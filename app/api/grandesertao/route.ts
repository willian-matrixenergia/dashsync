import { NextResponse } from 'next/server';
import { GDKpiRow } from '@/src/types/energy';

const MOCK_GRANDESERTAO: GDKpiRow[] = [
  {
    id: 'KPI 1',
    descricao: 'Geração de Energia x Energia Esperada',
    unidade: '(MWh)',
    atualSemana: 4133,
    targetMensal: 18038,
    atingimentoMensal: 43,
    confianca: 'success',
    semana: 422,
    targetAnual: 228321,
    atingimentoAnual: 10.5,
    hasVisaoSemanal: true,
  },
  {
    id: 'KPI 2',
    descricao: 'Fator de Irradiação',
    unidade: '(KWh/m²)',
    atualSemana: 53.7,
    targetMensal: 211.8,
    atingimentoMensal: 47,
    confianca: 'success',
    semana: 8.6,
    targetAnual: 2624,
    atingimentoAnual: 11.2,
    hasVisaoSemanal: true,
  },
  {
    id: 'KPI 3',
    descricao: 'Taxa de Disponibilidade',
    unidade: '(%)',
    atualSemana: null, // dados de fevereiro não recebidos
    targetMensal: 98.6,
    atingimentoMensal: 100,
    confianca: 'success',
    semana: null,
    targetAnual: 98.6,
    atingimentoAnual: 100, // média ano 98.8%
    hasVisaoSemanal: false,
  },
];

export async function GET() {
  return NextResponse.json({
    success: true,
    data: MOCK_GRANDESERTAO,
  });
}
