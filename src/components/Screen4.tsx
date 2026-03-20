import { PortfolioMaster } from '../types';
import { useState, useEffect } from 'react';

interface Screen4Props {
  selectedProject: PortfolioMaster | null;
}

export default function Screen4({ selectedProject }: Screen4Props) {
  const [logs, setLogs] = useState([
    { id: 1, time: '14:22:05', type: 'info', msg: 'System check: All sensors nominal' },
    { id: 2, time: '14:20:12', type: 'warning', msg: 'Inverter #4 reporting high temperature' },
    { id: 3, time: '14:15:30', type: 'info', msg: 'Manual override engaged - Section B' },
    { id: 4, time: '14:10:00', type: 'error', msg: 'Connection lost: Communication Tower 2' },
  ]);

  if (!selectedProject) {
    return (
      <div className="flex-1 flex items-center justify-center bg-bgLight text-muted italic">
        Select a project from the Portfolio to view live monitoring.
      </div>
    );
  }

  return (
    <>
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-bgLight p-6 gap-6">
        {/* Top Intelligence Cards */}
        <div className="grid grid-cols-4 gap-6 shrink-0">
          {[
            { label: 'Plant Availability', val: '99.8%', trend: '↑ 0.2%' },
            { label: 'Current Power', val: '12.4 MW', trend: 'Stable' },
            { label: 'Live Alerts', val: '02', trend: 'Active', color: 'text-accent-red' },
            { label: 'Efficiency Index', val: '0.94', trend: 'Optimal' }
          ].map((kpi) => (
            <div key={kpi.label} className="bg-surface border border-border-color rounded-md p-5 h-[100px] flex flex-col justify-between">
              <span className="text-xs font-bold text-muted uppercase tracking-wider">{kpi.label}</span>
              <div className="flex justify-between items-baseline">
                <span className={`text-2xl font-black ${kpi.color || 'text-text-main'}`}>{kpi.val}</span>
                <span className="text-[10px] font-bold text-primary">{kpi.trend}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Intelligence Center (70/30) */}
        <div className="flex-1 flex gap-6 overflow-hidden">
          {/* Main Floor Plan (70%) */}
          <div className="w-[70%] bg-surface border border-border-color rounded-md flex flex-col overflow-hidden relative">
            <div className="p-4 border-b border-border-color flex justify-between items-center bg-surface z-10">
              <h3 className="text-lg font-bold text-text-main">Live Operations Center</h3>
              <div className="flex gap-2">
                <button 
                  id="btn-view-2d"
                  aria-label="Switch to 2D view"
                  className="flex items-center gap-1 text-[10px] font-bold text-muted border border-border-color px-2 py-1 rounded hover:bg-bgLight"
                >
                  <span className="material-symbols-outlined text-[14px]">zoom_in</span>
                  2D VIEW
                </button>
                <button 
                  id="btn-view-3d"
                  aria-label="Switch to 3D view"
                  className="flex items-center gap-1 text-[10px] font-bold text-primary border border-primary/20 bg-primary/5 px-2 py-1 rounded"
                >
                  <span className="material-symbols-outlined text-[14px]">3d_rotation</span>
                  3D VIEW
                </button>
              </div>
            </div>
            
            <div className="flex-1 bg-bgLight flex items-center justify-center p-12 overflow-hidden">
              {/* Mock SVG Floor Plan */}
              <svg viewBox="0 0 600 400" className="w-full h-full max-w-[800px] drop-shadow-2xl">
                {/* Site Boundaries */}
                <rect x="50" y="50" width="500" height="300" rx="4" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="2" />
                
                {/* Solar Arrays / Sections */}
                <g id="map-section-a" aria-label="Operational Section A" className="cursor-pointer group">
                  <rect x="80" y="80" width="120" height="80" rx="2" fill="var(--primary)" fillOpacity="0.1" stroke="var(--primary)" strokeWidth="1" />
                  <text x="140" y="125" textAnchor="middle" className="text-[10px] fill-primary font-bold">SECTION A</text>
                  <circle cx="200" cy="80" r="4" fill="#22C55E" className="animate-pulse" />
                </g>

                <g id="map-section-b" aria-label="Operational Section B - Alert Active" className="cursor-pointer group">
                  <rect x="240" y="80" width="120" height="80" rx="2" fill="var(--accent-red)" fillOpacity="0.05" stroke="var(--accent-red)" strokeWidth="1" strokeDasharray="4,2" />
                  <text x="300" y="125" textAnchor="middle" className="text-[10px] fill-accent-red font-bold uppercase tracking-tighter">SECTION B [ALERT]</text>
                  <circle cx="360" cy="80" r="4" fill="var(--accent-red)" className="animate-pulse" />
                </g>

                <g className="cursor-pointer group">
                  <rect x="400" y="80" width="120" height="80" rx="2" fill="var(--primary)" fillOpacity="0.1" stroke="var(--primary)" strokeWidth="1" />
                  <text x="460" y="125" textAnchor="middle" className="text-[10px] fill-primary font-bold">SECTION C</text>
                </g>

                <rect x="80" y="200" width="440" height="120" rx="2" fill="#F1F5F9" stroke="#E2E8F0" strokeWidth="1" />
                <text x="300" y="265" textAnchor="middle" className="text-[12px] fill-muted font-bold opacity-30">MAIN OPERATIONAL AREA</text>
                
                {/* Connection Lines */}
                <path d="M140,160 L140,200 M300,160 L300,200 M460,160 L460,200" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="3,3" />
              </svg>

              {/* Float Info Box */}
              <div className="absolute top-20 right-8 bg-surface border border-border-color shadow-xl rounded p-4 w-48 animate-in fade-in slide-in-from-right-4">
                <p className="text-[10px] font-bold text-muted uppercase mb-1">SELECTED UNIT</p>
                <p className="text-sm font-black text-text-main mb-3">INVERTER_B_04</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-medium">
                    <span className="text-muted">TEMP:</span>
                    <span className="text-accent-red font-bold">82°C</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-medium">
                    <span className="text-muted">LOAD:</span>
                    <span className="text-text-main font-bold">94%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Log (30%) */}
          <div className="w-[30%] bg-surface border border-border-color rounded-md flex flex-col overflow-hidden">
            <div className="p-4 border-b border-border-color bg-surface shrink-0">
              <h3 className="text-lg font-bold text-text-main">Live Activity Feed</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {logs.map((log) => (
                <div key={log.id} className={`flex gap-3 p-3 rounded-md border text-xs transition-all hover:translate-x-1 ${log.type === 'error' ? 'bg-red-50 border-red-100' : log.type === 'warning' ? 'bg-orange-50 border-orange-100' : 'bg-bgLight border-border-color'}`}>
                  <span className={`material-symbols-outlined text-[16px] shrink-0 mt-0.5 ${log.type === 'error' ? 'text-accent-red' : log.type === 'warning' ? 'text-orange-500' : 'text-primary'}`}>
                    {log.type === 'error' ? 'error' : log.type === 'warning' ? 'warning' : 'info'}
                  </span>
                  <div>
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="font-bold text-text-main uppercase text-[9px] tracking-widest">{log.type}</span>
                      <span className="text-muted opacity-60 tabular-nums">{log.time}</span>
                    </div>
                    <p className="text-text-main leading-relaxed font-medium">{log.msg}</p>
                  </div>
                </div>
              ))}
            </div>
            <button 
              id="btn-view-history"
              aria-label="View full activity history"
              className="p-3 text-[10px] font-bold text-primary uppercase tracking-widest border-t border-border-color hover:bg-bgLight transition-all"
            >
              View Full History
            </button>
          </div>
        </div>

        {/* Bottom Trend Analysis */}
        <div className="bg-surface border border-border-color rounded-md h-[180px] shrink-0 p-5 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-muted uppercase tracking-wider">Health Trend (24h)</h3>
            <div className="flex gap-4 text-[10px] font-bold uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                <span className="text-text-main">Efficiency</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-muted"></span>
                <span className="text-muted">Load Avg</span>
              </div>
            </div>
          </div>
          <div className="flex-1 flex items-end justify-between gap-1 mt-2">
            {[40, 45, 42, 38, 35, 30, 32, 40, 55, 65, 80, 85, 90, 88, 85, 82, 80, 78, 75, 70, 65, 60, 55, 50].map((h, i) => (
              <div key={i} className="flex-1 group relative">
                <div 
                  className="w-full bg-primary/20 group-hover:bg-primary transition-all rounded-t-sm" 
                  style={{ height: `${h}%` }}
                ></div>
                {i % 4 === 0 && (
                  <span className="absolute -bottom-5 left-0 text-[8px] text-muted font-bold">{i}:00</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
