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
  Database,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface Screen3Props {
  selectedProject: PortfolioMaster | null;
}

const FOLDERS = [
  { name: 'Todos os Arquivos', icon: LayoutGrid, count: 124 },
  { name: 'Última Semana', icon: Clock, count: 12 },
  { name: 'Equipamentos', icon: Package, count: 45 },
  { name: 'Progresso do Canteiro', icon: Map, count: 67 },
] as const;

const ASSETS = [
  { id: 1, type: 'imagem', status: 'verificado', date: '15/03/2024', label: 'IMG_4829.jpg' },
  { id: 2, type: 'vídeo', status: 'verificado', date: '14/03/2024', label: 'DRONE_SURVEY_01.mp4' },
  { id: 3, type: 'imagem', status: 'pendente', date: '14/03/2024', label: 'IMG_4828.jpg' },
  { id: 4, type: 'imagem', status: 'verificado', date: '13/03/2024', label: 'IMG_4827.jpg' },
  { id: 5, type: 'imagem', status: 'verificado', date: '13/03/2024', label: 'IMG_4826.jpg' },
  { id: 6, type: 'imagem', status: 'pendente', date: '12/03/2024', label: 'IMG_4825.jpg' },
  { id: 7, type: 'imagem', status: 'verificado', date: '12/03/2024', label: 'IMG_4824.jpg' },
  { id: 8, type: 'imagem', status: 'verificado', date: '11/03/2024', label: 'IMG_4823.jpg' },
  { id: 9, type: 'imagem', status: 'verificado', date: '10/03/2024', label: 'IMG_4822.jpg' },
  { id: 10, type: 'vídeo', status: 'verificado', date: '09/03/2024', label: 'SITE_TIME_LAPSE.mp4' },
  { id: 11, type: 'imagem', status: 'verificado', date: '08/03/2024', label: 'IMG_4821.jpg' },
  { id: 12, type: 'imagem', status: 'verificado', date: '08/03/2024', label: 'IMG_4820.jpg' },
];

