import { PortfolioMaster } from '../types';
import { useState, useRef } from 'react';
import { useGSAP } from '../hooks/useGSAP';
import gsap from 'gsap';
import { BarChart3, PieChart, Activity, Zap, Info } from 'lucide-react';

interface Screen2Props {
  selectedProject: PortfolioMaster | null;
}

export default function Screen2({ selectedProject }: Screen2Props) {
  const [activeSubTab, setActiveSubTab] = useState('weekly');
  const containerRef = useRef(null);

  // Antigravity GSAP Stagger
  useGSAP(() => {
    if (selectedProject) {
      const tl = gsap.timeline();
      tl.fromTo(".analysis-card", 
        { y: 40, opacity: 0, scale: 0.95 }, 
        { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.15, ease: 'power4.out' }
      )
      .fromTo(".speedometer", 
        { rotateX: -45, opacity: 0, scale: 0.8 }, 
        { rotateX: 0, opacity: 1, scale: 1, duration: 1, stagger: 0.1, ease: 'back.out(1.7)' },
        "-=0.4"
      );
    }
  }, [selectedProject, activeSubTab]);

  if (!selectedProject) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-bgLight/30 backdrop-blur-sm p-12 text-center bg-noise">
        <div className="size-24 rounded-full bg-muted/5 flex items-center justify-center mb-6 border border-white/5 shadow-inner animate-pulse">
          <Activity className="size-10 text-muted/30" />
        </div>
        <h3 className="text-2xl font-black text-textMain tracking-tighter opacity-80">Telemetry Required</h3>
        <p className="text-muted max-w-sm mx-auto text-sm italic opacity-50 mt-2">Initialize project selection from the primary dashboard to stream execution analytics.</p>
      </div>
    );
  }

  const progress = selectedProject.avanco_fisico_real || 0;

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto p-10 relative scrollbar-hide">
      <div className="max-w-[1500px] mx-auto space-y-12 pb-24">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">Analysis Active</span>
              <span className="text-muted text-[10px] font-black uppercase tracking-widest opacity-40">Stream ID: {selectedProject.id.slice(0, 8)}</span>
            </div>
            <h1 className="text-4xl font-black text-textMain tracking-tighter leading-none">Analytical Overview</h1>
            <p className="text-muted text-sm font-medium opacity-60">
              Project: <span className="text-textMain font-black">{selectedProject.projeto}</span> • 
              Tracking Phase: <span className="text-primary font-black uppercase">{selectedProject.fase || 'Execution'}</span>
            </p>
          </div>
          
          <div className="flex glass-card p-1.5 rounded-2xl border-white/5 shadow-xl bg-surface/30">
            {[
              { id: 'weekly', label: 'Weekly Delta', icon: <BarChart3 className="size-3.5" /> },
              { id: 'milestone', label: 'Milestone Map', icon: <PieChart className="size-3.5" /> }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-500 ${activeSubTab === tab.id ? 'bg-primary text-white shadow-[0_8px_16px_rgba(var(--primary-rgb),0.3)]' : 'text-muted hover:text-textMain'}`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* S-Curve Card - Premium Glass */}
          <div className="analysis-card glass-card rounded-[2.5rem] p-10 flex flex-col min-h-[500px] border-white/5 shadow-2xl group hover:border-primary/20 transition-all duration-1000">
            <div className="flex justify-between items-start mb-10">
              <div>
                <h3 className="text-xl font-black text-textMain tracking-tighter mb-1">S-Curve Projection</h3>
                <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] opacity-40">Cumulative performance index</p>
              </div>
              <div className="flex gap-4 p-2 rounded-xl bg-white/5 border border-white/5">
                <LegendItem color="bg-muted" label="Planned" />
                <LegendItem color="bg-primary" label="Actual" />
              </div>
            </div>
            
            <div className="flex-1 relative mt-4 group/svg">
              {/* Refined S-Curve SVG with Neon Glow */}
              <svg viewBox="0 0 500 200" className="w-full h-full preserve-aspect-ratio drop-shadow-2xl">
                <defs>
                  <linearGradient id="curveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(var(--primary-rgb), 0.2)" />
                    <stop offset="100%" stopColor="var(--primary)" />
                  </linearGradient>
                </defs>
                <path d="M0,180 Q100,160 200,100 T500,20" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" strokeDasharray="8,8" />
                <path 
                  d={`M0,180 Q100,170 200,130 T${(progress/100)*500},${180 - (progress/100)*160}`} 
                  fill="none" 
                  stroke="url(#curveGradient)" 
                  strokeWidth="6" 
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
                <circle cx={(progress/100)*500} cy={180 - (progress/100)*160} r="8" fill="var(--primary)" className="animate-pulse shadow-2xl" />
              </svg>
            </div>

            <div className="mt-8 pt-8 border-t border-white/5 flex justify-between px-4">
              <StatItem label="Phase Variance" value="-4.2%" color="text-error" sub="Lag detected" />
              <StatItem label="Est. Completion" value="OCT 26" color="text-textMain" sub="Shift: +12d" />
              <StatItem label="Performance" value="Stable" color="text-success" sub="CPI: 0.98" />
            </div>
          </div>

          {/* Labor Histogram - High Frequency Bars */}
          <div className="analysis-card glass-card rounded-[2.5rem] p-10 flex flex-col min-h-[500px] border-white/5 shadow-2xl group hover:border-primary/20 transition-all duration-1000">
            <div className="flex justify-between items-start mb-10">
              <div>
                <h3 className="text-xl font-black text-textMain tracking-tighter mb-1">Resource Intensity</h3>
                <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] opacity-40">Direct labor allocation (MOD)</p>
              </div>
              <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                <Zap className="size-4 text-primary animate-pulse" />
              </div>
            </div>
            
            <div className="flex-1 flex items-end gap-3 px-2 mt-4">
              {[45, 60, 85, 95, 120, 110, 90, 75, 60, 40, 55, 70].map((val, i) => (
                <div key={i} className="flex-1 relative group/bar h-full flex items-end">
                  <div 
                    className="w-full bg-white/[0.03] group-hover/bar:bg-primary/5 transition-all duration-500 rounded-t-xl overflow-hidden relative"
                    style={{ height: `${val}%` }}
                  >
                    <div 
                      className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-primary/10 to-primary/40 rounded-t-xl group-hover/bar:from-primary/20 group-hover/bar:to-primary transition-all duration-700 shadow-[0_0_20px_rgba(var(--primary-rgb),0.2)]" 
                      style={{ height: '70%' }}
                    ></div>
                    {/* Tiny info pulse on hover */}
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-opacity duration-300">
                      <span className="text-[8px] font-black text-white">{val}h</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-8 text-[9px] font-black text-muted uppercase tracking-[0.3em] opacity-30 px-2">
              <span>WK 24</span><span>WK 28</span><span>WK 32</span><span>WK 36</span>
            </div>
          </div>
        </div>

        {/* Speedometers Grid - Weighted Elements */}
        <div className="glass-card rounded-[3rem] p-12 border-white/5 shadow-inner bg-white/[0.02]">
          <div className="flex items-center gap-3 mb-12">
            <h3 className="text-[10px] font-black text-muted uppercase tracking-[0.4em]">Discipline Sync Thresholds</h3>
            <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { label: 'Engineering', val: 95, color: 'primary' },
              { label: 'Procurement', val: 82, color: 'primary' },
              { label: 'Construction', val: (selectedProject.avanco_fisico_real || 0).toFixed(0), color: 'primary' },
              { label: 'Commissioning', val: 15, color: 'primary' }
            ].map((d) => (
              <div key={d.label} className="speedometer flex flex-col items-center gap-6 perspective-1000 group">
                <div className="relative w-48 h-24 overflow-hidden group-hover:-translate-y-2 transition-transform duration-700">
                  <svg viewBox="0 0 100 50" className="w-full h-full drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)]">
                    <path d="M10 50 A 40 40 0 0 1 90 50" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="10" strokeLinecap="round" />
                    <path 
                      d="M10 50 A 40 40 0 0 1 90 50" 
                      fill="none" 
                      stroke="var(--primary)" 
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={`${(Number(d.val)/100) * 125} 125`}
                      className="transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]"
                    />
                  </svg>
                  <div className="absolute bottom-0 left-0 w-full text-center">
                    <span className="text-4xl font-black text-textMain tracking-tighter tabular-nums drop-shadow-2xl">{d.val}<span className="text-sm opacity-30 ml-1">%</span></span>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/5 group-hover:bg-primary/5 transition-colors duration-500">
                  <span className="text-[9px] font-black text-muted uppercase tracking-[0.2em] group-hover:text-primary transition-colors">{d.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Narrative Stats - Spatial Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className=" glass-card rounded-3xl p-8 border-white/5 flex flex-col group hover:scale-[1.02] transition-all duration-700">
            <h3 className="text-[10px] font-black text-muted uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
              <Info className="size-3" /> Incident Report
            </h3>
            <div className="space-y-5">
              {[
                { label: 'Lost Time Injuries', val: '00', color: 'text-success' },
                { label: 'Minor Near Misses', val: '02', color: 'text-warning' },
                { label: 'Safety Inspections', val: '48', color: 'text-primary' }
              ].map(stat => (
                <div key={stat.label} className="flex justify-between items-center group/stat">
                  <span className="text-xs font-bold text-muted group-hover/stat:text-textMain transition-colors">{stat.label}</span>
                  <span className={`text-xl font-black font-mono ${stat.color} group-hover/stat:scale-110 transition-transform`}>{stat.val}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="lg:col-span-2 glass-card rounded-3xl p-8 border-white/5 bg-noise bg-opacity-[0.01] flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <div className="text-center space-y-4 relative z-10">
              <h3 className="text-[10px] font-black text-muted uppercase tracking-[0.4em] mb-2 opacity-40">Tactical Visualization</h3>
              <p className="text-xl font-black text-textMain tracking-tighter opacity-20 italic">Geospatial data streaming into regional mapping module...</p>
              <div className="flex gap-2 justify-center">
                <div className="size-1.5 rounded-full bg-primary animate-bounce" />
                <div className="size-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.2s]" />
                <div className="size-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string, label: string }) {
  return (
    <div className="flex items-center gap-2 px-2">
      <div className={`size-2 rounded-full ${color}`} />
      <span className="text-[9px] font-black text-muted uppercase tracking-widest">{label}</span>
    </div>
  );
}

function StatItem({ label, value, color, sub }: any) {
  return (
    <div className="flex flex-col gap-1 group/item">
      <span className="text-[9px] font-black text-muted uppercase tracking-[0.2em] opacity-40 group-hover/item:opacity-100 transition-opacity">{label}</span>
      <span className={`text-xl font-black tracking-tighter ${color} drop-shadow-lg`}>{value}</span>
      <span className="text-[8px] font-bold text-muted/30 italic uppercase">{sub}</span>
    </div>
  );
}
