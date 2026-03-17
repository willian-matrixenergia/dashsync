import { memo, useState } from 'react';
import type { ProjetoId } from '@dashsync/shared';

interface Screen04Props {
  projetoId: ProjetoId | null;
}

const PLACEHOLDER_STREAM = 'about:blank';

export const Screen04Live = memo(function Screen04Live({ projetoId }: Screen04Props) {
  const [streamError, setStreamError] = useState(false);

  const streamUrl = projetoId
    ? `/api/stream/${projetoId}/live`
    : PLACEHOLDER_STREAM;

  if (!projetoId) {
    return (
      <div className="screen screen-04 screen-empty">
        <p>Selecione um projeto para visualizar câmera ao vivo</p>
      </div>
    );
  }

  return (
    <div className="screen screen-04">
      <header className="screen-header">
        <h1>Monitorização em Tempo Real</h1>
        <span className={`live-indicator ${streamError ? 'live-offline' : 'live-online'}`}>
          {streamError ? '⏸ Câmara Offline' : '● AO VIVO'}
        </span>
      </header>

      <div className="live-grid">
        <section className="stream-panel" aria-label="Câmara ao vivo">
          {streamError ? (
            <div className="stream-fallback">
              <p>📷 Sinal da câmara indisponível</p>
              <p className="stream-fallback-sub">Verifique a conexão com o prestador de serviços</p>
            </div>
          ) : (
            <iframe
              src={streamUrl}
              title="Câmara ao vivo"
              className="stream-iframe"
              allowFullScreen
              onError={() => setStreamError(true)}
            />
          )}
        </section>

        <section className="timelapse-panel" aria-label="Timelapse">
          <h2>Timelapse</h2>
          <video
            className="timelapse-video"
            src={projetoId ? `/media/${projetoId}/timelapse.mp4` : undefined}
            controls
            loop
            onError={() => {/* graceful — timelapse optional */}}
          />
          <p className="timelapse-info">Evolução temporal gerada externamente • Atualização semanal</p>
        </section>
      </div>
    </div>
  );
});
