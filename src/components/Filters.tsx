import { PortfolioMaster } from '../types';

interface FiltersProps {
  projects: PortfolioMaster[];
  filters: {
    programa: string;
    fase: string;
    criticidade: string;
  };
  onChange: (filters: any) => void;
}

export default function Filters({ projects, filters, onChange }: FiltersProps) {
  // Extract unique values
  const programas = [...new Set(projects.map((p) => p.programa).filter((val): val is string => Boolean(val)))].sort();
  const fases = [...new Set(projects.map((p) => p.fase).filter((val): val is string => Boolean(val)))].sort();
  const criticidades = ['Alta', 'Média', 'Baixa'];

  const handleChange = (key: string, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-gray-900 rounded-lg shadow-lg p-6 space-y-6">
      <h2 className="text-xl font-bold text-white">Filtros</h2>

      {/* Programa */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Programa
        </label>
        <select
          value={filters.programa}
          onChange={(e) => handleChange('programa', e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos</option>
          {programas.map((prog) => (
            <option key={prog} value={prog}>
              {prog}
            </option>
          ))}
        </select>
      </div>

      {/* Fase */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Fase
        </label>
        <select
          value={filters.fase}
          onChange={(e) => handleChange('fase', e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todas</option>
          {fases.map((fase) => (
            <option key={fase} value={fase}>
              {fase}
            </option>
          ))}
        </select>
      </div>

      {/* Criticidade */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Criticidade
        </label>
        <select
          value={filters.criticidade}
          onChange={(e) => handleChange('criticidade', e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todas</option>
          {criticidades.map((crit) => (
            <option key={crit} value={crit}>
              {crit}
            </option>
          ))}
        </select>
      </div>

      {/* Reset */}
      <button
        onClick={() => onChange({ programa: '', fase: '', criticidade: '' })}
        className="w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition"
      >
        Limpar Filtros
      </button>
    </div>
  );
}
