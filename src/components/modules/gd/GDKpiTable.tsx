import type { GDKpiRow } from '@/src/types/energy';

// ----------------------------------------------------
// Tipos
// ----------------------------------------------------
interface GDKpiTableProps {
  data: GDKpiRow[];
}

// ----------------------------------------------------
// Grid de colunas — reutilizado em header e linhas de dados
// ----------------------------------------------------
const GRID_COLS =
  'grid grid-cols-[60px_minmax(180px,1fr)_100px_110px_220px_100px_80px_130px_100px_200px]';

// ----------------------------------------------------
// DeltaTriangle — triângulo CSS sólido
// ----------------------------------------------------
function DeltaTriangle({ up }: { up: boolean }) {
  if (up) {
    return (
      <span
        className="inline-block w-0 h-0"
        style={{
          borderLeft: '6px solid transparent',
          borderRight: '6px solid transparent',
          borderBottom: '9px solid #22c55e',
        }}
      />
    );
  }
  return (
    <span
      className="inline-block w-0 h-0"
      style={{
        borderLeft: '6px solid transparent',
        borderRight: '6px solid transparent',
        borderTop: '9px solid #ef4444',
      }}
    />
  );
}

// ----------------------------------------------------
// MiniSparkline — SVG inline
// ----------------------------------------------------
function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  const W = 80;
  const H = 36;
  const padding = 4;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((v, i) => {
    const x = padding + (i / (data.length - 1)) * (W - padding * 2);
    const y = H - padding - ((v - min) / range) * (H - padding * 2);
    return { x, y };
  });

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <div
      className="rounded p-1"
      style={{
        border: '1px solid #fed7aa',
        background: 'rgba(255,74,0,0.04)',
      }}
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        height={H}
        preserveAspectRatio="none"
      >
        <polyline
          points={polylinePoints}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="2" fill={color} />
        ))}
      </svg>
    </div>
  );
}

// ----------------------------------------------------
// NoSemanalBox — placeholder para KPI sem visão semanal
// ----------------------------------------------------
function NoSemanalBox() {
  return (
    <div
      className="h-10 rounded flex items-center justify-center"
      style={{
        border: '1px solid #e2e8f0',
        background: '#f1f5f9',
      }}
    >
      <span className="text-[10px] text-slate-400 italic">Sem visão Semanal</span>
    </div>
  );
}

// ----------------------------------------------------
// ThinBar — barra de progresso fina
// ----------------------------------------------------
function ThinBar({ value, color }: { value: number; color: string }) {
  const pct = Math.min(Math.max(value, 0), 100);
  return (
    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mt-1">
      <div
        className="h-full rounded-full"
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </div>
  );
}

// ----------------------------------------------------
// AnnualBar — barra com marker pontilhado e label
// ----------------------------------------------------
function AnnualBar({ value, color }: { value: number; color: string }) {
  const pct = Math.min(Math.max(value, 0), 100);
  return (
    <div className="relative mt-1" style={{ paddingTop: '14px' }}>
      {/* Label acima do marker */}
      <span
        className="absolute text-[9px] text-slate-500"
        style={{
          left: `${pct}%`,
          top: 0,
          transform: 'translateX(-50%)',
          whiteSpace: 'nowrap',
        }}
      >
        {value}%
      </span>
      {/* Trilha */}
      <div className="relative h-1.5 w-full bg-slate-100 rounded-full overflow-visible">
        {/* Fill */}
        <div
          className="absolute left-0 top-0 h-full rounded-full"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
        {/* Marker pontilhado vertical */}
        <div
          className="absolute top-[-4px]"
          style={{
            left: `${pct}%`,
            height: 'calc(100% + 8px)',
            borderLeft: '1px dashed #94a3b8',
            transform: 'translateX(-50%)',
          }}
        />
      </div>
    </div>
  );
}

// ----------------------------------------------------
// ConfiancaBadge
// ----------------------------------------------------
function ConfiancaBadge({ v }: { v: GDKpiRow['confianca'] }) {
  const map: Record<GDKpiRow['confianca'], { bg: string; label: string }> = {
    success: { bg: '#22c55e', label: 'Confiante' },
    warning: { bg: '#f59e0b', label: 'Atenção' },
    destructive: { bg: '#ef4444', label: 'Risco' },
  };
  const { bg, label } = map[v];
  return (
    <span
      className="inline-block text-[10px] font-bold text-white px-3 py-1 rounded-full"
      style={{ backgroundColor: bg }}
    >
      {label}
    </span>
  );
}

