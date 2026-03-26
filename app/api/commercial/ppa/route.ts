import { NextResponse } from 'next/server';
import { PPAContract } from '@/src/types/energy';

function getConfianca(pct: number): 'success' | 'warning' | 'destructive' {
  if (pct >= 80) return 'success';
  if (pct >= 40) return 'warning';
  return 'destructive';
}

const MOCK_PPA: PPAContract[] = [
  {
    tipo: 'originacao',
    atual: 39.6,
    vsSemana: -343,
    atingimentoMensal: 18,
    targetMensal: 2289,
    atingimentoAnual: 1,
    targetAnual: 40000,
    confianca: getConfianca(18),
  },
  {
    tipo: 'comissionamento',
    atual: 0,
    vsSemana: 68.2,
    atingimentoMensal: 24,
    targetMensal: 286,
    atingimentoAnual: 2,
    targetAnual: 5000,
    confianca: getConfianca(24),
  },
  {
    tipo: 'renegociacao',
    atual: 3893,
    vsSemana: 1840,
    atingimentoMensal: 693,
    targetMensal: 859,
    atingimentoAnual: 46,
    targetAnual: 15000,
    confianca: getConfianca(693),
  },
];

export async function GET() {
  return NextResponse.json({
    success: true,
    data: MOCK_PPA,
  });
}
