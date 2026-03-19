// ============================================
// Base 01: Portfolio Master
// ============================================
export interface PortfolioMaster {
  id: string;
  programa: string;
  projeto: string;
  potencia_mw: number | null;
  fase: string | null;
  localidade: string | null;
  inicio: string | null; // ISO date
  termino: string | null;
  coordenador: string | null;
  supervisor: string | null;
  avanco_fisico_previsto: number | null;
  avanco_fisico_real: number | null;
  avanco_financeiro_real: number | null;
  num_empreiteiros: number | null;
  num_profissionais: number | null;
  mod_prevista: number | null;
  mod_real: number | null;
  cod_inicial: string | null;
  cod_tendencia: string | null;
  cod_real: string | null;
  tem_risco_relevante: boolean | null;
  descricao_riscos: string | null;
  criticidade_risco: string | null;
  resumo_atraso: string | null;
  foi_entregue_prazo: boolean | null;
  entrada_operacao_assistida: string | null;
  finalizacao_operacao_assistida: string | null;
  comissionamento_quente: string | null;
  testes_coi: string | null;
  treinamento_cliente: string | null;
  nome_cliente: string | null;
  atendimento_cliente: string | null;
  pct_chamados_atendidos: number | null;
  created_at: string;
  updated_at: string;
}

// ============================================
// Base 02: Evolution & Labor
// ============================================
export interface EvolutionLabor {
  id: string;
  programa: string;
  projeto: string;
  fase: string | null;
  semana: string; // ISO date
  pct_planejado_lb: number | null;
  pct_tendencia: number | null;
  pct_realizado: number | null;
  mod_prevista: number | null;
  mod_real: number | null;
  created_at: string;
  updated_at: string;
}

// ============================================
// Base 03: Internal Activities
// ============================================
export interface InternalActivity {
  id: string;
  programa: string;
  projeto: string;
  fase: string | null;
  atividade: string;
  pct_fisico_previsto: number | null;
  pct_fisico_real: number | null;
  inicio: string | null; // ISO date
  termino: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================
// Base 04: Technical Specs
// ============================================
export interface TechnicalSpecs {
  id: string;
  programa: string;
  projeto: string;
  fase: string | null;
  caracteristicas_macro: string | null;
  caracteristicas_detalhadas: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================
// API Response
// ============================================
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
}
