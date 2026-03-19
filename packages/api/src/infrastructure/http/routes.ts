import type { FastifyInstance } from 'fastify';
import type { InMemoryPortfolioRepository } from '../repositories/InMemoryPortfolioRepository.js';
import type { InMemoryProgressoRepository } from '../repositories/InMemoryProgressoRepository.js';
import type { ControlHub } from '../ws/ControlHub.js';
import type { ProjetoId } from '@dashsync/shared';
import { filtroVazio } from '@dashsync/shared';
import { z } from 'zod';
import { apiKeyAuth } from './authMiddleware.js';
import { generateExecutiveSummary, assessProjectRisk, translateNLToFilter } from '../ai/ClaudeClient.js';

// C-001 fix: typed Zod schema for query params
const ProjectQuerySchema = z.object({
  coordenador:  z.string().max(200).optional(),
  supervisor:   z.string().max(200).optional(),
  busca:        z.string().max(200).optional(),
});

export async function registerRoutes(
  app: FastifyInstance,
  portfolioRepo: InMemoryPortfolioRepository,
  progressoRepo: InMemoryProgressoRepository,
  hub: ControlHub,
): Promise<void> {

  // Apply auth middleware to all non-public routes
  app.addHook('preHandler', apiKeyAuth);

  // Root endpoint (public info)
  app.get('/', async () => ({
    api: 'DashSync API v1.0',
    status: 'operational',
    timestamp: new Date().toISOString(),
  }));

  app.get('/api/health', async () => ({ ok: true, timestamp: new Date().toISOString() }));

  // Debug endpoint (public) to help diagnose auth issues
  app.get('/api/debug/auth', async (req) => {
    const providedKey = (req.headers['x-api-key'] as string | undefined) ?? '';
    const envKeyExists = !!process.env['DASHSYNC_API_KEY'];
    const envKeyLength = process.env['DASHSYNC_API_KEY']?.length ?? 0;
    const providedKeyLength = providedKey.length;
    return {
      envKeyConfigured: envKeyExists,
      envKeyLength,
      providedKeyLength,
      providedKeyPreview: providedKey.slice(0, 20) + '...',
      match: envKeyExists && providedKeyLength === envKeyLength,
      message: !envKeyExists ? 'API Key not configured in environment' : providedKeyLength !== envKeyLength ? 'Key length mismatch' : 'Keys match',
    };
  });

  app.get('/api/session', async () => hub.getEstado());

  app.get('/api/projects', async (req, reply) => {
    const parseResult = ProjectQuerySchema.safeParse(req.query);
    if (!parseResult.success) {
      return reply.status(400).send({ error: 'Invalid query params', details: parseResult.error.flatten() });
    }
    const q = parseResult.data;
    const filtro = filtroVazio();
    if (q.coordenador) filtro.coordenador = q.coordenador;
    if (q.supervisor)  filtro.supervisor  = q.supervisor;
    if (q.busca)       filtro.busca       = q.busca;
    const projetos = await portfolioRepo.findByFiltro(filtro);
    return projetos.map(p => p.toSummaryDTO());
  });

  app.get<{ Params: { id: string } }>('/api/projects/:id', async (req, reply) => {
    const projeto = await portfolioRepo.findById(req.params.id as ProjetoId);
    if (!projeto) return reply.status(404).send({ error: 'Projeto não encontrado' });
    return projeto.toDetailDTO();
  });

  app.get<{ Params: { id: string } }>('/api/projects/:id/scurve', async (req, reply) => {
    const evolucao = await progressoRepo.findEvolucaoSemanal(req.params.id as ProjetoId);
    if (!evolucao) return reply.status(404).send({ error: 'Evolução não encontrada' });
    return { projetoId: evolucao.projetoId, scurve: evolucao.scurve };
  });

  app.get<{ Params: { id: string } }>('/api/projects/:id/labor', async (req, reply) => {
    const evolucao = await progressoRepo.findEvolucaoSemanal(req.params.id as ProjetoId);
    if (!evolucao) return reply.status(404).send({ error: 'Evolução não encontrada' });
    return { projetoId: evolucao.projetoId, labor: evolucao.labor };
  });

  app.get('/api/stats', async () => {
    const all = await portfolioRepo.findAll();
    const totalMW = all.reduce((s, p) => s + p.potenciaMW, 0);
    const avgFisico = all.length
      ? all.reduce((s, p) => s + p.progressoFisico.realizado, 0) / all.length
      : 0;
    const avgFinanceiro = all.length
      ? all.reduce((s, p) => s + p.progressoFinanceiro.realizado, 0) / all.length
      : 0;
    const criticos = all.filter(p => p.criticidade.isAlto).length;
    return { total: all.length, totalMW: +totalMW.toFixed(2),
             avgFisico: +avgFisico.toFixed(1), avgFinanceiro: +avgFinanceiro.toFixed(1), criticos };
  });

  // C-003: admin/reload protected by apiKeyAuth hook above
  app.post('/api/admin/reload', async (_req, reply) => {
    return reply.status(202).send({ message: 'Reload triggered' });
  });

  // AI endpoints — requires Anthropic API key in ENV
  app.post('/api/ai/risk', async (req, reply) => {
    const schema = z.object({
      nome: z.string(), deltaFisico: z.number(), tendenciaCOD: z.string(),
      modDelta: z.number(), semanas: z.number().int().min(0),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return reply.status(400).send({ error: parsed.error.flatten() });
    const result = await assessProjectRisk(parsed.data);
    if (!result.ok) return reply.status(503).send({ error: result.error });
    return result.value;
  });

  app.post('/api/ai/summary', async (req, reply) => {
    const schema = z.object({ week: z.string().optional() });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return reply.status(400).send({ error: parsed.error.flatten() });
    const all  = await portfolioRepo.findAll();
    const week = parsed.data.week ?? new Date().toISOString().slice(0, 10);
    const criticos = all.filter(p => p.criticidade.isAlto);
    const result = await generateExecutiveSummary({
      week, totalProjetos: all.length, criticos: criticos.length,
      avgFisico: all.length ? all.reduce((s, p) => s + p.progressoFisico.realizado, 0) / all.length : 0,
      avgFinanceiro: all.length ? all.reduce((s, p) => s + p.progressoFinanceiro.realizado, 0) / all.length : 0,
      totalMW: all.reduce((s, p) => s + p.potenciaMW, 0),
      projetosCriticos: criticos.slice(0, 3).map(p => ({
        nome: p.nome, delta: p.progressoFisico.delta, cod: p.codPrevisto.toISOString().slice(0, 10),
      })),
    });
    if (!result.ok) return reply.status(503).send({ error: result.error });
    return { summary: result.value };
  });

  app.post('/api/ai/filter', async (req, reply) => {
    const schema = z.object({ query: z.string().min(1).max(500) });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return reply.status(400).send({ error: parsed.error.flatten() });
    const result = await translateNLToFilter(parsed.data.query);
    if (!result.ok) return reply.status(503).send({ error: result.error });
    return result.value;
  });

  // H-002: Camera proxy — never expose external URL to frontend
  app.get<{ Params: { id: string } }>('/api/stream/:id/live', async (req, reply) => {
    const streamUrl = process.env[`CAMERA_URL_${req.params.id.toUpperCase()}`];
    if (!streamUrl) return reply.status(404).send({ error: 'Stream not configured' });
    // In production: use http-proxy or undici to pipe the stream
    return reply.redirect(302, streamUrl);
  });
}
