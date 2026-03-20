import { PortfolioMaster } from '../types';
import { useState, useRef } from 'react';
import { useGSAP } from '../hooks/useGSAP';
import gsap from 'gsap';
import { 
  LayoutGrid, 
  Clock, 
  Package, 
  Map, 
  FolderPlus, 
  Filter, 
  CloudUpload, 
  Image as ImageIcon, 
  Video, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  Download,
  Database
} from 'lucide-react';

interface Screen3Props {
  selectedProject: PortfolioMaster | null;
}

export default function Screen3({ selectedProject }: Screen3Props) {
  const [activeFolder, setActiveFolder] = useState('All Assets');
  const containerRef = useRef(null);

  // Antigravity GSAP Stagger
  useGSAP(() => {
    if (selectedProject) {
      const tl = gsap.timeline();
      tl.fromTo(".asset-card", 
        { y: 30, opacity: 0, scale: 0.9, rotateY: 15 }, 
        { y: 0, opacity: 1, scale: 1, rotateY: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out' }
      );
    }
  }, [selectedProject, activeFolder]);

  if (!selectedProject) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-bgLight/30 backdrop-blur-sm p-12 text-center bg-noise">
        <div className="size-24 rounded-full bg-muted/5 flex items-center justify-center mb-6 border border-white/5 shadow-inner animate-pulse">
          <Database className="size-10 text-muted/30" />
        </div>
        <h3 className="text-2xl font-black text-textMain tracking-tighter opacity-80">Media Vault Locked</h3>
        <p className="text-muted max-w-sm mx-auto text-sm italic opacity-50 mt-2">Authentication with a project stream is required to access encrypted site media and records.</p>
      </div>
    );
  }

  const folders = [
    { name: 'All Assets', icon: <LayoutGrid className="size-4" />, count: 124 },
    { name: 'Recent Week', icon: <Clock className="size-4" />, count: 12 },
    { name: 'Equipment', icon: <Package className="size-4" />, count: 45 },
    { name: 'Site Progress', icon: <Map className="size-4" />, count: 67 },
  ];

  const assets = [
    { id: 1, type: 'image', status: 'verified', date: '2024-03-15', label: 'IMG_4829.jpg' },
    { id: 2, type: 'video', status: 'verified', date: '2024-03-14', label: 'DRONE_SURVEY_01.mp4' },
    { id: 3, type: 'image', status: 'pending', date: '2024-03-14', label: 'IMG_4828.jpg' },
    { id: 4, type: 'image', status: 'verified', date: '2024-03-13', label: 'IMG_4827.jpg' },
    { id: 5, type: 'image', status: 'verified', date: '2024-03-13', label: 'IMG_4826.jpg' },
    { id: 6, type: 'image', status: 'pending', date: '2024-03-12', label: 'IMG_4825.jpg' },
    { id: 7, type: 'image', status: 'verified', date: '2024-03-12', label: 'IMG_4824.jpg' },
    { id: 8, type: 'image', status: 'verified', date: '2024-03-11', label: 'IMG_4823.jpg' },
    { id: 9, type: 'image', status: 'verified', date: '2024-03-10', label: 'IMG_4822.jpg' },
    { id: 10, type: 'video', status: 'verified', date: '2024-03-09', label: 'SITE_TIME_LAPSE.mp4' },
    { id: 11, type: 'image', status: 'verified', date: '2024-03-08', label: 'IMG_4821.jpg' },
    { id: 12, type: 'image', status: 'verified', date: '2024-03-08', label: 'IMG_4820.jpg' },
  ];

  return (
    <div ref={containerRef} className="flex-1 flex flex-col md:flex-row h-full overflow-hidden relative">
      <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none" />
      
      {/* Media Sidebar (30%) - Glassmorphic Navigation */}
      <aside className="w-full md:w-[320px] bg-surface/40 backdrop-blur-2xl border-r border-white/5 flex flex-col h-full z-10">
        <div className="p-8">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-sm font-black text-textMain uppercase tracking-[0.3em]">Project Vault</h3>
            <button className="p-2 rounded-xl bg-white/5 border border-white/5 text-muted hover:text-primary transition-all">
              <FolderPlus className="size-4" />
            </button>
          </div>
          
          <nav className="space-y-2">
            {folders.map(folder => (
              <button
                key={folder.name}
                onClick={() => setActiveFolder(folder.name)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-500 group relative overflow-hidden ${activeFolder === folder.name ? 'bg-primary/10 text-primary shadow-inner' : 'text-muted hover:text-textMain hover:bg-white/5'}`}
              >
                {activeFolder === folder.name && <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-primary rounded-full" />}
                <div className="flex items-center gap-4">
                  <span className={`transition-transform duration-500 ${activeFolder === folder.name ? 'scale-110' : 'group-hover:scale-110'}`}>{folder.icon}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest">{folder.name}</span>
                </div>
                <span className={`text-[9px] font-black px-2.5 py-1 rounded-full transition-all duration-500 ${activeFolder === folder.name ? 'bg-primary text-white shadow-lg' : 'bg-white/5 text-muted group-hover:bg-white/10'}`}>
                  {folder.count}
                </span>
              </button>
            ))}
          </nav>

          <div className="mt-20 pt-10 border-t border-white/5">
            <h4 className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-6 opacity-40">Network Storage</h4>
            <div className="space-y-5">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black text-muted uppercase tracking-widest">Efficiency</span>
                <span className="text-xl font-black text-textMain tabular-nums">12.4<span className="text-xs opacity-30 ml-1">GB</span></span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden shadow-inner">
                <div className="bg-gradient-to-r from-primary/40 to-primary h-full rounded-full shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]" style={{ width: '12.4%' }} />
              </div>
              <p className="text-[8px] font-bold text-muted/30 italic uppercase">Uplink active • 87.6GB available</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area (Gallery) */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-bgLight/20 relative">
        {/* Gallery Header - Floating blur */}
        <div className="p-8 border-b border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6 z-20 bg-surface/20 backdrop-blur-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="size-2 rounded-full bg-primary animate-pulse" />
              <h1 className="text-2xl font-black text-textMain tracking-tighter">{activeFolder}</h1>
            </div>
            <p className="text-[10px] font-black text-muted uppercase tracking-widest opacity-50">
              {selectedProject.projeto} • <span className="text-primary">{assets.length}</span> Objects localized
            </p>
          </div>
          
          <div className="flex gap-4">
            <button className="flex items-center gap-3 glass-card bg-white/5 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all border-white/5">
              <Filter className="size-3.5" />
              Categorize
            </button>
            <button className="flex items-center gap-3 bg-primary text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:shadow-[0_12px_24px_rgba(var(--primary-rgb),0.3)] hover:-translate-y-1 transition-all duration-500 shadow-xl shadow-primary/10">
              <CloudUpload className="size-3.5" />
              Inject Media
            </button>
          </div>
        </div>

        {/* Gallery Grid - Responsive & Weighted */}
        <div className="flex-1 overflow-y-auto p-10 scrollbar-hide perspective-1000">
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {assets.map(asset => (
              <div key={asset.id} className="asset-card group relative">
                <div className="glass-card rounded-[2rem] p-4 border-white/5 bg-white/[0.03] group-hover:bg-white/[0.08] transition-all duration-700 shadow-2xl flex flex-col overflow-hidden h-[340px]">
                  <div className="flex-1 bg-black/10 rounded-[1.5rem] relative overflow-hidden flex items-center justify-center mb-4 inner-shadow group/img">
                    {/* Visual Placeholder with spatial depth */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-40" />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      {asset.type === 'image' ? (
                        <ImageIcon className="size-16 text-muted/10 group-hover/img:scale-125 transition-transform duration-1000 group-hover/img:text-primary/20" />
                      ) : (
                        <Video className="size-16 text-muted/10 group-hover/img:scale-125 transition-transform duration-1000 group-hover/img:text-primary/20" />
                      )}
                    </div>
                    
                    {/* Status Badge Overlay */}
                    <div className="absolute top-4 right-4 z-10">
                      <div className={`p-2 rounded-xl backdrop-blur-md border border-white/10 shadow-lg ${asset.status === 'verified' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'}`}>
                        {asset.status === 'verified' ? <CheckCircle2 className="size-3.5" /> : <AlertCircle className="size-3.5" />}
                      </div>
                    </div>

                    {/* Interaction Overlay - Weighted Depth */}
                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover/img:opacity-100 transition-all duration-700 backdrop-blur-sm flex items-center justify-center gap-6 translate-y-4 group-hover/img:translate-y-0">
                      <button className="size-12 rounded-2xl bg-white text-primary flex items-center justify-center shadow-2xl hover:scale-110 transition-transform hover:bg-primary hover:text-white duration-500">
                        <Eye className="size-5" />
                      </button>
                      <button className="size-12 rounded-2xl bg-white text-primary flex items-center justify-center shadow-2xl hover:scale-110 transition-transform hover:bg-primary hover:text-white duration-500">
                        <Download className="size-5" />
                      </button>
                    </div>
                  </div>

                  <div className="px-3 pb-2 flex justify-between items-center">
                    <div className="max-w-[70%]">
                      <p className="text-[10px] font-black text-textMain truncate tracking-tight">{asset.label}</p>
                      <p className="text-[8px] font-black text-muted uppercase tracking-[0.2em] opacity-40">{asset.date}</p>
                    </div>
                    <div className="p-1 px-2 rounded-lg bg-white/5 border border-white/5">
                      <span className="text-[8px] font-black text-muted uppercase tracking-widest">{asset.type}</span>
                    </div>
                  </div>
                  
                  {/* Subtle progress indicator for "uploads" or "verification" */}
                  <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent w-full opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
          
          {/* Final Row Spatial Tip */}
          <div className="mt-20 text-center opacity-20 hover:opacity-40 transition-opacity duration-1000">
            <p className="text-[10px] font-black uppercase tracking-[1em] mb-4">Historical Archive Terminus</p>
            <div className="h-20 w-px bg-gradient-to-b from-muted to-transparent mx-auto" />
          </div>
        </div>
      </main>
    </div>
  );
}
