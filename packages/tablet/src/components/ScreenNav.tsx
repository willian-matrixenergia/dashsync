import { memo } from 'react';
import type { EcraAtivo } from '@dashsync/shared';
import { ECRAS } from '@dashsync/shared';

const LABELS: Record<EcraAtivo, string> = {
  portfolio: '📊 Portfólio',
  progress:  '📈 Progressos',
  media:     '📷 Evidências',
  live:      '📡 Ao Vivo',
};

interface ScreenNavProps {
  ecraAtivo:  EcraAtivo;
  onNavigate: (e: EcraAtivo) => void;
}

export const ScreenNav = memo(function ScreenNav({ ecraAtivo, onNavigate }: ScreenNavProps) {
  return (
    <nav className="screen-nav" aria-label="Navegação de ecrãs">
      {ECRAS.map(ecra => (
        <button key={ecra}
          className={`nav-btn ${ecraAtivo === ecra ? 'nav-btn-active' : ''}`}
          onClick={() => onNavigate(ecra)}
          aria-pressed={ecraAtivo === ecra}
          aria-label={`Navegar para ${LABELS[ecra]}`}>
          {LABELS[ecra]}
        </button>
      ))}
    </nav>
  );
});
