import type { OperacoesData, FunilEtapa, IndicadorBC } from '@/src/types/energy';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface OperacoesModuleProps {
  data: OperacoesData;
}

// ─── Pílula de variação semanal ───────────────────────────────────────────────
function SemanaPill({ delta }: { delta: number }) {
  return (
    <div className="flex items-center gap-1 justify-end">
      {delta > 0 && (
        <>
          <ArrowUp className="size-3 text-green-500 shrink-0" />
          <span className="text-[11px] font-bold text-green-500 tabular-nums">
            +{delta.toLocaleString('pt-BR')}
          </span>
        </>
      )}
      {delta < 0 && (
        <>
          <ArrowDown className="size-3 text-red-500 shrink-0" />
          <span className="text-[11px] font-bold text-red-500 tabular-nums">
            {delta.toLocaleString('pt-BR')}
          </span>
        </>
      )}
      <div className="w-7 h-1.5 bg-[#D95B00] rounded-full opacity-80 shrink-0" />
    </div>
  );
}

// ─── Linha da tabela do funil ─────────────────────────────────────────────────
function FunilRow({ etapa }: { etapa: FunilEtapa | IndicadorBC }) {
  const isHighStage = etapa.numero >= 4;

  return (
    <div className="grid grid-cols-[20px_1fr_auto_auto] gap-x-3 items-center px-4 py-2.5 border-b border-slate-100 last:border-b-0">
      {/* Badge numérico */}
      <div
        className={cn(
          'size-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0',
          isHighStage
            ? 'bg-orange-100 text-[#D95B00]'
            : 'bg-slate-100 text-slate-500'
        )}
      >
        {etapa.numero}
      </div>

      {/* Nome da etapa */}
      <span
        className={cn(
          'text-sm text-slate-700 truncate',
          etapa.numero === 6 && 'font-bold'
        )}
      >
        {etapa.nome}
      </span>

      {/* Atual */}
      <span className="text-sm font-bold text-slate-800 tabular-nums text-right min-w-[60px]">
        {etapa.atual !== null
          ? etapa.atual.toLocaleString('pt-BR', { minimumFractionDigits: 1 })
          : '—'}
      </span>

      {/* SEMANA */}
      <div className="min-w-[80px]">
        <SemanaPill delta={etapa.deltaSemanaMM} />
      </div>
    </div>
  );
}

// ─── Cabeçalho de colunas da tabela ──────────────────────────────────────────
function TabelaHeader() {
  return (
    <div className="grid grid-cols-[20px_1fr_auto_auto] gap-x-3 px-4 pb-1">
      <div />
      <div />
      <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold text-right min-w-[60px]">
        ATUAL
      </span>
      <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold text-right min-w-[80px]">
        SEMANA
      </span>
    </div>
  );
}

// ─── Painel CAPEX / ASSET LIGHT ──────────────────────────────────────────────
function FunilPanel({
  number,
  title,
  subtitle,
  etapas,
  targetFechamentoMM,
}: {
  number: string;
  title: string;
  subtitle: string;
  etapas: FunilEtapa[];
  targetFechamentoMM: number;
}) {
  const fechamento = etapas.find((e) => e.numero === 6);
  const pct =
    fechamento?.atual && targetFechamentoMM > 0
      ? Math.round((fechamento.atual / targetFechamentoMM) * 100)
      : 0;

  return (
    <div className="flex flex-col">
      {/* Faixa laranja */}
      <div className="bg-[#D95B00] flex items-center gap-3 px-4 py-2">
        <div className="size-5 rounded-full bg-white flex items-center justify-center shrink-0">
          <span className="text-[10px] font-bold text-slate-800">{number}</span>
        </div>
        <span className="text-white font-bold text-sm uppercase tracking-widest">
          {title}
        </span>
      </div>

      {/* Subtítulo */}
      <p className="px-4 py-2 text-[11px] text-slate-500 border-b border-slate-100">
        {subtitle}
      </p>

      {/* Cabeçalho da tabela */}
      <div className="pt-2">
        <TabelaHeader />
      </div>

      {/* Linhas do funil */}
      <div className="flex-1">
        {etapas.map((etapa) => (
          <FunilRow key={etapa.numero} etapa={etapa} />
        ))}
      </div>

      {/* Rodapé: Target anual */}
      <div className="px-4 py-3 border-t border-slate-100 mt-auto">
        <p className="text-[10px] text-[#D95B00] uppercase tracking-widest font-bold underline mb-1.5">
          TARGET ANUAL PARA ETAPA FECHAMENTO
        </p>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-xl font-bold text-slate-700 tabular-nums">{pct}%</span>
          <span className="text-xs text-slate-400">de R$ {targetFechamentoMM} MM</span>
        </div>
        <Progress value={pct} className="h-2" />
      </div>
    </div>
  );
}

