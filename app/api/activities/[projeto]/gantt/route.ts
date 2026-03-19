import { NextResponse } from 'next/server';
import { getSupabase } from '@/src/lib/supabase';

export async function GET(req: Request, { params }: { params: { projeto: string } }) {
  try {
    const supabase = getSupabase();
    const { projeto } = params;

    const { data, error } = await supabase
      .from('internal_activities')
      .select('atividade, inicio, termino, pct_fisico_previsto, pct_fisico_real')
      .eq('projeto', projeto)
      .order('inicio');

    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error('Failed to fetch Gantt data:', err);
    return NextResponse.json({ success: false, error: { message: 'Failed to fetch Gantt data' } }, { status: 500 });
  }
}
