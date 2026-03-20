import React, { useState, useMemo, useRef } from 'react';
import { PortfolioMaster } from '../types';
import { Search, SlidersHorizontal, ArrowUpRight, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useGSAP } from '../hooks/useGSAP';
import gsap from 'gsap';

interface DashboardProps {
  projects: PortfolioMaster[];
  selectedProject: PortfolioMaster | null;
  onSelectProject: (project: PortfolioMaster) => void;
}

export default function Dashboard({ projects, selectedProject, onSelectProject }: DashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<{ criticality: string[]; program: string[] }>({
    criticality: [],
    program: []
  });

  const kpiContainerRef = useRef(null);
  const tableRef = useRef(null);

  // Filter Logic
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchSearch = (p.projeto || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchCrit = filters.criticality.length === 0 || filters.criticality.includes(p.criticidade_risco || '');
      const matchProg = filters.program.length === 0 || filters.program.includes(p.programa || '');
      return matchSearch && matchCrit && matchProg;
    });
  }, [projects, searchTerm, filters]);

  // Antigravity GSAP Stagger
  useGSAP(() => {
    if (filteredProjects.length > 0) {
      const tl = gsap.timeline();
      tl.fromTo(".kpi-card", 
        { y: 50, opacity: 0, scale: 0.9, rotateX: -10 }, 
        { y: 0, opacity: 1, scale: 1, rotateX: 0, duration: 0.8, stagger: 0.1, ease: 'power4.out' }
      )
      .fromTo(".project-row", 
        { x: -30, opacity: 0 }, 
        { x: 0, opacity: 1, duration: 0.5, stagger: 0.04, ease: 'power2.out' },
        "-=0.5"
      );
    }
  }, [filteredProjects]);

  return (
    <div className="flex-1 overflow-y-auto p-8 relative scrollbar-hide">
      <div className="max-w-[1500px] mx-auto space-y-10 pb-20">
        
        {/* Header Section - Antigravity Theme */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-textMain tracking-tighter leading-none">Command Center</h1>
            <p className="text-muted text-sm font-medium opacity-60 flex items-center gap-2">
              <span className="size-2 rounded-full bg-success animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
              Live Monitoring System • {projects.length} Active Nodes
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative group w-80">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
              <div className="relative flex items-center">
                <Search className="absolute left-4 size-4 text-muted group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  placeholder="Scan Asset ID or Name..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-surface/30 backdrop-blur-sm border border-white/5 rounded-xl text-sm focus:outline-none focus:border-primary/30 text-textMain transition-all shadow-inner"
                />
              </div>
            </div>
            <button className="flex items-center gap-2 px-5 py-3 glass-card rounded-xl text-xs font-black uppercase tracking-[0.2em] hover:text-primary transition-all active:scale-95 group border-white/5">
              <SlidersHorizontal className="size-4 group-hover:rotate-180 transition-transform duration-700" />
              Tweak View
            </button>
          </div>
        </div>

        {/* Global KPIs - Weightless Glass Cards */}
        <div ref={kpiContainerRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <KPICard 
            title="Operational Assets" 
            value={projects.length.toString()} 
            trend="+2.4" 
            icon={<ArrowUpRight className="size-6" />}
            color="primary"
            className="kpi-card floating"
          />
          <KPICard 
            title="System Efficiency" 
            value="98.2" 
            trend="+0.8" 
            suffix="%"
            icon={<Clock className="size-6" />}
            color="warning"
            className="kpi-card floating"
            style={{ animationDelay: '0.2s' }}
          />
          <KPICard 
            title="Energy Delivered" 
            value="1.4M" 
            trend="+12" 
            suffix="GWh"
            icon={<CheckCircle2 className="size-6" />}
            color="success"
            className="kpi-card floating"
            style={{ animationDelay: '0.4s' }}
          />
          <KPICard 
            title="Alert Threshold" 
            value="03" 
            trend="-1" 
            icon={<AlertCircle className="size-6" />}
            color="error"
            className="kpi-card floating"
            style={{ animationDelay: '0.6s' }}
          />
        </div>

        {/* Project Table - High-Precision Interface */}
        <div className="glass-card rounded-3xl overflow-hidden border border-white/5 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] bg-surface/50">
          <div className="overflow-x-auto">
            <table ref={tableRef} className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-white/[0.03] border-b border-white/5">
                  <th className="px-8 py-5 text-[11px] font-black text-muted uppercase tracking-[0.3em] pl-12 italic">ID / Name</th>
                  <th className="px-8 py-5 text-[11px] font-black text-muted uppercase tracking-[0.3em]">Program</th>
                  <th className="px-8 py-5 text-[11px] font-black text-muted uppercase tracking-[0.3em] text-center">Safety</th>
                  <th className="px-8 py-5 text-[11px] font-black text-muted uppercase tracking-[0.3em]">Status Mapping</th>
                  <th className="px-8 py-5 text-[11px] font-black text-muted uppercase tracking-[0.3em]">Lifecycle</th>
                  <th className="px-8 py-5 text-[11px] font-black text-muted uppercase tracking-[0.3em] text-right pr-12">Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {filteredProjects.map((project) => (
                  <tr 
                    key={project.id} 
                    id={`asset-row-${project.id}`}
                    onClick={() => onSelectProject(project)}
                    className={`project-row group cursor-pointer transition-all duration-500 hover:bg-white/[0.04] ${selectedProject?.id === project.id ? 'bg-primary/5' : ''}`}
                  >
                    <td className="px-8 py-6 pl-12 relative overflow-hidden">
                      {selectedProject?.id === project.id && (
                        <div className="absolute left-0 top-0 w-1.5 h-full bg-primary shadow-[4px_0_12px_rgba(var(--primary-rgb),0.5)]"></div>
                      )}
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-textMain group-hover:text-primary transition-all duration-500 transform group-hover:translate-x-1">{project.projeto}</span>
                        <span className="text-[10px] text-muted opacity-40 uppercase tracking-[0.15em] font-medium">{project.localidade || 'GEO:BRAZIL'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black bg-muted/5 text-muted uppercase tracking-widest border border-white/5 group-hover:border-primary/20 transition-all">
                        {project.programa || 'CORE'}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col items-center gap-1.5 grayscale group-hover:grayscale-0 transition-all duration-700 opacity-60 group-hover:opacity-100">
                        <span className="text-xs font-mono font-black text-success tabular-nums">100%</span>
                        <div className="w-14 h-1 bg-success/10 rounded-full overflow-hidden">
                          <div className="h-full bg-success w-full shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="w-full max-w-[150px] space-y-2">
                        <div className="flex justify-between text-[9px] font-black text-muted tabular-nums uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-opacity">
                          <span>Physical</span>
                          <span className="text-textMain">{project.avanco_fisico_real || 0}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/[0.03] rounded-full overflow-hidden relative p-[1px]">
                          <div 
                            className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(var(--primary-rgb),0.3)]" 
                            style={{ width: `${project.avanco_fisico_real || 0}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className={`size-2.5 rounded-full ring-4 ring-bgDark transition-all duration-500 ${project.criticidade_risco === 'Alta' ? 'bg-error shadow-[0_0_12px_rgba(239,64,64,0.6)] animate-pulse' : 'bg-success shadow-[0_0_12px_rgba(34,197,94,0.6)]'}`} />
                        <span className="text-[10px] font-black text-textMain uppercase tracking-widest opacity-80 group-hover:opacity-100">{project.criticidade_risco || 'Regular'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right pr-12">
                      <button className="inline-flex size-10 items-center justify-center glass-card rounded-xl hover:text-primary hover:border-primary/30 active:scale-90 transition-all duration-500 group-hover:shadow-[0_8px_16px_rgba(0,0,0,0.3)]">
                        <ArrowUpRight className="size-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Empty State - Narrative Style */}
          {filteredProjects.length === 0 && (
            <div className="p-32 text-center flex flex-col items-center gap-8 bg-noise bg-opacity-[0.03]">
              <div className="size-24 rounded-full flex items-center justify-center text-muted/20 border-2 border-dashed border-white/5 animate-[spin_10s_linear_infinite]">
                <Search className="size-10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-black text-textMain tracking-tighter opacity-80">No Active Nodes Found</h3>
                <p className="text-muted max-w-sm mx-auto text-sm italic opacity-40 leading-relaxed font-medium">The monitoring system could not identify any energy assets matching your current spectral parameters.</p>
              </div>
              <button 
                onClick={() => { setSearchTerm(''); setFilters({ criticality: [], program: [] }); }}
                className="px-6 py-3 glass-card rounded-full text-[10px] font-black text-primary uppercase tracking-[0.3em] hover:bg-primary/10 transition-all border-primary/20"
              >
                Reset Spectral Filter
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function KPICard({ title, value, trend, icon, color, className, style, suffix = '' }: any) {
  const colors: any = {
    primary: 'text-primary bg-primary/10 border-primary/20 shadow-[0_0_15px_rgba(var(--primary-rgb),0.2)]',
    success: 'text-success bg-success/10 border-success/20 shadow-[0_0_15px_rgba(34,197,94,0.2)]',
    warning: 'text-warning bg-warning/10 border-warning/20 shadow-[0_0_15px_rgba(234,179,8,0.2)]',
    error: 'text-error bg-error/10 border-error/20 shadow-[0_0_15px_rgba(239,64,64,0.2)]',
  };

  return (
    <div className={`glass-card p-8 rounded-3xl border border-white/5 group hover:border-primary/20 transition-all duration-1000 cursor-default flex flex-col justify-between min-h-[180px] hover:-translate-y-2 ${className}`} style={style}>
      <div className="flex justify-between items-start">
        <div className={`p-4 rounded-2xl border ${colors[color]} group-hover:scale-110 group-hover:rotate-12 transition-all duration-700 shadow-xl`}>
          {icon}
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10">
          <span className={`text-[10px] font-black tabular-nums ${trend.startsWith('+') ? 'text-success' : 'text-error'}`}>
            {trend}%
          </span>
          <div className={`size-1.5 rounded-full ${trend.startsWith('+') ? 'bg-success' : 'bg-error'} animate-pulse shadow-[0_0_8px_currentColor]`} />
        </div>
      </div>
      <div className="mt-6">
        <p className="text-[10px] font-black text-muted uppercase tracking-[0.3em] mb-2 opacity-30 group-hover:opacity-100 transition-opacity duration-700">{title}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-black text-textMain tracking-tighter tabular-nums drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)]">{value}</span>
          {suffix && <span className="text-sm font-black text-muted uppercase tracking-widest opacity-40">{suffix}</span>}
        </div>
      </div>
    </div>
  );
}
