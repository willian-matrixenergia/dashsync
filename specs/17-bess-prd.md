# PRD — Comercial: BESS
**Versão:** 2.0 — alinhado ao mockup aprovado (Mar 2026)

---

## 1. Objetivo

Reescrever `BESSModule.tsx` para que corresponda pixel-a-pixel ao mockup aprovado.
O módulo exibe **3 indicadores em layout de tabela horizontal** (List View), cada um ocupando uma linha completa com 6 colunas.

**Arquivo alvo:** `src/components/modules/commercial/BESSModule.tsx`
**API:** `GET /api/commercial/bess` → `BESSMetrics`

---

## 2. Layout Geral

```
┌───────────────────────────────────────────────────────────────────────────────┐
│  CABEÇALHOS DAS COLUNAS  (faixa laranja-texto, full-width)                    │
├─────┬──────────────┬─────────────┬────────────┬────────────────┬──────────────┤
│ ▌01 │ VALOR ATUAL  │ VS MÊS ANT. │ ATING.MEN. │ EVOLUÇÃO 2026  │ ATING.ANUAL  │
├─────┼──────────────┼─────────────┼────────────┼────────────────┼──────────────┤
│ ▌02 │              │             │            │                │              │
├─────┼──────────────┼─────────────┼────────────┼────────────────┼──────────────┤
│ ▌03 │              │             │            │                │              │
└─────┴──────────────┴─────────────┴────────────┴────────────────┴──────────────┘
```

O componente inteiro usa fundo branco (`bg-white`), sem padding externo.
Renderiza dentro do `CommercialModule` que já provê header escuro + faixa subtítulo.

---

## 3. Grid de Colunas

```tsx
// Grid base (aplicado ao header + cada row)
className="grid grid-cols-[200px_130px_110px_1fr_1fr_170px]"
```

| Coluna | Largura | Conteúdo |
|---|---|---|
| INDICADOR | `200px` | Nome + badge de unidade |
| VALOR ATUAL | `130px` | Número grande colorido + "mês anterior: -" |
| VS MÊS ANTERIOR | `110px` | Pílula "No Data" |
| ATINGIMENTO MENSAL | `1fr` | Percentual + legenda + barra + badge |
| EVOLUÇÃO 2026 | `1fr` | Mini area chart mensal |
| ATINGIMENTO ANUAL | `170px` | Percentual + barra com marcador + "Ano" |

---

## 4. Linha de Cabeçalho das Colunas

Faixa sobre as 3 linhas de dados. Fundo `bg-slate-50`, borda inferior `border-b border-slate-200`.

```tsx
<div className="grid grid-cols-[200px_130px_110px_1fr_1fr_170px] px-0 py-2 bg-slate-50 border-b border-slate-200">
  <span className="pl-5 ...">INDICADOR</span>
  <span>VALOR ATUAL</span>
  <span>VS MÊS ANTERIOR</span>
  <span>ATINGIMENTO MENSAL</span>
  <span>EVOLUÇÃO 2026</span>
  <span>ATINGIMENTO ANUAL</span>
</div>
```

Estilo dos labels: `text-[10px] uppercase tracking-widest text-[#D95B00] font-bold`

---

## 5. Linha de Dados (`BESSRow`)

Cada linha ocupa o grid de 6 colunas. Separadas por `border-b border-slate-100`.

**Borda esquerda colorida:**
```tsx
<div
  className="grid grid-cols-[200px_130px_110px_1fr_1fr_170px] border-b border-slate-100 items-center py-4"
  style={{ borderLeft: `4px solid ${cor}` }}
>
```

**Paleta por linha:**

| Linha | Indicador | Cor |
|---|---|---|
| 1 | Capacidade Instalada Faturando | `#FF4A00` |
| 2 | MWh Médio por Projeto | `#C6651E` |
| 3 | Faturamento Total | `#8A4B1D` |

---

## 6. Coluna: INDICADOR

