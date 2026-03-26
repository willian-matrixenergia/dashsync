'use client';

import type { BESSMetrics } from '@/src/types/energy';
import { cn } from '@/lib/utils';

interface BESSModuleProps {
  data: BESSMetrics;
}

type RealKey = 'capacidade' | 'mwh' | 'faturamento';
type BudgetKey = 'capacidadeBudget' | 'mwhBudget' | 'faturamentoBudget';

// ─── Formatação de valores ────────────────────────────────────────────────────
function fmt(v: number | null, decimals = 1): string {
  if (v === null) return '';
  if (v >= 1000) return v.toLocaleString('pt-BR', { maximumFractionDigits: 0 });
  return v.toFixed(decimals);
}

// ─── Mini area chart de evolução ──────────────────────────────────────────────
function BESSEvolutionChart({
  data,
  realKey,
  budgetKey,
  cor,
}: {
  data: BESSMetrics['evolution'];
  realKey: RealKey;
  budgetKey: BudgetKey;
  cor: string;
}) {
  const W = 300;
  const H = 70;
  const padX = 6;
  const padTop = 14;
  const padBottom = 14;

  const budgetVals = data.map((d) => d[budgetKey]);
  const realVals = data.map((d) => d[realKey]).filter((v): v is number => v !== null);
  const allVals = [...budgetVals, ...realVals];
  const min = Math.min(...allVals) * 0.88;
  const max = Math.max(...allVals) * 1.08;
  const range = max - min || 1;

  const getX = (i: number) => padX + (i / (data.length - 1)) * (W - padX * 2);
  const getY = (v: number) => padTop + ((max - v) / range) * (H - padTop - padBottom);

  const budgetPts = data.map((d, i) => ({ x: getX(i), y: getY(d[budgetKey]), v: d[budgetKey], mes: d.mes }));
  const realPts: Array<{ x: number; y: number; v: number; i: number }> = data.reduce(
    (acc, d, i) => {
      const v = d[realKey];
      if (v !== null) acc.push({ x: getX(i), y: getY(v), v, i });
      return acc;
    },
    [] as Array<{ x: number; y: number; v: number; i: number }>
  );

  const budgetPolyline = budgetPts.map((p) => `${p.x},${p.y}`).join(' ');
  const budgetArea = [
    `M ${budgetPts[0].x},${H - padBottom}`,
    ...budgetPts.map((p) => `L ${p.x},${p.y}`),
    `L ${budgetPts[budgetPts.length - 1].x},${H - padBottom}`,
    'Z',
  ].join(' ');

  const realPolyline = realPts.map((p) => `${p.x},${p.y}`).join(' ');
  const realArea = realPts.length > 1
    ? [
        `M ${realPts[0].x},${H - padBottom}`,
        ...realPts.map((p) => `L ${p.x},${p.y}`),
        `L ${realPts[realPts.length - 1].x},${H - padBottom}`,
        'Z',
      ].join(' ')
    : '';

  const firstReal = realPts[0];
  const lastReal = realPts[realPts.length - 1];
  const lastBudget = budgetPts[budgetPts.length - 1];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-16">
      {/* Área budget (fundo tracejado) */}
      <path d={budgetArea} fill={cor} fillOpacity="0.06" />
      <polyline
        points={budgetPolyline}
        fill="none"
        stroke={cor}
        strokeWidth="1.5"
        strokeDasharray="4 3"
        strokeOpacity="0.45"
      />

      {/* Área real (sólido) */}
      {realArea && <path d={realArea} fill={cor} fillOpacity="0.2" />}
      {realPts.length >= 2 && (
        <polyline
          points={realPolyline}
          fill="none"
          stroke={cor}
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      )}

      {/* Dots reais */}
      {realPts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill={cor} stroke="white" strokeWidth="1.5" />
      ))}

      {/* Label primeiro real */}
      {firstReal && (
        <text x={firstReal.x + 2} y={firstReal.y + 10} fontSize="7.5" fill="#94A3B8" textAnchor="start">
          {fmt(firstReal.v)}
        </text>
      )}
      {/* Label último real (se diferente do primeiro) */}
      {lastReal && lastReal.i !== firstReal?.i && (
        <text x={lastReal.x} y={lastReal.y - 5} fontSize="7.5" fill="#94A3B8" textAnchor="middle">
          {fmt(lastReal.v)}
        </text>
      )}
      {/* Label último budget */}
      <text x={lastBudget.x - 2} y={lastBudget.y - 4} fontSize="7.5" fill="#94A3B8" textAnchor="end">
        {fmt(lastBudget.v)}
      </text>

      {/* Labels dos meses */}
      {data.map((d, i) => (
        <text key={i} x={getX(i)} y={H - 1} fontSize="6.5" fill="#CBD5E1" textAnchor="middle">
          {d.mes}
        </text>
      ))}
    </svg>
  );
}

