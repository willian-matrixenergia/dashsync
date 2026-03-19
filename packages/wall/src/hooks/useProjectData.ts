import { useEffect, useState } from 'react';
import type { ProjetoDetailDTO, EvolucaoSemanalDTO, ProjetoId } from '@dashsync/shared';

interface ProjectData {
  detail:   ProjetoDetailDTO | null;
  evolucao: EvolucaoSemanalDTO | null;
  loading:  boolean;
  error:    string | null;
}

export function useProjectData(projetoId: ProjetoId | null, refreshToken: string | null): ProjectData {
  const [data, setData] = useState<ProjectData>({ detail: null, evolucao: null, loading: false, error: null });

  useEffect(() => {
    if (!projetoId) {
      setData({ detail: null, evolucao: null, loading: false, error: null });
      return;
    }
    let cancelled = false;
    setData(prev => ({ ...prev, loading: true, error: null }));

    Promise.all([
      fetch(`/api/projects/${projetoId}`).then(r => r.json() as Promise<ProjetoDetailDTO>),
      fetch(`/api/projects/${projetoId}/scurve`).then(r => r.json()),
      fetch(`/api/projects/${projetoId}/labor`).then(r => r.json()),
    ]).then(([detail, scurveData, laborData]) => {
      if (cancelled) return;
      const evolucao: EvolucaoSemanalDTO = {
        projetoId,
        scurve: (scurveData as { scurve: EvolucaoSemanalDTO['scurve'] }).scurve,
        labor:  (laborData  as { labor:  EvolucaoSemanalDTO['labor']  }).labor,
      };
      setData({ detail, evolucao, loading: false, error: null });
    }).catch((err: unknown) => {
      if (cancelled) return;
      setData(prev => ({ ...prev, loading: false, error: String(err) }));
    });

    return () => { cancelled = true; };
  }, [projetoId, refreshToken]);

  return data;
}
