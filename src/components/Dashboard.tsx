import { useState, useEffect } from 'react';
import { PortfolioMaster, TechnicalSpecs } from '../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DashboardProps {
  project: PortfolioMaster;
  onClose: () => void;
}

export default function Dashboard({ project, onClose }: DashboardProps) {
  const [specs, setSpecs] = useState<TechnicalSpecs | null>(null);

  useEffect(() => {
    const fetchSpecs = async () => {
      try {
        const response = await fetch(`/api/specs/${project.projeto}`);
        const data = await response.json();
        if (data.success) {
          setSpecs(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch specs:', err);
      }
    };

    if (project) fetchSpecs();
  }, [project]);

  const formatDate = (date: string | null) => {
    if (!date) return '—';
    return format(new Date(date), 'dd/MM/yyyy', { locale: ptBR });
  };

  return (
    <div className="bg-matrix-graphite rounded-2xl border border-white/10 shadow-2xl p-8 space-y-8 animate-in fade-in zoom-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-start border-b border-white/5 pb-6">
        <div>
          <h2 className="text-4xl font-black text-white mb-2 tracking-tight">{project.projeto}</h2>
          <p className="text-matrix-orange font-bold uppercase tracking-widest text-xs">{project.programa}</p>
        </div>
        <button
          onClick={onClose}
          className="text-white/40 hover:text-matrix-orange text-2xl p-2 transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Key Info Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {[
          { label: 'Potência', value: `${project.potencia_mw} MW`, icon: '⚡' },
          { label: 'Fase', value: project.fase || '—', icon: '📍' },
          { label: 'Localidade', value: project.localidade || '—', icon: '🗺️' },
          { label: 'Avanço Físico', value: `${project.avanco_fisico_real?.toFixed(1) || '—'}%`, color: 'text-matrix-orange' },
          { label: 'Avanço Financeiro', value: `${project.avanco_financeiro_real?.toFixed(1) || '—'}%`, color: 'text-white' },
          { label: 'Criticidade', value: project.criticidade_risco || '—', color: project.criticidade_risco === 'Alta' ? 'text-matrix-orange' : 'text-white' },
        ].map((item, i) => (
          <div key={i} className="bg-white/5 border border-white/5 rounded-xl p-5 hover:bg-white/[0.08] transition-all group">
            <p className="text-[10px] font-bold text-matrix-offwhite/40 uppercase tracking-widest mb-1">{item.label}</p>
            <p className={`text-2xl font-black ${item.color || 'text-white'} flex items-center gap-2 italic`}>
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Grid for Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Prazos */}
        <div className="bg-white/5 border border-white/5 rounded-xl p-6">
          <h3 className="text-sm font-bold text-matrix-orange uppercase tracking-widest mb-6 border-b border-white/5 pb-2">Prazos & Cronograma</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-xs text-matrix-offwhite/60 uppercase font-bold">Início</p>
              <p className="text-white font-mono">{formatDate(project.inicio)}</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-xs text-matrix-offwhite/60 uppercase font-bold">Término Previsto</p>
              <p className="text-white font-mono">{formatDate(project.termino)}</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-xs text-matrix-orange uppercase font-bold">COD Tendência</p>
              <p className="text-matrix-orange font-mono font-bold">{formatDate(project.cod_tendencia)}</p>
            </div>
          </div>
        </div>

        {/* Equipe */}
        <div className="bg-white/5 border border-white/5 rounded-xl p-6">
          <h3 className="text-sm font-bold text-matrix-orange uppercase tracking-widest mb-6 border-b border-white/5 pb-2">Equipe de Gestão</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-[10px] text-matrix-offwhite/40 uppercase font-bold mb-1">Coordenador</p>
              <p className="text-white text-sm font-semibold">{project.coordenador || '—'}</p>
            </div>
            <div>
              <p className="text-[10px] text-matrix-offwhite/40 uppercase font-bold mb-1">Supervisor</p>
              <p className="text-white text-sm font-semibold">{project.supervisor || '—'}</p>
            </div>
            <div>
              <p className="text-[10px] text-matrix-offwhite/40 uppercase font-bold mb-1">Empreiteiros</p>
              <p className="text-white text-2xl font-black italic">{project.num_empreiteiros || 0}</p>
            </div>
            <div>
              <p className="text-[10px] text-matrix-offwhite/40 uppercase font-bold mb-1">Profissionais</p>
              <p className="text-white text-2xl font-black italic">{project.num_profissionais || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Risks */}
      {project.tem_risco_relevante && (
        <div className="bg-matrix-orange/10 border-l-4 border-matrix-orange rounded-r-xl p-6 animate-pulse">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">⚠️</span>
            <h3 className="text-lg font-black text-matrix-orange uppercase tracking-widest italic">Alertas Críticos</h3>
          </div>
          <p className="text-matrix-offwhite/80 text-sm leading-relaxed">{project.descricao_riscos || 'Sem descrição'}</p>
          {project.resumo_atraso && (
            <p className="text-white/60 text-xs mt-3 font-medium border-t border-white/5 pt-3 uppercase tracking-tighter">
              {project.resumo_atraso}
            </p>
          )}
        </div>
      )}

      {/* Footer / Client */}
      <div className="flex justify-between items-center bg-white/5 rounded-xl p-6 border border-white/5">
        <div>
          <p className="text-[10px] text-matrix-offwhite/40 uppercase font-bold mb-1">Cliente / Parceiro</p>
          <p className="text-white font-black text-xl italic">{project.nome_cliente || '—'}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-matrix-offwhite/40 uppercase font-bold mb-1">SLA de Atendimento</p>
          <p className="text-matrix-orange font-black text-2xl italic">
            {project.pct_chamados_atendidos?.toFixed(1) || '—'}%
          </p>
        </div>
      </div>
    </div>
  );
}
