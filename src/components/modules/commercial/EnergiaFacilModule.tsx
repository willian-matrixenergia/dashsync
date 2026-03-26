'use client';

import type { EnergiaFacilFunnel } from '@/src/types/energy';
import { cn } from '@/lib/utils';

interface EnergiaFacilModuleProps {
  data: EnergiaFacilFunnel;
}

// ─── Sparkline SVG ────────────────────────────────────────────────────────────
function SparklineChart({
  data,
  color,
}: {
  data: Array<{ week: string; value: number }>;
  color: string;
}) {
  const values = data.map((d) => d.value);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const W = 200;
  const H = 48;
  const pad = 10;
  const allZero = values.every((v) => v === 0);
  const lineColor = allZero ? '#CBD5E1' : color;

  const pts = data.map((d, i) => {
    const x = data.length < 2 ? W / 2 : pad + (i / (data.length - 1)) * (W - pad * 2);
    const y = allZero ? H / 2 : pad + ((max - d.value) / range) * (H - pad * 2);
    return { x, y };
  });

  const polyline = pts.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-12">
      <polyline
        points={polyline}
        fill="none"
        stroke={lineColor}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {!allZero &&
        pts.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="4"
            fill={lineColor}
            stroke="white"
            strokeWidth="2"
          />
        ))}
    </svg>
  );
}

// ─── Triângulo direcional CSS ─────────────────────────────────────────────────
function DeltaTriangle({ up }: { up: boolean }) {
  return (
    <span
      className={cn(
        'inline-block w-0 h-0 shrink-0',
        up
          ? 'border-l-[5px] border-r-[5px] border-b-[8px] border-l-transparent border-r-transparent border-b-green-600'
          : 'border-l-[5px] border-r-[5px] border-t-[8px] border-l-transparent border-r-transparent border-t-red-600'
      )}
    />
  );
}

// ─── Badge de confiança ───────────────────────────────────────────────────────
function ConfiancaBadge({ v }: { v: 'success' | 'warning' | 'destructive' }) {
  const map = {
    success: { label: 'Confiante', cls: 'bg-green-500 text-white' },
    warning: { label: 'Atenção', cls: 'bg-amber-500 text-white' },
    destructive: { label: 'Risco', cls: 'bg-red-500 text-white' },
  };
  const { label, cls } = map[v];
  return (
    <span className={cn('text-[10px] font-bold px-3 py-1 rounded-full', cls)}>
      {label}
    </span>
  );
}

// ─── Barra de progresso fina ──────────────────────────────────────────────────
function ThinProgress({ value }: { value: number }) {
  const pct = Math.min(Math.max(value, 0), 100);
  return (
    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all"
        style={{ width: `${pct}%`, backgroundColor: '#D95B00' }}
      />
    </div>
  );
}

// ─── Card de etapa ────────────────────────────────────────────────────────────
interface FunnelCardProps {
  numero: string;
  titulo: string;
  unidade: string;
  cor: string;
  subtitle: string;
  atual: number;
  atualLabel: string;
  semana: number;
  confianca: 'success' | 'warning' | 'destructive' | null;
  notaMensal: string | null;
  mensagemInativa: string | null;
  atingimentoAnual: number;
  targetAnualLabel: string;
  evolution: Array<{ week: string; value: number }>;
}

