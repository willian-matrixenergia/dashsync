# PRD (Product Requirements Document) - Dashboard Grande Sertão II

## 1. Visão Geral do Produto
O módulo "Grande Sertão II" apresenta a mesma estrutura de layout denso tabular (Data Table) estreada em Geração Distribuída, aplicando a densidade horizontal para gerir indicadores de volume e disponibilidade do complexo solar. 
O dashboard exibe KPIs com colunas focadas em comparativos Semanais, Mensais e Anuais, adotando a paleta Dark & Orange da Matrix Energia para visualização executiva de alta legibilidade.

## 2. Padrões Visuais e Identidade
- **Container e Header Global:** O cabeçalho possui fundo escuro (`#151B1C`) acompanhado de uma grossa borda inferior Laranja Matrix (`#FF6B00`).
- **Body do Módulo:** A tabela é baseada num Light Mode, com contrastes cinza nas bordas de limite de célula.
- **Divisores de Subseção:**
  - Faixa Horizontal Laranja com escrita "COM VISÃO SEMANAL" marcando os KPIs 1 e 2.
  - Faixa Horizontal Cinza Claro/Médio com escrita "VISÃO APENAS MENSAL" marcando o KPI 3.
- **Badges State:** Emprego de tags de status visualmente marcadas (ex: Fundo Verde `#8CC63F` indicativo de `Confiante`). As setas são polígonos sólidos perfeitamente retos como no padrão anterior.

## 3. Estrutura das Linhas da Tabela (Métricas)

Haverá exatamente as 10 colunas pré-establecidas. Seguem os dados chumbados a serem inseridos de maneira estocástica:

### 3.1. COM VISÃO SEMANAL
- **KPI 1: Geração de Energia x Energia Esperada (MWh)**
  - Atual (Semana): `4,133` (Laranja)
  - Target Mensal: `18,038` (Chumbo/Escuro)
  - Atingimento Mensal: Texto Laranja `43%` + Progress Bar preenchendo as medidas de 43% de forma sólida. Subtexto cinza `acumulado mês atual: 7,844 MWh`.
  - Confiança: Badge verde `Confiante`.
  - Semana: `422` (Laranja) + Seta Direcional Verde Maciça (para cima).
  - Evolução Semanal: Sparkline em Laranja representando curva ascendente em grid delimitado de placeholder.
  - Target Anual: `228,321` (Cinza escuro).
  - Atingimento Anual: Texto cinza escuro `10,5%` (na direita da barra como marcador absoluto a 17,5%). Preenchimento da barra é de ~10,5%. Subtexto `acumulado ano: 23,922 MWh`.

- **KPI 2: Fator de Irradiação (KWh/m2)**
  - Atual: `53.7` (Laranja)
  - Target Mensal: `211.8`
  - Ating. Mensal: `47%` + Bar parcial. Subtexto: `acumulado mês atual: 98.8 kWh/m²`
  - Confiança: `Confiante`
  - Semana: `8.6` (Laranja) + Seta Direcional Verde Maciça (cima).
  - Evolução Semanal: Sparkline em Laranja crescente.
  - Target Anual: `2,624`
  - Ating. Anual: `11,2%` barra e subtítulo. Marcador tracejado na barra aponta visualmente para a frente os `13,0%`. `acumulado ano: 293 kWh/m²`.

### 3.2. VISÃO APENAS MENSAL
- **KPI 3: Taxa de Disponibilidade (%)**
  - Atual: Texto Laranja Grande com asterisco `98.8%*` e itálico minúsculo `Resultado Janeiro` abaixo.
  - Target Mensal: Texto Cinza `98.6%`.
  - Atingimento Mensal: Sem progress bar numérico, há uma "Block Box" light-grey tracejada com a legenda centralizada "Dados Fevereiro" sobreposto e "Não recebidos" abaixo.
  - Confiança: Verde `Confiante`.
  - Semana: Vazado.
  - Evolução Semanal: Sub-box "Sem visão Semanal" assim como predeterminado para visões apenas mensais.
  - Target Anual: Texto Cinza `98.6%`.
  - Atingimento Anual: `100%` Texto forte escuro ao lado esquerdo da barra preenchida perfeitamente em Laranja translúcido/sólido fraco. Abaixo: subtexto "média ano: 98.8%".

## 4. Diferimento Técnico da Tela
- Todo o cabeçalho "GRANDE SERTÃO II" abriga agora um sufixo `(operação 7 dias na semana)` em letra branda cursiva. O alinhamento dos valores e centralização celular compartilha dos recursos flex-box ou CSS Grid da adaptação da aba Geração Distribuída. A largura e o espaçamento (`tabular-nums`) devem atuar em uníssono.
