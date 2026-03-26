import type { PPAContract } from '@/src/types/energy';
import { cn } from '@/lib/utils';

interface PPAModuleProps {
  data: PPAContract[];
}

const LABELS: Record<PPAContract['tipo'], string> = {
  originacao: 'Originação',
  comissionamento: 'Comissionamento',
  renegociacao: 'Renegociação',
};

function TriangleDown() {
  return (
    <div
      className="w-0 h-0 mb-1"
      style={{
        borderLeft: '9px solid transparent',
        borderRight: '9px solid transparent',
        borderTop: '13px solid #DC2626',
      }}
    />
  );
}

function TriangleUp() {
  return (
    <div
      className="w-0 h-0 mb-1"
      style={{
        borderLeft: '9px solid transparent',
        borderRight: '9px solid transparent',
        borderBottom: '13px solid #8CC63F',
      }}
    />
  );
}

function Sparkline({
  up,
  darkBg,
  labels,
}: {
  up: boolean;
  darkBg?: boolean;
  labels: [string, string];
}) {
  const d = up ? 'M15,32 L85,8' : 'M15,8 L85,32';
  const c1 = up ? [15, 32] : [15, 8];
  const c2 = up ? [85, 8] : [85, 32];

  return (
    <div
      className={cn(
        'h-16 w-full rounded-xl p-2 relative flex items-end justify-center',
        darkBg
          ? 'border border-white/20 bg-[#1A2224]'
          : 'border border-primary/20 bg-orange-50/30 dark:bg-primary/5'
      )}
    >
      <svg
        className="w-full h-full absolute inset-0 z-10"
        viewBox="0 0 100 40"
        preserveAspectRatio="none"
      >
        <path
          d={d}
          stroke="#FF6B00"
          strokeWidth="1.5"
          fill="none"
          vectorEffect="non-scaling-stroke"
        />
        <circle cx={c1[0]} cy={c1[1]} r="3" fill="#FF6B00" />
        <circle cx={c2[0]} cy={c2[1]} r="3" fill="#FF6B00" />
      </svg>
      <div className="w-full flex justify-between px-2 pb-0 z-20">
        <span
          className={cn(
            'text-[8px] font-bold',
            darkBg ? 'text-white/40' : 'text-gray-400 dark:text-muted-foreground'
          )}
        >
          {labels[0]}
        </span>
        <span
          className={cn(
            'text-[8px] font-bold',
            darkBg ? 'text-white/40' : 'text-gray-400 dark:text-muted-foreground'
          )}
        >
          {labels[1]}
        </span>
      </div>
    </div>
  );
}