// ----------------------------------------------------
// ColHeaders — linha de cabeçalho das colunas
// ----------------------------------------------------
function ColHeaders() {
  const gray = 'text-slate-400 text-[10px] uppercase tracking-widest';
  const orange = 'text-[10px] uppercase tracking-widest font-bold';

  return (
    <div
      className={`${GRID_COLS} border-b border-slate-200 bg-slate-50`}
      style={{ minWidth: '900px' }}
    >
      <div className={`py-2 px-2 ${gray}`}>ID</div>
      <div className={`py-2 px-2 ${gray}`}>Key Result / KPI</div>
      <div className={`py-2 px-2 ${orange}`} style={{ color: '#D95B00' }}>
        Atual – Semana
      </div>
      <div className={`py-2 px-2 ${gray}`}>Target Mensal</div>
      <div className={`py-2 px-2 ${orange}`} style={{ color: '#D95B00' }}>
        ▶ Atingimento Mensal
      </div>
      <div className={`py-2 px-2 ${orange}`} style={{ color: '#D95B00' }}>
        Confiança
      </div>
      <div className={`py-2 px-2 ${gray}`}>Semana</div>
      <div className={`py-2 px-2 ${gray}`}>Evolução Semanal</div>
      <div className={`py-2 px-2 ${gray}`}>Target Anual</div>
      <div className={`py-2 px-2 ${gray}`}>Atingimento Anual</div>
    </div>
  );
}

// ----------------------------------------------------
// SectionSeparator
// ----------------------------------------------------
function SectionSeparator({
  label,
  variant,
}: {
  label: string;
  variant: 'orange' | 'gray';
}) {
  const bg = variant === 'orange' ? '#FF4A00' : '#64748B';
  return (
    <div className="px-4 py-1.5" style={{ backgroundColor: bg }}>
      <span
        className={`text-white text-[11px] tracking-widest uppercase${
          variant === 'gray' ? ' italic font-normal' : ' font-bold'
        }`}
      >
        {label}
      </span>
    </div>
  );
}

