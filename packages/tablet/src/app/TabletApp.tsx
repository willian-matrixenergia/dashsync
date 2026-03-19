import { useTabletControl }  from '../hooks/useTabletControl.js';
import { FilterPanel }        from '../components/FilterPanel.js';
import { ProjectList }        from '../components/ProjectList.js';
import { ScreenNav }          from '../components/ScreenNav.js';
import type { EstadoFiltroDTO } from '@dashsync/shared';
import { useState, useCallback } from 'react';
import { filtroVazio } from '@dashsync/shared';

export function TabletApp() {
  const { connected, estado, selecionarProjeto, aplicarFiltro, navegarEcra, recarregarDados } = useTabletControl();
  const [localFiltro, setLocalFiltro] = useState<EstadoFiltroDTO>(filtroVazio);

  const handleFiltroChange = useCallback((f: EstadoFiltroDTO) => {
    setLocalFiltro(f);
    aplicarFiltro(f);
  }, [aplicarFiltro]);

  return (
    <div className="tablet-root">
      <header className="tablet-header">
        <span className="tablet-logo">⚡ DashSync</span>
        <span className={`tablet-conn ${connected ? 'conn-ok' : 'conn-err'}`}>
          {connected ? '● Conectado' : '◯ Reconectando...'}
        </span>
        <button className="tablet-reload-btn" onClick={recarregarDados} aria-label="Recarregar dados Excel">
          ↻ Recarregar
        </button>
      </header>

      <ScreenNav ecraAtivo={estado.ecraAtivo} onNavigate={navegarEcra} />

      <main className="tablet-main">
        <FilterPanel filtros={localFiltro} onFiltroChange={handleFiltroChange} />
        <ProjectList
          filtros={localFiltro}
          projetoSelecionado={estado.projetoSelecionado}
          onSelect={selecionarProjeto}
        />
      </main>

      {estado.projetoSelecionado && (
        <footer className="tablet-footer">
          <span>Projeto selecionado no ecrã</span>
          <button className="btn-deselect" onClick={() => selecionarProjeto('' as never)}
                  aria-label="Limpar seleção">✕ Limpar</button>
        </footer>
      )}
    </div>
  );
}
