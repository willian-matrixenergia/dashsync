import { NextResponse } from 'next/server';
import { getSupabase } from '@/src/lib/supabase';

export async function GET(req: Request, { params }: { params: { projeto: string } }) {
  try {
    const supabase = getSupabase();
    const { projeto } = params;

    const { data, error } = await supabase
      .from('internal_activities')
      .select('atividade, pct_fisico_previsto, pct_fisico_real')
      .eq('projeto', projeto);

    if (error) throw error;

    // Group by discipline
    const disciplines = new Map<string, { previsto: number; real: number; count: number }>();

    (data as any[]).forEach((row) => {
      const parts = row.atividade.split(' - ');
      const discipline = parts[1] || 'Outros';

      if (!disciplines.has(discipline)) {
        disciplines.set(discipline, { previsto: 0, real: 0, count: 0 });
      }

      const d = disciplines.get(discipline)!;
      d.previsto += row.pct_fisico_previsto || 0;
      d.real += row.pct_fisico_real || 0;
      d.count += 1;
    });

    const result = Array.from(disciplines.entries()).map(([name, stats]) => ({
      disciplina: name,
      pct_previsto: stats.previsto / stats.count,
      pct_real: stats.real / stats.count,
    }));

    return NextResponse.json({ success: true, data: result });
  } catch (err) {
    console.error('Failed to fetch speedometer data:', err);
    return NextResponse.json({ success: false, error: { message: 'Failed to fetch speedometer data' } }, { status: 500 });
  }
}
