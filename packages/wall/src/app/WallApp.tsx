import { Component, type ErrorInfo, type ReactNode } from 'react';
import { useWallSync }        from '../hooks/useWallSync.js';
import { Screen01Portfolio }  from '../screens/Screen01Portfolio.js';
import { Screen02Progress }   from '../screens/Screen02Progress.js';
import { Screen03Media }      from '../screens/Screen03Media.js';
import { Screen04Live }       from '../screens/Screen04Live.js';

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  override state = { hasError: false };
  static getDerivedStateFromError(): { hasError: boolean } { return { hasError: true }; }
  override componentDidCatch(err: Error, info: ErrorInfo): void {
    console.error('[DashSync Wall Error]', err, info);
  }
  override render(): ReactNode {
    if (this.state.hasError) return (
      <div className="error-boundary">
        <h2>Erro na renderização</h2>
        <button onClick={() => this.setState({ hasError: false })}>Tentar novamente</button>
      </div>
    );
    return this.props.children;
  }
}

function ConnectionBadge({ connected }: { connected: boolean }) {
  return (
    <div className={`connection-badge ${connected ? 'connected' : 'disconnected'}`}
         aria-label={connected ? 'Tablet conectado' : 'Tablet desconectado'}>
      {connected ? '⬤ Tablet conectado' : '◯ Reconectando...'}
    </div>
  );
}

export function WallApp() {
  const { estado, connected, dataUpdatedAt } = useWallSync();
  const { ecraAtivo, projetoSelecionado, filtros } = estado;

  return (
    <div className="wall-root" data-screen={ecraAtivo}>
      <ConnectionBadge connected={connected} />

      {dataUpdatedAt && (
        <div className="data-refresh-badge" aria-live="polite">
          ↻ Dados atualizados: {new Date(dataUpdatedAt).toLocaleTimeString('pt-BR')}
        </div>
      )}

      <ErrorBoundary>
        {ecraAtivo === 'portfolio' && (
          <Screen01Portfolio filtros={filtros} refreshToken={dataUpdatedAt} />
        )}
        {ecraAtivo === 'progress' && (
          <Screen02Progress projetoId={projetoSelecionado} filtros={filtros} refreshToken={dataUpdatedAt} />
        )}
        {ecraAtivo === 'media' && (
          <Screen03Media projetoId={projetoSelecionado} refreshToken={dataUpdatedAt} />
        )}
        {ecraAtivo === 'live' && (
          <Screen04Live projetoId={projetoSelecionado} />
        )}
      </ErrorBoundary>
    </div>
  );
}