```tsx
<div className="pl-4 flex flex-col gap-2">
  <span className="text-sm font-bold text-slate-800 leading-tight">{nome}</span>
  <span
    className="text-[10px] font-bold px-2 py-0.5 rounded border self-start"
    style={{ color: cor, borderColor: cor }}
  >
    {unidade}
  </span>
</div>
```

- Badge é outlined (ghost): só borda + texto na `cor` da linha, fundo transparente.
- Unidades: `"MWh"` / `"R$ mil / MWh"` / `"R$ mil"`

---

## 7. Coluna: VALOR ATUAL

```tsx
<div className="flex flex-col gap-0.5 px-2">
  <span
    className="text-4xl font-bold tabular-nums leading-none"
    style={{ color: cor }}
  >
    {valor}
  </span>
  <span className="text-[10px] text-slate-400 mt-1">mês anterior: -</span>
</div>
```

- Valores: `"86.4"` / `"16.9"` / `"1.610"` (com `.toLocaleString('pt-BR')` para faturamento)

---

## 8. Coluna: VS MÊS ANTERIOR

```tsx
<div className="flex items-center justify-center px-2">
  <span className="text-xs font-medium text-slate-600 bg-slate-100 border border-slate-200 rounded-md px-3 py-1.5">
    No Data
  </span>
</div>
```

---

## 9. Coluna: ATINGIMENTO MENSAL

```tsx
<div className="flex flex-col gap-1 px-3">
  {/* Percentual */}
  <span className="text-3xl font-bold tabular-nums" style={{ color: cor }}>
    {atingimentoMensal}%
  </span>
  {/* Legenda */}
  <span className="text-[11px] text-slate-400">de {targetMensalLabel}</span>
  {/* Barra (capped a 100% visualmente) */}
  <BESSProgress value={Math.min(atingimentoMensal, 100)} cor={cor} />
  {/* Badge confiança — direita inferior */}
  <div className="flex justify-end mt-1">
    <ConfiancaBadge v={confianca} />
  </div>
</div>
```

**`BESSProgress`** — barra simples:
```tsx
<div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
  <div className="h-full rounded-full" style={{ width: `${value}%`, backgroundColor: cor }} />
</div>
```

- Quando `atingimentoMensal > 100` a barra visual é exibida cheia (100%) mas o percentual mostra o valor real (ex: `"105%"`).

---

## 10. Coluna: EVOLUÇÃO 2026

Cada linha possui seu próprio mini area chart inline. Container:

```tsx
<div className="px-3">
  <div className="rounded-lg border border-orange-200 bg-orange-50/20 p-2">
    <BESSEvolutionChart data={evolution} valueKey={valueKey} budgetKey={budgetKey} cor={cor} />
  </div>
</div>
```

**`BESSEvolutionChart`** — SVG inline:
- `viewBox="0 0 300 80"` / `className="w-full h-16"`
- Eixo X: 12 meses (Jan…Dez) — labels `text-[9px]` abaixo
- **Área real** (meses com dado real): fill com `cor` em 20% de opacidade; linha sólida `cor` strokeWidth=2
- **Área projeção** (meses futuros / budget): fill com `cor` em 8% opacidade; linha tracejada `cor` strokeWidth=1.5 `strokeDasharray="4 3"`
- Dots (círculo `r=3`) nos pontos reais: `fill=cor stroke=white strokeWidth=1.5`
- Labels flutuantes nos pontos chave:
  - Primeiro ponto real: valor abaixo-esquerdo (ex: `"82.5"`)
  - Último ponto real / atual: valor acima (ex: `"86.4"`)
  - Último ponto budget (Dez): valor acima-direito (ex: `"160.4"`)
- Fonte dos labels: `font-size="8"` `fill="#94A3B8"`

---

## 11. Coluna: ATINGIMENTO ANUAL

```tsx
<div className="flex flex-col gap-1 px-3">
  {/* Percentual */}
  <span className="text-3xl font-bold text-slate-600 tabular-nums">
    {atingimentoAnual}%
  </span>
  {/* Legenda */}
  <span className="text-[11px] text-slate-400">de {targetAnualLabel}</span>
  {/* Barra com marcador */}
  <AnnualProgressWithMarker value={atingimentoAnual} cor={cor} />
  {/* Label "Ano" */}
  <span className="text-[9px] text-slate-400 text-center">Ano</span>
</div>
```

