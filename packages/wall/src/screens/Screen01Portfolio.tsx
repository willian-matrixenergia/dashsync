import { useEffect, useState, useMemo, memo } from 'react';
import type { ProjetoSummaryDTO, EstadoFiltroDTO } from '@dashsync/shared';
import { KpiCard }    from '../components/KpiCard.js';
import { GanttChart } from '../components/GanttChart.js';

interface Screen01Props {
  filtros:      EstadoFiltroDTO;
  refreshToken: string | null;
}

interface Stats {
  total: number; totalMW: number; avgFisico: number; avgFinanceiro: number; criticos: number;
}

export const Screen01Portfolio = memo(function Screen01Portfolio({ filtros, refreshToken }: Screen01Props) {
  const [projetos, setProjetos]   = useState<ProjetoSummaryDTO[]>([]);
  const [stats, setStats]         = useState<Stats | null>(null);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const params = new URLSearchParams();
    if (filtros.coordenador) params.set('coordenador', filtros.coordenador);
    if (filtros.supervisor)  params.set('supervisor', filtros.supervisor);
    if (filtros.busca)       params.set('busca', filtros.busca);

    Promise.all([
      fetch(`/api/projects?${params}`).then(r => r.json() as Promise<ProjetoSummaryDTO[]>),
      fetch('/api/stats').then(r => r.json() as Promise<Stats>),
    ]).then(([ps, st]) => {
      if (cancelled) return;
      const filtered = ps.filter(p =>
        filtros.programas.includes(p.programa) &&
        filtros.criticidades.includes(p.criticidade),
      );
      setProjetos(filtered);
      setStats(st);
      setLoading(false);
    }).catch(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [filtros, refreshToken]);

  const criticosCount = useMemo(() => projetos.filter(p => p.criticidade === 'alto').length, [projetos]);
  const avgFisicoReal = useMemo(() =>
    projetos.length ? projetos.reduce((s, p) => s + p.progressoFisico.realizado, 0) / projetos.length : 0,
  [projetos]);

  if (loading) return <div className="screen-loading">Carregando portfólio...</div>;

  return (
    <div className="screen screen-01">
      <header className="screen-header">
        <h1>Portfólio de Projetos</h1>
        <span className="screen-badge">{projetos.length} projetos</span>
      </header>

      <section className="kpi-row" aria-label="Indicadores gerais">
        <KpiCard label="Total Projetos"   value={stats?.total ?? projetos.length} />
        <KpiCard label="Potência Total"   value={(stats?.totalMW ?? 0).toFixed(1)} unit="MW" />
        <KpiCard label="Progresso Físico" value={avgFisicoReal.toFixed(1)} unit="%" />
        <KpiCard label="Progresso Financeiro" value={(stats?.avgFinanceiro ?? 0).toFixed(1)} unit="%" />
        <KpiCard label="Críticos" value={criticosCount}
                 criticidade={criticosCount > 0 ? 'alto' : 'baixo'} />
      </section>

      <section className="table-section" aria-label="Lista de projetos">
        <div className="table-wrap">
          <table className="projects-table">
            <thead>
              <tr>
                <th>Localidade</th><th>Programa</th><th>Coordenador</th>
                <th>COD Previsto</th><th>Tendência</th>
                <th>Fís. Prev.</th><th>Fís. Real.</th>
                <th>Fin. Real.</th><th>Criticidade</th>
              </tr>
            </thead>
            <tbody>
              {projetos.map(p => (
                <tr key={p.id} className={p.criticidade === 'alto' ? 'row-critical' : ''}>
                  <td>{p.localidade}</td>
                  <td><span className={`badge badge-${p.programa.toLowerCase()}`}>{p.programa}</span></td>
                  <td>{p.coordenador}</td>
                  <td>{new Date(p.codPrevisto).toLocaleDateString('pt-BR')}</td>
                  <td><span className={`tendencia tendencia-${p.tendenciaCOD}`}>{p.tendenciaCOD.replace('_',' ')}</span></td>
                  <td className="num">{p.progressoFisico.previsto.toFixed(1)}%</td>
                  <td className="num">{p.progressoFisico.realizado.toFixed(1)}%</td>
                  <td className="num">{p.progressoFinanceiro.realizado.toFixed(1)}%</td>
                  <td><span className={`crit crit-${p.criticidade}`}>{p.criticidade}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="gantt-section" aria-label="Cronograma Gantt">
        <h2>Cronograma de Projetos</h2>
        {projetos.length > 0
          ? <GanttChart projetos={projetos} height={Math.max(220, projetos.length * 28)} />
          : <p className="empty-msg">Nenhum projeto para exibir com os filtros atuais</p>
        }
      </section>
    </div>
  );
});
