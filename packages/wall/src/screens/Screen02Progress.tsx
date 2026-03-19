import { memo } from 'react';
import type { ProjetoId, EstadoFiltroDTO, ProjetoSummaryDTO } from '@dashsync/shared';
import { useProjectData }   from '../hooks/useProjectData.js';
import { SCurveChart }      from '../components/SCurveChart.js';
import { LaborHistogram }   from '../components/LaborHistogram.js';
import { Speedometer }      from '../components/Speedometer.js';
import { DeltaScroller }    from '../components/DeltaScroller.js';
import { useEffect, useState } from 'react';

interface Screen02Props {
  projetoId:    ProjetoId | null;
  filtros:      EstadoFiltroDTO;
  refreshToken: string | null;
}

export const Screen02Progress = memo(function Screen02Progress({ projetoId, filtros, refreshToken }: Screen02Props) {
  const { detail, evolucao, loading } = useProjectData(projetoId, refreshToken);
  const [allProjetos, setAllProjetos] = useState<ProjetoSummaryDTO[]>([]);

  useEffect(() => {
    fetch('/api/projects').then(r => r.json())
      .then((ps: ProjetoSummaryDTO[]) => {
        const filtered = ps.filter(p =>
          filtros.programas.includes(p.programa) &&
          filtros.criticidades.includes(p.criticidade),
        );
        setAllProjetos(filtered);
      }).catch(() => null);
  }, [filtros, refreshToken]);

  if (!projetoId) {
    return (
      <div className="screen screen-02 screen-empty">
        <DeltaScroller projetos={allProjetos} />
        <div className="awaiting-selection">
          <p>Selecione um projeto no tablet para ver detalhes</p>
        </div>
      </div>
    );
  }

  if (loading) return <div className="screen-loading">Carregando progresso...</div>;
  if (!detail || !evolucao) return <div className="screen-error">Dados não disponíveis para este projeto</div>;

  const disc = detail.disciplinas;

  return (
    <div className="screen screen-02">
      <header className="screen-header">
        <h1>{detail.nome}</h1>
        <span className="screen-badge badge-programa">{detail.programa} — {detail.localidade}</span>
      </header>

      <DeltaScroller projetos={allProjetos} />

      <div className="progress-grid">
        <section className="card chart-card" aria-label="Curva S">
          <h2>Curva S — Progresso Semanal</h2>
          <SCurveChart data={evolucao.scurve} />
        </section>

        <section className="card chart-card" aria-label="Mão de Obra">
          <h2>Histograma MOD</h2>
          <LaborHistogram data={evolucao.labor} />
        </section>
      </div>

      <section className="speedometers-row" aria-label="Disciplinas">
        <Speedometer label="Engenharia"      progresso={disc.engenharia} />
        <Speedometer label="Suprimentos"     progresso={disc.suprimentos} />
        <Speedometer label="Construção"      progresso={disc.construcao} />
        <Speedometer label="Comissionamento" progresso={disc.comissionamento} />
      </section>
    </div>
  );
});
