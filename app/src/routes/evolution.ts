import { Router, Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';
import type { EvolutionLabor, ApiResponse } from '../types.js';

const router = Router();

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Missing Supabase credentials');
  return createClient(url, key);
}

// GET /api/evolution - List evolution data by project
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const supabase = getSupabase();
    const { projeto } = req.query;

    let query = supabase.from('evolution_labor').select('*');

    if (projeto) query = query.eq('projeto', projeto);

    const { data, error } = await query.order('semana');

    if (error) throw error;

    res.json({
      success: true,
      data: data as EvolutionLabor[],
    } as ApiResponse<EvolutionLabor[]>);
  } catch (err) {
    console.error('Failed to fetch evolution data:', err);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch evolution data' },
    } as ApiResponse<null>);
  }
});

// POST /api/evolution - Create/Upsert evolution record
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const supabase = getSupabase();
    const payload = req.body as Partial<EvolutionLabor>;

    if (!payload.projeto || !payload.semana) {
      res.status(400).json({
        success: false,
        error: { message: 'projeto and semana are required' },
      } as ApiResponse<null>);
      return;
    }

    const { data, error } = await supabase
      .from('evolution_labor')
      .upsert([payload], { onConflict: 'id' })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      data: data as EvolutionLabor,
    } as ApiResponse<EvolutionLabor>);
  } catch (err) {
    console.error('Failed to create/update evolution:', err);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to create/update evolution' },
    } as ApiResponse<null>);
  }
});

// GET /api/evolution/:projeto/curva-s - S-Curve data for project
router.get('/:projeto/curva-s', async (req: Request, res: Response): Promise<void> => {
  try {
    const supabase = getSupabase();
    const { projeto } = req.params;

    const { data, error } = await supabase
      .from('evolution_labor')
      .select('semana, pct_planejado_lb, pct_tendencia, pct_realizado')
      .eq('projeto', projeto)
      .order('semana');

    if (error) throw error;

    res.json({
      success: true,
      data: data,
    } as ApiResponse<any>);
  } catch (err) {
    console.error('Failed to fetch S-curve:', err);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch S-curve' },
    } as ApiResponse<null>);
  }
});

// GET /api/evolution/:projeto/mod - MOD data for project
router.get('/:projeto/mod', async (req: Request, res: Response): Promise<void> => {
  try {
    const supabase = getSupabase();
    const { projeto } = req.params;

    const { data, error } = await supabase
      .from('evolution_labor')
      .select('semana, mod_prevista, mod_real')
      .eq('projeto', projeto)
      .order('semana');

    if (error) throw error;

    res.json({
      success: true,
      data: data,
    } as ApiResponse<any>);
  } catch (err) {
    console.error('Failed to fetch MOD data:', err);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch MOD data' },
    } as ApiResponse<null>);
  }
});

export default router;
