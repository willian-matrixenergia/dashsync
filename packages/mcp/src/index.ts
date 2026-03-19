#!/usr/bin/env node
/**
 * DashSync MCP Server
 * Exposes portfolio data, risk analysis, and executive summaries
 * to Claude and other LLMs via the Model Context Protocol.
 *
 * Tools:
 *   list_projects         — list all projects with optional filters
 *   get_project_detail    — full detail for a single project
 *   get_scurve            — S-curve data for a project
 *   assess_risk           — AI risk assessment for a project
 *   generate_summary      — AI executive summary for the portfolio
 *   translate_nl_filter   — convert natural language to dashboard filter
 *   reload_data           — trigger Excel re-parse
 *
 * Resources:
 *   portfolio://stats     — portfolio KPI snapshot
 *   portfolio://schema    — Excel schema reference
 *
 * Prompts:
 *   weekly_briefing       — template for weekly portfolio briefing
 */

import { Server }               from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

const API_BASE    = process.env['DASHSYNC_API_URL'] ?? 'http://localhost:3001';
const API_KEY     = process.env['DASHSYNC_API_KEY'] ?? '';

// ─── Helpers ──────────────────────────────────────────────────────────────────
async function apiGet<T>(path: string): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (API_KEY) headers['X-Api-Key'] = API_KEY;
  const res = await fetch(`${API_BASE}${path}`, { headers });
  if (!res.ok) throw new Error(`API ${path} → ${res.status}: ${await res.text()}`);
  return res.json() as Promise<T>;
}

function ok(text: string) {
  return { content: [{ type: 'text' as const, text }] };
}

function err(text: string) {
  return { content: [{ type: 'text' as const, text: `Error: ${text}` }], isError: true };
}

// ─── Server ───────────────────────────────────────────────────────────────────
const server = new Server(
  { name: 'dashsync-mcp', version: '1.0.0' },
  { capabilities: { tools: {}, resources: {}, prompts: {} } },
);