**`AnnualProgressWithMarker`** — barra + linha tracejada vertical:
```tsx
<div className="relative h-2 w-full bg-slate-100 rounded-full overflow-visible mt-1">
  {/* Preenchimento */}
  <div
    className="h-full rounded-full"
    style={{ width: `${Math.min(value, 100)}%`, backgroundColor: cor }}
  />
  {/* Marcador tracejado vertical */}
  <div
    className="absolute top-[-4px] bottom-[-4px] w-px"
    style={{
      left: `${Math.min(value, 100)}%`,
      borderLeft: `1.5px dashed ${cor}`,
    }}
  />
  {/* Valor flutuante acima do marcador */}
  <span
    className="absolute text-[9px] font-bold"
    style={{ left: `${Math.min(value, 100)}%`, top: '-14px', transform: 'translateX(-50%)', color: cor }}
  >
    {value}%
  </span>
</div>
```

- Nota: para linha 2 (MWh Médio), o marcador de target fica em 82% (valor diferente do atingimentoAnual=78%). Se necessário, adicionar prop `targetPct` separada. Por ora, usar `atingimentoAnual` como posição do marcador.

---

## 12. Ajuste nos Dados Mock (`app/api/commercial/bess/route.ts`)

O gráfico EVOLUÇÃO 2026 precisa de dados com rampa real → projeção. Atualizar `evolution`:

```ts
evolution: [
  // Real (Jan apenas — "Report Mensal Janeiro 2026")
  { mes: 'Jan', capacidade: 86.4, capacidadeBudget: 82.5,  mwh: 16.9, mwhBudget: 17.9,  faturamento: 1610, faturamentoBudget: 1515 },
  // Projeção Budget (Fev–Dez): capacidade null/undefined indica "futuro"
  { mes: 'Fev', capacidade: null, capacidadeBudget: 91.0,  mwh: null, mwhBudget: 18.1,  faturamento: null, faturamentoBudget: 1620 },
  { mes: 'Mar', capacidade: null, capacidadeBudget: 95.0,  mwh: null, mwhBudget: 18.4,  faturamento: null, faturamentoBudget: 1750 },
  // ... crescendo até Dez
  { mes: 'Dez', capacidade: null, capacidadeBudget: 160.4, mwh: null, mwhBudget: 21.8,  faturamento: null, faturamentoBudget: 3574 },
],
```

Atualizar `BESSMetrics` em `src/types/energy.ts`:
```ts
evolution: Array<{
  mes: string;
  capacidade: number | null;   // null = mês futuro
  capacidadeBudget: number;
  mwh: number | null;
  mwhBudget: number;
  faturamento: number | null;
  faturamentoBudget: number;
}>;
```

---

## 13. Critérios de Aceite

| # | Critério |
|---|---|
| AC-1 | Layout é uma tabela de 6 colunas, não cards empilhados verticalmente |
| AC-2 | Cada linha tem borda esquerda espessa na cor da linha (laranja → terra → marrom) |
| AC-3 | Cabeçalho de colunas em texto laranja uppercase sobre fundo `slate-50` |
| AC-4 | Valor atual colorido com a cor da linha (ex: 86.4 em laranja) |
| AC-5 | "No Data" é uma pílula cinza, não texto simples |
| AC-6 | Atingimento Mensal: barra colorida + badge "Confiante" verde alinhado à direita inferior |
| AC-7 | EVOLUÇÃO 2026: area chart inline por linha, com área real sólida e projeção tracejada |
| AC-8 | ATINGIMENTO ANUAL: barra com marcador tracejado vertical + label percentual flutuante + "Ano" |
| AC-9 | Gráficos de evolução separados (seção abaixo) removidos do layout |
| AC-10 | Fundo branco, não dark cards (`bg-card/50`) |
