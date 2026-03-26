import { NextResponse } from 'next/server';
import { BESSMetrics } from '@/src/types/energy';

const MOCK_BESS: BESSMetrics = {
  capacidadeMwh: 86.4,
  capacidadeStats: {
    atingimentoMensal: 105,
    targetMensal: 82.5,
    atingimentoAnual: 54,
    targetAnual: 160.4,
    confianca: 'success',
  },
  mwhMedio: 16.9,
  mwhMedioStats: {
    atingimentoMensal: 94,
    targetMensal: 17.9,
    atingimentoAnual: 78,
    targetAnual: 21.8,
    confianca: 'success',
  },
  faturamentoTotal: 1610,
  faturamentoStats: {
    atingimentoMensal: 106,
    targetMensal: 1515,
    atingimentoAnual: 4,
    targetAnual: 36577,
    confianca: 'success',
  },
  evolution: [
    // Jan: dado real disponível
    { mes: 'Jan', capacidade: 86.4,  capacidadeBudget: 82.5,  mwh: 16.9, mwhBudget: 17.9,  faturamento: 1610, faturamentoBudget: 1515 },
    // Fev–Dez: apenas projeção budget (null = mês futuro)
    { mes: 'Fev', capacidade: null, capacidadeBudget: 89.6,  mwh: null, mwhBudget: 18.3,  faturamento: null, faturamentoBudget: 1702 },
    { mes: 'Mar', capacidade: null, capacidadeBudget: 96.7,  mwh: null, mwhBudget: 18.6,  faturamento: null, faturamentoBudget: 1889 },
    { mes: 'Abr', capacidade: null, capacidadeBudget: 103.8, mwh: null, mwhBudget: 19.0,  faturamento: null, faturamentoBudget: 2076 },
    { mes: 'Mai', capacidade: null, capacidadeBudget: 110.9, mwh: null, mwhBudget: 19.3,  faturamento: null, faturamentoBudget: 2264 },
    { mes: 'Jun', capacidade: null, capacidadeBudget: 118.0, mwh: null, mwhBudget: 19.7,  faturamento: null, faturamentoBudget: 2451 },
    { mes: 'Jul', capacidade: null, capacidadeBudget: 125.1, mwh: null, mwhBudget: 20.0,  faturamento: null, faturamentoBudget: 2638 },
    { mes: 'Ago', capacidade: null, capacidadeBudget: 132.2, mwh: null, mwhBudget: 20.4,  faturamento: null, faturamentoBudget: 2825 },
    { mes: 'Set', capacidade: null, capacidadeBudget: 139.3, mwh: null, mwhBudget: 20.7,  faturamento: null, faturamentoBudget: 3012 },
    { mes: 'Out', capacidade: null, capacidadeBudget: 146.4, mwh: null, mwhBudget: 21.1,  faturamento: null, faturamentoBudget: 3199 },
    { mes: 'Nov', capacidade: null, capacidadeBudget: 153.4, mwh: null, mwhBudget: 21.5,  faturamento: null, faturamentoBudget: 3387 },
    { mes: 'Dez', capacidade: null, capacidadeBudget: 160.4, mwh: null, mwhBudget: 21.8,  faturamento: null, faturamentoBudget: 3574 },
  ],
};

export async function GET() {
  return NextResponse.json({
    success: true,
    data: MOCK_BESS,
  });
}
