# PRD (Product Requirements Document) - Dashboard Trading Gás

## 1. Visão Geral do Produto
O submódulo "Trading Gás" é o segundo componente da aba de Trading & Risco. Seu objetivo é exibir a margem (Total e Spot), a exposição da carteira de gás sem budget comparativo e o acompanhamento de penalidades de transporte de gás numa janela de 12 meses (Janeiro a Dezembro).

## 2. Estrutura de Layout e Design System
O visual da tela consiste em um cabeçalho e quatro (4) blocos principais organizados em uma grid 2x2. Diferente da tela de Trading Energia (que usa preto e laranja majoritariamente na UI superior), aqui o fundo dos cartões é claro e os cabeçalhos internos dos blocos são destacados por uma faixa superior larga na cor laranja sólida (`#D95B00` ou similar ao Laranja Matrix).

### 2.1. Header Principal
- Fundo escuro (`#151B1C`).
- Esquerda: `TRADING GÁS` em bold branco. Logo à direita, separado por um "pipe" (`|`), o subtítulo `Report Mensal Janeiro 2026` em cinza claro/branco.
- Direita: `Fev - 2026` em texto Laranja.
- Abaixo do cabeçalho existe uma faixa fina muito sutil com fundo off-white/cinza contendo os dizeres na direita: `Valores apresentados com visão mensal.` em itálico e na esquerda um pequeno breadcrumb ou rótulo `Margem`.

### 2.2. Sessão 1 (Superior Esquerda): MARGEM TOTAL – R$ mil
- **Container:** Fundo branco, borda sutil.
- **Cabeçalho Interno:** Faixa laranja larga contendo o título em branco e em caixa alta: `MARGEM TOTAL – R$ mil`.
- **Gráfico (BarChart):**
  - Eixo X: Meses (Jan a Dez).
  - Eixo Y: Escala linear de 0 a 5000.
  - Dados representados por **barras duplas / sobrepostas / lado a lado (composição de valores reais vs budget)**. No mockup há uma barra Laranja alta para Janeiro (`4.284`) e uma barra Cinza menor ao lado/atrás (budget `1.963`). Nos demais meses apenas as barras cinzas de budget estão presentes.
  - No topo da barra Laranja de Janeiro, há um *badge* retangular preenchido (fundo laranja bem clarinho) destacando o percentual de atingimento: `218%`.
  - As labels `4.284` e `1.963` aparecem sobrepostas no topo ou base das barras de Janeiro. Os budgets (`1.963`, `1.589` etc.) aparecem nas bases de todos os meses.

### 2.3. Sessão 2 (Superior Direita): MARGEM SPOT – R$ mil
- **Container:** Fundo branco.
- **Cabeçalho Interno:** Faixa laranja: `MARGEM SPOT – R$ mil`.
- **Gráfico (BarChart):**
  - Mesma estrutura do Margem Total, eixos iguais.
  - Janeiro: Barra Laranja `2.810`, barra cinza (budget) `515`.
  - Badge no topo da Laranja com o percentual: `546%`.
  - Demais meses: apenas barras cinzas exibindo o budget de `515`.

### 2.4. Sessão 3 (Inferior Esquerda): EXPOSIÇÃO – R$ mil
- **Container:** Fundo branco.
- **Cabeçalho Interno:** Faixa laranja: `EXPOSIÇÃO – R$ mil (sem comparativo budget)`.
- **Gráfico (BarChart Simples):**
  - Eixo X: Meses (Jan a Dez).
  - Eixo Y: Escala 0 a 2000.
  - Como o nome sugere, sem budget. Apenas uma barra Laranja simples para o realizado.
  - Janeiro: `1.612,00`.

### 2.5. Sessão 4 (Inferior Direita): PENALIDADE DE TRANSPORTE – R$ mil
- **Container:** Fundo branco.
- **Cabeçalho Interno:** Faixa laranja: `PENALIDADE DE TRANSPORTE – R$ mil`.
- **Gráfico (BarChart Simples):**
  - Eixo X: Meses (Jan a Dez).
  - Eixo Y: Escala 0 a 50.
  - Apenas barra Laranja para o realizado.
  - Janeiro: `40,10`.

## 3. Comportamento e UI/UX
- **Tipografia e Cores:** As fontes numéricas sobre as barras devem ser limpas, fortes (bold) e sem excesso de zeros decimais (a menos que especificado, como na Exposição).
- O módulo compartilha o layout master do painel mas tem características próprias de `cards` com `CardHeader` sendo uma faixa preenchida na cor da marca.
- **Responsividade:** Em telas largas os blocos são 2x2. Em telas menores empilham em 1x4.

## 4. Estrutura de Dados / Tipagem (Mockup Base)
```ts
export interface TradingGasMetrics {
  margemTotal: number;
  margemTotalBudget: number;
  margemSpot: number;
  margemSpotBudget: number;
  exposicao: number;
  penalidade: number;
  atingimentoMargemTotal: number; // ex: 218%
  atingimentoMargemSpot: number;  // ex: 546%
  evolution: {
    mes: string; // Jan, Fev, etc
    margemTotal: number;
    margemTotalBudget: number;
    margemSpot: number;
    margemSpotBudget: number;
    exposicao: number;
    penalidade: number;
  }[];
}
```