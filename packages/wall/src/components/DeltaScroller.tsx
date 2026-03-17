import { memo, useRef, useEffect } from 'react';
import type { ProjetoSummaryDTO } from '@dashsync/shared';

interface DeltaScrollerProps {
  projetos: ProjetoSummaryDTO[];
}

export const DeltaScroller = memo(function DeltaScroller({ projetos }: DeltaScrollerProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let pos = 0;
    const speed = 0.5; // px per frame
    const id = requestAnimationFrame(function animate() {
      pos -= speed;
      if (Math.abs(pos) >= track.scrollWidth / 2) pos = 0;
      track.style.transform = `translateX(${pos}px)`;
      requestAnimationFrame(animate);
    });
    return () => cancelAnimationFrame(id);
  }, [projetos]);

  const items = [...projetos, ...projetos]; // duplicate for seamless loop

  return (
    <div className="scroller-viewport" aria-label="Delta de progresso por projeto" aria-live="off">
      <div className="scroller-track" ref={trackRef}>
        {items.map((p, i) => {
          const delta = p.progressoFisico.delta;
          const cls   = delta > 0 ? 'delta-pos' : delta < 0 ? 'delta-neg' : 'delta-neutral';
          return (
            <span key={`${p.id}-${i}`} className={`scroller-item ${cls}`}>
              <span className="scroller-nome">{p.nome}</span>
              <span className="scroller-delta">
                {delta > 0 ? '+' : ''}{delta.toFixed(1)}pp
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
});