// ═══════════════════════════════════════════════════════════════════════════════
// TOOLS
// ═══════════════════════════════════════════════════════════════════════════════
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'list_projects',
      description: `List all active infrastructure projects in the portfolio.
Optionally filter by program, criticality, coordinator, or search text.
Use when the user asks about the portfolio status, project counts, or wants to browse projects.`,
      inputSchema: {
        type: 'object',
        properties: {
          programa:    { type: 'string', enum: ['BESS', 'BTC', 'UFV', 'DataCenter'], description: 'Filter by program type' },
          criticidade: { type: 'string', enum: ['baixo', 'medio', 'alto'], description: 'Filter by risk level' },
          busca:       { type: 'string', description: 'Search by project name or location' },
        },
      },
    },
    {
      name: 'get_project_detail',
      description: `Get full details for a specific project including schedule, discipline metrics, and progress.
Use when the user asks about a specific project's performance, COD date, or discipline status.`,
      inputSchema: {
        type: 'object',
        properties: {
          projeto_id: { type: 'string', description: 'Project ID (from list_projects)' },
        },
        required: ['projeto_id'],
      },
    },
    {
      name: 'get_scurve',
      description: `Get the S-curve (weekly physical progress) and labor histogram for a project.
Use when asked about progress trends, weekly evolution, or labor headcount.`,
      inputSchema: {
        type: 'object',
        properties: {
          projeto_id: { type: 'string', description: 'Project ID' },
        },
        required: ['projeto_id'],
      },
    },
    {
      name: 'assess_risk',
      description: `Run an AI-powered risk assessment on a project using Claude.
Analyzes physical progress delta, COD tendency, and labor gaps.
Use when the user wants to understand why a project is critical or needs risk justification.`,
      inputSchema: {
        type: 'object',
        properties: {
          projeto_id: { type: 'string', description: 'Project ID to assess' },
        },
        required: ['projeto_id'],
      },
    },
    {
      name: 'generate_summary',
      description: `Generate an AI-powered executive summary of the full portfolio for the current week.
Returns a formatted briefing ready for board presentations.
Use for weekly meetings, status reports, or when the user asks for an overview.`,
      inputSchema: {
        type: 'object',
        properties: {
          semana: { type: 'string', description: 'Week label e.g. "2024-W15" (defaults to current week)' },
        },
      },
    },
    {
      name: 'translate_nl_filter',
      description: `Convert a natural language query into a structured dashboard filter.
Use when the user says things like "show me critical BESS projects" or "find projects coordinated by João".`,
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Natural language filter query in Portuguese or English' },
        },
        required: ['query'],
      },
    },
    {
      name: 'reload_data',
      description: `Trigger a re-parse of all Excel files in the data directory.
Use when the user says data was updated or wants to refresh the dashboard.`,
      inputSchema: { type: 'object', properties: {} },
    },
    {
      name: 'get_stats',
      description: `Get portfolio-level KPIs: total projects, total MW, average physical/financial progress, and critical project count.`,
      inputSchema: { type: 'object', properties: {} },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {

    case 'list_projects': {
      const { programa, criticidade, busca } = z.object({
        programa:    z.string().optional(),
        criticidade: z.string().optional(),
        busca:       z.string().optional(),
      }).parse(args ?? {});

      const params = new URLSearchParams();
      if (programa)    params.set('programa', programa);
      if (criticidade) params.set('criticidade', criticidade);
      if (busca)       params.set('busca', busca);

      try {
        const data = await apiGet<unknown[]>(`/api/projects?${params}`);
        return ok(JSON.stringify(data, null, 2));
      } catch (e) { return err(String(e)); }
    }

    case 'get_project_detail': {
      const { projeto_id } = z.object({ projeto_id: z.string().min(1) }).parse(args);
      try {
        const data = await apiGet<unknown>(`/api/projects/${projeto_id}`);
        return ok(JSON.stringify(data, null, 2));
      } catch (e) { return err(String(e)); }
    }

    case 'get_scurve': {
      const { projeto_id } = z.object({ projeto_id: z.string().min(1) }).parse(args);
      try {
        const [scurve, labor] = await Promise.all([
          apiGet<unknown>(`/api/projects/${projeto_id}/scurve`),
          apiGet<unknown>(`/api/projects/${projeto_id}/labor`),
        ]);
        return ok(JSON.stringify({ scurve, labor }, null, 2));
      } catch (e) { return err(String(e)); }
    }

    case 'assess_risk': {
      const { projeto_id } = z.object({ projeto_id: z.string().min(1) }).parse(args);
      try {
        const detail = await apiGet<{
          nome: string; progressoFisico: { delta: number }; tendenciaCOD: string;
        }>(`/api/projects/${projeto_id}`);
        const labor  = await apiGet<{ labor: Array<{ modRealizada: number; modPrevista: number }> }>(
          `/api/projects/${projeto_id}/labor`,
        );
        const lastLabor = labor.labor.at(-1);
        const modDelta  = lastLabor ? lastLabor.modRealizada - lastLabor.modPrevista : 0;

        const assessment = await fetch(`${API_BASE}/api/ai/risk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nome: detail.nome,
            deltaFisico: detail.progressoFisico.delta,
            tendenciaCOD: detail.tendenciaCOD,
            modDelta,
            semanas: 0,
          }),
        }).then(r => r.json());

        return ok(JSON.stringify(assessment, null, 2));
      } catch (e) { return err(String(e)); }
    }

    case 'generate_summary': {
      const { semana } = z.object({ semana: z.string().optional() }).parse(args ?? {});
      const week = semana ?? new Date().toISOString().slice(0, 10);
      try {
        const summary = await fetch(`${API_BASE}/api/ai/summary`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ week }),
        }).then(r => r.json() as Promise<{ summary: string }>);
        return ok(summary.summary);
      } catch (e) { return err(String(e)); }
    }

    case 'translate_nl_filter': {
      const { query } = z.object({ query: z.string().min(1) }).parse(args);
      try {
        const result = await fetch(`${API_BASE}/api/ai/filter`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query }),
        }).then(r => r.json());
        return ok(JSON.stringify(result, null, 2));
      } catch (e) { return err(String(e)); }
    }

    case 'reload_data': {
      try {
        await fetch(`${API_BASE}/api/admin/reload`, { method: 'POST' });
        return ok('Reload triggered. Data will be updated within 5 seconds.');
      } catch (e) { return err(String(e)); }
    }

    case 'get_stats': {
      try {
        const stats = await apiGet<unknown>('/api/stats');
        return ok(JSON.stringify(stats, null, 2));
      } catch (e) { return err(String(e)); }
    }

    default:
      return err(`Unknown tool: ${name}`);
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// RESOURCES
// ═══════════════════════════════════════════════════════════════════════════════
server.setRequestHandler(ListResourcesRequestSchema, async () => ({
  resources: [
    {
      uri: 'portfolio://stats',
      name: 'Portfolio KPI Snapshot',
      description: 'Current portfolio statistics: total projects, MW, progress averages, and critical count',
      mimeType: 'application/json',
    },
    {
      uri: 'portfolio://schema',
      name: 'Excel Data Schema',
      description: 'Schema reference for the 4 Excel bases (Base01-04) used to feed the dashboard',
      mimeType: 'application/json',
    },
  ],
}));

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  if (uri === 'portfolio://stats') {
    try {
      const stats = await apiGet<unknown>('/api/stats');
      return { contents: [{ uri, mimeType: 'application/json', text: JSON.stringify(stats, null, 2) }] };
    } catch (e) {
      return { contents: [{ uri, mimeType: 'text/plain', text: `Error: ${String(e)}` }] };
    }
  }

  if (uri === 'portfolio://schema') {
    const schema = {
      Base01: {
        description: 'Master project data and risk indicators',
        columns: ['id', 'nome', 'programa', 'localidade', 'coordenador', 'supervisor',
                  'progressoPrevisto', 'progressoRealizado', 'financeiroPrevisto', 'financeiroRealizado',
                  'criticidade', 'codPrevisto', 'tendenciaCOD', 'potenciaMW'],
      },
      Base02: {
        description: 'Weekly progress evolution',
        columns: ['projetoId', 'semana', 'planejado', 'realizado', 'tendencia', 'modPrevista', 'modRealizada'],
      },
      Base03: {
        description: 'Discipline schedule (Engenharia, Suprimentos, Construção, Comissionamento)',
        columns: ['projetoId', 'disciplina', 'progressoPrevisto', 'progressoRealizado', 'inicio', 'fim'],
      },
      Base04: {
        description: 'Technical characteristics',
        columns: ['projetoId', 'potenciaNominal', 'tensaoKv', 'areaHa', 'tecnologia', 'capacidadeMwh', 'numModulos'],
      },
    };
    return { contents: [{ uri, mimeType: 'application/json', text: JSON.stringify(schema, null, 2) }] };
  }

  throw new Error(`Unknown resource: ${uri}`);
});

// ═══════════════════════════════════════════════════════════════════════════════
// PROMPTS
// ═══════════════════════════════════════════════════════════════════════════════
server.setRequestHandler(ListPromptsRequestSchema, async () => ({
  prompts: [
    {
      name: 'weekly_briefing',
      description: 'Generate a structured weekly portfolio briefing for executive meetings',
      arguments: [
        { name: 'semana',     description: 'Week identifier (e.g. 2024-W15)', required: false },
        { name: 'foco',       description: 'Focus area: criticos | financeiro | geral', required: false },
      ],
    },
    {
      name: 'project_deep_dive',
      description: 'Detailed analysis of a single project for technical review meetings',
      arguments: [
        { name: 'projeto_id', description: 'Project ID to analyze', required: true },
      ],
    },
  ],
}));

server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === 'weekly_briefing') {
    const semana = (args?.['semana'] as string | undefined) ?? 'semana atual';
    const foco   = (args?.['foco']   as string | undefined) ?? 'geral';
    return {
      messages: [{
        role: 'user',
        content: {
          type: 'text',
          text: `Por favor, realize uma análise completa do portfólio de projetos para ${semana} com foco em "${foco}".

Siga este roteiro:
1. Use get_stats para obter os KPIs gerais
2. Use list_projects com criticidade=alto para listar os projetos críticos
3. Para cada projeto crítico (máx. 3), use get_project_detail e assess_risk
4. Use generate_summary para gerar o resumo executivo

Apresente os resultados em formato de briefing executivo em português, adequado para reunião de diretoria.`,
        },
      }],
    };
  }

  if (name === 'project_deep_dive') {
    const projetoId = (args?.['projeto_id'] as string | undefined) ?? '';
    if (!projetoId) throw new Error('projeto_id is required');
    return {
      messages: [{
        role: 'user',
        content: {
          type: 'text',
          text: `Realize uma análise técnica aprofundada do projeto ID "${projetoId}".

Siga este roteiro:
1. Use get_project_detail para obter dados completos
2. Use get_scurve para analisar a evolução temporal
3. Use assess_risk para avaliação de risco com IA
4. Apresente: status atual, análise de desvios, estado por disciplina, tendência de COD e ações recomendadas.

Formato: relatório técnico em português, com seções claras e tabelas onde aplicável.`,
        },
      }],
    };
  }

  throw new Error(`Unknown prompt: ${name}`);
});

// ─── Start ────────────────────────────────────────────────────────────────────
const transport = new StdioServerTransport();
await server.connect(transport);
