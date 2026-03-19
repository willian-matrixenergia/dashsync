import { NextResponse } from 'next/server';
import { getSupabase } from '@/src/lib/supabase';

export async function GET(req: Request) {
  try {
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from('portfolio_master')
      .select('potencia_mw, avanco_fisico_real, avanco_financeiro_real');

    if (error) throw error;

    const stats = {
      total_potencia: (data as any[]).reduce((sum, p) => sum + (p.potencia_mw || 0), 0),
      total_projetos: data?.length || 0,
      media_fisico: (data as any[]).reduce((sum, p) => sum + (p.avanco_fisico_real || 0), 0) / (data?.length || 1),
      media_financeiro: (data as any[]).reduce((sum, p) => sum + (p.avanco_financeiro_real || 0), 0) / (data?.length || 1),
    };

    return NextResponse.json({ success: true, data: stats });
  } catch (err) {
    console.error('Failed to fetch stats:', err);
    return NextResponse.json(
      { success: false, error: { message: 'Failed to fetch stats' } },
      { status: 500 }
    );
  }
}
