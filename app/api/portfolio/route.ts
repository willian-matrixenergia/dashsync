import { NextResponse } from 'next/server';
import { getSupabase } from '@/src/lib/supabase';

export async function GET(req: Request) {
  try {
    const supabase = getSupabase();
    const { searchParams } = new URL(req.url);
    
    const programa = searchParams.get('programa');
    const fase = searchParams.get('fase');
    const criticidade = searchParams.get('criticidade');

    let query = supabase.from('portfolio_master').select('*');

    if (programa) query = query.eq('programa', programa);
    if (fase) query = query.eq('fase', fase);
    if (criticidade) query = query.eq('criticidade_risco', criticidade);

    const { data, error } = await query.order('projeto');

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