// ─── Painel 03: Indicadores Pós-BC ───────────────────────────────────────────
function IndicadoresPanel({ ffc, mtm }: { ffc: IndicadorBC[]; mtm: IndicadorBC[] }) {
  return (
    <div className="flex flex-col">
      {/* Faixa laranja */}
      <div className="bg-[#D95B00] flex items-center gap-3 px-4 py-2">
        <div className="size-5 rounded-full bg-white flex items-center justify-center shrink-0">
          <span className="text-[10px] font-bold text-slate-800">03</span>
        </div>
        <span className="text-white font-bold text-sm uppercase tracking-widest">
          INDICADORES APÓS BUSINESS CASES
        </span>
      </div>

      <div className="px-4 py-4 flex flex-col gap-6">
        {/* FFC */}
        <div>
          <h4 className="text-base font-bold text-slate-800">FFC</h4>
          <p className="text-xs text-slate-400 mt-0.5 mb-3">FFC de projetos em negociação</p>
          <TabelaHeader />
          {ffc.map((etapa) => (
            <FunilRow key={etapa.numero} etapa={etapa} />
          ))}
        </div>

        {/* MtM */}
        <div>
          <h4 className="text-base font-bold text-slate-800">MtM</h4>
          <p className="text-xs text-slate-400 mt-0.5 mb-3">MtM de projetos em negociação</p>
          <TabelaHeader />
          {mtm.map((etapa) => (
            <FunilRow key={etapa.numero} etapa={etapa} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export function OperacoesModule({ data }: OperacoesModuleProps) {
  return (
    <div className="flex flex-col w-full bg-white text-slate-800 rounded-xl overflow-hidden shadow-sm border border-slate-200">
      {/* Header escuro */}
      <div className="bg-[#151B1C] flex items-center justify-between px-6 py-3 border-b-[3px] border-[#D95B00]">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-white tracking-widest uppercase">
            OPERAÇÕES ESTRUTURADAS
          </h2>
          <span className="text-white/50 mx-2 text-xl font-light">|</span>
          <span className="text-white/80 text-sm tracking-wide">
            Semana {data.semanaAtual} vs. Semana {data.semanaAnterior}
          </span>
        </div>
        <div className="text-[#D95B00] font-bold tracking-widest text-sm">
          {data.mesReferencia}
        </div>
      </div>

      {/* Faixa subtítulo */}
      <div className="bg-slate-50 flex items-center px-6 py-2 border-b border-slate-200">
        <span className="text-xs text-slate-500 font-medium">Funil de Vendas (MM R$)</span>
      </div>

      {/* 3 colunas */}
      <div className="grid grid-cols-3 divide-x divide-slate-200">
        <FunilPanel
          number="01"
          title="CAPEX"
          subtitle="Valores de projetos de CAPEX em cada etapa do Funil de venda"
          etapas={data.capex.etapas}
          targetFechamentoMM={data.capex.targetFechamentoMM}
        />
        <FunilPanel
          number="02"
          title="ASSET LIGHT"
          subtitle="Valores de projetos de Asset em cada etapa do Funil de venda"
          etapas={data.assetLight.etapas}
          targetFechamentoMM={data.assetLight.targetFechamentoMM}
        />
        <IndicadoresPanel ffc={data.ffc} mtm={data.mtm} />
      </div>

      {/* Rodapé confidencial */}
      <div className="bg-[#151B1C] py-2 text-center text-[10px] text-white/40 tracking-widest uppercase border-t border-white/5">
        CONFIDENCIAL · USO INTERNO · BOARD · FEV 2026
      </div>
    </div>
  );
}
