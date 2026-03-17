import { memo, useCallback } from 'react';
import type { EstadoFiltroDTO, ProgramaTipo, NivelCriticidade } from '@dashsync/shared';
import { PROGRAMAS, NIVEIS_CRITICIDADE } from '@dashsync/shared';

interface FilterPanelProps {
  filtros:        EstadoFiltroDTO;
  onFiltroChange: (f: EstadoFiltroDTO) => void;
}

export const FilterPanel = memo(function FilterPanel({ filtros, onFiltroChange }: FilterPanelProps) {
  const togglePrograma = useCallback((prog: ProgramaTipo) => {
    const programas = filtros.programas.includes(prog)
      ? filtros.programas.filter(p => p !== prog)
      : [...filtros.programas, prog];
    onFiltroChange({ ...filtros, programas });
  }, [filtros, onFiltroChange]);

  const toggleCriticidade = useCallback((crit: NivelCriticidade) => {
    const criticidades = filtros.criticidades.includes(crit)
      ? filtros.criticidades.filter(c => c !== crit)
      : [...filtros.criticidades, crit];
    onFiltroChange({ ...filtros, criticidades });
  }, [filtros, onFiltroChange]);

  const setBusca = useCallback((busca: string) => {
    onFiltroChange({ ...filtros, busca: busca || null });
  }, [filtros, onFiltroChange]);

  return (
    <aside className="filter-panel" aria-label="Filtros">
      <h2 className="filter-title">Filtros</h2>

      <div className="filter-group">
        <label className="filter-group-label">Programa</label>
        {PROGRAMAS.map(prog => (
          <button key={prog}
            className={`filter-chip ${filtros.programas.includes(prog) ? 'active' : ''}`}
            onClick={() => togglePrograma(prog)}
            aria-pressed={filtros.programas.includes(prog)}>
            {prog}
          </button>
        ))}
      </div>

      <div className="filter-group">
        <label className="filter-group-label">Criticidade</label>
        {NIVEIS_CRITICIDADE.map(crit => (
          <button key={crit}
            className={`filter-chip filter-crit-${crit} ${filtros.criticidades.includes(crit) ? 'active' : ''}`}
            onClick={() => toggleCriticidade(crit)}
            aria-pressed={filtros.criticidades.includes(crit)}>
            {crit.charAt(0).toUpperCase() + crit.slice(1)}
          </button>
        ))}
      </div>

      <div className="filter-group">
        <label className="filter-group-label" htmlFor="busca">Buscar projeto</label>
        <input id="busca" type="search" className="filter-input"
          placeholder="Nome ou localidade..."
          value={filtros.busca ?? ''}
          onChange={e => setBusca(e.target.value)}
          aria-label="Buscar projeto por nome ou localidade" />
      </div>
    </aside>
  );
});
