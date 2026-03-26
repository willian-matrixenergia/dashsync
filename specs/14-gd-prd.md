# PRD — Geração Distribuída (GD) — Implementação v2

## 1. Visão Geral

Módulo de tabela densa com 6 KPIs organizados em duas seções: "COM VISÃO SEMANAL" (KPI 1–4) e "VISÃO APENAS MENSAL" (KPI 5–6). Layout em CSS grid com flex-col externo para suportar separadores de seção full-width.

---

## 2. Estrutura de Dados — `GDKpiRow`

```ts
interface GDKpiRow {
  id: string;                            // "kpi1" … "kpi6"
  descricao: string;                     // nome completo do KPI
  unidade: string;                       // "(MWh)", "(R$MM)", "(GWh)", "(# mil clientes)"
  atualSemana: number | null;            // valor atual / semana
  atualSemanaLabel?: string;             // "Resultado Janeiro" — KPI 5 e 6
  targetMensal: number;
  targetMensalNota?: string;             // "Target ano dividido por 12" — KPI 4
  targetMensalLabel?: string;            // "Target Janeiro" — KPI 5 e 6
  atingimentoMensal: number;             // percentual 0–100
  acumuladoMes?: string;                 // texto completo ex: "acumulado mês atual: 1.076 MWh"
  isExtrapolado?: boolean;               // true → mostra "% EXTRAPOLADO" em vermelho
  confianca: 'success' | 'warning' | 'destructive';
  semana: number | null;                 // delta semanal; null → exibe "–"
  evolution?: number[];                  // 4–6 pontos para sparkline
  targetAnual: number;
  atingimentoAnual: number;              // percentual 0–100
  acumuladoAno?: string;                 // texto completo
  hasVisaoSemanal: boolean;              // false → seção "VISÃO APENAS MENSAL"
}
```

---

## 3. Layout da Tabela

### 3.1 Container Externo

```
div.flex.flex-col → bg-white rounded-xl overflow-hidden border border-slate-200
```

Cada filho é uma linha full-width (header, separador ou linha de dados). Linhas de dados usam grid interno.

### 3.2 Grid de Colunas

```
grid-cols-[60px_minmax(180px,1fr)_100px_110px_220px_100px_80px_130px_100px_200px]
```

| # | Coluna | Largura |
|---|--------|---------|
| 1 | ID | 60 px |
| 2 | Key Result / KPI | flex 180 px min |
| 3 | Atual – Semana | 100 px |
| 4 | Target Mensal | 110 px |
| 5 | Atingimento Mensal | 220 px |
| 6 | Confiança | 100 px |
| 7 | Semana | 80 px |
| 8 | Evolução Semanal | 130 px |
| 9 | Target Anual | 100 px |
| 10 | Atingimento Anual | 200 px |

### 3.3 Cabeçalho de Colunas

- ID, Key Result/KPI, Target Mensal, Semana, Evolução Semanal, Target Anual, Atingimento Anual → `text-slate-400 text-[10px] uppercase tracking-widest`
- **Atual – Semana**, **▶ Atingimento Mensal**, **Confiança** → `text-[#D95B00] text-[10px] uppercase tracking-widest font-bold`
- Linha header: `bg-slate-50 border-b border-slate-200`

---

## 4. Separadores de Seção

### COM VISÃO SEMANAL
- Fundo: `#FF4A00` (laranja Matrix sólido)
- Texto: branco, `font-bold uppercase tracking-widest text-[11px]`

### VISÃO APENAS MENSAL – Visão Janeiro (Fevereiro em Fechamento)
- Fundo: `#64748B` (slate-500)
- Texto: branco, itálico, `text-[11px]`

---

## 5. Especificação por Coluna (linha de dados)

### Col 1 — ID
- Texto `"KPI 1"` derivado de `id.replace('kpi', 'KPI ')`
- Estilo: `text-[11px] font-bold text-[#FF4A00]`

### Col 2 — Key Result / KPI
- `descricao` em `text-sm font-bold text-slate-800`
- `unidade` em `text-[11px] text-slate-400 block`

### Col 3 — Atual – Semana
- Valor: `text-2xl font-bold text-[#FF4A00] tabular-nums`
- Se `atualSemanaLabel` existe: `text-[10px] text-slate-400 italic block`
- Se `atualSemana === null`: exibe `—` em `text-slate-300`

### Col 4 — Target Mensal
- Valor: `text-sm text-slate-700 tabular-nums`
- Se `targetMensalNota`: apende `*` ao valor; nota em `text-[10px] text-slate-400 italic block`
- Se `targetMensalLabel`: exibe label em `text-[10px] text-slate-400 italic block`

### Col 5 — Atingimento Mensal

**Modo normal** (`isExtrapolado !== true`):
- Percentual: `text-xl font-bold text-[#FF4A00] tabular-nums`
- `ThinBar` com `value={atingimentoMensal}` e `color="#FF4A00"`
- `acumuladoMes` em `text-[10px] text-slate-400 mt-0.5 block`

