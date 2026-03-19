import { NextResponse } from 'next/server';
import { getSupabase } from '@/src/lib/supabase';

export async function GET(req: Request, { params }: { params: { projeto: string } }) {
  try {
    const supabase = getSupabase();
    const { projeto } = params;

    const { data, error } = await supabase
      .from('technical_specs')
      .select('*')
      .eq('projeto', projeto)
      .single();

    if (error) throw error;
    if (!data) {
      return NextResponse.json({ success: false, error: { message: 'Specs not found' } }, { status: 404 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error('Failed to fetch specs:', err);
    return NextResponse.json({ success: false, error: { message: 'Failed to fetch specs' } }, { status: 500 });
  }
}
