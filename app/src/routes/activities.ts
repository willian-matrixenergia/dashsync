import { Router, Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';
import type { InternalActivity, ApiResponse } from '../types.js';

const router = Router();

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Missing Supabase credentials');
  return createClient(url, key);
}

// GET /api/activities - List activities by project
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const supabase = getSupabase();
    const { projeto } = req.query as any;

    let query = supabase.from('internal_activities').select('*');

    if (projeto) query = query.eq('projeto', projeto);

    const { data, error } = await query.order('atividade');

    if (error) throw error;

    res.json({
      success: true,
      data: data as InternalActivity[],
    } as ApiResponse<InternalActivity[]>);
  } catch (err) {
    console.error('Failed to fetch activities:', err);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch activities' },
    } as ApiResponse<null>);
  }
});

// POST /api/activities - Create/Upsert activity
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const supabase = getSupabase();
    const payload = (req.body as any) as Partial<InternalActivity>;

    if (!payload?.projeto || !payload?.atividade) {
      res.status(400).json({
        success: false,
        error: { message: 'projeto and atividade are required' },
      } as ApiResponse<null>);
      return;
    }

    const { data, error } = await supabase
      .from('internal_activities')
      .upsert([payload], { onConflict: 'id' })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      data: data as InternalActivity,
    } as ApiResponse<InternalActivity>);
  } catch (err) {
    console.error('Failed to create/update activity:', err);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to create/update activity' },
    } as ApiResponse<null>);
  }
});

// GET /api/activities/:projeto/gantt - Gantt data for project
router.get('/:projeto/gantt', async (req: Request, res: Response): Promise<void> => {
  try {
    const supabase = getSupabase();
    const { projeto } = req.params as any;

    const { data, error } = await supabase
      .from('internal_activities')
      .select('atividade, inicio, termino, pct_fisico_previsto, pct_fisico_real')
      .eq('projeto', projeto)
      .order('inicio');

    if (error) throw error;

    res.json({
      success: true,
      data: data,
    } as ApiResponse<any>);
  } catch (err) {
    console.error('Failed to fetch Gantt data:', err);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch Gantt data' },
    } as ApiResponse<null>);
  }
});

// GET /api/activities/:projeto/speedometer - Speedometer (discipline) data
router.get('/:projeto/speedometer', async (req: Request, res: Response): Promise<void> => {
  try {
    const supabase = getSupabase();
    const { projeto } = req.params as any;

    const { data, error } = await supabase
      .from('internal_activities')
      .select('atividade, pct_fisico_previsto, pct_fisico_real')
      .eq('projeto', projeto);

    if (error) throw error;

    // Group by discipline (extract from atividade)
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

    res.json({
      success: true,
      data: result,
    } as ApiResponse<any>);
  } catch (err) {
    console.error('Failed to fetch speedometer data:', err);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch speedometer data' },
    } as ApiResponse<null>);
  }
});

export default router;
