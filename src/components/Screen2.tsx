import { useState, useEffect } from 'react';
import { EvolutionLabor, InternalActivity } from '../types';
import CurvaS from './charts/CurvaS';
import MODHistogram from './charts/MODHistogram';
import Speedometer from './charts/Speedometer';

interface Screen2Props {
  projeto: string;
}

export default function Screen2({ projeto }: Screen2Props) {
  const [evolution, setEvolution] = useState<EvolutionLabor[]>([]);
  const [activities, setActivities] = useState<InternalActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch evolution data (Curva S + MOD)
        const evoRes = await fetch(`/api/evolution?projeto=${projeto}`);
        const evoData = await evoRes.json();
        if (evoData.success) setEvolution(evoData.data);

        // Fetch activities (Velocímetros)
        const actRes = await fetch(`/api/activities?projeto=${projeto}`);
        const actData = await actRes.json();
        if (actData.success) setActivities(actData.data);
      } catch (err) {
        console.error('Failed to fetch screen 2 data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (projeto) fetchData();
  }, [projeto]);

  if (loading) {
    return (
      <div className="bg-gray-900 rounded-lg shadow-lg p-6">
        <p className="text-gray-400">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-900 rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-white mb-2">Tela 02: Fases e Progressos</h1>
        <p className="text-gray-400">Evolução semanal, Curva S, MOD e Velocímetros por Disciplina</p>
      </div>

      {/* Curva S */}
      <div className="bg-gray-900 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Curva S - Avanço Comparativo</h2>
        <div className="h-80">
          <CurvaS data={evolution} />
        </div>
      </div>

      {/* MOD Histogram */}
      <div className="bg-gray-900 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Histograma de MOD</h2>
        <div className="h-80">
          <MODHistogram data={evolution} />
        </div>
      </div>

      {/* Speedometers */}
      <div className="bg-gray-900 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Velocímetros por Disciplina</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Speedometer activities={activities} discipline="Engenharia" color="blue" />
          <Speedometer activities={activities} discipline="Suprimentos" color="purple" />
          <Speedometer activities={activities} discipline="Construção" color="orange" />
          <Speedometer activities={activities} discipline="Comissionamento" color="green" />
        </div>
      </div>

      {/* Summary Stats */}
      <div className="bg-gray-900 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Resumo</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {evolution.length > 0 && (
            <>
              <div className="bg-gray-800 rounded-lg p-4">
                <p className="text-sm text-gray-400 uppercase">Semanas Rastreadas</p>
                <p className="text-3xl font-bold text-white mt-2">{evolution.length}</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4">
                <p className="text-sm text-gray-400 uppercase">% Planejado Final</p>
                <p className="text-3xl font-bold text-blue-400 mt-2">
                  {evolution[evolution.length - 1]?.pct_planejado_lb?.toFixed(1) || '—'}%
                </p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4">
                <p className="text-sm text-gray-400 uppercase">% Realizado Final</p>
                <p className="text-3xl font-bold text-green-400 mt-2">
                  {evolution[evolution.length - 1]?.pct_realizado?.toFixed(1) || '—'}%
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