function FunnelCard({
  numero,
  titulo,
  unidade,
  cor,
  subtitle,
  atual,
  atualLabel,
  semana,
  confianca,
  notaMensal,
  mensagemInativa,
  atingimentoAnual,
  targetAnualLabel,
  evolution,
}: FunnelCardProps) {
  const inativo = atual === 0 && mensagemInativa !== null;
  const semanaUp = semana > 0;
  const hasSemana = semana !== 0;

  return (
    <div className="flex flex-col h-full">
      {/* Header colorido */}
      <div
        className="flex items-center justify-between px-4 py-2 shrink-0"
        style={{ backgroundColor: cor }}
      >
        <div className="flex items-center gap-2">
          <div className="size-5 rounded-full bg-white flex items-center justify-center shrink-0">
            <span className="text-[10px] font-bold text-slate-800">{numero}</span>
          </div>
          <span className="text-white font-bold text-sm uppercase tracking-widest">
            {titulo}
          </span>
        </div>
        <span className="text-xs text-white/80">{unidade}</span>
      </div>

      {/* Subtítulo */}
      <p className="px-4 py-2 text-[11px] text-slate-500 border-b border-slate-100 shrink-0">
        {subtitle}
      </p>

      {/* Bloco ATUAL / SEMANA */}
      <div className="grid grid-cols-2 px-4 pt-3 pb-2 gap-2 shrink-0">
        {/* ATUAL */}
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
            Atual
          </span>
          <span
            className="text-5xl font-bold leading-none tabular-nums"
            style={{ color: inativo ? '#CBD5E1' : cor }}
          >
            {inativo ? '—' : atual.toLocaleString('pt-BR')}
          </span>
          <span className="text-[11px] text-slate-400">{atualLabel}</span>
        </div>

        {/* SEMANA */}
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
            Semana
          </span>
          {hasSemana ? (
            <>
              <span className="text-3xl font-bold text-slate-800 leading-none tabular-nums">
                {semanaUp ? '+' : ''}
                {semana.toLocaleString('pt-BR')}
              </span>
              <div className="flex items-center gap-1 mt-0.5">
                <DeltaTriangle up={semanaUp} />
                <span
                  className={cn(
                    'text-[11px] font-medium',
                    semanaUp ? 'text-green-600' : 'text-red-600'
                  )}
                >
                  {semanaUp ? 'alta' : 'queda'}
                </span>
              </div>
              {confianca && (
                <div className="mt-2">
                  <ConfiancaBadge v={confianca} />
                </div>
              )}
            </>
          ) : (
            <span className="text-3xl font-bold leading-none text-slate-300">—</span>
          )}
        </div>
      </div>

      {/* ATINGIMENTO MENSAL */}
      <div className="px-4 pt-3 border-t border-slate-100 shrink-0">
        <p className="text-[10px] uppercase tracking-widest text-[#D95B00] font-bold mb-1">
          Atingimento Mensal
        </p>
        {mensagemInativa ? (
          <p className="text-[12px] font-bold text-[#D95B00] pb-3">{mensagemInativa}</p>
        ) : (
          <p className="text-[11px] text-slate-400 italic pb-3">{notaMensal}</p>
        )}
      </div>

      {/* EVOLUÇÃO SEMANAL */}
      <div className="mx-4 mb-3 rounded-lg border border-orange-200 bg-orange-50/30 p-2 shrink-0">
        <SparklineChart data={evolution} color={cor} />
        <div className="flex justify-between mt-1 px-1">
          {evolution.map((p) => (
            <span key={p.week} className="text-[10px] text-slate-400">
              {p.week}
            </span>
          ))}
        </div>
      </div>

      {/* ATINGIMENTO ANUAL */}
      <div className="px-4 pb-4 border-t border-slate-100 pt-3 mt-auto shrink-0">
        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">
          Atingimento Anual
        </p>
        <div className="mb-2">
          <span className="text-xl font-bold text-slate-800 tabular-nums">
            {atingimentoAnual}%
          </span>
          <span className="text-[11px] text-slate-400 ml-2">{targetAnualLabel}</span>
        </div>
        <ThinProgress value={atingimentoAnual} />
      </div>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export function EnergiaFacilModule({ data }: EnergiaFacilModuleProps) {
  const getConfianca = (pct: number): 'success' | 'warning' | 'destructive' => {
    if (pct >= 80) return 'success';
    if (pct >= 40) return 'warning';
    return 'destructive';
  };

  return (
    <div className="grid grid-cols-3 divide-x divide-slate-200 bg-white h-full rounded-b-xl overflow-hidden">
      <FunnelCard
        numero="01"
        titulo="Originação"
        unidade="#"
        cor="#FF4A00"
        subtitle="Originação de novos clientes"
        atual={data.originacao.clientes}
        atualLabel="# clientes"
        semana={data.originacao.semana}
        confianca={getConfianca(data.originacao.atingimentoMensal)}
        notaMensal="*Meta mensal com início em Abril de 2026"
        mensagemInativa={null}
        atingimentoAnual={data.originacao.atingimentoAnual}
        targetAnualLabel={`de ${data.originacao.targetAnual.toLocaleString('pt-BR')} contratos`}
        evolution={data.originacao.evolution ?? []}
      />
      <FunnelCard
        numero="02"
        titulo="Fechamento"
        unidade="#"
        cor="#C6651E"
        subtitle="Formalização e assinatura do novo contrato"
        atual={data.fechamento.contratos}
        atualLabel="# contratos"
        semana={data.fechamento.semana}
        confianca={getConfianca(data.fechamento.atingimentoMensal)}
        notaMensal="*Meta mensal com início em Abril de 2026"
        mensagemInativa={null}
        atingimentoAnual={data.fechamento.atingimentoAnual}
        targetAnualLabel={`de ${data.fechamento.targetAnual.toLocaleString('pt-BR')} contratos`}
        evolution={data.fechamento.evolution ?? []}
      />
      <FunnelCard
        numero="03"
        titulo="Faturamento"
        unidade="R$ MM"
        cor="#8A4B1D"
        subtitle="Faturamento dos projetos contratados"
        atual={data.faturamento.valor}
        atualLabel="R$ MM"
        semana={data.faturamento.semana}
        confianca={null}
        notaMensal={null}
        mensagemInativa="Faturamento de projetos ainda não iniciado"
        atingimentoAnual={data.faturamento.atingimentoAnual}
        targetAnualLabel={`de R$ ${(data.faturamento.targetAnual / 1000).toLocaleString('pt-BR', { minimumFractionDigits: 1 })} MM em contratos`}
        evolution={data.faturamento.evolution ?? []}
      />
    </div>
  );
}
