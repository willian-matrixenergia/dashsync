/**
 * AnalyticsService — event tracking for DashSync dashboard usage.
 * Writes to ClickHouse dashboard_events table.
 * Fails silently to never block the main request path.
 */

import { trackDashboardEvent, pingClickHouse } from '../clickhouse/ClickHouseClient.js';

type EventType =
  | 'screen_viewed'
  | 'project_selected'
  | 'filter_applied'
  | 'data_reloaded'
  | 'ws_reconnected'
  | 'media_viewed'
  | 'tour360_opened';

interface TrackArgs {
  sessaoId:    string;
  eventType:   EventType;
  ecra:        string;
  projetoId?:  string;
  filtroJson?: string;
  duracaoMs?:  number;
  deviceType?: 'wall' | 'tablet' | 'server' | 'unknown';
}

let clickhouseAvailable = false;

// Check ClickHouse availability once at startup (non-blocking)
pingClickHouse().then(ok => { clickhouseAvailable = ok; }).catch(() => null);

export async function track(args: TrackArgs): Promise<void> {
  if (!clickhouseAvailable) return; // MVP: skip if ClickHouse not configured

  // Fire-and-forget — never await in the request path
  trackDashboardEvent({
    sessao_id:   args.sessaoId,
    event_type:  args.eventType,
    ecra:        args.ecra,
    projeto_id:  args.projetoId,
    filtro_json: args.filtroJson,
    duracao_ms:  args.duracaoMs,
    device_type: args.deviceType ?? 'unknown',
  }).catch(() => null); // silent failure
}

// ─── KPI Trend Calculator ─────────────────────────────────────────────────────
export interface KpiTrend {
  delta:   number;
  percent: number;
  status:  'up' | 'down' | 'flat';
}

export function calcTrend(current: number, previous: number): KpiTrend {
  const delta   = current - previous;
  const percent = previous > 0 ? (delta / previous) * 100 : 0;
  return {
    delta,
    percent: Math.round(percent * 10) / 10,
    status:  Math.abs(percent) < 1 ? 'flat' : delta > 0 ? 'up' : 'down',
  };
}