function RightRow({ contract }: { contract: PPAContract }) {
  const isUp = contract.vsSemana >= 0;
  const acumuladoMes = Math.round((contract.targetMensal * contract.atingimentoMensal) / 100);
  const acumuladoAno = Math.round((contract.targetAnual * contract.atingimentoAnual) / 100);
  const progressMensal = Math.min(contract.atingimentoMensal, 100);
  const progressAnual = Math.min(contract.atingimentoAnual, 100);

  return (
    <div className="flex-1 min-h-[140px] border-t-[6px] border-t-primary bg-white dark:bg-card border border-border border-t-0 rounded-sm shadow-md p-4 flex flex-col">
      <h3 className="font-extrabold text-primary uppercase tracking-widest text-[13px] mb-4">
        {LABELS[contract.tipo]}
      </h3>
      <div className="flex-1 grid grid-cols-4 gap-4 lg:gap-8">
        {/* Col 1: Atual + Semana */}
        <div className="flex flex-col justify-between h-full border-r border-border pr-4">
          <div>
            <p className="text-[9px] text-gray-500 dark:text-muted-foreground uppercase tracking-[0.2em] mb-1 font-bold">
              Atual
            </p>
            <p className="text-2xl lg:text-3xl font-bold text-primary tabular-nums break-all tracking-tighter">
              {contract.atual === 0
                ? '-'
                : `R$ ${contract.atual.toLocaleString('pt-BR')} k`}
            </p>
          </div>
          <div className="flex justify-between items-end mt-2">
            <div>
              <p className="text-[9px] text-gray-500 dark:text-muted-foreground uppercase tracking-[0.2em] mb-1 font-bold">
                Semana
              </p>
              <p className="text-base lg:text-lg font-bold text-gray-900 dark:text-foreground tabular-nums tracking-tighter">
                {contract.vsSemana === 0
                  ? '-'
                  : `${contract.vsSemana > 0 ? '+' : ''}R$ ${Math.abs(contract.vsSemana).toLocaleString('pt-BR')} k`}
              </p>
            </div>
            {isUp ? <TriangleUp /> : <TriangleDown />}
          </div>
        </div>

        {/* Col 2: Atingimento Mensal */}
        <div className="flex flex-col justify-center h-full border-r border-border pr-4">
          <p className="text-[9px] text-primary uppercase tracking-[0.2em] text-center mb-3 font-bold">
            Atingimento Mensal
          </p>
          <div className="flex items-baseline gap-1 justify-center mb-2">
            <p className="text-xl lg:text-2xl font-bold text-primary tabular-nums">
              {contract.atingimentoMensal}%
            </p>
            <p className="text-[9px] text-gray-500 dark:text-muted-foreground font-medium">
              de R$ {contract.targetMensal.toLocaleString('pt-BR')} k
            </p>
          </div>
          <div className="w-full h-3.5 bg-gray-200 dark:bg-secondary rounded-none mb-2 overflow-hidden">
            <div className="h-full bg-primary/80" style={{ width: `${progressMensal}%` }} />
          </div>
          <p className="text-[9px] text-gray-400 dark:text-muted-foreground font-medium text-center">
            acumulado mês atual:{' '}
            {acumuladoMes < 0 ? '-' : ''}R${' '}
            {Math.abs(acumuladoMes).toLocaleString('pt-BR')} k
          </p>
        </div>

        {/* Col 3: Evolução Semanal */}
        <div className="flex flex-col justify-center h-full border-r border-border pr-4">
          <p className="text-[9px] text-primary uppercase tracking-[0.2em] text-center mb-2 font-bold">
            Evolução Semanal
          </p>
          <Sparkline up={isUp} labels={['S1', 'S2']} />
        </div>

        {/* Col 4: Atingimento Anual */}
        <div className="flex flex-col justify-center h-full">
          <p className="text-[9px] text-primary uppercase tracking-[0.2em] text-center mb-3 font-bold">
            Atingimento Anual
          </p>
          <div className="flex items-baseline gap-1 justify-center mb-2">
            <p className="text-xl lg:text-2xl font-bold text-primary tabular-nums">
              {contract.atingimentoAnual}%
            </p>
            <p className="text-[9px] text-gray-500 dark:text-muted-foreground font-medium">
              de R$ {contract.targetAnual.toLocaleString('pt-BR')} k
            </p>
          </div>
          <div className="w-full h-3.5 bg-gray-200 dark:bg-secondary rounded-none mb-2 overflow-hidden">
            <div className="h-full bg-primary/80" style={{ width: `${progressAnual}%` }} />
          </div>
          <p className="text-[9px] text-gray-400 dark:text-muted-foreground font-medium text-center">
            acumulado ano:{' '}
            {acumuladoAno < 0 ? '-' : ''}R${' '}
            {Math.abs(acumuladoAno).toLocaleString('pt-BR')} k
          </p>
        </div>
      </div>
    </div>
  );
}

