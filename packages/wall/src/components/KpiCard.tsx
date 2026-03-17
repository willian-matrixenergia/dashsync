import { memo } from 'react';
import type { NivelCriticidade } from '@dashsync/shared';

interface KpiCardProps {
  label:      string;
  value:      string | number;
  subtitle?:  string;
  trend?:     number;        // delta %
  criticidade?: NivelCriticidade;
  unit?:      string;
}

export const KpiCard = memo(function KpiCard({
  label, value, subtitle, trend, criticidade, unit,
}: KpiCardProps) {
  const trendClass = trend === undefined ? '' : trend > 0 ? 'kpi-up' : trend < 0 ? 'kpi-down' : '';
  const critClass  = criticidade === 'alto' ? 'kpi-critical' : '';

  return (
    <div className={`kpi-card ${critClass}`} role="status" aria-label={label}>
      <span className="kpi-label">{label}</span>
      <span className="kpi-value">
        {value}{unit && <span className="kpi-unit"> {unit}</span>}
      </span>
      {subtitle  && <span className="kpi-subtitle">{subtitle}</span>}
      {trend !== undefined && (
        <span className={`kpi-trend ${trendClass}`} aria-label={`Tendência: ${trend > 0 ? '+' : ''}${trend.toFixed(1)}%`}>
          {trend > 0 ? '▲' : trend < 0 ? '▼' : '─'} {Math.abs(trend).toFixed(1)}%
        </span>
      )}
      {criticidade === 'alto' && (
        <span className="kpi-alert" aria-label="Criticidade alta">⚠ CRÍTICO</span>
      )}
    </div>
  );
});