// ─── Barra de progresso com marcador tracejado ────────────────────────────────
function AnnualProgress({ value, cor }: { value: number; cor: string }) {
  const pct = Math.min(Math.max(value, 0), 100);
  return (
    <div className="relative mt-1">
      {/* Label flutuante acima do marcador */}
      <div
        className="absolute text-[8px] font-bold mb-0.5"
        style={{ left: `${pct}%`, top: '-12px', transform: 'translateX(-50%)', color: cor }}
      >
        {value}%
      </div>
      {/* Barra */}
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: `${pct}%`, backgroundColor: cor }}
        />
      </div>
      {/* Marcador tracejado vertical */}
      <div
        className="absolute top-[-4px] h-[calc(100%+8px)] w-px"
        style={{ left: `${pct}%`, borderLeft: `1.5px dashed ${cor}` }}
      />
    </div>
  );
}

// ─── Barra mensal simples ─────────────────────────────────────────────────────
function MonthlyProgress({ value, cor }: { value: number; cor: string }) {
  const pct = Math.min(Math.max(value, 0), 100);
  return (
    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
      <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: cor }} />
    </div>
  );
}

// ─── Badge confiança ──────────────────────────────────────────────────────────
function ConfiancaBadge({ v }: { v: 'success' | 'warning' | 'destructive' }) {
  const map = {
    success: { label: 'Confiante', cls: 'bg-green-500 text-white' },
    warning: { label: 'Atenção', cls: 'bg-amber-500 text-white' },
    destructive: { label: 'Risco', cls: 'bg-red-500 text-white' },
  };
  const { label, cls } = map[v];
  return (
    <span className={cn('text-[10px] font-bold px-2.5 py-0.5 rounded-full', cls)}>
      {label}
    </span>
  );
}

// ─── Linha de dados ───────────────────────────────────────────────────────────
interface BESSRowProps {
  nome: string;
  unidade: string;
  cor: string;
  valorAtual: string;
  atingimentoMensal: number;
  targetMensalLabel: string;
  confianca: 'success' | 'warning' | 'destructive';
  atingimentoAnual: number;
  targetAnualLabel: string;
  evolution: BESSMetrics['evolution'];
  realKey: RealKey;
  budgetKey: BudgetKey;
}

function BESSRow({
  nome,
  unidade,
  cor,
  valorAtual,
  atingimentoMensal,
  targetMensalLabel,
  confianca,
  atingimentoAnual,
  targetAnualLabel,
  evolution,
  realKey,
  budgetKey,
}: BESSRowProps) {
  return (
    <div
      className="grid grid-cols-[200px_130px_110px_1fr_1fr_170px] items-center border-b border-slate-100 py-4"
      style={{ borderLeft: `4px solid ${cor}` }}
    >
      {/* INDICADOR */}
      <div className="pl-4 flex flex-col gap-2 pr-3">
        <span className="text-sm font-bold text-slate-800 leading-tight">{nome}</span>
        <span
          className="text-[10px] font-bold px-2 py-0.5 rounded border self-start"
          style={{ color: cor, borderColor: cor }}
        >
          {unidade}
        </span>
      </div>

      {/* VALOR ATUAL */}
      <div className="flex flex-col gap-0.5 px-2">
        <span
          className="text-4xl font-bold tabular-nums leading-none"
          style={{ color: cor }}
        >
          {valorAtual}
        </span>
        <span className="text-[10px] text-slate-400 mt-1">mês anterior: -</span>
      </div>

      {/* VS MÊS ANTERIOR */}
      <div className="flex items-center justify-center px-2">
        <span className="text-xs font-medium text-slate-600 bg-slate-100 border border-slate-200 rounded-md px-3 py-1.5">
          No Data
        </span>
      </div>

      {/* ATINGIMENTO MENSAL */}
      <div className="flex flex-col gap-1 px-3">
        <span className="text-3xl font-bold tabular-nums" style={{ color: cor }}>
          {atingimentoMensal}%
        </span>
        <span className="text-[11px] text-slate-400">de {targetMensalLabel}</span>
        <MonthlyProgress value={atingimentoMensal} cor={cor} />
        <div className="flex justify-end mt-1">
          <ConfiancaBadge v={confianca} />
        </div>
      </div>

      {/* EVOLUÇÃO 2026 */}
      <div className="px-3">
        <div className="rounded-lg border border-orange-200 bg-orange-50/20 p-2">
          <BESSEvolutionChart
            data={evolution}
            realKey={realKey}
            budgetKey={budgetKey}
            cor={cor}
          />
        </div>
      </div>

      {/* ATINGIMENTO ANUAL */}
      <div className="flex flex-col gap-1 px-3">
        <span className="text-3xl font-bold text-slate-600 tabular-nums">
          {atingimentoAnual}%
        </span>
        <span className="text-[11px] text-slate-400">de {targetAnualLabel}</span>
        <AnnualProgress value={atingimentoAnual} cor={cor} />
        <span className="text-[9px] text-slate-400 text-center mt-2">Ano</span>
      </div>
    </div>
  );
}

