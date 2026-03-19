import { NextResponse } from 'next/server';
import { getSupabase } from '@/src/lib/supabase';

export async function GET(req: Request, { params }: { params: { projeto: string } }) {
  try {
    const supabase = getSupabase();
    const { projeto } = params;

    const { data, error } = await supabase
      .from('evolution_labor')
      .select('semana, mod_prevista, mod_real')
      .eq('projeto', projeto)
      .order('semana');

    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error('Failed to fetch MOD data:', err);
    return NextResponse.json({ success: false, error: { message: 'Failed to fetch MOD data' } }, { status: 500 });
  }
}
