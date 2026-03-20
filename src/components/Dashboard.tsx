import React, { useState, useMemo, useRef } from 'react';
import { PortfolioMaster } from '../types';
import { Search, SlidersHorizontal, ArrowUpRight, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useGSAP } from '../hooks/useGSAP';
import gsap from 'gsap';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface DashboardProps {
  projects: PortfolioMaster[];
  selectedProject: PortfolioMaster | null;
  onSelectProject: (project: PortfolioMaster) => void;
}

export default function Dashboard({ projects, selectedProject, onSelectProject }: DashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<{ criticality: string[]; program: string[] }>({
    criticality: [],
    program: [],
  });

  const kpiContainerRef = useRef(null);
  const tableRef = useRef(null);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchSearch = (p.projeto || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchCrit = filters.criticality.length === 0 || filters.criticality.includes(p.criticidade_risco || '');
      const matchProg = filters.program.length === 0 || filters.program.includes(p.programa || '');
      return matchSearch && matchCrit && matchProg;
    });
  }, [projects, searchTerm, filters]);

  useGSAP(() => {
    if (filteredProjects.length > 0) {
      const tl = gsap.timeline();
      tl.fromTo('.kpi-card',
        { y: 50, opacity: 0, scale: 0.9, rotateX: -10 },
        { y: 0, opacity: 1, scale: 1, rotateX: 0, duration: 0.8, stagger: 0.1, ease: 'power4.out' }
      )
      .fromTo('.project-row',
        { x: -30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, stagger: 0.04, ease: 'power2.out' },
        '-=0.5'
      );
    }
  }, [filteredProjects]);

  return (
    <div className="flex-1 overflow-y-auto p-8 relative scrollbar-hide">
      <div className="max-w-[1500px] mx-auto space-y-10 pb-20">

        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-textMain tracking-tighter leading-none">Central de Controle</h1>
            <p className="text-muted text-sm font-medium opacity-60 flex items-center gap-2">
              <span className="size-2 rounded-full bg-success animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
              Monitoramento em Tempo Real • {projects.length} Nós Ativos
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group w-80">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition duration-500" />
              <div className="relative flex items-center">
                <Search className="absolute left-4 size-4 text-muted group-focus-within:text-primary transition-colors z-10" />
                <Input
                  placeholder="Buscar por ID ou Nome..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 bg-surface/30 backdrop-blur-sm border-white/10 rounded-xl text-sm focus-visible:border-primary/30 text-textMain shadow-inner"
                />
              </div>
            </div>
            <Button
              variant="outline"
              className="flex items-center gap-2 glass-card rounded-xl text-xs font-bold uppercase tracking-[0.2em] hover:text-primary transition-all border-white/10 bg-transparent hover:bg-white/5 group h-10"
            >
              <SlidersHorizontal className="size-4 group-hover:rotate-180 transition-transform duration-700" />
              Filtrar
            </Button>
          </div>
        </div>

        {/* KPIs */}
        <div ref={kpiContainerRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <KPICard
            title="Ativos Operacionais"
            value={projects.length.toString()}
            trend="+2.4"
            icon={<ArrowUpRight className="size-6" />}
            color="primary"
            className="kpi-card floating"
          />
          <KPICard
            title="Eficiência do Sistema"
            value="98.2"
            trend="+0.8"
            suffix="%"
            icon={<Clock className="size-6" />}
            color="warning"
            className="kpi-card floating"
            style={{ animationDelay: '0.2s' }}
          />
          <KPICard
            title="Energia Entregue"
            value="1.4M"
            trend="+12"
            suffix="GWh"
            icon={<CheckCircle2 className="size-6" />}
            color="success"
            className="kpi-card floating"
            style={{ animationDelay: '0.4s' }}
          />
          <KPICard
            title="Nível de Alertas"
            value="03"
            trend="-1"
            icon={<AlertCircle className="size-6" />}
            color="error"
            className="kpi-card floating"
            style={{ animationDelay: '0.6s' }}
          />
        </div>

        {/* Tabela de Projetos */}
        <Card className="glass-card rounded-3xl overflow-hidden border-white/5 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] bg-surface/50">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table ref={tableRef} className="min-w-[1000px]">
                <TableHeader>
                  <TableRow className="bg-white/[0.03] border-b border-white/5 hover:bg-white/[0.03]">
                    <TableHead className="px-8 py-5 text-[11px] font-bold text-muted uppercase tracking-[0.3em] pl-12 italic">ID / Nome</TableHead>
                    <TableHead className="px-8 py-5 text-[11px] font-bold text-muted uppercase tracking-[0.3em]">Programa</TableHead>
                    <TableHead className="px-8 py-5 text-[11px] font-bold text-muted uppercase tracking-[0.3em] text-center">Segurança</TableHead>
                    <TableHead className="px-8 py-5 text-[11px] font-bold text-muted uppercase tracking-[0.3em]">Status</TableHead>
                    <TableHead className="px-8 py-5 text-[11px] font-bold text-muted uppercase tracking-[0.3em]">Criticidade</TableHead>
                    <TableHead className="px-8 py-5 text-[11px] font-bold text-muted uppercase tracking-[0.3em] text-right pr-12">Detalhe</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-white/[0.03]">
                  {filteredProjects.map((project) => (
                    <TableRow
                      key={project.id}
                      onClick={() => onSelectProject(project)}
                      className={cn(
                        "project-row cursor-pointer transition-all duration-500 hover:bg-white/[0.04] border-none",
                        selectedProject?.id === project.id ? "bg-primary/5" : ""
                      )}
                    >
                      <TableCell className="px-8 py-6 pl-12 relative overflow-hidden">
                        {selectedProject?.id === project.id && (
                          <div className="absolute left-0 top-0 w-1.5 h-full bg-primary shadow-[4px_0_12px_rgba(255,74,0,0.5)]" />
                        )}
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-textMain group-hover:text-primary transition-all duration-500 transform group-hover:translate-x-1">
                            {project.projeto}
                          </span>
                          <span className="text-[10px] text-muted opacity-40 uppercase tracking-[0.15em] font-medium">
                            {project.localidade || 'BRASIL'}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="px-8 py-6">
                        <Badge variant="outline" className="text-[9px] font-bold bg-muted/5 text-muted uppercase tracking-widest border-white/10 hover:border-primary/20 transition-all">
                          {project.programa || 'CORE'}
                        </Badge>
                      </TableCell>

                      <TableCell className="px-8 py-6">
                        <div className="flex flex-col items-center gap-1.5 grayscale group-hover:grayscale-0 transition-all duration-700 opacity-60 group-hover:opacity-100">
                          <span className="text-xs font-bold font-mono text-success tabular-nums">100%</span>
                          <Progress value={100} className="w-14 h-1 bg-success/10 [&>div]:bg-success [&>div]:shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                        </div>
                      </TableCell>

                      <TableCell className="px-8 py-6">
                        <div className="w-full max-w-[150px] space-y-2">
                          <div className="flex justify-between text-[9px] font-bold text-muted tabular-nums uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-opacity">
                            <span>Físico</span>
                            <span className="text-textMain">{project.avanco_fisico_real || 0}%</span>
                          </div>
                          <Progress
                            value={project.avanco_fisico_real || 0}
                            className="h-1.5 bg-white/[0.03] [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-accent [&>div]:shadow-[0_0_10px_rgba(255,74,0,0.3)]"
                          />
                        </div>
                      </TableCell>

                      <TableCell className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "size-2.5 rounded-full ring-4 ring-bgDark transition-all duration-500",
                            project.criticidade_risco === 'Alta'
                              ? "bg-error shadow-[0_0_12px_rgba(239,64,64,0.6)] animate-pulse"
                              : "bg-success shadow-[0_0_12px_rgba(34,197,94,0.6)]"
                          )} />
                          <span className="text-[10px] font-bold text-textMain uppercase tracking-widest opacity-80 group-hover:opacity-100">
                            {project.criticidade_risco || 'Regular'}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="px-8 py-6 text-right pr-12">
                        <Button
                          variant="outline"
                          size="icon"
                          className="size-10 glass-card rounded-xl hover:text-primary hover:border-primary/30 active:scale-90 transition-all duration-500 border-white/10 bg-transparent hover:bg-white/5"
                        >
                          <ArrowUpRight className="size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Estado Vazio */}
            {filteredProjects.length === 0 && (
              <div className="p-32 text-center flex flex-col items-center gap-8">
                <div className="size-24 rounded-full flex items-center justify-center text-muted/20 border-2 border-dashed border-white/5 animate-[spin_10s_linear_infinite]">
                  <Search className="size-10" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-black text-textMain tracking-tighter opacity-80">Nenhum Ativo Encontrado</h3>
                  <p className="text-muted max-w-sm mx-auto text-sm italic opacity-40 leading-relaxed font-medium">
                    O sistema de monitoramento não encontrou ativos com os parâmetros atuais de busca.
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => { setSearchTerm(''); setFilters({ criticality: [], program: [] }); }}
                  className="px-6 py-3 rounded-full text-[10px] font-bold text-primary uppercase tracking-[0.3em] hover:bg-primary/10 transition-all border-primary/20 bg-transparent"
                >
                  Limpar Filtros
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function KPICard({ title, value, trend, icon, color, className, style, suffix = '' }: any) {
  const colors: any = {
    primary: 'text-primary bg-primary/10 border-primary/20 shadow-[0_0_15px_rgba(255,74,0,0.2)]',
    success: 'text-success bg-success/10 border-success/20 shadow-[0_0_15px_rgba(34,197,94,0.2)]',
    warning: 'text-warning bg-warning/10 border-warning/20 shadow-[0_0_15px_rgba(234,179,8,0.2)]',
    error: 'text-error bg-error/10 border-error/20 shadow-[0_0_15px_rgba(239,64,64,0.2)]',
  };

  return (
    <Card
      className={cn(
        "glass-card rounded-3xl border-white/5 group hover:border-primary/20 transition-all duration-1000 cursor-default hover:-translate-y-2 p-0",
        className
      )}
      style={style}
    >
      <CardContent className="p-8 flex flex-col justify-between min-h-[180px]">
        <div className="flex justify-between items-start">
          <div className={cn(
            "p-4 rounded-2xl border group-hover:scale-110 group-hover:rotate-12 transition-all duration-700 shadow-xl",
            colors[color]
          )}>
            {icon}
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10">
            <span className={cn("text-[10px] font-bold tabular-nums", trend.startsWith('+') ? 'text-success' : 'text-error')}>
              {trend}%
            </span>
            <div className={cn("size-1.5 rounded-full animate-pulse", trend.startsWith('+') ? 'bg-success' : 'bg-error')} />
          </div>
        </div>
        <div className="mt-6">
          <p className="text-[10px] font-bold text-muted uppercase tracking-[0.3em] mb-2 opacity-30 group-hover:opacity-100 transition-opacity duration-700">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-black text-textMain tracking-tighter tabular-nums drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)]">
              {value}
            </span>
            {suffix && <span className="text-sm font-bold text-muted uppercase tracking-widest opacity-40">{suffix}</span>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