// ─── Cabeçalho das colunas ────────────────────────────────────────────────────
function ColumnHeader() {
  const cls = 'text-[10px] uppercase tracking-widest text-[#D95B00] font-bold';
  return (
    <div className="grid grid-cols-[200px_130px_110px_1fr_1fr_170px] px-0 py-2 bg-slate-50 border-b border-slate-200">
      <span className={cn(cls, 'pl-5')}>Indicador</span>
      <span className={cn(cls, 'px-2')}>Valor Atual</span>
      <span className={cn(cls, 'px-2 text-center')}>VS Mês Anterior</span>
      <span className={cn(cls, 'px-3')}>Atingimento Mensal</span>
      <span className={cn(cls, 'px-3')}>Evolução 2026</span>
      <span className={cn(cls, 'px-3')}>Atingimento Anual</span>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export function BESSModule({ data }: BESSModuleProps) {
  return (
    <div className="bg-white rounded-b-xl overflow-hidden w-full">
      <ColumnHeader />

      <BESSRow
        nome="Capacidade Instalada Faturando"
        unidade="MWh"
        cor="#FF4A00"
        valorAtual={data.capacidadeMwh.toFixed(1)}
        atingimentoMensal={data.capacidadeStats.atingimentoMensal}
        targetMensalLabel={`${data.capacidadeStats.targetMensal} MWh`}
        confianca={data.capacidadeStats.confianca}
        atingimentoAnual={data.capacidadeStats.atingimentoAnual}
        targetAnualLabel={`${data.capacidadeStats.targetAnual} MWh`}
        evolution={data.evolution}
        realKey="capacidade"
        budgetKey="capacidadeBudget"
      />

      <BESSRow
        nome="MWh Médio por Projeto"
        unidade="R$ mil / MWh"
        cor="#C6651E"
        valorAtual={data.mwhMedio.toFixed(1)}
        atingimentoMensal={data.mwhMedioStats.atingimentoMensal}
        targetMensalLabel={`${data.mwhMedioStats.targetMensal} R$ mil / MWh`}
        confianca={data.mwhMedioStats.confianca}
        atingimentoAnual={data.mwhMedioStats.atingimentoAnual}
        targetAnualLabel={`${data.mwhMedioStats.targetAnual} R$ mil / MWh`}
        evolution={data.evolution}
        realKey="mwh"
        budgetKey="mwhBudget"
      />

      <BESSRow
        nome="Faturamento Total"
        unidade="R$ mil"
        cor="#8A4B1D"
        valorAtual={data.faturamentoTotal.toLocaleString('pt-BR')}
        atingimentoMensal={data.faturamentoStats.atingimentoMensal}
        targetMensalLabel={`${data.faturamentoStats.targetMensal.toLocaleString('pt-BR')} R$ mil`}
        confianca={data.faturamentoStats.confianca}
        atingimentoAnual={data.faturamentoStats.atingimentoAnual}
        targetAnualLabel={`${data.faturamentoStats.targetAnual.toLocaleString('pt-BR')} R$ mil`}
        evolution={data.evolution}
        realKey="faturamento"
        budgetKey="faturamentoBudget"
      />
    </div>
  );
}
