# PRD — Comercial: Energia Fácil
**Versão:** 2.0 — alinhado ao mockup aprovado (Mar 2026)

---

## 1. Objetivo

Reescrever `EnergiaFacilModule.tsx` para que corresponda pixel-a-pixel ao mockup aprovado.
O módulo exibe um **Funil de Vendas em 3 etapas**: Originação → Fechamento → Faturamento.

**Arquivo alvo:** `src/components/modules/commercial/EnergiaFacilModule.tsx`
**API:** `GET /api/commercial/energia-facil` → `EnergiaFacilFunnel`

---

## 2. Layout Geral

```
┌────────────────────────────────────────────────────────┐
│  HEADER ESCURO  (full-width, border-b laranja)         │
├────────────────────────────────────────────────────────┤
│  FAIXA SUBTÍTULO  (cinza claro, full-width)            │
├─────────────────┬──────────────────┬───────────────────┤
│   CARD 01       │   CARD 02        │   CARD 03         │
│   ORIGINAÇÃO    │   FECHAMENTO     │   FATURAMENTO     │
│   (laranja)     │   (terra)        │   (marrom)        │
└─────────────────┴──────────────────┴───────────────────┘
```

O componente inteiro usa **fundo branco** (`bg-white text-slate-800`) com sombra e borda `rounded-xl border border-slate-200`.

---

## 3. Header

| Elemento | Especificação |
|---|---|
| Background | `#151B1C` |
| Borda inferior | `border-b-[3px] border-[#D95B00]` |
| Texto esquerda | `COMERCIAL – ENERGIA FÁCIL` — branco, bold, uppercase, tracking-widest |
| Separador | pipe `\|` — branco/50, `mx-2` |
| Texto secundário | `Semana 09Fev vs. Semana 02Fev` — branco/80, normal, `text-sm` |
| Texto direita | `Fev · 2026` — `#D95B00`, bold, `text-sm tracking-widest` |

---

## 4. Faixa de Subtítulo

```tsx
<div className="bg-slate-50 flex items-center px-6 py-2 border-b border-slate-200">
  <span className="text-xs text-slate-500 font-medium">Funil de Vendas (# e R$ mil)</span>
</div>
```

---

## 5. Grid de 3 Cards

`grid grid-cols-3 divide-x divide-slate-200`
Cada coluna recebe um componente `FunnelCard` com as props abaixo.

---

## 6. Anatomia de um FunnelCard

### 6.1 Header do Card

Faixa sólida de cor (varia por etapa). Altura: `py-2 px-4`.

```
[ badge número ] TÍTULO DO ESTÁGIO          UNIDADE
```

- **Badge:** círculo branco `size-5`, número em negrito `text-[10px] text-slate-800`
- **Título:** `text-white font-bold text-sm uppercase tracking-widest`
- **Unidade** (lado direito): `text-xs text-white/80` — `"#"` para etapas 01/02, `"R$ MM"` para etapa 03

**Cores por etapa:**

| Etapa | Background |
|---|---|
| 01 ORIGINAÇÃO | `#FF4A00` (primary) |
| 02 FECHAMENTO | `#C6651E` |
| 03 FATURAMENTO | `#8A4B1D` |

### 6.2 Linha de Descrição

```tsx
<p className="px-4 py-2 text-[11px] text-slate-500 border-b border-slate-100">
  {subtitle}
</p>
```

### 6.3 Bloco ATUAL / SEMANA

Grid 2 colunas: `grid grid-cols-2 gap-0 px-4 pt-3 pb-2`

**Coluna ATUAL:**
```
ATUAL          ← text-[10px] uppercase tracking-widest text-slate-400
86             ← text-5xl font-bold (cor = themeColor da etapa)
# clientes     ← text-[11px] text-slate-400
```

**Coluna SEMANA:**
```
SEMANA         ← text-[10px] uppercase tracking-widest text-slate-400
+9             ← text-3xl font-bold text-slate-800
▲ alta         ← triângulo sólido verde (tamanho ~8px) + "alta" text-[11px] text-green-600 font-medium
```

- Quando `semana > 0`: triângulo ▲ verde (`border-bottom: 8px solid #16a34a`) + texto `"alta"` verde
- Quando `semana < 0`: triângulo ▼ vermelho + texto `"queda"` vermelho
- Quando `semana = 0` ou card em estado inativo: traço `"—"` cinza

**Badge Confiante** (flutua à direita da coluna SEMANA, mesmo nível do valor):
```tsx
<span className="text-[10px] font-bold px-3 py-1 rounded-full bg-green-500 text-white">
  Confiante
</span>
```
- Exibido somente quando `confianca === 'success'`
- `'warning'` → `bg-amber-500` + `"Atenção"`
- `'destructive'` → `bg-red-500` + `"Risco"`

Para o card **Faturamento** (inativo): Atual = `"—"`, Semana = `"—"`, sem badge.

