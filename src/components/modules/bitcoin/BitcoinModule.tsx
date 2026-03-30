'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  LabelList,
  Legend,
} from 'recharts';
import type { BitcoinMetrics, BitcoinEvolution } from '@/src/types/energy';

interface BitcoinModuleProps {
  metrics: BitcoinMetrics; // unused visualmente pelo spec mas mantido caso precise
  evolution: BitcoinEvolution[];
}

export function BitcoinModule({ metrics, evolution }: BitcoinModuleProps) {
  // Hack: Inserir uma base mínima visual para valores zerados, garantindo a "régua" inferior.
  const mappedEvolution = evolution.map((item) => {
    // uptime vem do mock apenas como 'uptime' usado no budget. Criamos um 'uptimeReal' zerado para ilustrar o Actual.
    const uptimeReal = 0;

    return {
      ...item,
      // Actuals (Laranja)
      btcMinados: item.btcMinados === 0 ? 0.05 : item.btcMinados,
      uptimeReal: uptimeReal === 0 ? 1.5 : uptimeReal,
      hashrate: item.hashrate === 0 ? 0.005 : item.hashrate,
      consumo: item.consumo === 0 ? 10 : item.consumo,
      
      // Budgets (Cinza)
      btcBudget: item.btcBudget === 0 ? 0.05 : item.btcBudget,
      uptime: item.uptime === 0 ? 1.5 : item.uptime,
      hashrateBudget: item.hashrateBudget === 0 ? 0.005 : item.hashrateBudget,
      consumoBudget: item.consumoBudget === 0 ? 10 : item.consumoBudget,
    };
  });

  // Configuração padrão para a legenda idêntica à imagem
  const renderLegend = () => {
    return (
      <div className="flex items-center justify-end gap-4 text-[10px] font-bold text-slate-700 mt-2 mr-4">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 bg-[#D95B00]"></div>
          <span>Actual</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 bg-[#CBD5E1]"></div>
          <span>Budget</span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full bg-white text-slate-800 rounded-xl overflow-hidden shadow-sm border border-slate-200">
      {/* 1. Header Principal */}
      <div className="bg-[#151B1C] flex items-center justify-between px-6 py-4 border-b-[3px] border-[#D95B00]">
        <div className="flex items-baseline gap-3">
          <h1 className="text-white font-bold text-xl uppercase tracking-wider">
            BITCOIN
          </h1>
          <span className="text-white/60 text-sm italic">
            | Report Mensal Janeiro 2026
          </span>
        </div>
        <div className="text-[#D95B00] font-bold text-lg">Fev - 2026</div>
      </div>

      <div className="bg-slate-50 flex items-center justify-between px-6 py-2 border-b border-slate-200">
        <span className="text-[#D95B00] font-bold text-xs">Margem</span>
        <span className="text-slate-500 text-xs italic">Valores são budget. Produto ainda não operacional</span>
      </div>

      <div className="p-6 bg-slate-50/50">
        {/* 4 Gráficos em grid 2x2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Quadrante 1: BTC MINERADOS NO MÊS (#BTC) */}
          <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm flex flex-col h-[350px]">
            <div className="bg-[#D95B00] px-4 py-3">
              <h2 className="text-white font-bold uppercase tracking-wide text-sm">
                BTC MINERADOS NO MÊS (#BTC)
              </h2>
            </div>
            <div className="flex-1 p-6 relative">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mappedEvolution} margin={{ top: 30, right: 60, bottom: 0, left: -20 }} barGap={0}>
                  <CartesianGrid vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="mes" axisLine={true} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} dy={10} stroke="#CBD5E1" />
                  <YAxis axisLine={false} tickLine={false} tick={false} domain={[0, 4]} />
                  <Legend content={renderLegend} />
                  
                  <Bar dataKey="btcMinados" fill="#D95B00" maxBarSize={12} isAnimationActive={false}>
                    <LabelList dataKey="btcMinados" position="top" fill="#D95B00" fontSize={11} fontWeight="bold" formatter={(v: any) => v <= 0.05 ? '' : Number(v).toFixed(1).replace('.', ',')} />
                  </Bar>
                  
                  <Bar dataKey="btcBudget" fill="#CBD5E1" maxBarSize={12}>
                    <LabelList dataKey="btcBudget" position="top" fill="#151B1C" fontSize={11} fontWeight="bold" formatter={(v: any) => v <= 0.05 ? '0,0' : Number(v).toFixed(1).replace('.', ',')} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quadrante 2: UPTIME DOS ASICs (%) */}
          <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm flex flex-col h-[350px]">
            <div className="bg-[#D95B00] px-4 py-3">
              <h2 className="text-white font-bold uppercase tracking-wide text-sm">
                UPTIME DOS ASICs (%)
              </h2>
            </div>
            <div className="flex-1 p-6 relative">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mappedEvolution} margin={{ top: 30, right: 60, bottom: 0, left: -20 }} barGap={0}>
                  <CartesianGrid vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="mes" axisLine={true} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} dy={10} stroke="#CBD5E1" />
                  <YAxis axisLine={false} tickLine={false} tick={false} domain={[0, 120]} />
                  <Legend content={renderLegend} />
                  
                  <Bar dataKey="uptimeReal" fill="#D95B00" maxBarSize={12} isAnimationActive={false}>
                    <LabelList dataKey="uptimeReal" position="top" fill="#D95B00" fontSize={11} fontWeight="bold" formatter={(v: any) => v <= 1.5 ? '' : `${Number(v).toFixed(1).replace('.', ',')}%`} />
                  </Bar>
                  
                  <Bar dataKey="uptime" fill="#CBD5E1" maxBarSize={12}>
                    <LabelList dataKey="uptime" position="top" fill="#151B1C" fontSize={11} fontWeight="bold" formatter={(v: any) => v <= 1.5 ? '0,0%' : `${Number(v).toFixed(1).replace('.', ',')}%`} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quadrante 3: HASHRATE EFETIVO / HASHRATE NOMINAL (EH/s) */}
          <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm flex flex-col h-[350px]">
            <div className="bg-[#D95B00] px-4 py-3">
              <h2 className="text-white font-bold uppercase tracking-wide text-sm">
                HASHRATE EFETIVO / HASHRATE NOMINAL (EH/s)
              </h2>
            </div>
            <div className="flex-1 p-6 relative">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mappedEvolution} margin={{ top: 30, right: 60, bottom: 0, left: -20 }} barGap={0}>
                  <CartesianGrid vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="mes" axisLine={true} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} dy={10} stroke="#CBD5E1" />
                  <YAxis axisLine={false} tickLine={false} tick={false} domain={[0, 0.3]} />
                  <Legend content={renderLegend} />
                  
                  <Bar dataKey="hashrate" fill="#D95B00" maxBarSize={12} isAnimationActive={false}>
                    <LabelList dataKey="hashrate" position="top" fill="#D95B00" fontSize={11} fontWeight="bold" formatter={(v: any) => v <= 0.005 ? '' : Number(v).toFixed(2).replace('.', ',')} />
                  </Bar>
                  
                  <Bar dataKey="hashrateBudget" fill="#CBD5E1" maxBarSize={12}>
                    <LabelList dataKey="hashrateBudget" position="top" fill="#151B1C" fontSize={11} fontWeight="bold" formatter={(v: any) => v <= 0.005 ? '0,00' : Number(v).toFixed(2).replace('.', ',')} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quadrante 4: CONSUMO DE ENERGIA NA SEMANA E CUSTO (R$ '000) */}
          <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm flex flex-col h-[350px]">
            <div className="bg-[#D95B00] px-4 py-3">
              <h2 className="text-white font-bold uppercase tracking-wide text-sm">
                CONSUMO DE ENERGIA NA SEMANA E CUSTO (R$ &apos;000)
              </h2>
            </div>
            <div className="flex-1 p-6 relative">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mappedEvolution} margin={{ top: 30, right: 60, bottom: 0, left: -20 }} barGap={0}>
                  <CartesianGrid vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="mes" axisLine={true} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} dy={10} stroke="#CBD5E1" />
                  <YAxis axisLine={false} tickLine={false} tick={false} domain={[0, 800]} />
                  <Legend content={renderLegend} />
                  
                  <Bar dataKey="consumo" fill="#D95B00" maxBarSize={12} isAnimationActive={false}>
                    <LabelList dataKey="consumo" position="top" fill="#D95B00" fontSize={11} fontWeight="bold" formatter={(v: any) => v <= 10 ? '' : Math.round(Number(v))} />
                  </Bar>
                  
                  <Bar dataKey="consumoBudget" fill="#CBD5E1" maxBarSize={12}>
                    <LabelList dataKey="consumoBudget" position="top" fill="#151B1C" fontSize={11} fontWeight="bold" formatter={(v: any) => v <= 10 ? '0' : Math.round(Number(v))} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
