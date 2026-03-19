/**
 * ClickHouse client wrapper for DashSync analytics layer.
 * Uses HTTP interface for broad compatibility (no native driver required).
 * Falls back gracefully when ClickHouse is not configured (MVP mode).
 */

const CH_URL      = process.env['CLICKHOUSE_URL']      ?? 'http://localhost:8123';
const CH_USER     = process.env['CLICKHOUSE_USER']     ?? 'default';
const CH_PASSWORD = process.env['CLICKHOUSE_PASSWORD'] ?? '';
const CH_DB       = process.env['CLICKHOUSE_DB']       ?? 'dashsync';

interface ClickHouseRow { [key: string]: unknown }

export async function chQuery<T extends ClickHouseRow>(
  sql: string,
  params: Record<string, string | number> = {},
): Promise<T[]> {
  const paramStr = Object.entries(params)
    .map(([k, v]) => `param_${k}=${encodeURIComponent(String(v))}`)
    .join('&');

  const url = `${CH_URL}?database=${CH_DB}&${paramStr}`;
  const res  = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain',
      'X-ClickHouse-User':     CH_USER,
      'X-ClickHouse-Key':      CH_PASSWORD,
      'X-ClickHouse-Format':   'JSONEachRow',
    },
    body: sql,
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`ClickHouse query failed: ${res.status} ${body}`);
  }

  const text = await res.text();
  if (!text.trim()) return [];
  return text.trim().split('\n').map(line => JSON.parse(line) as T);
}

// H-001 fix: whitelist of allowed table names to prevent injection via table parameter
const ALLOWED_TABLES = new Set([
  'progresso_semanal', 'portfolio_snapshot', 'dashboard_events',
]);

export async function chInsert(table: string, rows: ClickHouseRow[]): Promise<void> {
  if (!ALLOWED_TABLES.has(table)) throw new Error(`chInsert: table '${table}' not in whitelist`);
  if (rows.length === 0) return;
  const ndjson = rows.map(r => JSON.stringify(r)).join('\n');
  const url = `${CH_URL}?database=${CH_DB}&query=${encodeURIComponent(`INSERT INTO ${table} FORMAT JSONEachRow`)}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-ndjson',
      'X-ClickHouse-User':   CH_USER,
      'X-ClickHouse-Key':    CH_PASSWORD,
    },
    body: ndjson,
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`ClickHouse insert failed: ${res.status} ${body}`);
  }
}

// ─── Domain-specific queries ───────────────────────────────────────────────────
export async function insertProgressoSemanal(rows: Array<{
  semana_date: string; semana_label: string; projeto_id: string; projeto_nome: string;
  programa: string; coordenador: string; planejado: number; realizado: number;
  tendencia: number; mod_prevista: number; mod_realizada: number;
}>): Promise<void> {
  await chInsert('progresso_semanal', rows);
}

export async function insertPortfolioSnapshot(rows: Array<{
  snapshot_date: string; projeto_id: string; nome: string; programa: string;
  localidade: string; coordenador: string; supervisor: string; criticidade: string;
  tendencia_cod: string; progresso_previsto: number; progresso_realizado: number;
  financeiro_previsto: number; financeiro_realizado: number;
  potencia_mw: number; cod_previsto: string;
}>): Promise<void> {
  await chInsert('portfolio_snapshot', rows);
}

export async function trackDashboardEvent(event: {
  sessao_id: string; event_type: string; ecra: string;
  projeto_id?: string; filtro_json?: string; duracao_ms?: number; device_type?: string;
}): Promise<void> {
  const now = new Date();
  await chInsert('dashboard_events', [{
    event_date:  now.toISOString().slice(0, 10),
    event_time:  now.toISOString().replace('T', ' ').slice(0, 23),
    sessao_id:   event.sessao_id,
    event_type:  event.event_type,
    ecra:        event.ecra,
    projeto_id:  event.projeto_id ?? null,
    filtro_json: event.filtro_json ?? null,
    duracao_ms:  event.duracao_ms ?? null,
    device_type: event.device_type ?? 'unknown',
  }]);
}

// ─── Health check ─────────────────────────────────────────────────────────────
export async function pingClickHouse(): Promise<boolean> {
  try {
    const rows = await chQuery<{ result: number }>('SELECT 1 AS result');
    return rows[0]?.result === 1;
  } catch {
    return false;
  }
}
