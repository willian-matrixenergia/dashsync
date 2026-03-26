import { NextResponse } from 'next/server';
import { EnergiaFacilFunnel } from '@/src/types/energy';

const MOCK_ENERGIA_FACIL: EnergiaFacilFunnel = {
  originacao: {
    clientes: 86,
    semana: 9,
    atingimentoMensal: 1,
    targetMensal: 8600,
    atingimentoAnual: 1,
    targetAnual: 21923,
    evolution: [
      { week: 'S1', value: 77 },
      { week: 'S2', value: 86 },
    ],
  },
  fechamento: {
    contratos: 9,
    semana: 6,
    atingimentoMensal: 2,
    targetMensal: 450,
    atingimentoAnual: 1,
    targetAnual: 2850,
    evolution: [
      { week: 'S1', value: 3 },
      { week: 'S2', value: 9 },
    ],
  },
  faturamento: {
    valor: 0,
    semana: 0,
    atingimentoMensal: 0,
    targetMensal: 4480,
    atingimentoAnual: 0,
    targetAnual: 44800,
    evolution: [
      { week: 'S1', value: 0 },
      { week: 'S2', value: 0 },
    ],
  },
};

export async function GET() {
  return NextResponse.json({
    success: true,
    data: MOCK_ENERGIA_FACIL,
  });
}
