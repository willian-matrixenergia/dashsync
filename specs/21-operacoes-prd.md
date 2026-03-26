# PRD (Product Requirements Document) — Dashboard Operações Estruturadas

## 1. Visão Geral do Produto

O submódulo "Operações Estruturadas" é o segundo slide da aba **Bitcoin & Operações**. O objetivo é exibir o **Funil de Vendas** da área comercial de projetos estruturados, comparando o volume atual de cada etapa com a semana anterior, além de indicadores financeiros pós-Business Case (FFC e MtM).

> **Nota de Negócio:** A visão é agregada por etapa do funil — não por projeto individual. O período de referência é semana atual (09Fev) vs. semana anterior (02Fev), dentro do mês de referência (Fev 2026).

---

## 2. Estrutura de Layout e Design System

A interface usa o mesmo padrão corporativo escuro do Bitcoin: header principal + faixa de subtítulo + três colunas de painéis.

### 2.1. Header Principal
- Fundo escuro (`#151B1C`).
- Esquerda: `OPERAÇÕES ESTRUTURADAS` em bold branco + pipe (`|`) + subtítulo `Semana 09Fev vs. Semana 02Fev` em branco opaco.
- Direita: `Fev · 2026` em Laranja Matrix (`#D95B00`).

### 2.2. Faixa de Subtítulo
- Fundo off-white (mesmo padrão Bitcoin).
- Esquerda: `Funil de Vendas (MM R$)` em texto pequeno escuro/cinza.

### 2.3. Layout de Três Colunas

Os três painéis são dispostos em `grid-cols-3` ocupando toda a largura disponível. Cada painel tem fundo branco (`#FFFFFF`) com borda fina cinza clara e sem `border-radius` (cantos retos).

#### Faixa de Cabeçalho dos Painéis (padrão comum)
- Fundo: Laranja Matrix (`#D95B00`), sem borda-radius (retangular).
- Conteúdo: badge circular branco sólido com número (`01`, `02`, `03`) em texto escuro/preto bold + título em CAIXA ALTA branco bold com tracking-widest.
- Badge numérico: círculo `~20px`, fundo branco, texto `#151B1C` bold, `text-xs`.
- Altura da faixa: `py-2 px-4`.

#### Painel 01 — CAPEX
- Faixa superior: Laranja Matrix com badge `01` + título `CAPEX`.
- Subtítulo abaixo: `Valores de projetos de CAPEX em cada etapa do Funil de venda` — fonte `text-xs text-slate-500`, padding `px-4 py-2`.
- Cabeçalho das colunas da tabela: `ATUAL` e `SEMANA` em `text-[10px] uppercase tracking-widest text-slate-400 font-bold`, alinhados à direita sobre as respectivas colunas.
- Tabela do Funil (ver seção 2.4).
- Rodapé de Target (ver seção 2.5).

#### Painel 02 — ASSET LIGHT
- Faixa superior: mesma cor Laranja Matrix, badge `02`, título `ASSET LIGHT`.
- Subtítulo: `Valores de projetos de Asset em cada etapa do Funil de venda`.
- Mesmos estilos de cabeçalho e tabela do Painel 01.
- Rodapé de Target.

#### Painel 03 — INDICADORES APÓS BUSINESS CASES
- Faixa superior: mesma cor Laranja Matrix, badge `03`, título `INDICADORES APÓS BUSINESS CASES`.
- **Sem** subtítulo descritivo.
- Dois sub-blocos internos separados por `mt-6`:
  - **FFC** (ver seção 2.6)
  - **MtM** (ver seção 2.6)
- **Sem** rodapé de target.

---

### 2.4. Tabela do Funil de Vendas (Painéis 01 e 02)

Cada tabela exibe as **7 etapas** do funil em linhas. Layout: `grid grid-cols-[auto_1fr_auto_auto]` ou equivalente.

| Coluna | Largura | Descrição |
|---|---|---|
| `#` | ~24px | Círculo com número da etapa. Etapas 1–3: fundo `slate-200`, texto `slate-500`. Etapas 4–7: fundo `orange-100`, texto `#D95B00` bold. |
| Etapa | flex-1 | Nome da etapa, `text-sm text-slate-700`. Etapa 6 (Fechamento) em bold. |
| `ATUAL` | ~80px, alinhado à direita | Valor em R$ MM, `text-sm font-bold text-slate-800 tabular-nums`. Exibir `—` (`text-slate-400`) se `null` ou `0`. |
| `SEMANA` | ~80px, alinhado à direita | Ver especificação abaixo. |

**Especificação da coluna SEMANA:**
- **Caso padrão (sem variação):** pílula retangular laranja (`#D95B00`) de ~28×6px, `rounded-full`, opacidade 80%.
- **Caso variação positiva** (`deltaSemanaMM > 0`): exibir ícone `↑` verde (`#22c55e`, `text-xs`) + valor delta em verde bold (ex: `+5.0`) + pílula laranja ao lado.
- **Caso variação negativa** (`deltaSemanaMM < 0`): exibir ícone `↓` vermelho + valor delta em vermelho + pílula laranja.
- Quando `atual === null`, a pílula laranja ainda aparece (rastreamento ativo da etapa).

**Espaçamento de linha:** `py-2.5 px-4`, `border-b border-slate-100` entre cada linha. Sem border na última linha.

**Altura total da tabela:** deve preencher o espaço disponível entre o subtítulo e o rodapé.

---

### 2.5. Rodapé de Target Anual (Painéis 01 e 02)

Cada painel CAPEX e Asset Light possui um rodapé fixo na parte inferior:

