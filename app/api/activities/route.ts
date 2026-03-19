import { NextResponse } from 'next/server';
import { getSupabase } from '@/src/lib/supabase';

export async function GET(req: Request) {
  try {
    const supabase = getSupabase();
    const { searchParams } = new URL(req.url);
    const projeto = searchParams.get('projeto');

    let query = supabase.from('internal_activities').select('*');
    if (projeto) query = query.eq('projeto', projeto);

    const { data, error } = await query.order('atividade');

    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error('Failed to fetch activities:', err);
    return NextResponse.json({ success: false, error: { message: 'Failed to fetch activities' } }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const supabase = getSupabase();
    const payload = await req.json();

    if (!payload.projeto || !payload.atividade) {
      return NextResponse.json({ success: false, error: { message: 'projeto and atividade are required' } }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('internal_activities')
      .upsert([payload], { onConflict: 'id' })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err) {
    console.error('Failed to create/update activity:', err);
    return NextResponse.json({ success: false, error: { message: 'Failed to create/update activity' } }, { status: 500 });
  }
}
