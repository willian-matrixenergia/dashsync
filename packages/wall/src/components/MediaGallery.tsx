import { memo, useState } from 'react';
import type { MediaFileDTO } from '@dashsync/shared';

interface MediaGalleryProps {
  fotos:  MediaFileDTO[];
  videos: MediaFileDTO[];
  tour360: MediaFileDTO | null;
}

export const MediaGallery = memo(function MediaGallery({ fotos, videos, tour360 }: MediaGalleryProps) {
  const [lightbox, setLightbox] = useState<MediaFileDTO | null>(null);

  const openLightbox = (item: MediaFileDTO) => setLightbox(item);
  const closeLightbox = () => setLightbox(null);

  return (
    <div className="media-gallery">
      {tour360 && (
        <a href={tour360.link360 ?? tour360.url} target="_blank" rel="noopener noreferrer"
           className="tour360-btn" aria-label="Abrir tour 360° em nova aba">
          🌐 Tour 360° / VR
        </a>
      )}

      <section aria-label="Fotos da obra">
        <h3 className="gallery-section-title">Fotos ({fotos.length})</h3>
        <div className="gallery-grid">
          {fotos.map(foto => (
            <button key={foto.id} className="gallery-thumb" onClick={() => openLightbox(foto)}
                    aria-label={`Ver foto: ${foto.nome}`}>
              <img src={foto.url} alt={foto.nome} loading="lazy" />
              <span className="gallery-thumb-label">{foto.nome}</span>
            </button>
          ))}
          {fotos.length === 0 && <p className="gallery-empty">Nenhuma foto esta semana</p>}
        </div>
      </section>

      <section aria-label="Vídeos da obra">
        <h3 className="gallery-section-title">Vídeos ({videos.length})</h3>
        <div className="gallery-grid">
          {videos.map(video => (
            <button key={video.id} className="gallery-thumb video-thumb" onClick={() => openLightbox(video)}
                    aria-label={`Ver vídeo: ${video.nome}`}>
              <span className="video-play-icon">▶</span>
              <span className="gallery-thumb-label">{video.nome}</span>
            </button>
          ))}
          {videos.length === 0 && <p className="gallery-empty">Nenhum vídeo esta semana</p>}
        </div>
      </section>

      {lightbox && (
        <div className="lightbox-overlay" role="dialog" aria-modal aria-label={lightbox.nome}
             onClick={closeLightbox}>
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox} aria-label="Fechar">✕</button>
            {lightbox.tipo === 'foto'
              ? <img src={lightbox.url} alt={lightbox.nome} className="lightbox-img" />
              : <video src={lightbox.url} controls autoPlay className="lightbox-video" />
            }
            <p className="lightbox-caption">{lightbox.nome}</p>
          </div>
        </div>
      )}
    </div>
  );
});
