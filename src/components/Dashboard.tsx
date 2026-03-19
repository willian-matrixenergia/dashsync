import { useState, useEffect } from 'react';
import { PortfolioMaster, TechnicalSpecs } from '../types.js';
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
    <div className="bg-gray-900 rounded-lg shadow-lg p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">{project.projeto}</h2>
          <p className="text-gray-400">{project.programa}</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white text-2xl font-bold"
        >
          ✕
        </button>
      </div>

      {/* Key Info Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-xs font-semibold text-gray-400 uppercase">Potência</p>
          <p className="text-2xl font-bold text-white mt-1">{project.potencia_mw} MW</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-xs font-semibold text-gray-400 uppercase">Fase</p>
          <p className="text-2xl font-bold text-white mt-1">{project.fase || '—'}</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-xs font-semibold text-gray-400 uppercase">Localidade</p>
          <p className="text-2xl font-bold text-white mt-1">{project.localidade || '—'}</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-xs font-semibold text-gray-400 uppercase">Avanço Físico</p>
          <p className="text-2xl font-bold text-green-400 mt-1">
            {project.avanco_fisico_real?.toFixed(1) || '—'}%
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-xs font-semibold text-gray-400 uppercase">Avanço Financeiro</p>
          <p className="text-2xl font-bold text-blue-400 mt-1">
            {project.avanco_financeiro_real?.toFixed(1) || '—'}%
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-xs font-semibold text-gray-400 uppercase">Criticidade</p>
          <p className="text-2xl font-bold text-orange-400 mt-1">
            {project.criticidade_risco || '—'}
          </p>
        </div>
      </div>

      {/* Dates */}
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-4">Prazos</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-gray-400 uppercase">Início</p>
            <p className="text-white font-medium">{formatDate(project.inicio)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase">Término Previsto</p>
            <p className="text-white font-medium">{formatDate(project.termino)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase">COD Tendência</p>
            <p className="text-white font-medium">{formatDate(project.cod_tendencia)}</p>
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-4">Equipe</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-gray-400 uppercase">Coordenador</p>
            <p className="text-white">{project.coordenador || '—'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase">Supervisor</p>
            <p className="text-white">{project.supervisor || '—'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase">Empreiteiros</p>
            <p className="text-white text-xl font-bold">{project.num_empreiteiros || 0}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase">Profissionais</p>
            <p className="text-white text-xl font-bold">{project.num_profissionais || 0}</p>
          </div>
        </div>
      </div>

      {/* MOD */}
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-4">Mão de Obra (MOD)</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-400 uppercase">Prevista</p>
            <p className="text-2xl font-bold text-white">{project.mod_prevista || 0}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase">Real</p>
            <p className="text-2xl font-bold text-white">{project.mod_real || 0}</p>
          </div>
        </div>
      </div>

      {/* Risks */}
      {project.tem_risco_relevante && (
        <div className="bg-red-900 bg-opacity-30 border-l-4 border-red-500 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-red-400 mb-2">Alertas de Risco</h3>
          <p className="text-gray-300 text-sm">{project.descricao_riscos || 'Sem descrição'}</p>
          <p className="text-gray-400 text-sm mt-2">{project.resumo_atraso || ''}</p>
        </div>
      )}

      {/* Technical Specs */}
      {specs && (
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-4">Especificações Técnicas</h3>
          <div className="space-y-4">
            {specs.caracteristicas_macro && (
              <div>
                <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Macro</p>
                <p className="text-gray-300 text-sm">{specs.caracteristicas_macro}</p>
              </div>
            )}
            {specs.caracteristicas_detalhadas && (
              <div>
                <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Detalhadas</p>
                <p className="text-gray-300 text-sm">{specs.caracteristicas_detalhadas}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Customer */}
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-4">Cliente</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-400 uppercase">Nome</p>
            <p className="text-white">{project.nome_cliente || '—'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase">% Chamados Atendidos</p>
            <p className="text-white font-bold">
              {project.pct_chamados_atendidos?.toFixed(1) || '—'}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
