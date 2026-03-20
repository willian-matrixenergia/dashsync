import { PortfolioMaster } from '../types';
import { useState, useRef } from 'react';
import { useGSAP } from '../hooks/useGSAP';
import gsap from 'gsap';
import { BarChart3, PieChart, Activity, Zap, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface Screen2Props {
  selectedProject: PortfolioMaster | null;
}

export default function Screen2({ selectedProject }: Screen2Props) {
  const containerRef = useRef(null);

  useGSAP(() => {
    if (selectedProject) {
      const tl = gsap.timeline();
      tl.fromTo('.analysis-card',
        { y: 40, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.15, ease: 'power4.out' }
      )
      .fromTo('.speedometer',
        { rotateX: -45, opacity: 0, scale: 0.8 },
        { rotateX: 0, opacity: 1, scale: 1, duration: 1, stagger: 0.1, ease: 'back.out(1.7)' },
        '-=0.4'
      );
    }
  }, [selectedProject]);

  if (!selectedProject) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-bgLight/30 backdrop-blur-sm p-12 text-center bg-noise">
        <div className="size-24 rounded-full bg-muted/5 flex items-center justify-center mb-6 border border-white/5 shadow-inner animate-pulse">
          <Activity className="size-10 text-muted/30" />
        </div>
        <h3 className="text-2xl font-black text-textMain tracking-tighter opacity-80">Telemetria Necessária</h3>
        <p className="text-muted max-w-sm mx-auto text-sm italic opacity-50 mt-2">
          Selecione um projeto no painel principal para visualizar os dados de execução.
        </p>
      </div>
    );
  }

  const progress = selectedProject.avanco_fisico_real || 0;

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto p-10 relative scrollbar-hide">
      <div className="max-w-[1500px] mx-auto space-y-12 pb-24">

        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] font-bold uppercase tracking-widest hover:bg-primary/10">
                Análise Ativa
              </Badge>
              <span className="text-muted text-[10px] font-bold uppercase tracking-widest opacity-40">
                ID do Fluxo: {selectedProject.id?.slice(0, 8)}
              </span>
            </div>
            <h1 className="text-4xl font-black text-textMain tracking-tighter leading-none">Visão Analítica</h1>
            <p className="text-muted text-sm font-medium opacity-60">
              Projeto: <span className="text-textMain font-bold">{selectedProject.projeto}</span> •{' '}
              Fase: <span className="text-primary font-bold uppercase">{selectedProject.fase || 'Execução'}</span>
            </p>
          </div>

          {/* Sub-Abas */}
          <Tabs defaultValue="weekly" className="w-auto">
            <TabsList className="glass-card p-1.5 rounded-2xl border-white/5 shadow-xl bg-surface/30 h-auto gap-1">
              <TabsTrigger
                value="weekly"
                className="flex items-center gap-2 px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-[0_8px_16px_rgba(255,74,0,0.3)] transition-all duration-500 text-muted"
              >
                <BarChart3 className="size-3.5" />
                Delta Semanal
              </TabsTrigger>
              <TabsTrigger
                value="milestone"
                className="flex items-center gap-2 px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-[0_8px_16px_rgba(255,74,0,0.3)] transition-all duration-500 text-muted"
              >
                <PieChart className="size-3.5" />
                Mapa de Marcos
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Grade de Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Curva-S */}
          <Card className="analysis-card glass-card rounded-[2.5rem] border-white/5 shadow-2xl group hover:border-primary/20 transition-all duration-1000 p-0">
            <CardHeader className="p-10 pb-0">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl font-black text-textMain tracking-tighter">Projeção Curva-S</CardTitle>
                  <CardDescription className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] opacity-40 mt-1">
                    Índice de desempenho acumulado
                  </CardDescription>
                </div>
                <div className="flex gap-4 p-2 rounded-xl bg-white/5 border border-white/5">
                  <LegendItem color="bg-muted" label="Planejado" />
                  <LegendItem color="bg-primary" label="Realizado" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-10 pt-4 flex flex-col" style={{ minHeight: '400px' }}>
              <div className="flex-1 relative mt-4">
                <svg viewBox="0 0 500 200" className="w-full h-full drop-shadow-2xl">
                  <defs>
                    <linearGradient id="curveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="rgba(255,74,0,0.2)" />
                      <stop offset="100%" stopColor="#FF4A00" />
                    </linearGradient>
                  </defs>
                  <path d="M0,180 Q100,160 200,100 T500,20" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" strokeDasharray="8,8" />
                  <path
                    d={`M0,180 Q100,170 200,130 T${(progress / 100) * 500},${180 - (progress / 100) * 160}`}
                    fill="none"
                    stroke="url(#curveGradient)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                  <circle cx={(progress / 100) * 500} cy={180 - (progress / 100) * 160} r="8" fill="#FF4A00" className="animate-pulse" />
                </svg>
              </div>
              <Separator className="my-8 bg-white/5" />
              <div className="flex justify-between px-4">
                <StatItem label="Variação de Fase" value="-4,2%" color="text-error" sub="Atraso detectado" />
                <StatItem label="Conclusão Prev." value="OUT 26" color="text-textMain" sub="Desvio: +12d" />
                <StatItem label="Desempenho" value="Estável" color="text-success" sub="CPI: 0,98" />
              </div>
            </CardContent>
          </Card>

          {/* Histograma MOD */}
          <Card className="analysis-card glass-card rounded-[2.5rem] border-white/5 shadow-2xl group hover:border-primary/20 transition-all duration-1000 p-0">
            <CardHeader className="p-10 pb-0">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl font-black text-textMain tracking-tighter">Intensidade de Recursos</CardTitle>
                  <CardDescription className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] opacity-40 mt-1">
                    Alocação de mão de obra direta (MOD)
                  </CardDescription>
                </div>
                <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                  <Zap className="size-4 text-primary animate-pulse" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-10 pt-4 flex flex-col" style={{ minHeight: '400px' }}>
              <div className="flex-1 flex items-end gap-3 px-2 mt-4">
                {[45, 60, 85, 95, 120, 110, 90, 75, 60, 40, 55, 70].map((val, i) => (
                  <div key={i} className="flex-1 relative group/bar h-full flex items-end">
                    <div
                      className="w-full bg-white/[0.03] group-hover/bar:bg-primary/5 transition-all duration-500 rounded-t-xl overflow-hidden relative"
                      style={{ height: `${val}%` }}
                    >
                      <div
                        className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-primary/10 to-primary/40 rounded-t-xl group-hover/bar:from-primary/20 group-hover/bar:to-primary transition-all duration-700"
                        style={{ height: '70%' }}
                      />
                      <div className="absolute top-2 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-opacity duration-300">
                        <span className="text-[8px] font-bold text-white">{val}h</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-8 text-[9px] font-bold text-muted uppercase tracking-[0.3em] opacity-30 px-2">
                <span>SEM 24</span><span>SEM 28</span><span>SEM 32</span><span>SEM 36</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Velocímetros por Disciplina */}
        <Card className="glass-card rounded-[3rem] border-white/5 shadow-inner bg-white/[0.02] p-0">
          <CardContent className="p-12">
            <div className="flex items-center gap-3 mb-12">
              <span className="text-[10px] font-bold text-muted uppercase tracking-[0.4em]">
                Sincronização por Disciplina
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
              {[
                { label: 'Engenharia', val: 95 },
                { label: 'Suprimentos', val: 82 },
                { label: 'Construção', val: Number((selectedProject.avanco_fisico_real || 0).toFixed(0)) },
                { label: 'Comissionamento', val: 15 },
              ].map((d) => (
                <div key={d.label} className="speedometer flex flex-col items-center gap-6 group">
                  <div className="relative w-48 h-24 overflow-hidden group-hover:-translate-y-2 transition-transform duration-700">
                    <svg viewBox="0 0 100 50" className="w-full h-full drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)]">
                      <path d="M10 50 A 40 40 0 0 1 90 50" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="10" strokeLinecap="round" />
                      <path
                        d="M10 50 A 40 40 0 0 1 90 50"
                        fill="none"
                        stroke="#FF4A00"
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={`${(Number(d.val) / 100) * 125} 125`}
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute bottom-0 left-0 w-full text-center">
                      <span className="text-4xl font-black text-textMain tracking-tighter tabular-nums">
                        {d.val}<span className="text-sm opacity-30 ml-1">%</span>
                      </span>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="px-4 py-1.5 bg-white/5 border-white/5 group-hover:bg-primary/5 group-hover:text-primary group-hover:border-primary/20 transition-colors duration-500 text-[9px] font-bold text-muted uppercase tracking-[0.2em]"
                  >
                    {d.label}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Estatísticas Narrativas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="glass-card rounded-3xl border-white/5 group hover:scale-[1.02] transition-all duration-700 p-0">
            <CardContent className="p-8">
              <h3 className="text-[10px] font-bold text-muted uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                <Info className="size-3" /> Relatório de Incidentes
              </h3>
              <div className="space-y-5">
                {[
                  { label: 'Acidentes com Afastamento', val: '00', color: 'text-success' },
                  { label: 'Quase-Acidentes Leves', val: '02', color: 'text-warning' },
                  { label: 'Inspeções de Segurança', val: '48', color: 'text-primary' },
                ].map((stat) => (
                  <div key={stat.label} className="flex justify-between items-center group/stat">
                    <span className="text-xs font-bold text-muted group-hover/stat:text-textMain transition-colors">{stat.label}</span>
                    <span className={cn("text-xl font-black font-mono group-hover/stat:scale-110 transition-transform", stat.color)}>
                      {stat.val}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 glass-card rounded-3xl border-white/5 p-0 overflow-hidden group">
            <CardContent className="p-8 h-full flex items-center justify-center relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <div className="text-center space-y-4 relative z-10">
                <h3 className="text-[10px] font-bold text-muted uppercase tracking-[0.4em] mb-2 opacity-40">
                  Visualização Tática
                </h3>
                <p className="text-xl font-black text-textMain tracking-tighter opacity-20 italic">
                  Dados geoespaciais sendo integrados ao módulo de mapeamento regional...
                </p>
                <div className="flex gap-2 justify-center">
                  <div className="size-1.5 rounded-full bg-primary animate-bounce" />
                  <div className="size-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.2s]" />
                  <div className="size-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2 px-2">
      <div className={cn("size-2 rounded-full", color)} />
      <span className="text-[9px] font-bold text-muted uppercase tracking-widest">{label}</span>
    </div>
  );
}

function StatItem({ label, value, color, sub }: { label: string; value: string; color: string; sub: string }) {
  return (
    <div className="flex flex-col gap-1 group/item">
      <span className="text-[9px] font-bold text-muted uppercase tracking-[0.2em] opacity-40 group-hover/item:opacity-100 transition-opacity">{label}</span>
      <span className={cn("text-xl font-black tracking-tighter drop-shadow-lg", color)}>{value}</span>
      <span className="text-[8px] font-bold text-muted/30 italic uppercase">{sub}</span>
    </div>
  );
}
