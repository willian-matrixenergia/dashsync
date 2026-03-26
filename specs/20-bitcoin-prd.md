# PRD (Product Requirements Document) - Dashboard Bitcoin

## 1. Visão Geral do Produto
O submódulo "Bitcoin" é o segundo componente da aba de Inovação / Novos Negócios. O objetivo desta página é apresentar projeções orçamentárias (budget) e realizar o acompanhamento de 4 pilares chaves da operação de mineração: BTCs minerados, Uptime dos equipamentos (ASICs), Hashrate Nominal vs Efetivo, e Consumo/Custo de energia.

> **Nota Crítica de Negócio:** Conforme estabelecido no design, o produto ainda não está operacional. Os valores apresentados tratam-se exclusivamente da visão de Budget, cobrindo o período inteiro do ano de referência em uma visão mensal.

## 2. Estrutura de Layout e Design System
A interface é estritamente limpa e corporativa, abandonando cards avulsos para focar em grandes painéis gráficos organizados em uma grid 2x2 preenchendo o espaço da tela.

### 2.1. Header Principal
- Fundo escuro (`#151B1C`).
- Esquerda: `BITCOIN` em bold branco. Logo à direita, separado por um "pipe" (`|`), o subtítulo `Report Mensal Janeiro 2026` em branco opaco/cinza claro.
- Direita: `Fev - 2026` com coloração Laranja Matrix (`#D95B00` ou similar).
- Logo abaixo, faixa off-white contendo na esquerda "Margem" (em laranja) e na direita em itálico e cor cinza: `Valores são budget. Produto ainda não operacional`.

### 2.2. Organização Geral dos Gráficos (Aplica a todos)
- Quatro containeres (cards) grandes.
- Cada container possui uma faixa grossa superior na cor Laranja Matrix contendo o título em **CAIXA ALTA**.
- Background principal do gráfico em branco.
- Todos os gráficos compartilham o eixo X com a listagem de meses de "Jan" a "Dez".
- Eixo Y não exibe a linha vertical e os `ticks` (marcações) tradicionais, apenas linhas de grade sutis.
- Como o produto não está ativo, apenas a barra de `Budget` (cor Cinza Prata / Cinza Claro) é renderizada para cada mês. A barra `Actual` (Laranja) deve estar na legenda de todos os quadros (Laranja quadrado = Actual, Cinza quadrado = Budget), mas ausente/zerada visualmente no gráfico para meses futuros/atuais.
- Em cima de cada barra cinza de budget, deve constar o valor projetado respectivo em negrito escuro (preto/cinza muito escuro).

### 2.3. Quadrante 1 (Superior Esquerdo): BTC MINERADOS NO MÊS (#BTC)
- Título na faixa: `BTC MINERADOS NO MÊS (#BTC)`.
- **Eixo Y:** Escala oculta ou até o valor máximo do budget (em torno de 4 ou 5).
- Dados (Mockup Image): Jan=0.0 | Fev=1.6 | Mar=1.7 | Abr=2.8 | Mai=2.9 | Jun=2.8 | Jul=2.9 | Ago=2.9 | Set=2.8 | Out=2.9 | Nov=2.8 | Dez=2.9.
- O valor 0.0 do mês de Janeiro também deve ser desenhado flutuando acima da linha 0 do eixo.

### 2.4. Quadrante 2 (Superior Direito): UPTIME DOS ASICs (%)
- Título na faixa: `UPTIME DOS ASICs (%)`.
- Apenas este gráfico possui formatação com símbolo percentual (%) colado no valor flutuante da barra.
- Dados: Jan=0.0% | Fev=98.6% | Mar=98.6% | ... até Dez.

### 2.5. Quadrante 3 (Inferior Esquerdo): HASHRATE EFETIVO / HASHRATE NOMINAL (EH/s)
- Título na faixa: `HASHRATE EFETIVO / HASHRATE NOMINAL (EH/s)`.
- Dados decimais: Jan=0.00 | Fev=0.12 | Mar=0.12 | Abr=0.20 | ... até Dez.

### 2.6. Quadrante 4 (Inferior Direito): CONSUMO DE ENERGIA NA SEMANA E CUSTO (R$ '000)
- Título na faixa: `CONSUMO DE ENERGIA NA SEMANA E CUSTO (R$ '000)`.
- Valores inteiros grandes sem casas decimais.
- Dados: Jan=0 | Fev=332 | Mar=367 | Abr=603 | Mai=623 | Jun=603 | Jul=623 | Ago=623 | Set=603 | Out=623 | Nov=603 | Dez=623.

## 3. UI / UX Constraints
- **Gráficos (Recharts):** Utilizar `BarChart` do recharts.
- **Labels das Barras:** A propriedade `LabelList` no Recharts deve ser configurada para renderizar os dados sempre acima da barra. A cor deve ser preta/dark gray (`#151B1C` ou `#1e293b`), **em bold**.
- O espaçamento entre os gráficos deve dar respiro.

## 4. Estrutura de Dados/Tipos Esperada
```typescript
export interface BitcoinEvolution {
  mes: string;
  hashrate: number;
  hashrateBudget: number;
  btcMinados: number;
  btcBudget: number;
  uptime: number; // Percentual 0 a 100
  consumo: number;
  consumoBudget: number;
}
```
*Note que a API atual já possui esta exata estrutura preenchida. O agente técnico deverá apenas ajustar o front-end do `BitcoinModule.tsx` para refletir o wireframe especificado, focando em renderizar as barras da variável "Budget" no lugar de um card de "Real x Budget" lado a lado como existia antigamente.*