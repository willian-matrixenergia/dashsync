import { memo } from 'react';
import type { EcrãAtivo } from '@dashsync/shared';
import { ECRAS } from '@dashsync/shared';

const LABELS: Record<EcrãAtivo, string> = {
  portfolio: '📊 Portfólio',
  progress:  '📈 Progressos',
  media:     '📷 Evidências',
  live:      '📡 Ao Vivo',
};

interface ScreenNavProps {
  ecrãAtivo:    EcrãAtivo;
  onNavigate:   (e: EcrãAtivo) => void;
}

export const ScreenNav = memo(function ScreenNav({ ecrãAtivo, onNavigate }: ScreenNavProps) {
  return (
    <nav className="screen-nav" aria-label="Navegação de ecrãs">
      {ECRAS.map(ecrã => (
        <button key={ecrã}
          className={`nav-btn ${ecrãAtivo === ecrã ? 'nav-btn-active' : ''}`}
          onClick={() => onNavigate(ecrã)}
          aria-pressed={ecrãAtivo === ecrã}
          aria-label={`Navegar para ${LABELS[ecrã]}`}>
          {LABELS[ecrã]}
        </button>
      ))}
    </nav>
  );
});
