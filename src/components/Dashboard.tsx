import { PortfolioMaster } from '../types';
import { useState, useMemo } from 'react';

interface DashboardProps {
  projects: PortfolioMaster[];
  selectedProject: PortfolioMaster | null;
  onSelectProject: (project: PortfolioMaster | null) => void;
}

export default function Dashboard({ projects, selectedProject, onSelectProject }: DashboardProps) {
  const [filters, setFilters] = useState({
    criticality: [] as string[],
    program: [] as string[],
  });

  // KPI Calculations
  const totalProjects = projects.length;
  const totalMW = projects.reduce((acc, p) => acc + (p.potencia_mw || 0), 0);
  const avgPhysical = projects.length > 0 
    ? projects.reduce((acc, p) => acc + (p.avanco_fisico_real || 0), 0) / projects.length 
    : 0;
  const avgFinancial = projects.length > 0 
    ? projects.reduce((acc, p) => acc + (p.avanco_financeiro_real || 0), 0) / projects.length 
    : 0;

  // Filter Logic
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchCrit = filters.criticality.length === 0 || filters.criticality.includes(p.criticidade_risco || '');
      const matchProg = filters.program.length === 0 || filters.program.includes(p.programa || '');
      return matchCrit && matchProg;
    });
  }, [projects, filters]);

  const toggleCriticality = (val: string) => {
    setFilters(f => ({
      ...f,
      criticality: f.criticality.includes(val) 
        ? f.criticality.filter(c => c !== val) 
        : [...f.criticality, val]
    }));
  };

  const toggleProgram = (val: string) => {
    setFilters(f => ({
      ...f,
      program: f.program.includes(val) 
        ? f.program.filter(p => p !== val) 
        : [...f.program, val]
    }));
  };

  return (
    <>
      {/* Left Sidebar (20% Width) */}
      <aside className="w-1/5 bg-surface border-r border-border-color flex flex-col h-full overflow-y-auto">
        <div className="p-6">
          <h3 className="text-lg font-bold text-text-main mb-6">Filters</h3>
          
          {/* Criticality Filter */}
          <div className="mb-8">
            <h4 className="text-sm font-semibold text-muted mb-3 uppercase tracking-wider">Criticality</h4>
            <label className="flex items-center gap-3 p-2 rounded hover:bg-bgLight cursor-pointer group mb-1">
              <input 
                id="filter-crit-all"
                aria-label="Show all projects"
                className="form-checkbox text-primary rounded border-muted focus:ring-primary focus:ring-offset-0 size-4" 
                type="checkbox"
                checked={filters.criticality.length === 0}
                onChange={() => setFilters(f => ({ ...f, criticality: [] }))}
              />
              <span className="text-sm font-medium text-text-main">All Projects</span>
            </label>
            <label className="flex items-center gap-3 p-2 rounded hover:bg-bgLight cursor-pointer group mb-1">
              <input 
                id="filter-crit-high"
                aria-label="Filter by High Risk"
                className="form-checkbox text-primary rounded border-muted focus:ring-primary focus:ring-offset-0 size-4" 
                type="checkbox"
                checked={filters.criticality.includes('Alta')}
                onChange={() => toggleCriticality('Alta')}
              />
              <span className="text-sm font-medium text-text-main flex items-center gap-2">
                High Risk 
                <span className="size-2 rounded-full bg-accent-red"></span>
              </span>
            </label>
            <label className="flex items-center gap-3 p-2 rounded hover:bg-bgLight cursor-pointer group">
              <input 
                id="filter-crit-low"
                aria-label="Filter by On Track projects"
                className="form-checkbox text-primary rounded border-muted focus:ring-primary focus:ring-offset-0 size-4" 
                type="checkbox"
                checked={filters.criticality.includes('Baixa')}
                onChange={() => toggleCriticality('Baixa')}
              />
              <span className="text-sm font-medium text-text-main">On Track</span>
            </label>
          </div>

          {/* Program Filter */}
          <div className="mb-8">
            <h4 className="text-sm font-semibold text-muted mb-3 uppercase tracking-wider">Program Type</h4>
            {Array.from(new Set(projects.map(p => p.programa))).filter(Boolean).map(prog => (
              <label key={prog} className="flex items-center gap-3 p-2 rounded hover:bg-bgLight cursor-pointer mb-1">
                <input 
                  id={`filter-prog-${prog?.replace(/\s+/g, '-').toLowerCase()}`}
                  aria-label={`Filter by program ${prog}`}
                  className="form-checkbox text-primary rounded border-muted focus:ring-primary focus:ring-offset-0 size-4" 
                  type="checkbox"
                  checked={filters.program.includes(prog!)}
                  onChange={() => toggleProgram(prog!)}
                />
                <span className="text-sm font-medium text-text-main truncate">{prog}</span>
              </label>
            ))}
          </div>
        </div>
      </aside>

      {/* Right Content Area (80% Width) */}
      <main className="w-4/5 flex flex-col h-full overflow-hidden bg-bgLight p-6 gap-6">
        {/* Top KPI Bar */}
        <div className="grid grid-cols-4 gap-6 shrink-0">
          <div className="bg-surface border border-border-color rounded-md p-5 flex flex-col justify-between h-[120px]">
            <span className="text-sm font-medium text-muted uppercase tracking-wide">Total Projects</span>
            <div className="flex items-baseline gap-2">
              <span className="text-[48px] font-extrabold text-text-main leading-none">{totalProjects}</span>
              <span className="text-sm font-medium text-muted">Active</span>
            </div>
          </div>
          <div className="bg-surface border border-border-color rounded-md p-5 flex flex-col justify-between h-[120px]">
            <span className="text-sm font-medium text-muted uppercase tracking-wide">Total Power (MW)</span>
            <div className="flex items-baseline gap-2">
              <span className="text-[48px] font-extrabold text-text-main leading-none">{totalMW.toLocaleString()}</span>
              <span className="text-sm font-medium text-primary">↑ 12%</span>
            </div>
          </div>
          <div className="bg-surface border border-border-color rounded-md p-5 flex flex-col justify-between h-[120px]">
            <span className="text-sm font-medium text-muted uppercase tracking-wide">Physical Progress</span>
            <div className="flex items-baseline gap-2">
              <span className="text-[48px] font-extrabold text-text-main leading-none">{avgPhysical.toFixed(0)}</span>
              <span className="text-xl font-bold text-text-main leading-none">%</span>
            </div>
          </div>
          <div className="bg-surface border border-border-color rounded-md p-5 flex flex-col justify-between h-[120px]">
            <span className="text-sm font-medium text-muted uppercase tracking-wide">Financial Progress</span>
            <div className="flex items-baseline gap-2">
              <span className="text-[48px] font-extrabold text-text-main leading-none">{avgFinancial.toFixed(0)}</span>
              <span className="text-xl font-bold text-text-main leading-none">%</span>
            </div>
          </div>
        </div>

        {/* Details Table */}
        <div className="bg-surface border border-border-color rounded-md flex-1 overflow-hidden flex flex-col min-h-[300px]">
          <div className="px-5 py-4 border-b border-border-color flex justify-between items-center bg-surface">
            <h2 className="text-xl font-bold text-text-main">Project Details</h2>
            <button 
              id="btn-export-data"
              aria-label="Export project data to CSV"
              className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              Export Data
            </button>
          </div>
          <div className="overflow-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead className="bg-bgLight sticky top-0 z-10 border-b border-border-color">
                <tr>
                  <th className="py-3 px-5 text-xs font-semibold text-muted uppercase tracking-wider w-1/4">Project Name</th>
                  <th className="py-3 px-5 text-xs font-semibold text-muted uppercase tracking-wider w-1/6">Location</th>
                  <th className="py-3 px-5 text-xs font-semibold text-muted uppercase tracking-wider w-1/6">Status</th>
                  <th className="py-3 px-5 text-xs font-semibold text-muted uppercase tracking-wider w-1/6 text-right">Budget Consumed</th>
                  <th className="py-3 px-5 text-xs font-semibold text-muted uppercase tracking-wider w-1/4">Timeline Variance</th>
                </tr>
              </thead>
              <tbody className="text-sm text-text-main divide-y divide-border-color">
                {filteredProjects.map((p) => (
                  <tr 
                    key={p.projeto} 
                    id={`row-project-${p.projeto?.replace(/\s+/g, '-').toLowerCase()}`}
                    aria-label={`Select project ${p.projeto}`}
                    onClick={() => onSelectProject(p)}
                    className={`hover:bg-bgLight cursor-pointer border-l-4 transition-colors ${selectedProject?.projeto === p.projeto ? 'bg-bgLight border-l-primary' : (p.criticidade_risco === 'Alta' ? 'border-l-accent-red' : 'border-l-transparent')}`}
                  >
                    <td className="py-4 px-5 font-semibold text-text-main">{p.projeto}</td>
                    <td className="py-4 px-5 text-muted">{p.localidade || '—'}</td>
                    <td className="py-4 px-5">
                      <span className={`inline-flex items-center justify-center px-2.5 py-1 text-xs font-bold rounded min-w-[80px] ${p.criticidade_risco === 'Alta' ? 'bg-[#FEE2E2] text-accent-red' : 'bg-[#ECFCCB] text-[#4D7C0F]'}`}>
                        {p.criticidade_risco === 'Alta' ? 'High Risk' : 'On Track'}
                      </span>
                    </td>
                    <td className="py-4 px-5 font-mono text-right">{p.avanco_financeiro_real?.toFixed(1) || 0}%</td>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2">
                        {p.criticidade_risco === 'Alta' ? (
                          <><span className="material-symbols-outlined text-accent-red text-[16px]">warning</span><span className="text-accent-red font-medium">Critical Delay</span></>
                        ) : (
                          <span className="text-muted font-medium">On Schedule</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Project Chart (Gantt Mock) */}
        <div className="bg-surface border border-border-color rounded-md h-[250px] shrink-0 flex flex-col p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-text-main">{selectedProject?.projeto || 'No Project Selected'} Timeline</h3>
            <div className="flex gap-4 text-xs font-medium">
              <div className="flex items-center gap-2">
                <div className="w-4 h-2 bg-muted rounded-sm"></div>
                <span className="text-muted">Planned</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-2 bg-primary rounded-sm"></div>
                <span className="text-text-main">Actual</span>
              </div>
            </div>
          </div>
          <div className="flex-1 relative border-t border-border-color mt-2 pt-4">
            <div className="absolute inset-0 flex justify-between z-0 px-[10%]">
              <div className="w-px h-full bg-border-color"></div>
              <div className="w-px h-full bg-border-color"></div>
              <div className="w-px h-full bg-border-color"></div>
              <div className="w-px h-full bg-border-color"></div>
            </div>
            <div className="relative z-10 flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <span className="w-[15%] text-sm font-medium text-text-main truncate">Overall</span>
                <div className="flex-1 relative h-6">
                  <div className="absolute top-0 left-0 h-2 bg-muted rounded-sm" style={{ width: '100%' }}></div>
                  <div className="absolute bottom-0 left-0 h-2 bg-primary rounded-sm transition-all duration-500" style={{ width: `${selectedProject?.avanco_fisico_real || 0}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
