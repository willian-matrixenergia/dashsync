# PRD (Product Requirements Document) - Dashboard Comercial PPA

## 1. Visão Geral do Produto
O módulo "Comercial PPA" é uma view fidedigna e de alta densidade de dados dentro do SyncDash Matrix. Seu design alterna componentes contrastantes (Dark e Light) para segregar a leitura macro (Rentabilização Global) das sub-métricas (Originação, Comissionamento e Renegociação). O objetivo é apresentar aos executivos a evolução clara das metas semanais, mensais e anuais.

## 2. Padrões Visuais (Design System & Identidade)
A tela se baseia rigorosamente na paleta de cores institucional da Matrix Energia:
- **Cor Primária (Destaque/Marca):** Laranja Matrix (`#FF6B00`)
- **Cores de Fundo (Backgrounds):** 
  - Preto Absoluto / Cinza Chumbo (`#000000` / `#151B1C`) para o Painel Esquerdo.
  - Branco Puro (`#FFFFFF`) para os cards da direita.
  - Cinza Pálido (`#F1F3F0`) para barras de subtítulo.
- **Tipografia:** Família sem serifa (Lexend preferencialmente), com peso `Bold` para os números em destaque e `Light/Regular` uppercase com tracking (espaçamento) para subtítulos.
- **Cores Semânticas de Variação:**
  - Positivo/Crescimento: Verde vibrante (ex: `#8CC63F` ou `#22C55E`)
  - Negativo/Queda: Vermelho sangue (ex: `#DC2626` ou `#E50000`)
  - "Confiante" (Badge): Fundo verde suave sólido com texto branco.

## 3. Detalhamento Estrutural do Layout

A interface é dividida em **Cabeçalho Principal** e **Corpo de Conteúdo** (estruturado em uma grade assimétrica de duas colunas: Esquerda ~35% e Direita ~65%).

---

### 3.1. Cabeçalho (Header)
- **Fundo:** Cinza muito escuro/Chumbo.
- **Borda Inferior:** Linha grossa (border-b-4) na cor Laranja Matrix.
- **Textos:** 
  - Esquerda: `COMERCIAL - PPA` (Branco, Bold) seguido de pipe `|` e texto secundário `Semana 09Fev vs. Semana 02Fev` (Branco/Cinza claro, Regular).
  - Direita: `Fev - 2026` (Laranja Matrix, Bold, alinhado à direita).
- **Faixa Subtítulo:** Logo abaixo da linha laranja, uma faixa contínua cinza claro (`#F1F3F0`) com texto escuro: `Rentabilização dos Contratos - PPA (R$ mil)`.

---

### 3.2. Painel Esquerdo ("Rentabilização Global")
Este bloco tem um peso sombrio (Dark Mode nativo constante) com alto contraste no Laranja.
- **Container:** Background Preto/Cinza profundo borda superior grossa Laranja Matrix (`border-t-8`).
- **Título da Sessão:** `RENTABILIZAÇÃO DOS CONTRATOS (R$ mil)` em letras Brancas, Bold, Maiúsculas. Linha separadora branca fina abaixo e entre todas as subseções.
- **Subseção 1: Valores Atuais**
  - Coluna 1: Label `ATUAL` (Cinza muito sutil). Valor: `R$ 3,893 k` (Gigante, Bold, Laranja).
  - Coluna 2: Label `VS. ÚLTIMA SEMANA` (Cinza autil). Valor: `-R$ 1,840k` (Branco, Bold).
  - Ícone de Tendência: Seta geométrica maciça vermelha apontando para baixo (Triângulo Equilátero, preenchimento sólido sem contorno).
- **Subseção 2: Atingimento Mensal**
  - Label: `ATINGIMENTO MENSAL`
  - Valor: `208%` (Grande, Laranja) seguido inline de `de R$ 2,862 k` (Pequeno, Cinza).
  - Barra de Progresso: Fundo base laranja sutil apagado, preenchimento até o topo em Laranja vibrante. 
  - Badge: Botão visual não-clicável verde escrito `Confiante` (Canto do lado direito sob a barra).
- **Subseção 3: Evolução Semanal**
  - Label: `EVOLUÇÃO SEMANAL (FEVEREIRO)`
  - Gráfico Mini (Sparkline): Dentro de um card interno cinza-médio com borda raio e fina.
  - Line Chart com pontos focais preenchidos em `S1` e `S2`. Linha crescente conectando do ponto 1 ao 2. A cor do traçado e dos dots (círculos) é Laranja. Labels "S1" e "S2" em fonte minúscula cinza sob o gráfico.
