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
      case 'Alta':
        return 'bg-red-900 text-red-100';
      case 'Média':
        return 'bg-yellow-900 text-yellow-100';
      case 'Baixa':
        return 'bg-green-900 text-green-100';
      default:
        return 'bg-gray-700 text-gray-100';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="text-left py-3 px-4 font-semibold text-gray-300">Projeto</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-300">Programa</th>
            <th className="text-right py-3 px-4 font-semibold text-gray-300">Potência (MW)</th>
            <th className="text-center py-3 px-4 font-semibold text-gray-300">Físico %</th>
            <th className="text-center py-3 px-4 font-semibold text-gray-300">Financeiro %</th>
            <th className="text-center py-3 px-4 font-semibold text-gray-300">Criticidade</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-300">Ação</th>
          </tr>
        </thead>
        <tbody>
          {projects.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center py-8 text-gray-400">
                Nenhum projeto encontrado
              </td>
            </tr>
          ) : (
            projects.map((project) => (
              <tr
                key={project.id}
                className={`border-b border-gray-800 hover:bg-gray-800 transition cursor-pointer ${
                  selectedProject?.id === project.id ? 'bg-gray-800' : ''
                }`}
              >
                <td className="py-3 px-4 font-medium text-white">{project.projeto}</td>
                <td className="py-3 px-4 text-gray-400">{project.programa}</td>
                <td className="py-3 px-4 text-right text-white">{project.potencia_mw}</td>
                <td className="py-3 px-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500"
                        style={{ width: `${project.avanco_fisico_real || 0}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400">
                      {project.avanco_fisico_real?.toFixed(0)}%
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500"
                        style={{ width: `${project.avanco_financeiro_real || 0}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400">
                      {project.avanco_financeiro_real?.toFixed(0)}%
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4 text-center">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getCriticalityColor(
                      project.criticidade_risco,
                    )}`}
                  >
                    {project.criticidade_risco || '—'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => onSelectProject(project)}
                    className="text-blue-400 hover:text-blue-300 transition text-sm font-medium"
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