// ----------------------------------------------------
// KpiRow — linha de dados
// ----------------------------------------------------
function KpiRow({ row }: { row: GDKpiRow }) {
  const kpiLabel = row.id.replace('kpi', 'KPI ');

  return (
    <div
      className={`${GRID_COLS} border-b border-slate-100`}
      style={{ minWidth: '900px', alignItems: 'start' }}
    >
      {/* Col 1 — ID */}
      <div className="py-3 px-2">
        <span className="text-[11px] font-bold" style={{ color: '#FF4A00' }}>
          {kpiLabel}
        </span>
      </div>

      {/* Col 2 — Nome + unidade */}
      <div className="py-3 px-2">
        <span className="text-sm font-bold text-slate-800">{row.descricao}</span>
        <span className="block text-[11px] text-slate-400">{row.unidade}</span>
      </div>

      {/* Col 3 — Atual – Semana */}
      <div className="py-3 px-2">
        {row.atualSemana !== null ? (
          <>
            <span
              className="text-2xl font-bold tabular-nums"
              style={{ color: '#FF4A00' }}
            >
              {row.atualSemana.toLocaleString('pt-BR')}
            </span>
            {row.atualSemanaLabel && (
              <span className="block text-[10px] text-slate-400 italic">
                {row.atualSemanaLabel}
              </span>
            )}
          </>
        ) : (
          <span className="text-slate-300">—</span>
        )}
      </div>

      {/* Col 4 — Target Mensal */}
      <div className="py-3 px-2">
        <span className="text-sm text-slate-700 tabular-nums">
          {row.targetMensal.toLocaleString('pt-BR')}
          {row.targetMensalNota ? '*' : ''}
        </span>
        {row.targetMensalNota && (
          <span className="block text-[10px] text-slate-400 italic">
            {row.targetMensalNota}
          </span>
        )}
        {row.targetMensalLabel && (
          <span className="block text-[10px] text-slate-400 italic">
            {row.targetMensalLabel}
          </span>
        )}
      </div>

      {/* Col 5 — Atingimento Mensal */}
      <div className="py-3 px-2">
        {row.isExtrapolado ? (
          <>
            <span className="text-[10px] font-bold text-red-500">% EXTRAPOLADO</span>
            <div className="flex items-center gap-1">
              <span className="text-xl font-bold text-red-500 tabular-nums">
                {row.atingimentoMensal}%
              </span>
            </div>
            <div className="relative h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mt-1">
              <div className="absolute left-0 top-0 h-full w-1 bg-red-500 rounded-full" />
            </div>
          </>
        ) : (
          <>
            <span
              className="text-xl font-bold tabular-nums"
              style={{ color: '#FF4A00' }}
            >
              {row.atingimentoMensal}%
            </span>
            <ThinBar value={row.atingimentoMensal} color="#FF4A00" />
            {row.acumuladoMes && (
              <span className="block text-[10px] text-slate-400 mt-0.5">
                {row.acumuladoMes}
              </span>
            )}
          </>
        )}
      </div>

      {/* Col 6 — Confiança */}
      <div className="py-3 px-2">
        <ConfiancaBadge v={row.confianca} />
      </div>

      {/* Col 7 — Semana */}
      <div className="py-3 px-2">
        {row.semana !== null ? (
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-sm font-bold text-slate-800 tabular-nums">
              {row.semana > 0 ? '+' : ''}
              {row.semana.toLocaleString('pt-BR')}
            </span>
            <DeltaTriangle up={row.semana > 0} />
          </div>
        ) : (
          <span className="text-slate-300 text-sm">–</span>
        )}
      </div>

      {/* Col 8 — Evolução Semanal */}
      <div className="py-3 px-2">
        {row.hasVisaoSemanal && row.evolution ? (
          <MiniSparkline data={row.evolution} color="#FF4A00" />
        ) : (
          <NoSemanalBox />
        )}
      </div>

      {/* Col 9 — Target Anual */}
      <div className="py-3 px-2">
        <span className="text-sm text-slate-700 tabular-nums">
          {row.targetAnual.toLocaleString('pt-BR')}
        </span>
      </div>

      {/* Col 10 — Atingimento Anual */}
      <div className="py-3 px-2">
        {row.isExtrapolado ? (
          <>
            <span className="text-[10px] font-bold text-red-500">% EXTRAPOLADO</span>
            <span className="block text-xl font-bold text-slate-600 tabular-nums">
              {row.atingimentoAnual}%
            </span>
            <div className="h-1.5 w-full bg-slate-100 rounded-full mt-1" />
            {row.acumuladoAno && (
              <span className="block text-[10px] text-slate-400 mt-1">
                {row.acumuladoAno}
              </span>
            )}
          </>
        ) : (
          <>
            <span className="text-xl font-bold text-slate-600 tabular-nums">
              {row.atingimentoAnual}%
            </span>
            <AnnualBar value={row.atingimentoAnual} color="#FF4A00" />
            {row.acumuladoAno && (
              <span className="block text-[10px] text-slate-400 mt-1">
                {row.acumuladoAno}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ----------------------------------------------------
// GDKpiTable — componente principal
// ----------------------------------------------------
export function GDKpiTable({ data }: GDKpiTableProps) {
  const comVisao = data.filter((r) => r.hasVisaoSemanal);
  const semVisao = data.filter((r) => !r.hasVisaoSemanal);

  return (
    <div
      className="bg-white rounded-xl overflow-hidden border border-slate-200 flex flex-col"
      style={{ minWidth: '900px' }}
    >
      {/* Cabeçalho das colunas */}
      <ColHeaders />

      {/* Seção 1: Com visão semanal */}
      <SectionSeparator label="COM VISÃO SEMANAL" variant="orange" />
      {comVisao.map((row) => (
        <KpiRow key={row.id} row={row} />
      ))}

      {/* Seção 2: Visão apenas mensal */}
      <SectionSeparator
        label="VISÃO APENAS MENSAL – Visão Janeiro (Fevereiro em Fechamento)"
        variant="gray"
      />
      {semVisao.map((row) => (
        <KpiRow key={row.id} row={row} />
      ))}
    </div>
  );
}
