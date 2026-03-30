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
import type { TradingGasMetrics } from '@/src/types/energy';

interface TradingGasModuleProps {
  data: TradingGasMetrics;
}

export function TradingGasModule({ data }: TradingGasModuleProps) {
  // Configuração padrão para a legenda
  const renderLegend = () => {
    return (
      <div className="flex flex-col gap-2 text-[10px] font-bold text-slate-700 ml-4 absolute right-4 top-1/2 -translate-y-1/2">
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 bg-[#D95B00]"></div>
          <span>Realizado</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 bg-[#CBD5E1]"></div>
          <span>Budget</span>
        </div>
      </div>
    );
  };

  // Hack: Recharts não renderiza bem eixos quando todos os valores (exceto o primeiro) são exatamente 0. 
  // Isso quebra a linha visual base e a proporção da barra isolada. Inserir uma base mínima (ex: 20 ou 100) garante a "régua" inferior.
  const mappedEvolution = data.evolution.map((item) => {
    return {
      ...item,
      margemTotal: item.margemTotal === 0 ? 50 : item.margemTotal,
      margemSpot: item.margemSpot === 0 ? 50 : item.margemSpot,
      exposicao: item.exposicao === 0 ? 20 : item.exposicao,
      penalidade: item.penalidade === 0 ? 1 : item.penalidade,
      margemTotalBudget: item.margemTotalBudget === 0 ? 50 : item.margemTotalBudget,
      margemSpotBudget: item.margemSpotBudget === 0 ? 50 : item.margemSpotBudget,
    };
  });

  return (
    <div className="flex flex-col w-full bg-white text-slate-800 rounded-xl overflow-hidden shadow-sm border border-slate-200">
      {/* 1. Header Principal */}
      <div className="bg-[#151B1C] flex items-center justify-between px-6 py-4 border-b-[3px] border-[#D95B00]">
        <div className="flex items-baseline gap-3">
          <h1 className="text-white font-bold text-xl uppercase tracking-wider">
            TRADING GÁS
          </h1>
          <span className="text-white/60 text-sm italic">
            | Report Mensal Janeiro 2026
          </span>
        </div>
        <div className="text-[#D95B00] font-bold text-lg">Fev - 2026</div>
      </div>

      <div className="bg-slate-50 flex items-center justify-between px-6 py-2 border-b border-slate-200">
        <span className="text-[#D95B00] font-bold text-xs">Margem</span>
        <span className="text-slate-500 text-xs italic">Valores apresentados com visão mensal.</span>
      </div>

      <div className="p-6 bg-slate-50/50">
        {/* 4 Gráficos em grid 2x2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Margem Total */}
          <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm flex flex-col h-[350px]">
            <div className="bg-[#D95B00] px-4 py-3">
              <h2 className="text-white font-bold uppercase tracking-wide text-sm">
                MARGEM TOTAL – R$ mil
              </h2>
            </div>
            <div className="flex-1 p-6 relative">
              <div className="absolute top-6 left-6 z-10 bg-[#FFEDD5] text-slate-800 font-bold text-[10px] px-2 py-1 rounded shadow-sm border border-[#FFDDB3]">
                {data.atingimentoMargemTotal}%
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mappedEvolution} margin={{ top: 20, right: 60, bottom: 0, left: -10 }} barGap={0}>
                  <CartesianGrid vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="mes" axisLine={true} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} dy={10} stroke="#CBD5E1" />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} domain={[0, 5000]} ticks={[0, 1000, 2000, 3000, 4000, 5000]} />
                  <Legend content={renderLegend} />
                  
                  <Bar dataKey="margemTotal" fill="#D95B00" maxBarSize={16}>
                    <LabelList dataKey="margemTotal" position="top" fill="#1e293b" fontSize={11} fontWeight="bold" formatter={(v: any) => v <= 50 ? '' : Number(v).toLocaleString('pt-BR')} />
                  </Bar>
                  
                  <Bar dataKey="margemTotalBudget" fill="#CBD5E1" maxBarSize={16}>
                    <LabelList dataKey="margemTotalBudget" position="bottom" fill="#1e293b" fontSize={11} fontWeight="bold" formatter={(v: any) => v <= 50 ? '' : Number(v).toLocaleString('pt-BR')} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Margem Spot */}
          <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm flex flex-col h-[350px]">
            <div className="bg-[#D95B00] px-4 py-3">
              <h2 className="text-white font-bold uppercase tracking-wide text-sm">
                MARGEM SPOT – R$ mil
              </h2>
            </div>
            <div className="flex-1 p-6 relative">
              <div className="absolute top-6 left-6 z-10 bg-[#FFEDD5] text-slate-800 font-bold text-[10px] px-2 py-1 rounded shadow-sm border border-[#FFDDB3]">
                {data.atingimentoMargemSpot}%
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mappedEvolution} margin={{ top: 20, right: 60, bottom: 0, left: -10 }} barGap={0}>
                  <CartesianGrid vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="mes" axisLine={true} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} dy={10} stroke="#CBD5E1" />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} domain={[0, 5000]} ticks={[0, 1000, 2000, 3000, 4000, 5000]} />
                  <Legend content={renderLegend} />
                  
                  <Bar dataKey="margemSpot" fill="#D95B00" maxBarSize={16}>
                    <LabelList dataKey="margemSpot" position="top" fill="#1e293b" fontSize={11} fontWeight="bold" formatter={(v: any) => v <= 50 ? '' : Number(v).toLocaleString('pt-BR')} />
                  </Bar>
                  
                  <Bar dataKey="margemSpotBudget" fill="#CBD5E1" maxBarSize={16}>
                    <LabelList dataKey="margemSpotBudget" position="bottom" fill="#1e293b" fontSize={11} fontWeight="bold" formatter={(v: any) => v <= 50 ? '' : Number(v).toLocaleString('pt-BR')} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Exposição */}
          <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm flex flex-col h-[350px]">
            <div className="bg-[#B45F06] px-4 py-3">
              <h2 className="text-white font-bold uppercase tracking-wide text-sm">
                EXPOSIÇÃO – R$ mil <span className="italic text-white/80 lowercase">(sem comparativo budget)</span>
              </h2>
            </div>
            <div className="flex-1 p-6 relative">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mappedEvolution} margin={{ top: 20, right: 60, bottom: 0, left: -10 }}>
                  <CartesianGrid vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="mes" axisLine={true} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} dy={10} stroke="#CBD5E1" />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} domain={[0, 2000]} ticks={[0, 500, 1000, 1500, 2000]} />
                  
                  <Bar dataKey="exposicao" fill="#A0522D" maxBarSize={20}>
                    <LabelList dataKey="exposicao" position="top" fill="#1e293b" fontSize={11} fontWeight="bold" formatter={(v: any) => v <= 20 ? '' : Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Penalidade de Transporte */}
          <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm flex flex-col h-[350px]">
            <div className="bg-[#B45F06] px-4 py-3">
              <h2 className="text-white font-bold uppercase tracking-wide text-sm">
                PENALIDADE DE TRANSPORTE – R$ mil
              </h2>
            </div>
            <div className="flex-1 p-6 relative">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mappedEvolution} margin={{ top: 20, right: 60, bottom: 0, left: -10 }}>
                  <CartesianGrid vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="mes" axisLine={true} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} dy={10} stroke="#CBD5E1" />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} domain={[0, 50]} ticks={[0, 10, 20, 30, 40, 50]} />
                  
                  <Bar dataKey="penalidade" fill="#A0522D" maxBarSize={20}>
                    <LabelList dataKey="penalidade" position="top" fill="#1e293b" fontSize={11} fontWeight="bold" formatter={(v: any) => v <= 1 ? '' : Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} />
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