### 6.4 Bloco ATINGIMENTO MENSAL

```
ATINGIMENTO MENSAL   ← text-[10px] uppercase tracking-widest text-[#D95B00] font-bold border-t border-slate-100 pt-3 px-4
```

Quando não há meta mensal vigente:
```tsx
<p className="text-[11px] text-slate-400 italic px-4 pb-3">
  *Meta mensal com início em Abril de 2026
</p>
```

Para o card Faturamento inativo:
```tsx
<p className="text-[12px] font-bold text-[#D95B00] px-4 pb-3">
  Faturamento de projetos ainda não iniciado
</p>
```

### 6.5 Bloco EVOLUÇÃO SEMANAL

Container com borda laranja suave e fundo laranja-pastel muito claro:

```tsx
<div className="mx-4 mb-3 rounded-lg border border-orange-200 bg-orange-50/30 p-2">
  {/* Sparkline SVG */}
  <SparklineChart data={evolution} color={themeColor} />
  {/* Labels S1, S2 */}
  <div className="flex justify-between mt-1 px-1">
    {evolution.map(p => (
      <span key={p.week} className="text-[10px] text-slate-400">{p.week}</span>
    ))}
  </div>
</div>
```

**Sparkline (`SparklineChart`):**
- SVG inline, `width="100%" height="48"`
- Linha conectando todos os pontos (sem curvas — `polyline` ou `path` com `L`)
- Cor da linha = `themeColor` da etapa, `strokeWidth="2"`, sem fill
- Dots: círculo `r="4"` preenchido com `themeColor`, `stroke="white" strokeWidth="2"`
- Para card Faturamento (valores todos zero): exibir linha reta horizontal no centro, muted (`#CBD5E1`)

### 6.6 Bloco ATINGIMENTO ANUAL

```
ATINGIMENTO ANUAL   ← text-[10px] uppercase tracking-widest text-slate-400 font-bold border-t border-slate-100 pt-3 px-4
1%                  ← text-xl font-bold text-slate-800 inline
de 21,923 contratos ← text-[11px] text-slate-400 ml-2 inline
<ProgressBar value={1} className="h-1.5 mx-4 mb-4" />
```

- Para Faturamento: `"0% de R$ 44,8 MM em contratos"`

---

## 7. Estado Inativo (Faturamento — Card 03)

O card inteiro **não** tem opacidade reduzida — apenas os valores são `"—"` e a cor do número omitida. A mensagem de "ainda não iniciado" substitui o atingimento mensal.

---

## 8. Dados da API → Props

`EnergiaFacilFunnel` (já existente em `src/types/energy.ts`):

```ts
originacao.clientes          → ATUAL (número inteiro)
originacao.semana            → SEMANA delta
originacao.atingimentoMensal → confianca (calculado: ≥80%=success, ≥40%=warning, else destructive)
originacao.targetAnual       → "de 21,923 contratos"
originacao.atingimentoAnual  → percentual barra anual
originacao.evolution         → [{week:'S1',value:77},{week:'S2',value:86}]
```

Mesma estrutura para `fechamento` e `faturamento`.

---

## 9. Paleta por Etapa (constante no componente)

```ts
const ETAPAS = [
  { numero: '01', titulo: 'ORIGINAÇÃO',  unidade: '#',      cor: '#FF4A00' },
  { numero: '02', titulo: 'FECHAMENTO',  unidade: '#',      cor: '#C6651E' },
  { numero: '03', titulo: 'FATURAMENTO', unidade: 'R$ MM',  cor: '#8A4B1D' },
] as const;
```

---

## 10. Texto de Legenda das Unidades

- Etapa 01: `# clientes`
- Etapa 02: `# contratos`
- Etapa 03: `R$ MM` (valor 0 exibe `"—"`)

---

## 11. Critérios de Aceite

| # | Critério |
|---|---|
| AC-1 | Cards 01/02/03 têm headers com cores distintas: laranja → terra → marrom |
| AC-2 | Valores ATUAL são coloridos com a cor da etapa; SEMANA é sempre slate-800 |
| AC-3 | Triângulo ▲ verde com texto "alta" aparece quando `semana > 0` |
| AC-4 | Badge "Confiante" verde aparece no card 01 e 02; card 03 não exibe badge |
| AC-5 | ATINGIMENTO MENSAL exibe footnote de meta futura (sem barra de progresso) |
| AC-6 | EVOLUÇÃO SEMANAL exibe sparkline com cor da etapa em box com borda laranja |
| AC-7 | Card 03 exibe "Faturamento de projetos ainda não iniciado" em laranja |
| AC-8 | Sparkline do card 03 é linha reta cinza (sem dados) |
| AC-9 | Layout branco com header escuro e faixa subtítulo cinza claro |
| AC-10 | Componente recebe `EnergiaFacilFunnel` via prop; não faz fetch direto |
