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
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="bg-matrix-graphite border border-white/10 rounded-2xl shadow-2xl p-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-matrix-orange/10 blur-[100px] rounded-full -mr-32 -mt-32 group-hover:bg-matrix-orange/20 transition-all duration-1000" />
        <h1 className="text-4xl font-black text-white mb-2 italic tracking-tighter">Tela 02: Fases e Progressos</h1>
        <p className="text-matrix-offwhite/60 font-medium uppercase tracking-widest text-xs flex items-center gap-2">
          <span className="w-2 h-2 bg-matrix-orange rounded-full animate-pulse" />
          Evolução semanal • Curva S • Histograma MOD
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Curva S */}
        <div className="bg-matrix-graphite border border-white/10 rounded-2xl shadow-2xl p-8 hover:border-white/20 transition-all">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-black text-white uppercase tracking-tighter italic">Curva S - Avanço Comparativo</h2>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-matrix-orange rounded-full" />
                <span className="text-[10px] font-bold text-white/40 uppercase">Realizado</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-white/40 rounded-full" />
                <span className="text-[10px] font-bold text-white/40 uppercase">Planejado</span>
              </div>
            </div>
          </div>
          <div className="h-80">
            <CurvaS data={evolution} />
          </div>
        </div>

        {/* MOD Histogram */}
        <div className="bg-matrix-graphite border border-white/10 rounded-2xl shadow-2xl p-8 hover:border-white/20 transition-all">
          <h2 className="text-xl font-black text-white uppercase tracking-tighter italic mb-8">Histograma de Mão de Obra</h2>
          <div className="h-80">
            <MODHistogram data={evolution} />
          </div>
        </div>
      </div>

      {/* Speedometers */}
      <div className="bg-matrix-graphite border border-white/10 rounded-2xl shadow-2xl p-8 hover:border-white/20 transition-all">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-6 bg-matrix-orange rounded-full" />
          <h2 className="text-xl font-black text-white uppercase tracking-tighter italic">Velocímetros por Disciplina</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Speedometer activities={activities} discipline="Engenharia" color="#FF4A00" />
          <Speedometer activities={activities} discipline="Suprimentos" color="#FFFFFF" />
          <Speedometer activities={activities} discipline="Construção" color="#FF4A00" />
          <Speedometer activities={activities} discipline="Comissionamento" color="#FFFFFF" />
        </div>
      </div>

      {/* Summary Stats */}
      <div className="bg-matrix-graphite border border-white/10 rounded-2xl shadow-2xl p-8 hover:border-white/20 transition-all">
        <h2 className="text-xl font-black text-white uppercase tracking-tighter italic mb-8">Estatísticas de Evolução</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {evolution.length > 0 && (
            <>
              <div className="bg-white/5 border border-white/5 rounded-xl p-6 hover:bg-white/[0.08] transition-all">
                <p className="text-[10px] font-bold text-matrix-offwhite/40 uppercase tracking-widest mb-2">Semanas Rastreadas</p>
                <p className="text-4xl font-black text-white italic">{evolution.length}</p>
              </div>
              <div className="bg-white/5 border border-white/5 rounded-xl p-6 hover:bg-white/[0.08] transition-all">
                <p className="text-[10px] font-bold text-matrix-offwhite/40 uppercase tracking-widest mb-2">% Planejado Final</p>
                <p className="text-4xl font-black text-white italic">
                  {evolution[evolution.length - 1]?.pct_planejado_lb?.toFixed(1) || '—'}%
                </p>
              </div>
              <div className="bg-matrix-orange/5 border border-matrix-orange/10 rounded-xl p-6 hover:bg-matrix-orange/10 transition-all">
                <p className="text-[10px] font-bold text-matrix-orange/60 uppercase tracking-widest mb-2">% Realizado Final</p>
                <p className="text-4xl font-black text-matrix-orange italic">
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
