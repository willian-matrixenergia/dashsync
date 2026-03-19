import { Router, Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';
import type { TechnicalSpecs, ApiResponse } from '../types.js';

const router = Router();

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Missing Supabase credentials');
  return createClient(url, key);
}

// GET /api/specs - List technical specs
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const supabase = getSupabase();
    const { projeto } = req.query as any;

    let query = supabase.from('technical_specs').select('*');

    if (projeto) query = query.eq('projeto', projeto);

    const { data, error } = await query;

    if (error) throw error;

    res.json({
      success: true,
      data: data as TechnicalSpecs[],
    } as ApiResponse<TechnicalSpecs[]>);
  } catch (err) {
    console.error('Failed to fetch specs:', err);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch specs' },
    } as ApiResponse<null>);
  }
});

// GET /api/specs/:projeto - Get project specs
router.get('/:projeto', async (req: Request, res: Response): Promise<void> => {
  try {
    const supabase = getSupabase();
    const { projeto } = req.params as any;

    const { data, error } = await supabase
      .from('technical_specs')
      .select('*')
      .eq('projeto', projeto)
      .single();

    if (error) throw error;
    if (!data) {
      res.status(404).json({
        success: false,
        error: { message: 'Specs not found' },
      } as ApiResponse<null>);
      return;
    }

    res.json({
      success: true,
      data: data as TechnicalSpecs,
    } as ApiResponse<TechnicalSpecs>);
  } catch (err) {
    console.error('Failed to fetch specs:', err);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch specs' },
    } as ApiResponse<null>);
  }
});

// POST /api/specs - Create/Upsert specs
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const supabase = getSupabase();
    const payload = (req.body as any) as Partial<TechnicalSpecs>;

    if (!payload?.projeto || !payload?.programa) {
      res.status(400).json({
        success: false,
        error: { message: 'projeto and programa are required' },
      } as ApiResponse<null>);
      return;
    }

    const { data, error } = await supabase
      .from('technical_specs')
      .upsert([payload], { onConflict: 'projeto' })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      data: data as TechnicalSpecs,
    } as ApiResponse<TechnicalSpecs>);
  } catch (err) {
    console.error('Failed to create/update specs:', err);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to create/update specs' },
    } as ApiResponse<null>);
  }
});

export default router;