**Modo extrapolado** (`isExtrapolado === true`):
- Label: `text-[10px] font-bold text-red-500` → `"% EXTRAPOLADO"`
- Percentual: `text-xl font-bold text-red-500 tabular-nums`
- Barra: `relative h-1.5 w-full bg-slate-100 rounded-full mt-1` com `div.absolute.left-0.top-0.h-full.w-1.bg-red-500.rounded-full`

### Col 6 — Confiança

Badge cápsula:
- `success` → `bg-green-500 text-white` → "Confiante"
- `warning` → `bg-amber-500 text-white` → "Atenção"
- `destructive` → `bg-red-500 text-white` → "Risco"
- Estilo: `text-[10px] font-bold px-3 py-1 rounded-full`

### Col 7 — Semana

- `semana !== null`: mostra valor + `DeltaTriangle` (up se > 0, down se < 0)
- Valor: `text-sm font-bold text-slate-800 tabular-nums`; prefixo `+` se positivo
- `semana === null`: exibe `–` em `text-slate-300 text-sm`

### Col 8 — Evolução Semanal

- `hasVisaoSemanal && evolution`: `MiniSparkline` com border laranja
- `!hasVisaoSemanal`: `NoSemanalBox` — div cinza com `"Sem visão Semanal"` centralizado, itálico, `text-[10px] text-slate-400`

### Col 9 — Target Anual

- `text-sm text-slate-700 tabular-nums`

### Col 10 — Atingimento Anual

**Modo normal:**
- Percentual: `text-xl font-bold text-slate-600 tabular-nums`
- `AnnualBar`: barra relativa com linha pontilhada vertical na posição `value%` e label pequeno `value%` acima
- `acumuladoAno` em `text-[10px] text-slate-400 mt-1 block`

**Modo extrapolado:**
- Label `"% EXTRAPOLADO"` em `text-[10px] font-bold text-red-500`
- Percentual: `text-xl font-bold text-slate-600 tabular-nums`
- Barra vazia: `h-1.5 w-full bg-slate-100 rounded-full`

---

## 6. Sub-componentes

### `DeltaTriangle`
CSS puro — triângulo sólido sem SVG.
- `up=true`: `border-l-[6px] border-r-[6px] border-b-[9px] border-transparent border-b-green-500`
- `up=false`: `border-l-[6px] border-r-[6px] border-t-[9px] border-transparent border-t-red-500`

### `MiniSparkline`
- SVG com `viewBox="0 0 80 40"`, `height="40"`, `width="100%"`
- Normaliza dados para 0–40 faixa vertical
- `polyline` com `stroke={color}` e `fill="none"` + dots
- Container: `border border-orange-200 bg-orange-50/20 rounded p-1`

### `ThinBar`
- `h-1.5 w-full bg-slate-100 rounded-full overflow-hidden`
- Fill: `h-full rounded-full` com largura = `Math.min(value, 100)%`

### `AnnualBar`
- Container: `relative h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mt-1`
- Fill: `h-full rounded-full` com `width={Math.min(value,100)}%`
- Marker: `absolute top-[-4px] h-[calc(100%+8px)] border-l border-dashed border-slate-400` em `left={Math.min(value,100)}%`
- Label acima: `absolute text-[9px] text-slate-500` posicionado sobre o marker

### `NoSemanalBox`
```
div: h-10 rounded border border-slate-200 bg-slate-100 flex items-center justify-center
span: text-[10px] text-slate-400 italic → "Sem visão Semanal"
```

---

## 7. Dados Mock (KPI 1–6)

Referência no arquivo `app/api/gd/route.ts`. Destaques:

| KPI | Seção | Confiança | Extrapolado |
|-----|-------|-----------|-------------|
| 1 — Vendas GD (MWh) | Semanal | Confiante | não |
| 2 — Recebimento (R$MM) | Semanal | Confiante | não |
| 3 — Recebimento NEWCO/EF/BTC (R$ mil) | Semanal | Risco | não |
| 4 — Distrato em usinas (R$ MM) | Semanal | Atenção | não |
| 5 — Crédito GD acumulados (GWh) | Mensal | Atenção | sim |
| 6 — Nº de UCs Ativas (# mil clientes) | Mensal | Confiante | não |

---

## 8. Regras de Implementação

1. Componente `GDKpiTable` é server-safe — sem `'use client'`
2. Sem imports de shadcn `Table/*` — usar divs com CSS grid
3. Linhas de dados têm `border-b border-slate-100` e `py-3 px-2`
4. Separadores são filhos diretos do flex-col externo — não ficam dentro do grid
5. `GDModule.tsx` não muda — já passa `data` corretamente
6. Altura das linhas não é fixada — conteúdo determina altura organicamente