export function PPAModule({ data }: PPAModuleProps) {
  const totalAtual = data.reduce((sum, c) => sum + c.atual, 0);
  const totalVsSemana = data.reduce((sum, c) => sum + c.vsSemana, 0);
  const totalTargetMensal = data.reduce((sum, c) => sum + c.targetMensal, 0);
  const totalAtingimentoMensal =
    totalTargetMensal > 0
      ? Math.round((totalAtual / totalTargetMensal) * 10000) / 100
      : 0;
  const totalTargetAnual = data.reduce((sum, c) => sum + c.targetAnual, 0);
  const totalAtingimentoAnual =
    totalTargetAnual > 0
      ? Math.round((totalAtual / totalTargetAnual) * 10000) / 100
      : 0;

  const confiancaLabel =
    totalAtingimentoMensal >= 80
      ? 'Confiante'
      : totalAtingimentoMensal >= 40
        ? 'Atenção'
        : 'Risco';
  const isGlobalUp = totalVsSemana >= 0;
  const progressMensal = Math.min(totalAtingimentoMensal, 100);
  const progressAnual = Math.min(totalAtingimentoAnual, 100);

  return (
    <div className="flex gap-4 h-full overflow-hidden">
      {/* COLUNA ESQUERDA: Rentabilização Global (Dark) */}
      <div className="w-[35%] min-w-[300px] max-w-[420px] flex flex-col h-full bg-[#0A0D0E] border-t-8 border-primary rounded-sm shadow-xl p-6 overflow-y-auto scrollbar-hide">
        <h3 className="text-white font-bold uppercase tracking-widest text-[13px] mb-8">
          Rentabilização dos Contratos (R$ mil)
        </h3>

        {/* Atual + Vs Semana */}
        <div className="flex justify-between items-end border-b border-white/20 pb-5 mb-6">
          <div>
            <p className="text-[9px] text-white/50 uppercase tracking-[0.2em] mb-1 font-bold">
              Atual
            </p>
            <p className="text-4xl lg:text-5xl font-bold text-primary tabular-nums break-all tracking-tighter">
              R$ {totalAtual.toLocaleString('pt-BR')}{' '}
              <span className="text-3xl lg:text-4xl">k</span>
            </p>
          </div>
          <div className="text-right flex items-end gap-3 pb-1">
            <div>
              <p className="text-[9px] text-white/50 uppercase tracking-[0.2em] mb-1 font-bold">
                Vs. Última Semana
              </p>
              <p className="text-xl lg:text-2xl font-bold text-white tabular-nums tracking-tighter">
                {totalVsSemana >= 0 ? '+' : ''}R${' '}
                {Math.abs(totalVsSemana).toLocaleString('pt-BR')}k
              </p>
            </div>
            {isGlobalUp ? <TriangleUp /> : <TriangleDown />}
          </div>
        </div>

        {/* Atingimento Mensal */}
        <div className="mb-6 border-b border-white/20 pb-6 relative">
          <p className="text-[9px] text-white/50 uppercase tracking-[0.2em] mb-3 font-bold">
            Atingimento Mensal
          </p>
          <div className="flex items-baseline gap-1 mb-1">
            <p className="text-3xl lg:text-4xl font-bold text-primary tabular-nums tracking-tighter">
              {totalAtingimentoMensal}%
            </p>
          </div>
          <p className="text-[10px] text-white/50 font-medium mb-2">
            de R$ {totalTargetMensal.toLocaleString('pt-BR')} k
          </p>
          <div className="relative mt-2">
            <div className="absolute right-0 top-[-30px] z-20">
              <span className="bg-[#8CC63F] text-white px-8 py-1.5 rounded-sm text-[11px] uppercase tracking-wider font-bold shadow-md">
                {confiancaLabel}
              </span>
            </div>
            <div className="w-full h-4 bg-primary/20 rounded-none overflow-hidden relative z-10">
              <div
                className="h-full bg-primary shadow-[0_0_10px_rgba(255,107,0,0.5)]"
                style={{ width: `${progressMensal}%` }}
              />
            </div>
          </div>
        </div>

        {/* Evolução Semanal */}
        <div className="mb-6 border-b border-white/20 pb-6">
          <p className="text-[9px] text-white/50 uppercase tracking-[0.2em] mb-3 font-bold">
            Evolução Semanal
          </p>
          <Sparkline up={isGlobalUp} darkBg labels={['S1', 'S2']} />
        </div>

        {/* Atingimento Anual */}
        <div>
          <p className="text-[9px] text-white/50 uppercase tracking-[0.2em] mb-3 font-bold">
            Atingimento Anual
          </p>
          <div className="flex items-start justify-between relative mb-1">
            <div className="flex flex-col">
              <p className="text-3xl lg:text-4xl font-bold text-primary tabular-nums tracking-tighter">
                {totalAtingimentoAnual}%
              </p>
              <p className="text-[10px] text-white/50 font-medium">
                de R$ {totalTargetAnual.toLocaleString('pt-BR')}k
              </p>
            </div>
            <div className="absolute left-[6%] top-[-8px] flex flex-col items-center">
              <span className="text-[9px] text-primary font-bold mb-1">6%</span>
              <div className="w-px h-8 border-l border-dashed border-primary" />
            </div>
          </div>
          <div className="w-full h-4 bg-[#2A3437] rounded-none relative mt-2">
            <div className="absolute left-[6%] top-[-4px] bottom-[-4px] w-0.5 bg-primary z-20 shadow-[0_0_5px_rgba(255,107,0,0.8)]" />
            <div
              className="h-full bg-primary z-10 shadow-[0_0_10px_rgba(255,107,0,0.5)]"
              style={{ width: `${progressAnual}%` }}
            />
          </div>
        </div>
      </div>

      {/* COLUNA DIREITA: 3 Rows (Originação, Comissionamento, Renegociação) */}
      <div className="flex-1 flex flex-col gap-4 overflow-y-auto scrollbar-hide">
        {data.map((contract) => (
          <RightRow key={contract.tipo} contract={contract} />
        ))}
      </div>
    </div>
  );
}
