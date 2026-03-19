import { useMemo } from 'react';
import { InternalActivity } from '../../types';

interface SpeedometerProps {
  activities: InternalActivity[];
  discipline: string;
  color: 'blue' | 'purple' | 'orange' | 'green';
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

  const colorMap = {
    blue: { bg: 'from-blue-900 to-blue-700', text: 'text-blue-400' },
    purple: { bg: 'from-purple-900 to-purple-700', text: 'text-purple-400' },
    orange: { bg: 'from-orange-900 to-orange-700', text: 'text-orange-400' },
    green: { bg: 'from-green-900 to-green-700', text: 'text-green-400' },
  };

  const colors = colorMap[color];

  // SVG Gauge
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const prevOffset = circumference - (stats.previsto / 100) * circumference;
  const realOffset = circumference - (stats.real / 100) * circumference;

  return (
    <div className={`bg-gradient-to-br ${colors.bg} rounded-lg shadow-lg p-6 text-white`}>
      <h3 className="text-lg font-semibold mb-4 text-center">{discipline}</h3>

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
          stroke="currentColor"
          strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset={realOffset}
          strokeLinecap="round"
          style={{ transform: 'rotate(-90deg)', transformOrigin: '60px 60px' }}
          className={colors.text}
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
