import { NextResponse } from 'next/server';
import type {
  TradingMetrics,
  CashGenMonth,
  ExposicaoAnual,
  MtmAnual,
  PldAtual,
  KpiSemanalRow,
  StressTestScenario,
  TradingGasMetrics,
} from '@/src/types/energy';

interface TradingResponse {
  energia: {
    metrics: TradingMetrics;
    cashGen: CashGenMonth[];
    exposicaoMmR: MtmAnual[];
    exposicaoGwh: ExposicaoAnual[];
    pldAtual: PldAtual[];
    kpiSemanal: KpiSemanalRow[];
    stressTest: StressTestScenario[];
  };
  gas: TradingGasMetrics;
}

const MOCK_TRADING: TradingResponse = {
  energia: {
    metrics: {
      resultadoCaixa: 22.5,
      mtm2026: 217.7,
      varTrading: -22.3,
      varPortfolio: -62.5,
      pld2026: 358.6,
      exposicao2026: 236.7,
      dataRef: '2026-02-13',
    },
    cashGen: [
      { mes: 'Jan', esperado: 3.3, realizado: -0.53 },
      { mes: 'Fev', esperado: 19.06, realizado: 0 },
      { mes: 'Mar', esperado: 21.49, realizado: 0 },
      { mes: 'Abr', esperado: 21.72, realizado: 0 },
      { mes: 'Mai', esperado: 24.37, realizado: 0 },
      { mes: 'Jun', esperado: 26.09, realizado: 0 },
      { mes: 'Jul', esperado: 26.01, realizado: 0 },
      { mes: 'Ago', esperado: 24.93, realizado: 0 },
      { mes: 'Set', esperado: 25.25, realizado: 0 },
      { mes: 'Out', esperado: 24.52, realizado: 0 },
      { mes: 'Nov', esperado: 13.25, realizado: 0 },
      { mes: 'Dez', esperado: 25.91, realizado: 0 },
    ],
    exposicaoMmR: [
      { ano: 2026, mtmMmR: 217.7, deltaSemana: -6.32 },
      { ano: 2027, mtmMmR: 35.4, deltaSemana: 9.83 },
      { ano: 2028, mtmMmR: 107.9, deltaSemana: 0.57 },
      { ano: 2029, mtmMmR: -21.1, deltaSemana: -1.88 },
      { ano: 2030, mtmMmR: 51.6, deltaSemana: -5.23 },
      { ano: 2031, mtmMmR: 31.4, deltaSemana: -0.15 },
      { ano: 2032, mtmMmR: 32.2, deltaSemana: -0.02 },
      { ano: 2033, mtmMmR: 35.4, deltaSemana: -0.06 },
      { ano: 2034, mtmMmR: 18, deltaSemana: -0.05 },
      { ano: 2035, mtmMmR: 15.1, deltaSemana: -0.03 },
    ],
    exposicaoGwh: [
      { ano: 2026, exposicaoGwh: 236.9, deltaSemana: -38.9 },
      { ano: 2027, exposicaoGwh: -1427, deltaSemana: 18.4 },
      { ano: 2028, exposicaoGwh: -633.4, deltaSemana: 18.4 },
      { ano: 2029, exposicaoGwh: -2028.7, deltaSemana: 18.0 },
      { ano: 2030, exposicaoGwh: -1727.8, deltaSemana: 1.8 },
      { ano: 2031, exposicaoGwh: -983.7, deltaSemana: 0.4 },
      { ano: 2032, exposicaoGwh: -1419.2, deltaSemana: -0.1 },
      { ano: 2033, exposicaoGwh: -1065.5, deltaSemana: 0.8 },
      { ano: 2034, exposicaoGwh: -347.6, deltaSemana: 0.6 },
    ],
    pldAtual: [
      { ano: 2026, rsMwh: 358.6, varPct: -6.9 },
      { ano: 2027, rsMwh: 278.0, varPct: -2.5 },
      { ano: 2028, rsMwh: 254.7, varPct: -0.2 },
      { ano: 2029, rsMwh: 228.2, varPct: 0.5 },
      { ano: 2030, rsMwh: 171.6, varPct: 2.3 },
      { ano: 2031, rsMwh: 160.1, varPct: 0.0 },
      { ano: 2032, rsMwh: 157.2, varPct: 0.0 },
    ],
    kpiSemanal: [
      { kpi: 'Resultado Caixa', descricao: 'Resultado das operações já encerradas/liquidadas', sem1: 24.6, sem2: 27.4, sem3: 22.5 },
      { kpi: 'MtM 2026', descricao: 'Resultado potencial das operações ainda em aberto dado a diferença do preço contrato x mercado', sem1: 199.6, sem2: 224.0, sem3: 217.7 },
      { kpi: 'VaR Trading 26/27', descricao: 'Estimativa da perda máxima da carteira de Trading dado um nível de confiança', sem1: -9.3, sem2: -19.6, sem3: -22.3 },
      { kpi: 'VaR Portfólio 26/27', descricao: 'Estimativa da perda máxima do Portfólio dado um nível de confiança', sem1: -67.9, sem2: 61.2, sem3: -62.5 },
      { kpi: 'PLD 2026', descricao: 'Variação do preço do PLD', sem1: 344.2, sem2: 385.1, sem3: 358.6 },
      { kpi: 'Exp. 2026*', descricao: 'Variação da exposição da carteira de 2026', sem1: 190.7, sem2: 275.7, sem3: 236.7 },
    ],
    stressTest: [
      { deltaPlD: 10, ano2026: -2.4, ano2027: -14.3, ano2028: -6.3, ano2029: -20.3, ano2030: -17.3, ano2031: -9.8, total: -70.4 },
      { deltaPlD: 20, ano2026: -4.7, ano2027: -28.5, ano2028: -12.7, ano2029: -40.6, ano2030: -34.6, ano2031: -19.7, total: -140.8 },
      { deltaPlD: 50, ano2026: -11.8, ano2027: -71.4, ano2028: -31.7, ano2029: -101.4, ano2030: -86.4, ano2031: -49.2, total: -351.9 },
    ],
  },
  gas: {
    margemTotal: 4284,
    margemTotalBudget: 1963,
    margemSpot: 2810,
    margemSpotBudget: 515,
    exposicao: 1612,
    penalidade: 40.1,
    atingimentoMargemTotal: 218,
    atingimentoMargemSpot: 546,
    evolution: [
      { mes: 'Jan', margemTotal: 4284, margemTotalBudget: 1963, margemSpot: 2810, margemSpotBudget: 515, exposicao: 1612, penalidade: 40.1 },
      { mes: 'Fev', margemTotal: 0, margemTotalBudget: 1963, margemSpot: 0, margemSpotBudget: 515, exposicao: 0, penalidade: 0 },
      { mes: 'Mar', margemTotal: 0, margemTotalBudget: 1963, margemSpot: 0, margemSpotBudget: 515, exposicao: 0, penalidade: 0 },
      { mes: 'Abr', margemTotal: 0, margemTotalBudget: 1963, margemSpot: 0, margemSpotBudget: 515, exposicao: 0, penalidade: 0 },
      { mes: 'Mai', margemTotal: 0, margemTotalBudget: 1589, margemSpot: 0, margemSpotBudget: 515, exposicao: 0, penalidade: 0 },
      { mes: 'Jun', margemTotal: 0, margemTotalBudget: 1589, margemSpot: 0, margemSpotBudget: 515, exposicao: 0, penalidade: 0 },
      { mes: 'Jul', margemTotal: 0, margemTotalBudget: 1589, margemSpot: 0, margemSpotBudget: 515, exposicao: 0, penalidade: 0 },
      { mes: 'Ago', margemTotal: 0, margemTotalBudget: 1589, margemSpot: 0, margemSpotBudget: 515, exposicao: 0, penalidade: 0 },
      { mes: 'Set', margemTotal: 0, margemTotalBudget: 1589, margemSpot: 0, margemSpotBudget: 515, exposicao: 0, penalidade: 0 },
      { mes: 'Out', margemTotal: 0, margemTotalBudget: 1963, margemSpot: 0, margemSpotBudget: 515, exposicao: 0, penalidade: 0 },
      { mes: 'Nov', margemTotal: 0, margemTotalBudget: 1963, margemSpot: 0, margemSpotBudget: 515, exposicao: 0, penalidade: 0 },
      { mes: 'Dez', margemTotal: 0, margemTotalBudget: 1963, margemSpot: 0, margemSpotBudget: 515, exposicao: 0, penalidade: 0 },
    ],
  },
};

export async function GET() {
  return NextResponse.json({
    success: true,
    data: MOCK_TRADING,
  });
}