export default function Screen3({ selectedProject }: Screen3Props) {
  const [activeFolder, setActiveFolder] = useState('Todos os Arquivos');
  const containerRef = useRef(null);

  useGSAP(() => {
    if (selectedProject) {
      const tl = gsap.timeline();
      tl.fromTo('.asset-card',
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
        <h3 className="text-2xl font-black text-textMain tracking-tighter opacity-80">Arquivo de Mídia Bloqueado</h3>
        <p className="text-muted max-w-sm mx-auto text-sm italic opacity-50 mt-2">
          Selecione um projeto para acessar as mídias e registros do canteiro.
        </p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex-1 flex flex-col md:flex-row h-full overflow-hidden relative">
      <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none" />

      {/* Sidebar (30%) */}
      <aside className="w-full md:w-[320px] bg-surface/40 backdrop-blur-2xl border-r border-white/5 flex flex-col h-full z-10">
        <div className="p-8 flex flex-col h-full">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-sm font-bold text-textMain uppercase tracking-[0.3em]">Arquivo do Projeto</h3>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-xl bg-white/5 border border-white/5 text-muted hover:text-primary hover:bg-white/10"
              aria-label="Nova pasta"
            >
              <FolderPlus className="size-4" />
            </Button>
          </div>

          <nav className="space-y-2">
            {FOLDERS.map((folder) => {
              const Icon = folder.icon;
              const isActive = activeFolder === folder.name;
              return (
                <button
                  key={folder.name}
                  onClick={() => setActiveFolder(folder.name)}
                  className={cn(
                    "w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-500 group relative overflow-hidden",
                    isActive ? "bg-primary/10 text-primary shadow-inner" : "text-muted hover:text-textMain hover:bg-white/5"
                  )}
                >
                  {isActive && <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-primary rounded-full" />}
                  <div className="flex items-center gap-4">
                    <Icon className={cn("size-4 transition-transform duration-500", isActive ? "scale-110" : "group-hover:scale-110")} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">{folder.name}</span>
                  </div>
                  <Badge
                    variant={isActive ? "default" : "secondary"}
                    className={cn(
                      "text-[9px] font-bold transition-all duration-500",
                      isActive ? "bg-primary text-white shadow-lg" : "bg-white/5 text-muted group-hover:bg-white/10"
                    )}
                  >
                    {folder.count}
                  </Badge>
                </button>
              );
            })}
          </nav>

          <div className="mt-auto pt-10">
            <Separator className="mb-6 bg-white/5" />
            <h4 className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-6 opacity-40">Armazenamento</h4>
            <div className="space-y-5">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Utilizado</span>
                <span className="text-xl font-black text-textMain tabular-nums">
                  12,4<span className="text-xs opacity-30 ml-1">GB</span>
                </span>
              </div>
              <Progress
                value={12.4}
                className="h-1.5 bg-white/5 [&>div]:bg-gradient-to-r [&>div]:from-primary/40 [&>div]:to-primary [&>div]:shadow-[0_0_10px_rgba(255,74,0,0.5)]"
              />
              <p className="text-[8px] font-bold text-muted/30 italic uppercase">
                Conexão ativa • 87,6GB disponíveis
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-bgLight/20 relative">
        {/* Cabeçalho da Galeria */}
        <div className="p-8 border-b border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6 z-20 bg-surface/20 backdrop-blur-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="size-2 rounded-full bg-primary animate-pulse" />
              <h1 className="text-2xl font-black text-textMain tracking-tighter">{activeFolder}</h1>
            </div>
            <p className="text-[10px] font-bold text-muted uppercase tracking-widest opacity-50">
              {selectedProject.projeto} •{' '}
              <span className="text-primary">{ASSETS.length}</span> objetos localizados
            </p>
          </div>

          <div className="flex gap-4">
            <Button
              variant="outline"
              className="flex items-center gap-3 glass-card bg-white/5 px-6 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all border-white/10 h-auto"
            >
              <Filter className="size-3.5" />
              Categorizar
            </Button>
            <Button className="flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-primary/10 hover:shadow-[0_12px_24px_rgba(255,74,0,0.3)] hover:-translate-y-1 transition-all duration-500 h-auto bg-primary text-white hover:bg-primary/90">
              <CloudUpload className="size-3.5" />
              Enviar Mídia
            </Button>
          </div>
        </div>

        {/* Grade de Ativos */}
        <ScrollArea className="flex-1">
          <div className="p-10">
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {ASSETS.map((asset) => (
                <div key={asset.id} className="asset-card group relative">
                  <div className="glass-card rounded-[2rem] p-4 border-white/5 bg-white/[0.03] group-hover:bg-white/[0.08] transition-all duration-700 shadow-2xl flex flex-col overflow-hidden h-[340px]">
                    <div className="flex-1 bg-black/10 rounded-[1.5rem] relative overflow-hidden flex items-center justify-center mb-4 group/img">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-40" />
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        {asset.type === 'imagem' ? (
                          <ImageIcon className="size-16 text-muted/10 group-hover/img:scale-125 transition-transform duration-1000 group-hover/img:text-primary/20" />
                        ) : (
                          <Video className="size-16 text-muted/10 group-hover/img:scale-125 transition-transform duration-1000 group-hover/img:text-primary/20" />
                        )}
                      </div>

                      {/* Badge de Status */}
                      <div className="absolute top-4 right-4 z-10">
                        <Badge
                          variant={asset.status === 'verificado' ? 'default' : 'secondary'}
                          className={cn(
                            "p-2 backdrop-blur-md border border-white/10 shadow-lg text-[9px] font-bold",
                            asset.status === 'verificado'
                              ? "bg-success/20 text-success border-success/20 hover:bg-success/20"
                              : "bg-warning/20 text-warning border-warning/20 hover:bg-warning/20"
                          )}
                        >
                          {asset.status === 'verificado'
                            ? <CheckCircle2 className="size-3.5" />
                            : <AlertCircle className="size-3.5" />
                          }
                        </Badge>
                      </div>

                      {/* Overlay de interação */}
                      <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover/img:opacity-100 transition-all duration-700 backdrop-blur-sm flex items-center justify-center gap-6 translate-y-4 group-hover/img:translate-y-0">
                        <Button
                          size="icon"
                          className="size-12 rounded-2xl bg-white text-primary shadow-2xl hover:scale-110 transition-transform hover:bg-primary hover:text-white duration-500"
                          aria-label="Visualizar"
                        >
                          <Eye className="size-5" />
                        </Button>
                        <Button
                          size="icon"
                          className="size-12 rounded-2xl bg-white text-primary shadow-2xl hover:scale-110 transition-transform hover:bg-primary hover:text-white duration-500"
                          aria-label="Baixar"
                        >
                          <Download className="size-5" />
                        </Button>
                      </div>
                    </div>

                    <div className="px-3 pb-2 flex justify-between items-center">
                      <div className="max-w-[70%]">
                        <p className="text-[10px] font-bold text-textMain truncate tracking-tight">{asset.label}</p>
                        <p className="text-[8px] font-bold text-muted uppercase tracking-[0.2em] opacity-40">{asset.date}</p>
                      </div>
                      <Badge variant="outline" className="text-[8px] font-bold text-muted uppercase tracking-widest bg-white/5 border-white/5">
                        {asset.type}
                      </Badge>
                    </div>

                    <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent w-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-20 text-center opacity-20 hover:opacity-40 transition-opacity duration-1000">
              <p className="text-[10px] font-bold uppercase tracking-[1em] mb-4">Fim do Arquivo Histórico</p>
              <div className="h-20 w-px bg-gradient-to-b from-muted to-transparent mx-auto" />
            </div>
          </div>
        </ScrollArea>
      </main>
    </div>
  );
}
