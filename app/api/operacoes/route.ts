import { NextResponse } from 'next/server';
import type { OperacoesData } from '@/src/types/energy';

const MOCK_OPERACOES: OperacoesData = {
  semanaAtual: '09Fev',
  semanaAnterior: '02Fev',
  mesReferencia: 'Fev · 2026',
  capex: {
    etapas: [
      { numero: 1, nome: 'Prospecção',   atual: 4505.0, deltaSemanaMM: 5.0 },
      { numero: 2, nome: 'Qualificação', atual: 510.0,  deltaSemanaMM: 0 },
      { numero: 3, nome: 'Diagnóstico',  atual: 1200.0, deltaSemanaMM: 0 },
      { numero: 4, nome: 'Proposta e BC',atual: 992.0,  deltaSemanaMM: 0 },
      { numero: 5, nome: 'Negociação',   atual: 168.0,  deltaSemanaMM: 0 },
      { numero: 6, nome: 'Fechamento',   atual: null,   deltaSemanaMM: 0 },
      { numero: 7, nome: 'Expansão',     atual: null,   deltaSemanaMM: 0 },
    ],
    targetFechamentoMM: 115,
  },
  assetLight: {
    etapas: [
      { numero: 1, nome: 'Prospecção',   atual: null,  deltaSemanaMM: 0 },
      { numero: 2, nome: 'Qualificação', atual: null,  deltaSemanaMM: 0 },
      { numero: 3, nome: 'Diagnóstico',  atual: 40.0,  deltaSemanaMM: 0 },
      { numero: 4, nome: 'Proposta e BC',atual: null,  deltaSemanaMM: 0 },
      { numero: 5, nome: 'Negociação',   atual: 25.0,  deltaSemanaMM: 0 },
      { numero: 6, nome: 'Fechamento',   atual: null,  deltaSemanaMM: 0 },
      { numero: 7, nome: 'Expansão',     atual: 7.0,   deltaSemanaMM: 0 },
    ],
    targetFechamentoMM: 61,
  },
  ffc: [
    { numero: 4, nome: 'Proposta e BC', atual: 118.0, deltaSemanaMM: 0 },
    { numero: 5, nome: 'Negociação',    atual: 39.0,  deltaSemanaMM: 0 },
    { numero: 6, nome: 'Fechamento',    atual: null,  deltaSemanaMM: 0 },
  ],
  mtm: [
    { numero: 4, nome: 'Proposta e BC', atual: 420.0, deltaSemanaMM: 0 },
    { numero: 5, nome: 'Negociação',    atual: 168.0, deltaSemanaMM: 0 },
    { numero: 6, nome: 'Fechamento',    atual: null,  deltaSemanaMM: 0 },
  ],
};

export async function GET() {
  return NextResponse.json({ success: true, data: MOCK_OPERACOES });
}
