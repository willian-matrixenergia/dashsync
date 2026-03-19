import { Router, Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';
import type { PortfolioMaster, ApiResponse } from '../types.js';

const router = Router();

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Missing Supabase credentials');
  return createClient(url, key);
}

// GET /api/portfolio - List all projects with filters
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const supabase = getSupabase();
    const { programa, fase, criticidade } = req.query as any;

    let query = supabase.from('portfolio_master').select('*');

    if (programa) query = query.eq('programa', programa);
    if (fase) query = query.eq('fase', fase);
    if (criticidade) query = query.eq('criticidade_risco', criticidade);

    const { data, error } = await query.order('projeto');

    if (error) throw error;

    res.json({
      success: true,
      data: data as PortfolioMaster[],
    } as ApiResponse<PortfolioMaster[]>);
  } catch (err) {
    console.error('Failed to fetch portfolio:', err);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch portfolio' },
    } as ApiResponse<null>);
  }
});

// GET /api/portfolio/:projeto - Get single project
router.get('/:projeto', async (req: Request, res: Response): Promise<void> => {
  try {
    const supabase = getSupabase();
    const { projeto } = req.params as any;

    const { data, error } = await supabase
      .from('portfolio_master')
      .select('*')
      .eq('projeto', projeto)
      .single();

    if (error) throw error;
    if (!data) {
      res.status(404).json({
        success: false,
        error: { message: 'Project not found' },
      } as ApiResponse<null>);
      return;
    }

    res.json({
      success: true,
      data: data as PortfolioMaster,
    } as ApiResponse<PortfolioMaster>);
  } catch (err) {
    console.error('Failed to fetch project:', err);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch project' },
    } as ApiResponse<null>);
  }
});

// POST /api/portfolio - Create/Upsert project
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const supabase = getSupabase();
    const payload = (req.body as any) as Partial<PortfolioMaster>;

    if (!payload?.projeto || !payload?.programa) {
      res.status(400).json({
        success: false,
        error: { message: 'projeto and programa are required' },
      } as ApiResponse<null>);
      return;
    }

    const { data, error } = await supabase
      .from('portfolio_master')
      .upsert([payload], { onConflict: 'projeto' })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      data: data as PortfolioMaster,
    } as ApiResponse<PortfolioMaster>);
  } catch (err) {
    console.error('Failed to create/update project:', err);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to create/update project' },
    } as ApiResponse<null>);
  }
});

// GET /api/portfolio/stats/summary - Portfolio summary stats
router.get('/stats/summary', async (req: Request, res: Response): Promise<void> => {
  try {
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from('portfolio_master')
      .select('potencia_mw, avanco_fisico_real, avanco_financeiro_real');

    if (error) throw error;

    const stats = {
      total_potencia: (data as any[]).reduce((sum, p) => sum + (p.potencia_mw || 0), 0),
      total_projetos: data?.length || 0,
      media_fisico: (data as any[]).reduce((sum, p) => sum + (p.avanco_fisico_real || 0), 0) / (data?.length || 1),
      media_financeiro: (data as any[]).reduce((sum, p) => sum + (p.avanco_financeiro_real || 0), 0) / (data?.length || 1),
    };

    res.json({
      success: true,
      data: stats,
    });
  } catch (err) {
    console.error('Failed to fetch stats:', err);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch stats' },
    });
  }
});

export default router;
