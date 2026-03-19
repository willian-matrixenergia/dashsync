import type { EcraAtivo, EstadoFiltroDTO, EstadoSessaoDTO, ProjetoId, SessaoId } from './types.js';

// ─── WebSocket Control Messages ───────────────────────────────────────────────
// Tablet → Server → Wall (broadcast)

export type ControlMessage =
  | { type: 'SELECT_PROJECT';  sessaoId: SessaoId; projetoId: ProjetoId }
  | { type: 'APPLY_FILTER';    sessaoId: SessaoId; filtro: EstadoFiltroDTO }
  | { type: 'NAVIGATE_SCREEN'; sessaoId: SessaoId; ecra: EcraAtivo }
  | { type: 'RELOAD_DATA' }
  | { type: 'PING' }
  | { type: 'PONG' };

// Server → Wall/Tablet (push state)
export type ServerMessage =
  | { type: 'STATE_SYNC';     estado: EstadoSessaoDTO }
  | { type: 'DATA_UPDATED';   timestamp: string }
  | { type: 'PONG' }
  | { type: 'ERROR';          message: string };

// ─── Domain Events (internal, api layer) ─────────────────────────────────────
export interface DomainEvent {
  readonly occurredOn: Date;
  readonly type: string;
}

export class ProjetoSelecionado implements DomainEvent {
  readonly occurredOn = new Date();
  readonly type = 'ProjetoSelecionado' as const;
  constructor(
    public readonly sessaoId: SessaoId,
    public readonly projetoId: ProjetoId,
  ) {}
}

export class FiltroAplicado implements DomainEvent {
  readonly occurredOn = new Date();
  readonly type = 'FiltroAplicado' as const;
  constructor(
    public readonly sessaoId: SessaoId,
    public readonly filtro: EstadoFiltroDTO,
  ) {}
}

export class EcraSelecionado implements DomainEvent {
  readonly occurredOn = new Date();
  readonly type = 'EcraSelecionado' as const;
  constructor(
    public readonly sessaoId: SessaoId,
    public readonly ecra: EcraAtivo,
  ) {}
}

export class ExcelCarregado implements DomainEvent {
  readonly occurredOn = new Date();
  readonly type = 'ExcelCarregado' as const;
  constructor(public readonly timestamp: Date) {}
}
