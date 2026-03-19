import { NextResponse } from 'next/server';
import { getSupabase } from '@/src/lib/supabase';

export async function GET(req: Request, { params }: { params: { projeto: string } }) {
  try {
    const supabase = getSupabase();
    const { projeto } = params;

    const { data, error } = await supabase
      .from('evolution_labor')
      .select('semana, pct_planejado_lb, pct_tendencia, pct_realizado')
      .eq('projeto', projeto)
      .order('semana');

    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error('Failed to fetch S-curve:', err);
    return NextResponse.json({ success: false, error: { message: 'Failed to fetch S-curve' } }, { status: 500 });
  }
}
