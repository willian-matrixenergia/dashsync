'use client';

import {
  CashGenMonth,
  MtmAnual,
  PldAtual,
} from '@/src/types/energy';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { ArrowDown, ArrowUp } from 'lucide-react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LabelList,
} from 'recharts';

interface TradingEnergiaVisaoContabilModuleProps {
  cashGen: CashGenMonth[];
  exposicaoMmR: MtmAnual[];
  pldAtual: PldAtual[];
}

export function TradingEnergiaVisaoContabilModule({
  cashGen,
  exposicaoMmR,
  pldAtual,
}: TradingEnergiaVisaoContabilModuleProps) {
  // Para o gráfico MTM (Exposição Líquida)
  const maxMtm = Math.max(
    ...exposicaoMmR.map((d) => Math.abs(d.mtmMmR)),
    1
  );

  return (
    <div className="flex flex-col w-full bg-white text-slate-800 rounded-xl overflow-hidden shadow-sm border border-slate-200">
      {/* 1. Header Principal */}
      <div className="bg-[#151B1C] flex items-center justify-between px-6 py-4 border-b-[3px] border-primary">
        <div className="flex items-baseline gap-3">
          <h1 className="text-white font-bold text-xl uppercase tracking-wider">
            TRADING ENERGIA
          </h1>
          <span className="text-white/60 text-sm italic">
            | Semana 09Fev vs. Semana 02Fev (fechamento sexta feira)
          </span>
        </div>
        <div className="text-primary font-bold text-lg">Fev - 2026</div>
      </div>

      <div className="p-6 flex flex-col gap-6">
        {/* ROW 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
          
          {/* Sessão Superior Esquerda: Visão Contábil - Geração de Caixa */}
          <div className="border border-slate-200 rounded-lg p-6 relative">
            <h2 className="text-primary font-bold uppercase tracking-wide text-sm mb-1">
              VISÃO CONTÁBIL - GERAÇÃO DE CAIXA (R$ MM)
              <span className="text-slate-400 font-normal normal-case ml-2 text-xs">
                Visão de geração de caixa inclui Trading Energia, PPA e Operações Estruturadas.
              </span>
            </h2>

            <div className="h-[250px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={cashGen} margin={{ top: 20, right: 20, bottom: 20, left: -20 }}>
                  <CartesianGrid vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                  
                  <Bar dataKey="realizado" fill="#8B4513" maxBarSize={30}>
                    <LabelList dataKey="realizado" position="bottom" fill="#8B4513" fontSize={11} formatter={(v: any) => v === 0 ? '' : Number(v).toFixed(2).replace('.', ',')} />
                  </Bar>
                  
                  <Line type="monotone" dataKey="esperado" stroke="#FF6B00" strokeWidth={3} dot={{ r: 4, fill: '#FF6B00', strokeWidth: 0 }}>
                    <LabelList dataKey="esperado" position="top" fill="#FF6B00" fontSize={11} formatter={(v: any) => Number(v).toFixed(2).replace('.', ',')} dy={-10} />
                  </Line>
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex gap-6 mt-2 justify-start px-8">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary"></div>
                <span className="text-xs text-slate-500 font-semibold">Geração de Caixa Esperado</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#8B4513]"></div>
                <span className="text-xs text-slate-500 font-semibold">Geração de Caixa realizada</span>
              </div>
            </div>
          </div>

          {/* Sessão Superior Direita: Meta Anual de Trading */}
          <div className="border border-slate-200 rounded-lg p-6 flex flex-col justify-center text-center h-full">
            <h2 className="text-primary font-bold text-[13px] mb-3">
              Meta Anual de Trading: gerar R$ 30 MM adicionais de caixa
            </h2>
            
            <div className="mb-2">
              <p className="text-xs text-slate-500 font-bold mb-2">Atingimento Anual</p>
              
              <div className="flex items-center justify-center gap-3">
                <span className="text-base font-bold text-slate-800">1%</span>
                <div className="w-40 lg:w-48 h-3 bg-slate-100 border border-slate-200 rounded-sm overflow-hidden flex">
                  <div className="h-full bg-primary" style={{ width: '1%' }}></div>
                </div>
              </div>
              
              <p className="text-[11px] text-slate-500 font-bold mt-2">
                acumulado ano: R$ 3.6 MM
              </p>
            </div>
            
            <p className="text-[9px] text-slate-400 mt-3 leading-tight max-w-[280px] mx-auto">
              *Meta de 30 MM está incluída nos números a partir de Abril. Período anterior dedicado à proteção do portfólio.
            </p>
          </div>

        </div>

        {/* ROW 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
          
          {/* Sessão Inferior Esquerda: MTM POR ANO EXPOSIÇÃO LÍQUIDA POR ANO */}
          <div className="flex flex-col gap-4">
            <div className="border border-primary/30 rounded-xl p-6 bg-[#FF6B00]/[0.02]">
              <h2 className="text-primary font-bold uppercase tracking-wide text-sm mb-6">
                MTM POR ANO EXPOSIÇÃO LÍQUIDA POR ANO (MM R$)
              </h2>

              <div className="flex-1 flex flex-col relative pl-6 lg:pl-8">
                <div className="flex-1 flex items-end relative h-[250px]">
                  {/* Linhas de grade horizontais */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-slate-200" />
                  <div className="absolute top-1/4 left-0 right-0 h-px bg-slate-200" />
                  <div className="absolute top-1/2 left-0 right-0 h-px bg-slate-400" />
                  <div className="absolute top-3/4 left-0 right-0 h-px bg-slate-200" />
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-slate-200" />

                  {/* Y-Axis labels estáticos */}
                  <div className="absolute top-0 left-2 lg:-left-2 text-[10px] text-slate-400">250</div>
                  <div className="absolute top-1/4 left-2 lg:-left-2 text-[10px] text-slate-400">200</div>
                  <div className="absolute top-1/2 left-2 lg:-left-2 text-[10px] text-slate-400">0</div>
                  <div className="absolute top-3/4 left-2 lg:-left-2 text-[10px] text-slate-400">-50</div>

                  {exposicaoMmR.map((d) => {
                    const heightPct = (Math.abs(d.mtmMmR) / maxMtm) * 50;
                    const isPositive = d.mtmMmR >= 0;

                    return (
                      <div key={d.ano} className="flex-1 relative h-full flex justify-center group z-10">
                        {isPositive ? (
                          <div
                            className="absolute bottom-1/2 w-6 lg:w-10 bg-[#D95B00] shadow-sm rounded-t-sm"
                            style={{ height: `${heightPct}%` }}
                          >
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 text-[10px] lg:text-[11px] font-bold text-slate-800 mb-1">
                              {d.mtmMmR.toFixed(1).replace('.', ',')}
                            </span>
                          </div>
                        ) : (
                          <div
                            className="absolute top-1/2 w-6 lg:w-10 bg-[#D95B00] shadow-sm rounded-b-sm"
                            style={{ height: `${heightPct}%` }}
                          >
                            <span className="absolute top-full left-1/2 -translate-x-1/2 text-[10px] lg:text-[11px] font-bold text-slate-800 mt-1">
                              {d.mtmMmR.toFixed(1).replace('.', ',')}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                
                {/* Eixo X e Setas de Delta */}
                <div className="mt-2 flex flex-col">
                  <div className="flex justify-between items-center text-[11px] font-bold text-slate-500 mb-6">
                    {exposicaoMmR.map((d) => (
                      <div key={d.ano} className="flex-1 text-center">
                        {d.ano}
                      </div>
                    ))}
                  </div>
                  
                  <div className="relative flex justify-between items-center">
                    {/* Linha horizontal para as setas cinzas */}
                    <div className="absolute top-2 left-0 right-0 h-[2px] bg-slate-200 -z-10" />

                    <div className="absolute left-0 bottom-0 mb-[-24px] max-w-[120px]">
                      <span className="text-[10px] text-slate-400 font-bold block leading-tight text-right pr-4">
                        Δ MtM em relação a<br/>semana anterior<br/>(MM R$)
                      </span>
                    </div>

                    <div className="flex-1 flex justify-between items-center pl-[120px]">
                      {exposicaoMmR.map((d) => {
                        const delta = d.deltaSemana ?? 0;
                        const isUp = delta > 0;
                        const isDown = delta < 0;
                        
                        return (
                          <div key={d.ano} className="flex-1 flex flex-col items-center justify-center relative">
                            {/* Base para a seta visual (Chevron cinza) */}
                            <div className="w-8 h-4 bg-slate-200 shrink-0" style={{ clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)' }} />
                            
                            <div className="flex flex-col items-center gap-1 mt-4">
                              {isUp && <ArrowUp className="w-5 h-5 text-success drop-shadow-sm" strokeWidth={4} />}
                              {isDown && <ArrowDown className="w-5 h-5 text-[#C00000] drop-shadow-sm" strokeWidth={4} />}
                              {delta === 0 && <span className="text-slate-400 font-bold">-</span>}
                              
                              {(isUp || isDown) && (
                                <span
                                  className="text-[11px] font-bold text-slate-800 mt-1"
                                >
                                  {isUp ? '+' : ''}{delta.toFixed(2)}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sessão Inferior Direita: PLD ATUAL */}
          <div className="border border-slate-200 rounded-lg p-6 bg-white flex flex-col">
            <h2 className="text-primary font-bold uppercase tracking-wide text-sm mb-4">
              PLD ATUAL (R$/MWH)
            </h2>
            
            <div className="border border-slate-200 rounded overflow-hidden flex-1">
              <Table>
                <TableHeader className="bg-slate-50 border-b border-slate-200">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-sm font-bold text-slate-600 text-center h-12 border-r border-slate-200 w-1/3">Ano</TableHead>
                    <TableHead className="text-sm font-bold text-slate-600 text-center h-12 border-r border-slate-200 w-1/3">R$/MWh</TableHead>
                    <TableHead className="text-sm font-bold text-slate-600 text-center h-12 w-1/3">Var %</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pldAtual.map((row) => (
                    <TableRow key={row.ano} className="border-b border-slate-100 hover:bg-slate-50/50">
                      <TableCell className="text-sm font-medium text-slate-500 text-center py-4 border-r border-slate-200">
                        {row.ano}
                      </TableCell>
                      <TableCell className="text-sm font-bold text-slate-800 text-center py-4 border-r border-slate-200">
                        {row.rsMwh.toFixed(1)}
                      </TableCell>
                      <TableCell className={cn(
                        "text-sm font-bold text-center py-4",
                        row.varPct > 0 ? "text-success" : row.varPct < 0 ? "text-[#C00000]" : "text-slate-500"
                      )}>
                        {row.varPct > 0 ? '+' : ''}{row.varPct.toFixed(1).replace('.', ',')}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
