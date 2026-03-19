import { NextResponse } from 'next/server';
import { getSupabase } from '@/src/lib/supabase';

export async function GET(req: Request) {
  try {
    const supabase = getSupabase();
    const { searchParams } = new URL(req.url);
    const projeto = searchParams.get('projeto');

    let query = supabase.from('technical_specs').select('*');
    if (projeto) query = query.eq('projeto', projeto);

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error('Failed to fetch specs:', err);
    return NextResponse.json({ success: false, error: { message: 'Failed to fetch specs' } }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const supabase = getSupabase();
    const payload = await req.json();

    if (!payload.projeto || !payload.programa) {
      return NextResponse.json({ success: false, error: { message: 'projeto and programa are required' } }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('technical_specs')
      .upsert([payload], { onConflict: 'projeto' })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err) {
    console.error('Failed to create/update specs:', err);
    return NextResponse.json({ success: false, error: { message: 'Failed to create/update specs' } }, { status: 500 });
  }
}