```
TARGET ANUAL PARA ETAPA FECHAMENTO    ← laranja, uppercase, underline
0%  de R$ 115 MM                       ← cinza escuro; percentual bold
[============================]          ← barra de progresso vazia (cor primária quando > 0)
```

- Painel CAPEX: meta `R$ 115 MM`.
- Painel Asset Light: meta `R$ 61 MM`.
- O percentual é calculado como: `(valorFechamento / targetAnual) * 100`.
- Usar componente `Progress` do shadcn/ui.

---

### 2.6. Painel 03 — Indicadores Pós-BC

O painel é dividido em dois sub-blocos verticais com espaçamento `mt-6` entre eles. Fundo branco como os demais.

#### Sub-bloco FFC
- Heading: `FFC` — `text-base font-bold text-slate-800`.
- Sub-heading: `FFC de projetos em negociação` — `text-xs text-slate-400 mt-0.5 mb-3`.
- Cabeçalho de colunas: `ATUAL` e `SEMANA` em `text-[10px] uppercase tracking-widest text-slate-400 font-bold`.
- Tabela com apenas as etapas **4, 5 e 6** (Proposta e BC, Negociação, Fechamento).
- Mesma estrutura de colunas `#` | Etapa | `ATUAL` | `SEMANA` da seção 2.4.
- Badges de número continuam o estilo de etapas 4–6 (fundo `orange-100`, texto laranja).

#### Sub-bloco MtM
- Heading: `MtM` — mesma tipografia do FFC.
- Sub-heading: `MtM de projetos em negociação`.
- Mesma tabela das etapas 4, 5 e 6 com os dados de MtM.

---

### 2.7. Rodapé Global
- Fundo escuro (`#151B1C`).
- Texto centralizado: `CONFIDENCIAL · USO INTERNO · BOARD · FEV 2026` em branco opaco/cinza claro, fonte pequena.

---

## 3. Dados de Referência (Mockup)

### Painel CAPEX

| # | Etapa | Atual (R$ MM) | Delta Semana |
|---|---|---|---|
| 1 | Prospecção | 4.505,0 | +5,0 (seta verde) |
| 2 | Qualificação | 510,0 | 0 |
| 3 | Diagnóstico | 1.200,0 | 0 |
| 4 | Proposta e BC | 992,0 | 0 |
| 5 | Negociação | 168,0 | 0 |
| 6 | Fechamento | — | 0 |
| 7 | Expansão | — | 0 |

- Target Fechamento CAPEX: `115` (R$ MM)

### Painel Asset Light

| # | Etapa | Atual (R$ MM) | Delta Semana |
|---|---|---|---|
| 1 | Prospecção | — | 0 |
| 2 | Qualificação | — | 0 |
| 3 | Diagnóstico | 40,0 | 0 |
| 4 | Proposta e BC | — | 0 |
| 5 | Negociação | 25,0 | 0 |
| 6 | Fechamento | — | 0 |
| 7 | Expansão | 7,0 | 0 |

- Target Fechamento Asset Light: `61` (R$ MM)

### Indicadores FFC

| # | Etapa | Atual (R$ MM) | Delta Semana |
|---|---|---|---|
| 4 | Proposta e BC | 118,0 | 0 |
| 5 | Negociação | 39,0 | 0 |
| 6 | Fechamento | — | 0 |

### Indicadores MtM

| # | Etapa | Atual (R$ MM) | Delta Semana |
|---|---|---|---|
| 4 | Proposta e BC | 420,0 | 0 |
| 5 | Negociação | 168,0 | 0 |
| 6 | Fechamento | — | 0 |

---

## 4. Estrutura de Dados/Tipos Esperada

```typescript
// Etapa do funil com valores agregados
export interface FunilEtapa {
  numero: number;         // 1–7
  nome: string;           // "Prospecção", "Qualificação", etc.
  atual: number | null;   // R$ MM; null = exibir "—"
  deltaSemanaMM: number;  // variação vs. semana anterior (positivo = entrada)
}

// Indicadores pós-BC (FFC e MtM) — apenas etapas 4, 5, 6
export interface IndicadorBC {
  numero: number;         // 4, 5 ou 6
  nome: string;
  atual: number | null;
  deltaSemanaMM: number;
}

export interface OperacoesData {
  semanaAtual: string;    // "09Fev"
  semanaAnterior: string; // "02Fev"
  mesReferencia: string;  // "Fev · 2026"
  capex: {
    etapas: FunilEtapa[];
    targetFechamentoMM: number; // 115
  };
  assetLight: {
    etapas: FunilEtapa[];
    targetFechamentoMM: number; // 61
  };
  ffc: IndicadorBC[];
  mtm: IndicadorBC[];
}
```

> **Nota para o agente técnico:** A API atual retorna `OperacaoDetail[]` (projetos individuais). O endpoint `/api/operacoes` deve ser **refatorado** para retornar `OperacoesData` com dados pré-agregados por etapa conforme a estrutura acima. O componente `OperacoesModule.tsx` deve ser **reescrito** para renderizar o layout de três colunas especificado, abandonando o layout de cards por projeto.

---

## 5. UI / UX Constraints

- **Sem Recharts** neste módulo — layout é tabular, não gráfico.
- Componentes shadcn permitidos: `Progress`, `Badge` (se necessário), `Separator`.
- Números formatados com vírgula decimal PT-BR: `4.505,0` (ponto milhar, vírgula decimal).
- O valor `0` ou `null` deve exibir `—` (em dash) na coluna ATUAL.
- A faixa de número da etapa (`#`) deve ser um círculo pequeno com o dígito centralizado.
- Layout responsivo não é prioridade — o módulo é projetado para tela larga (TV/desktop).
