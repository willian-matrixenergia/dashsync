// ============================================
// GERAÇÃO DISTRIBUÍDA (GD)
// ============================================
export interface GDKpiRow {
  id: string;
  descricao: string;
  unidade: string;               // "(MWh)", "(R$MM)", etc.
  atualSemana: number | null;
  atualSemanaLabel?: string;     // "Resultado Janeiro" para KPI5/6
  targetMensal: number;
  targetMensalNota?: string;     // "Target ano dividido por 12" para KPI4
  targetMensalLabel?: string;    // "Target Janeiro" para KPI5/6
  atingimentoMensal: number;     // percentual 0-100
  acumuladoMes?: string;         // texto completo ex: "acumulado mês atual: 1.076 MWh"
  isExtrapolado?: boolean;       // true para KPI5 — exibe "% EXTRAPOLADO"
  confianca: 'success' | 'warning' | 'destructive';
  semana: number | null;         // delta semanal; null → exibe "–"
  evolution?: number[];          // 4–6 pontos para sparkline
  targetAnual: number;
  atingimentoAnual: number;      // percentual 0-100
  acumuladoAno?: string;         // texto completo ex: "acumulado ano: 2.771 MWh"
  hasVisaoSemanal: boolean;
}

// ============================================
// GRANDE SERTÃO II
// ============================================
export type GrandeSertaoII = GDKpiRow[];

// ============================================
// COMERCIAL - PPA
// ============================================
export interface PPAContract {
  tipo: 'originacao' | 'comissionamento' | 'renegociacao';
  atual: number; // R$ k
  vsSemana: number;
  atingimentoMensal: number;
  targetMensal: number;
  atingimentoAnual: number;
  targetAnual: number;
  confianca: 'success' | 'warning' | 'destructive';
}

// ============================================
// COMERCIAL - ENERGIA FÁCIL
// ============================================
export interface EnergiaFacilFunnel {
  originacao: {
    clientes: number;
    semana: number;
    atingimentoMensal: number;
    targetMensal: number;
    atingimentoAnual: number;
    targetAnual: number;
    evolution?: Array<{ week: string; value: number }>;
  };
  fechamento: {
    contratos: number;
    semana: number;
    atingimentoMensal: number;
    targetMensal: number;
    atingimentoAnual: number;
    targetAnual: number;
    evolution?: Array<{ week: string; value: number }>;
  };
  faturamento: {
    valor: number;
    semana: number;
    atingimentoMensal: number;
    targetMensal: number;
    atingimentoAnual: number;
    targetAnual: number;
    evolution?: Array<{ week: string; value: number }>;
  };
}

// ============================================
// COMERCIAL - BESS
// ============================================
export interface BESSMetrics {
  capacidadeMwh: number;
  capacidadeStats: {
    atingimentoMensal: number;
    targetMensal: number;
    atingimentoAnual: number;
    targetAnual: number;
    confianca: 'success' | 'warning' | 'destructive';
  };
  mwhMedio: number;
  mwhMedioStats: {
    atingimentoMensal: number;
    targetMensal: number;
    atingimentoAnual: number;
    targetAnual: number;
    confianca: 'success' | 'warning' | 'destructive';
  };
  faturamentoTotal: number;
  faturamentoStats: {
    atingimentoMensal: number;
    targetMensal: number;
    atingimentoAnual: number;
    targetAnual: number;
    confianca: 'success' | 'warning' | 'destructive';
  };
  evolution: Array<{
    mes: string;
    capacidade: number | null;
    capacidadeBudget: number;
    mwh: number | null;
    mwhBudget: number;
    faturamento: number | null;
    faturamentoBudget: number;
  }>;
}

// ============================================
// TRADING - ENERGIA
// ============================================
export interface TradingMetrics {
  resultadoCaixa: number;
  mtm2026: number;
  varTrading: number;
  varPortfolio: number;
  pld2026: number;
  exposicao2026: number;
  dataRef: string;
}

export interface CashGenMonth {
  mes: string;
  esperado: number;
  realizado: number;
}

export interface ExposicaoAnual {
  ano: number;
  exposicaoGwh: number;
  deltaSemana?: number;
}

export interface MtmAnual {
  ano: number;
  mtmMmR: number;
  deltaSemana: number;
}

export interface PldAtual {
  ano: number;
  rsMwh: number;
  varPct: number;
}

export interface KpiSemanalRow {
  kpi: string;
  descricao: string;
  sem1: number;
  sem2: number;
  sem3: number;
}

export interface StressTestScenario {
  deltaPlD: number;
  ano2026: number;
  ano2027: number;
  ano2028: number;
  ano2029: number;
  ano2030: number;
  ano2031: number;
  total: number;
}

// ============================================
// TRADING - GÁS
// ============================================
export interface TradingGasMetrics {
  margemTotal: number;
  margemTotalBudget: number;
  margemSpot: number;
  margemSpotBudget: number;
  exposicao: number;
  penalidade: number;
  atingimentoMargemTotal: number;
  atingimentoMargemSpot: number;
  evolution: Array<{
    mes: string;
    margemTotal: number;
    margemTotalBudget: number;
    margemSpot: number;
    margemSpotBudget: number;
    exposicao: number;
    penalidade: number;
  }>;
}

// ============================================
// BITCOIN
// ============================================
export interface BitcoinMetrics {
  hashrate: number;
  uptimeBudget: number;
  btcMinados: number;
  consumoEnergia: number;
}

export interface BitcoinEvolution {
  mes: string;
  hashrate: number;
  hashrateBudget: number;
  btcMinados: number;
  btcBudget: number;
  uptime: number;
  consumo: number;
  consumoBudget: number;
}

// ============================================
// OPERAÇÕES ESTRUTURADAS
// ============================================
export interface OperacaoDetail {
  id: string;
  nome: string;
  estagio: string;
  valor: number;
  tipo: 'capex' | 'asset_light';
  descricao?: string;
  variacao?: number;
}

export interface FunilEtapa {
  numero: number;        // 1–7
  nome: string;
  atual: number | null;  // R$ MM; null = exibir "—"
  deltaSemanaMM: number; // variação vs. semana anterior
}

export interface IndicadorBC {
  numero: number;        // 4, 5 ou 6
  nome: string;
  atual: number | null;
  deltaSemanaMM: number;
}

export interface OperacoesData {
  semanaAtual: string;
  semanaAnterior: string;
  mesReferencia: string;
  capex: {
    etapas: FunilEtapa[];
    targetFechamentoMM: number;
  };
  assetLight: {
    etapas: FunilEtapa[];
    targetFechamentoMM: number;
  };
  ffc: IndicadorBC[];
  mtm: IndicadorBC[];
}

// ============================================
// API RESPONSE ENVELOPE
// ============================================
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
  };
}