- **Subseção 4: Atingimento Anual**
  - Label: `ATINGIMENTO ANUAL`
  - Valores: `14%` (Laranja). Subtexto adicional superior indicando a meta base `6%` (alinhado a um marcador tracejado laranja). Abaixo: `de R$ 50,000k`
  - Barra de Progresso: Fundo cinza escuro. Preenchimento Laranja até 14%. Tracejado vertical laranja marcando os 6%.

---

### 3.3. Painel Direito (Detalhe de Indicadores)
O painel da direita possui proporção Light Mode (Fundo Branco em cada card). São três linhas exatas (`Originação`, `Comissionamento`, `Renegociação`). Todos possuem fundo branco, borda fina cinza clara em volta, contudo a Borda Superior é Laranja espessa. Cada linha possui 4 colunas delineadas com uma pequena borda entre si:

#### 3.3.1. Row 1: ORIGINAÇÃO
- **Cabeçalho Interno:** Título `ORIGINAÇÃO` cor Laranja, maiúscula, cantos direntos esquerda superior.
- **Col 1 (Evolução Financeira):**
  - Label `ATUAL`: `R$ 39.6 k` (Laranja, Grande).
  - Label `SEMANA`: `-R$ 343 k` (Maior, Chumbo/Preto) acompanhado de Seta Vermelha maciça (para baixo).
- **Col 2 (Atingimento Mensal):**
  - Título da coluna da cor Laranja. Textos: `18%` (Laranja) `de R$ 2,289 k` (Cinza).
  - Progress Bar preenchendo apenas 18% em laranja. Fundo da progressão é um laranja muito pálido (quase cinza gelo).
  - Footnote: `acumulado mês atual: R$ 422 k` (Cinza fraco/pequeno).
- **Col 3 (Evolução Semanal Gráfico):**
  - Título Laranja. Background do inner-chart possui contorno laranja pálido ou borda fina, fundo ligeiramente off-white (ou branco contornado). 
  - Gráfico descendo de `S2` para `S3`. Tracejado em laranja e dots em laranja.
- **Col 4 (Atingimento Anual):**
  - Título Laranja. Textos: `1%` (Laranja) `de R$ 40,000 k` (Cinza).
  - Progress Bar minimamente preenchida (1%). Fundo da barra laranja translúcido/cinza claro.
  - Footnote: `acumulado ano: R$ 543 k`.

#### 3.3.2. Row 2: COMISSIONAMENTO
- Título: `COMISSIONAMENTO` (Laranja).
- **Col 1:** `ATUAL`: `-` (Hífen laranja). `SEMANA`: `+R$ 68.2 k` (Preto) + Seta Verde (cima).
- **Col 2:** `24%` (Laranja) `De -R$ 286 k`. Barra no terço inicial (24%). Acumulado mês atual: `-R$ 68.2 k`.
- **Col 3:** Linechart crescente do marcador `S1` para `S2` em laranja.
- **Col 4:** `2%` (Laranja) `de R$ 5,000 k`. Barra 2%. Acumulado ano: `-R$ 101 k`.

#### 3.3.3. Row 3: RENEGOCIAÇÃO
- Título: `RENEGOCIAÇÃO` (Laranja).
- **Col 1:** `ATUAL`: `R$ 3,893 k` (Laranja). `SEMANA`: `+R$ 1,840 k` (Preto) + Seta Verde (cima).
- **Col 2:** `693%` (Laranja) `de R$ 859 k`. Barra cheia (overflow) simulada. Acumulado mês atual: `R$ 5,946 k`.
- **Col 3:** Linechart crescente de `S1` para `S2` em laranja.
- **Col 4:** `46%` (Laranja) `de R$ 15,000 k`. Barra quase ao meio (46%). Acumulado mês atual (ou ano indicado): `R$ 6,945 k`.

## 4. Requisitos de UI / Resiliência
- **Triângulos Direcionais:** Os ícones de crescimento (Seta Verde Cima / Seta Vermelha Baixo) e os marcadores laterais não devem usar SVGs com pontas arredondadas (como o `Chevron` do lucide-react), mas sim polígonos sólidos perfeitamente retos como na imagem de mock. Recomenda-se renderização de bordas mágicas do CSS moderno se não houver asset isolado (Ex: `border-left/right: transparent; border-bottom: solid color`).
- **Gráficos (Evolução Semanal):** Devem ser construídos com mini SVGs customizados e leves (`Sparklines`) integrados ou via bibliotecas limpas como recharts, limitando os nós do gráfico unicamente à área útil do contorno do card. As labels ("S1, S2, S3") ficam dispostas em row, rentes ao gráfico.
- **Alinhamento:** Todo o grid deve manter os baselines tipográficos alinhados horizontalmente (ex: todas as barras de Atingimento Mensal e Anual dividem a mesma linha perfeitamente).
