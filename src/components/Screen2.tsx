import { PortfolioMaster } from '../types';
import { useState } from 'react';

interface Screen2Props {
  selectedProject: PortfolioMaster | null;
}

export default function Screen2({ selectedProject }: Screen2Props) {
  const [activeSubTab, setActiveSubTab] = useState('weekly');

  if (!selectedProject) {
    return (
      <div className="flex-1 flex items-center justify-center bg-bgLight text-muted italic">
        Select a project from the Portfolio to view detailed progress.
      </div>
    );
  }

  // Mocked data based on project progress for visualization
  const progress = selectedProject.avanco_fisico_real || 0;
  const planned = selectedProject.avanco_fisico_real ? selectedProject.avanco_fisico_real + 5 : 10;

  return (
    <>
      {/* Sidebar (Consistent with Screen 1) */}
      <aside className="w-1/5 bg-surface border-r border-border-color flex flex-col h-full overflow-y-auto">
        <div className="p-6">
          <h3 className="text-lg font-bold text-text-main mb-6">Execution Filters</h3>
          <div className="mb-8">
            <h4 className="text-sm font-semibold text-muted mb-3 uppercase tracking-wider">Project Phase</h4>
            {['Engineering', 'Procurement', 'Construction', 'Testing'].map(phase => (
              <label key={phase} className="flex items-center gap-3 p-2 rounded hover:bg-bgLight cursor-pointer mb-1">
                <input 
                  id={`filter-phase-${phase.toLowerCase()}`}
                  aria-label={`Filter by ${phase} phase`}
                  type="checkbox" 
                  className="form-checkbox text-primary rounded border-muted size-4" 
                  defaultChecked 
                />
                <span className="text-sm font-medium text-text-main">{phase}</span>
              </label>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="w-4/5 flex flex-col h-full overflow-y-auto bg-bgLight p-6 gap-6">
        <div className="flex justify-between items-center shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-text-main">Analytical Overview</h1>
            <p className="text-sm text-muted">{selectedProject.projeto} • Tracking Phase: {selectedProject.fase || 'Execution'}</p>
          </div>
          <div className="flex bg-surface p-1 rounded-md border border-border-color">
            <button 
              id="btn-subtab-weekly"
              aria-label="View weekly progress"
              onClick={() => setActiveSubTab('weekly')}
              className={`px-4 py-1.5 text-sm font-bold rounded transition-all ${activeSubTab === 'weekly' ? 'bg-bgLight text-primary shadow-sm' : 'text-muted'}`}
            >
              Weekly Progress
            </button>
            <button 
              id="btn-subtab-milestone"
              aria-label="View milestone view"
              onClick={() => setActiveSubTab('milestone')}
              className={`px-4 py-1.5 text-sm font-bold rounded transition-all ${activeSubTab === 'milestone' ? 'bg-bgLight text-primary shadow-sm' : 'text-muted'}`}
            >
              Milestone View
            </button>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-2 gap-6">
          {/* S-Curve Card */}
          <div className="bg-surface border border-border-color rounded-md p-6 flex flex-col min-h-[400px]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-text-main">S-Curve Analysis</h3>
              <div className="flex gap-4 text-xs font-medium">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-muted"></div>
                  <span>Planned</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <span>Actual</span>
                </div>
              </div>
            </div>
            <div className="flex-1 relative mt-4">
              {/* Simplified S-Curve SVG */}
              <svg viewBox="0 0 500 200" className="w-full h-full preserve-aspect-ratio cursor-crosshair">
                <path d="M0,180 Q100,160 200,100 T500,20" fill="none" stroke="#E2E8F0" strokeWidth="3" strokeDasharray="5,5" />
                <path d={`M0,180 Q100,170 200,130 T${(progress/100)*500},${180 - (progress/100)*160}`} fill="none" stroke="var(--primary)" strokeWidth="4" />
                {/* Dots */}
                <circle cx="200" cy="130" r="5" fill="var(--primary)" />
                <text x="210" y="125" className="text-[10px] font-bold fill-primary">Current Week</text>
              </svg>
            </div>
            <div className="mt-4 pt-4 border-t border-border-color flex justify-around">
              <div className="text-center">
                <p className="text-xs text-muted font-bold uppercase">Variance</p>
                <p className="text-lg font-bold text-accent-red">-4.2%</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted font-bold uppercase">Forecast</p>
                <p className="text-lg font-bold text-text-main">Oct 2026</p>
              </div>
            </div>
          </div>

          {/* Labor Histogram Card */}
          <div className="bg-surface border border-border-color rounded-md p-6 flex flex-col min-h-[400px]">
            <h3 className="text-lg font-bold text-text-main mb-6">Labor Histogram (MOD)</h3>
            <div className="flex-1 flex items-end gap-2 px-2 mt-4">
              {[45, 60, 85, 95, 120, 110, 90, 75, 60, 40].map((val, i) => (
                <div key={i} className="flex-1 bg-bgLight relative group">
                  <div 
                    className="absolute bottom-0 left-0 w-full bg-primary/20 group-hover:bg-primary/40 transition-all rounded-t-sm" 
                    style={{ height: `${val}%` }}
                  ></div>
                  <div 
                    className="absolute bottom-0 left-1/4 w-1/2 bg-primary transition-all rounded-t-sm" 
                    style={{ height: `${val * 0.7}%` }}
                  ></div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 text-[10px] text-muted font-bold px-2">
              <span>W24</span><span>W26</span><span>W28</span><span>W30</span><span>W32</span>
            </div>
          </div>
        </div>

        {/* Speedometers Grid */}
        <div className="bg-surface border border-border-color rounded-md p-6">
          <h3 className="text-lg font-bold text-text-main mb-8">EPC Progress by Discipline</h3>
          <div className="grid grid-cols-4 gap-8">
            {[
              { label: 'Engineering', val: 95, color: '#2563EB' },
              { label: 'Procurement', val: 82, color: '#2563EB' },
              { label: 'Construction', val: (selectedProject.avanco_fisico_real || 0).toFixed(0), color: '#2563EB' },
              { label: 'Commissioning', val: 15, color: '#2563EB' }
            ].map((d) => (
              <div key={d.label} className="flex flex-col items-center gap-4">
                <div className="relative w-40 h-20 overflow-hidden">
                  <svg viewBox="0 0 100 50" className="w-full h-full">
                    {/* Background Arc */}
                    <path d="M10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#E2E8F0" strokeWidth="8" />
                    {/* Progress Arc */}
                    <path 
                      d="M10 50 A 40 40 0 0 1 90 50" 
                      fill="none" 
                      stroke="var(--primary)" 
                      strokeWidth="8"
                      strokeDasharray={`${(Number(d.val)/100) * 125} 125`}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute bottom-0 left-0 w-full text-center">
                    <span className="text-2xl font-black text-text-main">{d.val}%</span>
                  </div>
                </div>
                <span className="text-sm font-bold text-muted uppercase tracking-wider">{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Regional & Milestones Mixed Grid */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="col-span-1 bg-surface border border-border-color rounded-md p-6 h-[300px] flex flex-col">
            <h3 className="text-sm font-bold text-muted uppercase mb-4">Milestone Variance</h3>
            <div className="space-y-4">
              {[
                { name: 'Licensing Approval', status: 'done', delay: 0 },
                { name: 'Equipment Delivery', status: 'delay', delay: 15 },
                { name: 'Foundation Work', status: 'progress', delay: 0 }
              ].map(m => (
                <div key={m.name} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-text-main">{m.name}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${m.status === 'done' ? 'bg-green-100 text-green-700' : m.status === 'delay' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                    {m.status === 'delay' ? `+${m.delay}d` : m.status.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="col-span-2 bg-surface border border-border-color rounded-md p-6 h-[300px] flex flex-col">
            <h3 className="text-sm font-bold text-muted uppercase mb-4">Site Resource Allocation</h3>
            <div className="flex-1 bg-bgLight rounded border border-dashed border-border-color flex items-center justify-center text-muted italic">
              [ Interactive Site Map Component ]
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
