# PRD (Product Requirements Document) - Dashboard Trading Energia

## 1. Visão Geral do Produto
O submódulo "Trading Energia" encabeça a aba de Trading & Risco. Seu objetivo é exibir a exposição líquida contratual ao longo da próxima década acoplada a tabelas sensíveis de KPIs de risco (VaR, MtM, CAIXA) e um teste de estresse (Stress Test) com perdas potenciais atreladas a saltos bruscos no PLD.

## 2. Estrutura de Layout e Design System
O visual da tela divide-se majoritariamente numa grid top-bottom de proporções áureas, ou seja, um Header com duas sessões superpostas (Esquerda/Direita) e uma faixa de rodapé longa ocupando toda a largura para o Stress Test.
A cor pilar será Laranja, utilizando contrastes de cinza e branco sólidos para planilhas.

### 2.1. Header Principal
- Fundo escuro (`#151B1C`), Título branco bold lado esquerdo: `TRADING ENERGIA`. Sufixo em itálico e menor `(fechamento sexta feira)`. Direita em Laranja o mês de referência: `Fev - 2026`.
- Fina e elegante linha laranja embaixo.

### 2.2. Sessão Superior Esquerda: Gráfico Exposição Líquida (GWh)
- **Título de Seção:** Laranja forte, all-caps. `EXPOSIÇÃO LÍQUIDA POR ANO (GWh)`.
- **Card Principal:** Borda Laranja outline contornando um box de fundo muito macio (Laranja/Amarelo claríssimo translúcido).
- **Gráfico de Barras em Eixo Y zero-center:**
  - Valores negativos caindo e positivos subindo. Barras Laranja.
  - X: Anos de 2026 até 2034.
  - Dados absolutos estáticos injetados na ponta das barras: 
    - 26: `236,9` / 27: `-1427` / 28: `-633,4` / 29: `-2028,7` / 30: `-1727,8` / 31: `-983,7` / 32: `-1419,2` / 33: `-1065,5` / 34: `-347,6`.
- **Rodapé do Gráfico (Abaixo do container):**
  - Legenda flutuando a esquerda: `Δ exposição em relação a semana anterior`
  - Um alinhamento (flex ou grid idêntico ao chart) para os sub-indicadores de ano:
  - Consistem numa seta massiva 3D com haste (Red ou Green) acompanhada de um texto:
  - 2026: Seta Red Down, `-38.9`
  - 2027 a 2031: Setas Green Up (`+18.4`, `+18.4`, `+18.0`, `+1.8`, `+0.4`).
  - 2032: Seta Red Down `-0.1`.
  - 2033 a 2034: Setas Green Up (`+0.8`, `+0.6`).

### 2.3. Sessão Superior Direita: Evolução Semanal - KPIs Chave
- **Layout de Tabela Clássica:** Fundo branco, com borda fina cinza.
- Título: Laranja, centralizado no container: `EVOLUÇÃO SEMANAL - KPIs Chave`.
- **Cabeçalho da Tabela:**
  - Colunas: KPI | Descrição | 30/01 | 06/02 | 13/02 (Esta última coluna tem header Laranja bold).
- **Larguras de coluna obrigatórias (table-layout: fixed):**
  - A tabela DEVE usar `table-layout: fixed` com `w-full` para que os `width` das colunas sejam respeitados.
  - KPI: `w-[110px]` — `whitespace-nowrap`
  - Descrição: `w-[180px]` — `whitespace-normal break-words` — texto menor `text-[11px]` itálico cinza claro
  - 30/01: `w-[60px]` — `text-right whitespace-nowrap`
  - 06/02: `w-[60px]` — `text-right whitespace-nowrap`
  - 13/02: `w-[60px]` — `text-right whitespace-nowrap font-bold text-primary`
  - **NÃO usar shadcn `<Table>` para esta seção** — o componente envolve o `<table>` em `<div overflow-auto>`, o que faz a tabela expandir horizontalmente e ignora qualquer `table-layout: fixed`. Usar **div com CSS grid** (`style={{ gridTemplateColumns: '120px 1fr 58px 58px 62px' }}`), igual ao padrão BESS/GD.
- **Corpo e Linhas:**
  - KPI e Células de Valores: Fonte Dark/Cinza. A coluna 13/02 sempre é Bold. A coluna de Descrição possui fonte menor, cinza claro e legibilidade cursiva/discreta com quebra de linha automática.
  - Valores chave linha-a-linha (Resultado Caixa, MtM 2026, VaR Trading 26/27, VaR Porfólio 26/27, PLD 2026, Exp. 2026*).
- Footnote: `*Exposição em MWh. Demais valores em R$ MM.`

### 2.4. Sessão Inferior: Stress Test
- **Título de Seção:** Laranja forte, cap. `STRESS TEST - Impacto por Cenário de Variação de PLD (MM R$)` encapsulado dentro do layout da Tabela.
- **Header Columns:** Cenário, 2026 a 2031, e Total*.
- **Body Columns:**
  - Linha 1: `Δ R$10/MWh` (Texto Laranja). Restante células com números negativos (ex: `-2.4`). Última coluna "Total*" Laranja: `-70.4`.
  - Linha 2: `Δ R$20/MWh`. Total `-140.8`.
  - Linha 3: `Δ R$50/MWh`. Total `-351.9`.
- Footnote Cinza: `*Total considera anos 2026-2031. Valores negativos indicam perda potencial.`

## 3. UI/UX
- Será priorizado CSS Grid para diagramação estrita da sessão de Gráfico e Setas Inferiores, garantindo alinhamentos sem biblioteca pesada de Charts, ou a simulação disto via DIVs estáticas repletas de cálculos porcentuais (inline-style width/height) como fizemos perfeitamente no BESS.
- A aba "Trading Energia" fará parte da hierarquização de sub-abas introduzida na refatoração, habitando `<TradingModule />`.
