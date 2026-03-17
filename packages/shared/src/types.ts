// ─── Branded Types ────────────────────────────────────────────────────────────
export type Brand<T, B> = T & { readonly _brand: B };
export type ProjetoId  = Brand<string, 'ProjetoId'>;
export type SessaoId   = Brand<string, 'SessaoId'>;

// ─── Domain Enums (as const) ──────────────────────────────────────────────────
export const PROGRAMAS = ['BESS', 'BTC', 'UFV', 'DataCenter'] as const;
export type ProgramaTipo = (typeof PROGRAMAS)[number];

export const FASES = ['Engenharia', 'Suprimentos', 'Construção', 'Comissionamento'] as const;
export type FaseTipo = (typeof FASES)[number];

export const NIVEIS_CRITICIDADE = ['baixo', 'medio', 'alto'] as const;
export type NivelCriticidade = (typeof NIVEIS_CRITICIDADE)[number];

export const TENDENCIAS_COD = ['no_prazo', 'risco', 'atrasado'] as const;
export type TendenciaCOD = (typeof TENDENCIAS_COD)[number];

export const ECRAS = ['portfolio', 'progress', 'media', 'live'] as const;
export type EcraAtivo = (typeof ECRAS)[number];

export const TIPOS_MEDIA = ['foto', 'video', '360'] as const;
export type TipoMedia = (typeof TIPOS_MEDIA)[number];

// ─── Result Type ──────────────────────────────────────────────────────────────
export type Result<T, E = string> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: E };

// ─── Core DTOs (shared between api ↔ wall ↔ tablet) ──────────────────────────
export interface ProgressoDTO {
  previsto: number;   // 0–100
  realizado: number;  // 0–100
  delta: number;
  status: 'adiantado' | 'no_prazo' | 'atrasado';
}

export interface CronogramaItemDTO {
  nome: string;
  inicio: string;  // ISO date
  fim: string;     // ISO date
  progressoFisico: ProgressoDTO;
  duracaoDias: number;
}

export interface ProjetoSummaryDTO {
  id: ProjetoId;
  nome: string;
  programa: ProgramaTipo;
  localidade: string;
  coordenador: string;
  supervisor: string;
  progressoFisico: ProgressoDTO;
  progressoFinanceiro: ProgressoDTO;
  criticidade: NivelCriticidade;
  codPrevisto: string;   // ISO date
  tendenciaCOD: TendenciaCOD;
  potenciaMW: number;
}

export interface ProjetoDetailDTO extends ProjetoSummaryDTO {
  cronograma: CronogramaItemDTO[];
  disciplinas: DisciplinaMetricsDTO;
}

export interface DisciplinaMetricsDTO {
  engenharia:      ProgressoDTO;
  suprimentos:     ProgressoDTO;
  construcao:      ProgressoDTO;
  comissionamento: ProgressoDTO;
}

export interface SCurvePointDTO {
  semana: string;          // 'YYYY-WW'
  planejado:  number;
  realizado:  number;
  tendencia:  number;
}

export interface LaborPointDTO {
  semana: string;
  modPrevista: number;
  modRealizada: number;
}

export interface EvolucaoSemanalDTO {
  projetoId: ProjetoId;
  scurve: SCurvePointDTO[];
  labor: LaborPointDTO[];
}

export interface MediaFileDTO {
  id: string;
  projetoId: ProjetoId;
  nome: string;
  tipo: TipoMedia;
  url: string;
  tamanhoBytes: number;
  criadoEm: string;
  link360?: string;
}

export interface GaleriaDTO {
  projetoId: ProjetoId;
  semanaAtual: string;
  fotos: MediaFileDTO[];
  videos: MediaFileDTO[];
  tour360: MediaFileDTO | null;
}

// ─── Filtros ──────────────────────────────────────────────────────────────────
export interface EstadoFiltroDTO {
  programas:    ProgramaTipo[];
  fases:        FaseTipo[];
  criticidades: NivelCriticidade[];
  coordenador:  string | null;
  supervisor:   string | null;
  busca:        string | null;
}

export function filtroVazio(): EstadoFiltroDTO {
  return {
    programas:    [...PROGRAMAS],
    fases:        [...FASES],
    criticidades: [...NIVEIS_CRITICIDADE],
    coordenador:  null,
    supervisor:   null,
    busca:        null,
  };
}

// ─── Estado global da sessão ──────────────────────────────────────────────────
export interface EstadoSessaoDTO {
  sessaoId:           SessaoId;
  projetoSelecionado: ProjetoId | null;
  filtros:            EstadoFiltroDTO;
  ecraAtivo:          EcraAtivo;
  ultimaAtualizacao:  string;  // ISO datetime
}
