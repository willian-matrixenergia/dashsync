import { memo, useEffect, useState } from 'react';
import type { ProjetoId, ProjetoSummaryDTO, EstadoFiltroDTO } from '@dashsync/shared';

interface ProjectListProps {
  filtros:            EstadoFiltroDTO;
  projetoSelecionado: ProjetoId | null;
  onSelect:           (id: ProjetoId) => void;
}

export const ProjectList = memo(function ProjectList({ filtros, projetoSelecionado, onSelect }: ProjectListProps) {
  const [projetos, setProjetos] = useState<ProjetoSummaryDTO[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch('/api/projects').then(r => r.json()).then((ps: ProjetoSummaryDTO[]) => {
      if (cancelled) return;
      const filtered = ps.filter(p =>
        filtros.programas.includes(p.programa) &&
        filtros.criticidades.includes(p.criticidade) &&
        (!filtros.busca || p.nome.toLowerCase().includes(filtros.busca.toLowerCase()) ||
                           p.localidade.toLowerCase().includes(filtros.busca.toLowerCase())),
      );
      setProjetos(filtered);
      setLoading(false);
    }).catch(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [filtros]);

  if (loading) return <div className="project-list-loading">Carregando...</div>;
  if (projetos.length === 0) return <div className="project-list-empty">Nenhum projeto encontrado</div>;

  return (
    <div className="project-list" role="listbox" aria-label="Lista de projetos">
      {projetos.map(p => (
        <button key={p.id}
          role="option"
          aria-selected={projetoSelecionado === p.id}
          className={`project-item ${projetoSelecionado === p.id ? 'selected' : ''} crit-border-${p.criticidade}`}
          onClick={() => onSelect(p.id)}>
          <div className="project-item-header">
            <span className="project-name">{p.nome}</span>
            <span className={`project-crit crit-${p.criticidade}`}>
              {p.criticidade === 'alto' ? '⚠' : p.criticidade === 'medio' ? '●' : '✓'}
            </span>
          </div>
          <div className="project-item-meta">
            <span className="project-local">{p.localidade}</span>
            <span className={`project-badge badge-${p.programa.toLowerCase()}`}>{p.programa}</span>
          </div>
          <div className="project-progress-bar">
            <div className="pb-track">
              <div className="pb-previsto" style={{ width: `${p.progressoFisico.previsto}%` }} />
              <div className="pb-realizado" style={{ width: `${p.progressoFisico.realizado}%` }} />
            </div>
            <span className="pb-label">{p.progressoFisico.realizado.toFixed(0)}%</span>
          </div>
        </button>
      ))}
    </div>
  );
});
