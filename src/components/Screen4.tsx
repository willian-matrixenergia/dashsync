import { PortfolioMaster } from '../types';
import { useState, useRef } from 'react';
import { useGSAP } from '../hooks/useGSAP';
import gsap from 'gsap';
import { 
  ShieldCheck, 
  Zap, 
  AlertTriangle, 
  Target, 
  Maximize2, 
  Box, 
  Activity, 
  History,
  Info,
  Radio,
  Wifi,
  Thermometer
} from 'lucide-react';

interface Screen4Props {
  selectedProject: PortfolioMaster | null;
}

export default function Screen4({ selectedProject }: Screen4Props) {
  const containerRef = useRef(null);
  const [logs] = useState([
    { id: 1, time: '14:22:05', type: 'info', msg: 'System check: All sensors nominal' },
    { id: 2, time: '14:20:12', type: 'warning', msg: 'Inverter #4 reporting high temperature' },
    { id: 3, time: '14:15:30', type: 'info', msg: 'Manual override engaged - Section B' },
    { id: 4, time: '14:10:00', type: 'error', msg: 'Connection lost: Communication Tower 2' },
  ]);

  // Antigravity GSAP Orchestration
  useGSAP(() => {
    if (selectedProject) {
      const tl = gsap.timeline();
      tl.fromTo(".intel-card", 
        { y: 30, opacity: 0, scale: 0.95 }, 
        { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.1, ease: 'power4.out' }
      )
      .fromTo(".ops-center", 
        { opacity: 0, scale: 0.98 }, 
        { opacity: 1, scale: 1, duration: 1.2, ease: 'expo.out' },
        "-=0.4"
      )
      .fromTo(".log-entry", 
        { x: 20, opacity: 0 }, 
        { x: 0, opacity: 1, duration: 0.5, stagger: 0.05, ease: 'power2.out' },
        "-=0.8"
      );
    }
  }, [selectedProject]);

  if (!selectedProject) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-bgLight/30 backdrop-blur-sm p-12 text-center bg-noise">
        <div className="size-24 rounded-full bg-muted/5 flex items-center justify-center mb-6 border border-white/5 shadow-inner animate-pulse">
          <Radio className="size-10 text-muted/30" />
        </div>
        <h3 className="text-2xl font-black text-textMain tracking-tighter opacity-80">Link Terminated</h3>
        <p className="text-muted max-w-sm mx-auto text-sm italic opacity-50 mt-2">Biometric handshake required. Select a primary node from the Portfolio to initialize live operations stream.</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto p-10 relative scrollbar-hide">
      <div className="max-w-[1500px] mx-auto space-y-10 pb-24">
        
        {/* Top Intelligence Cards - Glassmorphic weighted */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 shrink-0">
          {[
            { label: 'Plant Availability', val: '99.8%', trend: '↑ 0.2%', icon: <ShieldCheck className="size-4" />, color: 'text-success' },
            { label: 'Current Power', val: '12.4', suffix: 'MW', trend: 'STABLE', icon: <Zap className="size-4" />, color: 'text-primary' },
            { label: 'Live Alerts', val: '02', trend: 'ACTIVE', icon: <AlertTriangle className="size-4" />, color: 'text-error' },
            { label: 'Efficiency Index', val: '0.94', trend: 'OPTIMAL', icon: <Target className="size-4" />, color: 'text-primary' }
          ].map((kpi) => (
            <div key={kpi.label} className="intel-card glass-card rounded-[2rem] p-8 h-[160px] flex flex-col justify-between border-white/5 shadow-2xl group hover:border-primary/20 transition-all duration-700">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-black text-muted uppercase tracking-[0.3em] opacity-40 group-hover:opacity-100 transition-opacity">
                  {kpi.label}
                </span>
                <div className={`p-2 rounded-xl bg-white/5 border border-white/5 ${kpi.color}`}>
                  {kpi.icon}
                </div>
              </div>
              <div className="flex justify-between items-end">
                <div className="flex items-baseline gap-1">
                  <span className={`text-3xl font-black tracking-tighter ${kpi.color}`}>{kpi.val}</span>
                  {kpi.suffix && <span className="text-[10px] font-black opacity-30 text-textMain">{kpi.suffix}</span>}
                </div>
                <span className={`text-[10px] font-black tracking-widest ${kpi.color} group-hover:animate-pulse`}>{kpi.trend}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Intelligence Center (70/30) - Spatial Depth */}
        <div className="flex flex-col lg:flex-row gap-8 min-h-[600px]">
          {/* Main Operations Center (70%) */}
          <div className="ops-center lg:w-[70%] glass-card rounded-[2.5rem] border-white/5 flex flex-col overflow-hidden relative shadow-inner">
            <div className="p-8 border-b border-white/5 flex flex-col sm:flex-row justify-between items-center bg-white/[0.02] backdrop-blur-md z-10 gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20">
                  <Activity className="size-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-textMain tracking-tighter">Live Operations Center</h3>
                  <p className="text-[10px] font-black text-muted uppercase tracking-widest opacity-40">Tactical Node: {selectedProject.projeto}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 glass-card bg-white/5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all border-white/10 text-muted">
                  <Maximize2 className="size-3.5" />
                  2D VIEW
                </button>
                <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:-translate-y-1 transition-all duration-500">
                  <Box className="size-3.5" />
                  3D ENGINE
                </button>
              </div>
            </div>
            
            <div className="flex-1 bg-noise flex items-center justify-center p-12 overflow-hidden relative">
              {/* Mock SVG Floor Plan with Antigravity depth */}
              <svg viewBox="0 0 600 400" className="w-full h-full max-w-[800px] drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] scale-110">
                <defs>
                   <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                     <feGaussianBlur stdDeviation="3" result="blur" />
                     <feComposite in="SourceGraphic" in2="blur" operator="over" />
                   </filter>
                </defs>
                {/* Site Boundaries */}
                <rect x="50" y="50" width="500" height="300" rx="30" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
                
                {/* Site Grid */}
                {[1,2,3,4,5,6].map(i => (
                  <line key={`v-${i}`} x1={50 + i*70} y1="50" x2={50 + i*70} y2="350" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
                ))}
                
                {/* Solar Arrays / Sections - Spatial elements */}
                <g className="cursor-pointer group/node" filter="url(#glow)">
                   <rect x="100" y="100" width="100" height="60" rx="10" fill="rgba(var(--primary-rgb),0.05)" stroke="var(--primary)" strokeWidth="1.5" className="group-hover/node:fill-primary/20 transition-all duration-500" />
                   <text x="150" y="135" textAnchor="middle" className="text-[10px] fill-primary font-black opacity-40 group-hover/node:opacity-100 transition-opacity">NODE_A</text>
                   <circle cx="200" cy="100" r="4" fill="#22C55E" className="animate-pulse shadow-lg" />
                </g>

                <g className="cursor-pointer group/node" filter="url(#glow)">
                   <rect x="250" y="100" width="100" height="60" rx="10" fill="rgba(239,68,68,0.05)" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="4,2" className="group-hover/node:fill-error/20 transition-all duration-500" />
                   <text x="300" y="135" textAnchor="middle" className="text-[10px] fill-error font-black opacity-60 group-hover/node:opacity-100 transition-opacity">NODE_B [!!]</text>
                   <circle cx="350" cy="100" r="5" fill="#EF4444" className="animate-pulse" />
                </g>

                <g className="cursor-pointer group/node" filter="url(#glow)">
                   <rect x="400" y="100" width="100" height="60" rx="10" fill="rgba(var(--primary-rgb),0.05)" stroke="var(--primary)" strokeWidth="1.5" className="group-hover/node:fill-primary/20 transition-all duration-500" />
                   <text x="450" y="135" textAnchor="middle" className="text-[10px] fill-primary font-black opacity-40 group-hover/node:opacity-100 transition-opacity">NODE_C</text>
                </g>

                <rect x="100" y="220" width="400" height="100" rx="20" fill="rgba(255,255,255,0.01)" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                <text x="300" y="275" textAnchor="middle" className="text-[14px] fill-textMain font-black opacity-10 tracking-[0.5em]">PRIMARY FIELD</text>
                
                {/* Pulse lines */}
                <path d="M150,160 L150,220 M300,160 L300,220 M450,160 L450,220" stroke="rgba(255,255,255,0.05)" strokeWidth="1.5" strokeDasharray="5,5" className="animate-pulse" />
              </svg>

              {/* Floating Unit Info - Weightless */}
              <div className="absolute top-28 right-12 glass-card bg-surface/30 p-6 rounded-[2rem] border-white/10 shadow-3xl w-60 animate-in fade-in slide-in-from-right-10 duration-1000 group hover:border-primary/40 transition-all hover:scale-105">
                <div className="flex justify-between items-center mb-4">
                   <p className="text-[9px] font-black text-muted uppercase tracking-[0.3em]">Telemetry Hub</p>
                   <Wifi className="size-3 text-success animate-pulse" />
                </div>
                <p className="text-xl font-black text-textMain tracking-tighter mb-5">INV_DELTA_04</p>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Thermometer className="size-3 text-error" />
                      <span className="text-[10px] font-black text-muted uppercase">Temp</span>
                    </div>
                    <span className="text-sm font-black text-error font-mono">82<span className="text-[10px] opacity-40 ml-0.5">°C</span></span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Activity className="size-3 text-primary" />
                      <span className="text-[10px] font-black text-muted uppercase">Load</span>
                    </div>
                    <span className="text-sm font-black text-textMain font-mono">94<span className="text-[10px] opacity-40 ml-0.5">%</span></span>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-white/5">
                   <button className="w-full py-2 bg-primary/10 hover:bg-primary/20 text-primary text-[9px] font-black uppercase tracking-widest rounded-xl transition-all">Diagnostic Ping</button>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Log (30%) - Glass List */}
          <div className="lg:w-[30%] glass-card rounded-[2.5rem] border-white/5 flex flex-col overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-white/5 bg-white/[0.02] shrink-0 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <History className="size-4 text-primary" />
                <h3 className="text-sm font-black text-textMain uppercase tracking-[0.3em]">Activity Stream</h3>
              </div>
              <div className="size-2 rounded-full bg-success animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-5 scrollbar-hide">
              {logs.map((log) => (
                <div key={log.id} className="log-entry flex gap-4 p-5 rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10 transition-all duration-500 group/log h-[120px] flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className={`p-2 rounded-xl backdrop-blur-md shadow-lg ${log.type === 'error' ? 'bg-error/10 text-error' : log.type === 'warning' ? 'bg-warning/10 text-warning' : 'bg-primary/10 text-primary'}`}>
                      {log.type === 'error' ? <AlertTriangle className="size-3" /> : log.type === 'warning' ? <Info className="size-3" /> : <Activity className="size-3" />}
                    </div>
                    <span className="text-[9px] font-black text-muted opacity-30 tabular-nums group-hover/log:opacity-100 transition-opacity">{log.time}</span>
                  </div>
                  <div>
                    <h4 className={`text-[8px] font-black uppercase tracking-[0.3em] mb-1 ${log.type === 'error' ? 'text-error' : log.type === 'warning' ? 'text-warning' : 'text-primary'}`}>{log.type} event</h4>
                    <p className="text-[11px] font-black text-textMain tracking-tight leading-tight group-hover/log:translate-x-1 transition-transform">{log.msg}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="p-6 text-[10px] font-black text-primary uppercase tracking-[0.4em] border-t border-white/5 hover:bg-white/5 transition-all text-center">
              Full Archive Trace
            </button>
          </div>
        </div>

        {/* Bottom Trend Analysis - Weightless Wave */}
        <div className="glass-card rounded-[3rem] p-10 border-white/5 shadow-inner bg-white/[0.01] flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-[10px] font-black text-muted uppercase tracking-[0.4em]">Node Health Topology (24h)</h3>
            <div className="flex gap-8 text-[9px] font-black uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]"></span>
                <span className="text-textMain">Efficiency</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-white/10"></span>
                <span className="text-muted">Load Avg</span>
              </div>
            </div>
          </div>
          <div className="flex-1 flex items-end justify-between gap-2 mt-2 group/chart h-24">
            {[40, 45, 42, 38, 35, 30, 32, 40, 55, 65, 80, 85, 90, 88, 85, 82, 80, 78, 75, 70, 65, 60, 55, 50].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col h-full justify-end items-center group/bar">
                <div 
                  className="w-full bg-white/5 rounded-t-lg group-hover/bar:bg-primary/20 transition-all duration-700 relative overflow-hidden" 
                  style={{ height: `${h}%` }}
                >
                  <div className="absolute bottom-0 left-0 w-full bg-primary/40 group-hover/bar:bg-primary transition-all duration-1000 shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]" style={{ height: '30%' }} />
                </div>
                {i % 4 === 0 && (
                  <span className="text-[8px] font-black text-muted opacity-20 mt-3">{i}:00</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
