import { useMemo } from 'react';
import { InternalActivity } from '../../types';

interface SpeedometerProps {
  activities: InternalActivity[];
  discipline: string;
  color: string;
}

export default function Speedometer({ activities, discipline, color }: SpeedometerProps) {
  const stats = useMemo(() => {
    const filtered = activities.filter((a) => a.atividade?.includes(discipline));

    if (filtered.length === 0) {
      return { previsto: 0, real: 0 };
    }

    const previsto =
      filtered.reduce((sum, a) => sum + (a.pct_fisico_previsto || 0), 0) / filtered.length;
    const real = filtered.reduce((sum, a) => sum + (a.pct_fisico_real || 0), 0) / filtered.length;

    return { previsto, real };
  }, [activities, discipline]);

  // SVG Gauge
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const prevOffset = circumference - (stats.previsto / 100) * circumference;
  const realOffset = circumference - (stats.real / 100) * circumference;

  return (
    <div className="bg-white/5 border border-white/5 rounded-2xl p-6 hover:bg-white/[0.08] transition-all group relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-matrix-orange/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <h3 className="text-xs font-bold mb-6 text-matrix-offwhite/40 uppercase tracking-widest text-center group-hover:text-matrix-orange transition-colors">
        {discipline}
      </h3>

      {/* SVG Gauge */}
      <svg viewBox="0 0 120 120" className="w-full h-32 mx-auto mb-4">
        {/* Background circle */}
        <circle cx="60" cy="60" r={radius} fill="none" stroke="#374151" strokeWidth="4" />

        {/* Previsto arc */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={prevOffset}
          strokeLinecap="round"
          style={{ transform: 'rotate(-90deg)', transformOrigin: '60px 60px' }}
        />

        {/* Real arc (on top) */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset={realOffset}
          strokeLinecap="round"
          style={{ transform: 'rotate(-90deg)', transformOrigin: '60px 60px' }}
        />

        {/* Center text */}
        <text x="60" y="60" textAnchor="middle" dy="0.3em" className="fill-white text-2xl font-bold">
          {stats.real.toFixed(0)}%
        </text>
      </svg>

      {/* Stats */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-300">Previsto:</span>
          <span className="font-semibold">{stats.previsto.toFixed(1)}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-300">Real:</span>
          <span className="font-semibold">{stats.real.toFixed(1)}%</span>
        </div>
        <div className="flex justify-between pt-2 border-t border-white border-opacity-20">
          <span className="text-gray-300">Delta:</span>
          <span className={`font-semibold ${stats.real >= stats.previsto ? 'text-green-400' : 'text-red-400'}`}>
            {(stats.real - stats.previsto).toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
}
