import type { IncomingMessage, ServerResponse } from 'node:http';
import type { InMemoryPortfolioRepository } from '../repositories/InMemoryPortfolioRepository.js';
import type { InMemoryProgressoRepository } from '../repositories/InMemoryProgressoRepository.js';
import type { ControlHub } from '../ws/ControlHub.js';
import type { ProjetoId } from '@dashsync/shared';
import { filtroVazio } from '@dashsync/shared';
import { z } from 'zod';
import { Router } from './router.js';
import { sendJson, readJson } from './authMiddleware.js';
import { generateExecutiveSummary, assessProjectRisk, translateNLToFilter } from '../ai/ClaudeClient.js';

// C-001 fix: typed Zod schema for query params
const ProjectQuerySchema = z.object({
  coordenador: z.string().max(200).optional(),
  supervisor:  z.string().max(200).optional(),
  busca:       z.string().max(200).optional(),
});

function getSearchParams(req: IncomingMessage): URLSearchParams {
  try {
    return new URL(req.url ?? '/', 'http://localhost').searchParams;
  } catch {
    return new URLSearchParams();
  }
}

export function buildRouter(
  portfolioRepo: InMemoryPortfolioRepository,
  progressoRepo: InMemoryProgressoRepository,
  hub: ControlHub,
): Router {
  const router = new Router();

  router.get('/api/health', async (_req, res) => {
    sendJson(res, 200, { ok: true, timestamp: new Date().toISOString() });
  });

  router.get('/api/session', async (_req, res) => {
    sendJson(res, 200, hub.getEstado());
  });

  router.get('/api/projects', async (req, res) => {
    const sp = getSearchParams(req);
    const parseResult = ProjectQuerySchema.safeParse({
      coordenador: sp.get('coordenador') ?? undefined,
      supervisor:  sp.get('supervisor')  ?? undefined,
      busca:       sp.get('busca')       ?? undefined,
    });
    if (!parseResult.success) {
      sendJson(res, 400, { error: 'Invalid query params', details: parseResult.error.flatten() });
      return;
    }
    const q = parseResult.data;
    const filtro = filtroVazio();
    if (q.coordenador) filtro.coordenador = q.coordenador;
    if (q.supervisor)  filtro.supervisor  = q.supervisor;
    if (q.busca)       filtro.busca       = q.busca;
    const projetos = await portfolioRepo.findByFiltro(filtro);
    sendJson(res, 200, projetos.map(p => p.toSummaryDTO()));
  });

  router.get('/api/projects/:id', async (_req, res, params) => {
    const projeto = await portfolioRepo.findById(params['id'] as ProjetoId);
    if (!projeto) { sendJson(res, 404, { error: 'Projeto não encontrado' }); return; }
    sendJson(res, 200, projeto.toDetailDTO());
  });

  router.get('/api/projects/:id/scurve', async (_req, res, params) => {
    const evolucao = await progressoRepo.findEvolucaoSemanal(params['id'] as ProjetoId);
    if (!evolucao) { sendJson(res, 404, { error: 'Evolução não encontrada' }); return; }
    sendJson(res, 200, { projetoId: evolucao.projetoId, scurve: evolucao.scurve });
  });

  router.get('/api/projects/:id/labor', async (_req, res, params) => {
    const evolucao = await progressoRepo.findEvolucaoSemanal(params['id'] as ProjetoId);
    if (!evolucao) { sendJson(res, 404, { error: 'Evolução não encontrada' }); return; }
    sendJson(res, 200, { projetoId: evolucao.projetoId, labor: evolucao.labor });
  });

  router.get('/api/stats', async (_req, res) => {
    const all = await portfolioRepo.findAll();
    const totalMW = all.reduce((s, p) => s + p.potenciaMW, 0);
    const avgFisico = all.length ? all.reduce((s, p) => s + p.progressoFisico.realizado, 0) / all.length : 0;
    const avgFinanceiro = all.length ? all.reduce((s, p) => s + p.progressoFinanceiro.realizado, 0) / all.length : 0;
    const criticos = all.filter(p => p.criticidade.isAlto).length;
    sendJson(res, 200, {
      total: all.length, totalMW: +totalMW.toFixed(2),
      avgFisico: +avgFisico.toFixed(1), avgFinanceiro: +avgFinanceiro.toFixed(1), criticos,
    });
  });

  // C-003: admin/reload protected by apiKeyAuth in app.ts
  router.post('/api/admin/reload', async (_req, res) => {
    sendJson(res, 202, { message: 'Reload triggered' });
  });

  // AI endpoints — requires Anthropic API key in ENV
  router.post('/api/ai/risk', async (req, res) => {
    const schema = z.object({
      nome: z.string(), deltaFisico: z.number(), tendenciaCOD: z.string(),
      modDelta: z.number(), semanas: z.number().int().min(0),
    });
    const body = await readJson(req);
    const parsed = schema.safeParse(body);
    if (!parsed.success) { sendJson(res, 400, { error: parsed.error.flatten() }); return; }
    const result = await assessProjectRisk(parsed.data);
    if (!result.ok) { sendJson(res, 503, { error: result.error }); return; }
    sendJson(res, 200, result.value);
  });

  router.post('/api/ai/summary', async (req, res) => {
    const schema = z.object({ week: z.string().optional() });
    const body = await readJson(req);
    const parsed = schema.safeParse(body);
    if (!parsed.success) { sendJson(res, 400, { error: parsed.error.flatten() }); return; }
    const all = await portfolioRepo.findAll();
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
    if (!result.ok) { sendJson(res, 503, { error: result.error }); return; }
    sendJson(res, 200, { summary: result.value });
  });

  router.post('/api/ai/filter', async (req, res) => {
    const schema = z.object({ query: z.string().min(1).max(500) });
    const body = await readJson(req);
    const parsed = schema.safeParse(body);
    if (!parsed.success) { sendJson(res, 400, { error: parsed.error.flatten() }); return; }
    const result = await translateNLToFilter(parsed.data.query);
    if (!result.ok) { sendJson(res, 503, { error: result.error }); return; }
    sendJson(res, 200, result.value);
  });

  // H-002: Camera proxy — never expose external URL to frontend
  router.get('/api/stream/:id/live', async (_req, res, params) => {
    const streamUrl = process.env[`CAMERA_URL_${(params['id'] ?? '').toUpperCase()}`];
    if (!streamUrl) { sendJson(res, 404, { error: 'Stream not configured' }); return; }
    res.writeHead(302, { Location: streamUrl });
    res.end();
  });

  return router;
}
