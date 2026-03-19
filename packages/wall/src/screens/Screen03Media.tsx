import { memo, useEffect, useState } from 'react';
import type { ProjetoId, GaleriaDTO } from '@dashsync/shared';
import { MediaGallery } from '../components/MediaGallery.js';

interface Screen03Props {
  projetoId:    ProjetoId | null;
  refreshToken: string | null;
}

export const Screen03Media = memo(function Screen03Media({ projetoId, refreshToken }: Screen03Props) {
  const [galeria, setGaleria] = useState<GaleriaDTO | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!projetoId) { setGaleria(null); return; }
    let cancelled = false;
    setLoading(true);

    fetch(`/api/projects/${projetoId}/media`)
      .then(r => r.json() as Promise<GaleriaDTO>)
      .then(g => { if (!cancelled) { setGaleria(g); setLoading(false); } })
      .catch(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [projetoId, refreshToken]);

  if (!projetoId) {
    return (
      <div className="screen screen-03 screen-empty">
        <p>Selecione um projeto no tablet para ver evidências visuais</p>
      </div>
    );
  }

  if (loading) return <div className="screen-loading">Carregando mídia...</div>;
  if (!galeria) return <div className="screen-error">Galeria não disponível</div>;

  return (
    <div className="screen screen-03">
      <header className="screen-header">
        <h1>Evidências Visuais</h1>
        <span className="screen-badge">Semana {galeria.semanaAtual}</span>
      </header>
      <MediaGallery fotos={galeria.fotos} videos={galeria.videos} tour360={galeria.tour360} />
    </div>
  );
});
