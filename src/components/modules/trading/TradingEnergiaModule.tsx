'use client';

import {
  ExposicaoAnual,
  KpiSemanalRow,
  StressTestScenario,
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

interface TradingEnergiaModuleProps {
  exposicaoGwh: ExposicaoAnual[];
  kpiSemanal: KpiSemanalRow[];
  stressTest: StressTestScenario[];
}

export function TradingEnergiaModule({
  exposicaoGwh,
  kpiSemanal,
  stressTest,
}: TradingEnergiaModuleProps) {
  // Para o gráfico de Exposição Líquida
  const maxExposicao = Math.max(
    ...exposicaoGwh.map((d) => Math.abs(d.exposicaoGwh)),
    1 // Evita divisão por zero
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
            (fechamento sexta feira)
          </span>
        </div>
        <div className="text-primary font-bold text-lg">Fev - 2026</div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-[1.618fr_1fr] gap-8">
        {/* 2. Sessão Superior Esquerda: Gráfico Exposição Líquida (GWh) */}
        <div className="flex flex-col gap-4">
          <h2 className="text-primary font-bold uppercase tracking-wide text-sm">
            EXPOSIÇÃO LÍQUIDA POR ANO (GWh)
          </h2>
          
          <div className="flex-1 flex flex-col border border-primary/30 bg-[#FF6B00]/[0.03] rounded-xl p-6 relative">
            <div className="flex-1 flex items-end relative h-[300px]">
              {/* Linha Zero */}
              <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-slate-200" />

              {exposicaoGwh.map((d) => {
                const heightPct = (Math.abs(d.exposicaoGwh) / maxExposicao) * 50;
                const isPositive = d.exposicaoGwh >= 0;

                return (
                  <div key={d.ano} className="flex-1 flex flex-col justify-end h-full group z-10">
                    <div className="flex-1 relative w-full flex items-center justify-center">
                      {isPositive ? (
                        <div
                          className="absolute bottom-1/2 flex flex-col items-center justify-end w-full"
                          style={{ height: `${heightPct}%` }}
                        >
                          <span className="text-[10px] font-bold text-slate-700 mb-1 opacity-80 group-hover:opacity-100 transition-opacity">
                            {d.exposicaoGwh.toFixed(1)}
                          </span>
                          <div className="w-8 lg:w-10 bg-primary h-full rounded-t-sm shadow-sm opacity-90 group-hover:opacity-100 transition-opacity" />
                        </div>
                      ) : (
                        <div
                          className="absolute top-1/2 flex flex-col items-center justify-start w-full"
                          style={{ height: `${heightPct}%` }}
                        >
                          <div className="w-8 lg:w-10 bg-primary h-full rounded-b-sm shadow-sm opacity-90 group-hover:opacity-100 transition-opacity" />
                          <span className="text-[10px] font-bold text-slate-700 mt-1 opacity-80 group-hover:opacity-100 transition-opacity">
                            {d.exposicaoGwh.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Eixo X e Legenda */}
            <div className="mt-4 flex flex-col">
              <div className="flex justify-between items-center text-xs font-bold text-slate-600 mb-4 border-t border-slate-200 pt-2">
                {exposicaoGwh.map((d) => (
                  <div key={d.ano} className="flex-1 text-center">
                    {d.ano}
                  </div>
                ))}
              </div>
              
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                  Δ exposição em relação a semana anterior
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                {exposicaoGwh.map((d) => {
                  const delta = d.deltaSemana ?? 0;
                  const isUp = delta > 0;
                  const isDown = delta < 0;
                  
                  return (
                    <div key={d.ano} className="flex-1 flex flex-col items-center justify-center">
                      <div className="flex flex-col items-center gap-1">
                        {isUp && <ArrowUp className="w-5 h-5 text-success drop-shadow-sm" strokeWidth={3} />}
                        {isDown && <ArrowDown className="w-5 h-5 text-error drop-shadow-sm" strokeWidth={3} />}
                        {delta === 0 && <span className="text-slate-400 font-bold">-</span>}
                        
                        {(isUp || isDown) && (
                          <span
                            className={cn(
                              'text-xs font-bold',
                              isUp ? 'text-success' : 'text-error'
                            )}
                          >
                            {isUp ? '+' : ''}
                            {delta.toFixed(1)}
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

        {/* 3. Sessão Superior Direita: Evolução Semanal - KPIs Chave */}
        <div className="flex flex-col gap-4">
          <h2 className="text-primary font-bold uppercase tracking-wide text-sm text-center">
            EVOLUÇÃO SEMANAL - KPIs Chave
          </h2>
          
          <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm flex-1 flex flex-col">
            {/* Cabeçalho */}
            <div className="grid bg-slate-50 border-b border-slate-200" style={{ gridTemplateColumns: '120px 1fr 58px 58px 62px' }}>
              <div className="px-3 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wide">KPI</div>
              <div className="px-3 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wide">Descrição</div>
              <div className="px-3 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wide text-right">30/01</div>
              <div className="px-3 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wide text-right">06/02</div>
              <div className="px-3 py-2.5 text-[10px] font-bold text-primary uppercase tracking-wide text-right">13/02</div>
            </div>

            {/* Linhas de dados */}
            {kpiSemanal.map((row) => (
              <div
                key={row.kpi}
                className="grid border-b border-slate-100 hover:bg-slate-50/50 items-start"
                style={{ gridTemplateColumns: '120px 1fr 58px 58px 62px' }}
              >
                <div className="px-3 py-3 text-sm font-semibold text-slate-800 leading-snug">
                  {row.kpi}
                </div>
                <div className="px-3 py-3 text-[11px] text-slate-400 italic leading-tight">
                  {row.descricao}
                </div>
                <div className="px-3 py-3 text-sm text-right text-slate-600 whitespace-nowrap">
                  {row.sem1.toFixed(1)}
                </div>
                <div className="px-3 py-3 text-sm text-right text-slate-600 whitespace-nowrap">
                  {row.sem2.toFixed(1)}
                </div>
                <div className="px-3 py-3 text-sm text-right font-bold text-slate-800 whitespace-nowrap">
                  {row.sem3.toFixed(1)}
                </div>
              </div>
            ))}

            {/* Footnote */}
            <div className="p-3 bg-slate-50/50 border-t border-slate-100 mt-auto">
              <p className="text-[10px] text-slate-400 italic">
                *Exposição em MWh. Demais valores em R$ MM.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Sessão Inferior: Stress Test */}
      <div className="px-6 pb-6 pt-2">
        <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
          <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
            <h2 className="text-primary font-bold uppercase tracking-wide text-sm">
              STRESS TEST - Impacto por Cenário de Variação de PLD (MM R$)
            </h2>
          </div>
          <Table>
            <TableHeader className="bg-slate-50/50 border-b border-slate-200">
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs font-bold text-slate-600 uppercase h-10">Cenário</TableHead>
                <TableHead className="text-xs font-bold text-slate-600 uppercase text-right h-10">2026</TableHead>
                <TableHead className="text-xs font-bold text-slate-600 uppercase text-right h-10">2027</TableHead>
                <TableHead className="text-xs font-bold text-slate-600 uppercase text-right h-10">2028</TableHead>
                <TableHead className="text-xs font-bold text-slate-600 uppercase text-right h-10">2029</TableHead>
                <TableHead className="text-xs font-bold text-slate-600 uppercase text-right h-10">2030</TableHead>
                <TableHead className="text-xs font-bold text-slate-600 uppercase text-right h-10">2031</TableHead>
                <TableHead className="text-xs font-bold text-slate-600 uppercase text-right h-10">Total*</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stressTest.map((row) => (
                <TableRow key={row.deltaPlD} className="border-b border-slate-100 hover:bg-slate-50/50">
                  <TableCell className="text-sm font-bold text-primary py-3 whitespace-nowrap">
                    Δ R${row.deltaPlD}/MWh
                  </TableCell>
                  <TableCell className="text-sm text-right text-slate-600 py-3 font-mono">{row.ano2026.toFixed(1)}</TableCell>
                  <TableCell className="text-sm text-right text-slate-600 py-3 font-mono">{row.ano2027.toFixed(1)}</TableCell>
                  <TableCell className="text-sm text-right text-slate-600 py-3 font-mono">{row.ano2028.toFixed(1)}</TableCell>
                  <TableCell className="text-sm text-right text-slate-600 py-3 font-mono">{row.ano2029.toFixed(1)}</TableCell>
                  <TableCell className="text-sm text-right text-slate-600 py-3 font-mono">{row.ano2030.toFixed(1)}</TableCell>
                  <TableCell className="text-sm text-right text-slate-600 py-3 font-mono">{row.ano2031.toFixed(1)}</TableCell>
                  <TableCell className="text-sm text-right font-bold text-primary py-3 font-mono">
                    {row.total.toFixed(1)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="p-3 bg-slate-50/50 border-t border-slate-100">
            <p className="text-[10px] text-slate-400 italic">
              *Total considera anos 2026-2031. Valores negativos indicam perda potencial.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
