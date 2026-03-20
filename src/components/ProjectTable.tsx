import { PortfolioMaster } from '../types';

interface ProjectTableProps {
  projects: PortfolioMaster[];
  selectedProject: PortfolioMaster | null;
  onSelectProject: (project: PortfolioMaster) => void;
}

export default function ProjectTable({
  projects,
  selectedProject,
  onSelectProject,
}: ProjectTableProps) {
  const getCriticalityColor = (level: string | null) => {
    switch (level) {
      case 'Crítica':
      case 'Alta':
        return 'bg-matrix-orange/20 text-matrix-orange border border-matrix-orange/30';
      case 'Média':
        return 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20';
      case 'Baixa':
        return 'bg-green-500/10 text-green-500 border border-green-500/20';
      default:
        return 'bg-white/5 text-white/60 border border-white/10';
    }
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-white/10 bg-matrix-graphite shadow-2xl">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-white/5">
            <th className="text-left py-4 px-6 font-bold text-matrix-offwhite/60 uppercase tracking-widest text-xs">Projeto</th>
            <th className="text-left py-4 px-6 font-bold text-matrix-offwhite/60 uppercase tracking-widest text-xs">Programa</th>
            <th className="text-right py-4 px-6 font-bold text-matrix-offwhite/60 uppercase tracking-widest text-xs">Potência (MW)</th>
            <th className="text-center py-4 px-6 font-bold text-matrix-offwhite/60 uppercase tracking-widest text-xs">Físico %</th>
            <th className="text-center py-4 px-6 font-bold text-matrix-offwhite/60 uppercase tracking-widest text-xs">Financeiro %</th>
            <th className="text-center py-4 px-6 font-bold text-matrix-offwhite/60 uppercase tracking-widest text-xs">Criticidade</th>
            <th className="text-left py-4 px-6 font-bold text-matrix-offwhite/60 uppercase tracking-widest text-xs">Ação</th>
          </tr>
        </thead>
        <tbody>
          {projects.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center py-12 text-matrix-offwhite/40 italic">
                Nenhum projeto encontrado
              </td>
            </tr>
          ) : (
            projects.map((project) => (
              <tr
                key={project.id}
                onClick={() => onSelectProject(project)}
                className={`border-b border-white/5 hover:bg-white/[0.02] transition-colors cursor-pointer group ${
                  selectedProject?.id === project.id ? 'bg-matrix-orange/5' : ''
                }`}
              >
                <td className="py-4 px-6 font-semibold text-white group-hover:text-matrix-orange transition-colors">{project.projeto}</td>
                <td className="py-4 px-6 text-matrix-offwhite/60 font-medium">{project.programa}</td>
                <td className="py-4 px-6 text-right text-white font-mono">{project.potencia_mw}</td>
                <td className="py-4 px-6 text-center">
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-matrix-orange transition-all duration-500"
                        style={{ width: `${project.avanco_fisico_real || 0}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-matrix-offwhite/80 w-8">
                      {project.avanco_fisico_real?.toFixed(0)}%
                    </span>
                  </div>
                </td>
                <td className="py-4 px-6 text-center">
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white/60 transition-all duration-500"
                        style={{ width: `${project.avanco_financeiro_real || 0}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-matrix-offwhite/80 w-8">
                      {project.avanco_financeiro_real?.toFixed(0)}%
                    </span>
                  </div>
                </td>
                <td className="py-4 px-6 text-center">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getCriticalityColor(
                      project.criticidade_risco,
                    )}`}
                  >
                    {project.criticidade_risco || '—'}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <button
                    aria-label={`Ver detalhes do projeto ${project.projeto}`}
                    className="bg-white/5 hover:bg-matrix-orange hover:text-white text-matrix-offwhite/80 px-4 py-1.5 rounded-lg transition-all text-xs font-bold uppercase tracking-wider"
                  >
                    Detalhes
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
