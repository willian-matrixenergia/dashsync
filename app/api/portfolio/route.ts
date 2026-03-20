import { NextResponse } from 'next/server';
import { getSupabase } from '@/src/lib/supabase';

const MOCK_DATA = [
  { projeto: 'Complexo Solar Arinos', localidade: 'MG', programa: 'Geração Centralizada', criticidade_risco: 'Baixa', avanco_fisico_real: 85, avanco_financeiro_real: 78, potencia_mw: 420 },
  { projeto: 'UHE Estreito - Modernização', localidade: 'MA', programa: 'Geração Hidráulica', criticidade_risco: 'Alta', avanco_fisico_real: 42, avanco_financeiro_real: 55, potencia_mw: 1087 },
  { projeto: 'Linha Transmissão Xingu', localidade: 'PA', programa: 'Transmissão', criticidade_risco: 'Baixa', avanco_fisico_real: 92, avanco_financeiro_real: 89, potencia_mw: 0 },
  { projeto: 'PCH Rio do Peixe', localidade: 'SC', programa: 'Geração Hidráulica', criticidade_risco: 'Media', avanco_fisico_real: 65, avanco_financeiro_real: 62, potencia_mw: 24 }
];

export async function GET(req: Request) {
  try {
    let supabase;
    try {
      supabase = getSupabase();
    } catch (envError) {
      console.warn('Supabase credentials missing, falling back to MOCK_DATA for local development.');
      return NextResponse.json({ success: true, data: MOCK_DATA });
    }

    const { searchParams } = new URL(req.url);
    // ... filtering logic ...
    const { data, error } = await supabase.from('portfolio_master').select('*').order('projeto');
    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error('Failed to fetch portfolio:', err);
    return NextResponse.json(
      { success: false, error: { message: 'Failed to fetch portfolio' } },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const supabase = getSupabase();
    const payload = await req.json();

    if (!payload.projeto || !payload.programa) {
      return NextResponse.json(
        { success: false, error: { message: 'projeto and programa are required' } },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('portfolio_master')
      .upsert([payload], { onConflict: 'projeto' })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err) {
    console.error('Failed to create/update project:', err);
    return NextResponse.json(
      { success: false, error: { message: 'Failed to create/update project' } },
      { status: 500 }
    );
  }
}
