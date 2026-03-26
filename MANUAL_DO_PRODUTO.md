# Manual do Produto - SyncDash (Matrix Energia)

O **SyncDash** é um sistema de painéis de controle e monitoramento contínuo, desenvolvido em **Next.js** para a diretoria e gerência operacional da Matrix Energia. Ele consolida os principais indicadores de performance (KPIs) de diversos setores da empresa em uma interface única, fluida e com suporte a visualização em Videowalls (Modo Televisão).

---

## 🚀 Quickstart (Guia de Início Rápido)

### Pré-requisitos
- Node.js (versão 20+ recomendada)
- Gerenciador de pacotes (`npm`, `yarn` ou `pnpm`)

### Rodando o Projeto Localmente

1. **Instalação das dependências:**
   ```bash
   npm install
   ```
2. **Configuração de Variáveis de Ambiente:**
   Crie um arquivo `.env.local` na raiz do projeto configurando chaves de autenticação (NextAuth), banco de dados e URLs de API, conforme o `.env.example` do projeto.

3. **Iniciando o Servidor de Desenvolvimento:**
   ```bash
   npm run dev
   ```
   Acesse `http://localhost:3000` em seu navegador.

4. **Gerando o Build de Produção:**
   ```bash
   npm run build
   npm run start
   ```

---

## 🧭 Estrutura de Navegação

A interface principal do SyncDash foi projetada para minimizar cliques e maximizar a visualização de dados. A navegação acontece através de **Navegadores Principais** e **Subnavegadores**.

### 1. Navegador Principal (Abas Superiores)
Localizado no topo da tela, centralizado, no modo normal de visualização. As principais abas são:
*   ⚡ **Geração Distribuída:** Indicadores, evolução de receita e performance de usinas de GD.
*   ☀️ **Grande Sertão II:** Painel focado na operação do complexo solar.
*   📈 **Comercial:** Métricas de venda de energia estruturada e varejo.
*   📊 **Trading & Risco:** Gestão de portfólio, exposição líquida e visão contábil.
*   💻 **Bitcoin & Operações:** Acompanhamento de mineração de criptoativos e estruturação de novas operações.

### 2. Subnavegadores (Sub-abas)
Para otimizar o espaço da tela, os módulos mais complexos possuem uma navegação secundária (sub-navbar customizada) localizada logo acima do conteúdo principal do dashboard.
*   **Aba Comercial:** Permite navegar entre **PPA**, **Energia Fácil** e **BESS**.
*   **Aba Trading & Risco:** Permite navegar entre **Trading Energia** e **Trading Gás**.
*   **Aba Bitcoin & Operações:** Permite navegar entre as visões de **Bitcoin** e **Operações Estruturadas**.

Esses subnavegadores utilizam botões de rápido acesso, facilitando a transição de contexto sem necessidade de recarregar a página.

---

## 📊 Dashboards e Páginas

Abaixo detalhamos o escopo de dados esperado em cada módulo:

### Geração Distribuída (GD)
Foco em rentabilização, capacidade instalada e KPIs operacionais. Conta com tabelas de desempenho de usinas (`GDKpiTable`), indicadores de evolução mensal e status de injeção de energia na rede.

### Grande Sertão II
Monitoramento dedicado ao parque de geração solar, incluindo acompanhamento de geração (MWh), faturamento focado no ativo e evolução contábil de sua operação.

### Comercial
A diretoria comercial visualiza as metas vs. atingimento através de três "lentes" diferentes:
*   **PPA (Power Purchase Agreement):** Evolução de contratos de longo prazo (R$ mil e MWh).
*   **Energia Fácil:** Acompanhamento do modelo de varejo simplificado, visualizando o funil de vendas (número de contratos e montante em R$ mil).
*   **BESS (Sistemas de Armazenamento de Energia em Baterias):** Rentabilização de contratos e faturamento associado às baterias.

### Trading & Risco
A principal tela para gestão de risco de mercado.
*   **Trading Energia:** Análise de exposição (Exposição Líquida Chart), geração de caixa (Cash Gen Chart), Mark-to-Market (MtM) e Stress Test (Heatmap de calor).
*   **Trading Gás:** Evolução e controle de posições no mercado de gás natural.

### Bitcoin & Operações
*   **Bitcoin:** Monitoramento do parque de mineração próprio (hashrate, custos operacionais) e cotações atreladas à receita.
*   **Operações Estruturadas:** Controle de derivativos, limites de contrapartes e outros produtos financeiros customizados.

---

## 🎨 Funcionalidades Especiais da Interface

O SyncDash inclui recursos criados para melhorar a usabilidade em diferentes ambientes, desde notebooks até grandes monitores nas salas de reunião.

### 🌓 Dark Mode / Light Mode
O sistema suporta alternância completa entre temas visuais (Dark e Light) através de um ícone de "Sol/Lua" localizado na barra superior à direita.
*   **Como funciona:** Utiliza a biblioteca `next-themes` integrada com o Tailwind CSS e a biblioteca de componentes `shadcn/ui`. Ao trocar o tema, todos os gráficos (`Chart.js` / `Recharts`), fundos e textos são atualizados dinamicamente sem recarregar os dados, garantindo ergonomia visual (ideal para salas com baixa luminosidade).

### 📺 Modo Televisão (TV Mode)
O recurso mais poderoso para **Videowalls e apresentações automáticas**. Ele transforma o painel interativo em um carrossel autônomo.

*   **Ativação:** Pode ser ativado/desativado pelos ícones de "Play/Pause" ou "Ícone de TV" no canto superior direito.
*   **Comportamento:** 
    *   Ao ativar, os menus laterais, avatares de usuário e botões excessivos são ocultados para focar apenas nos dados (`Fullscreen effect`).
    *   Uma **Barra de Progresso (Progress Bar)** vermelha, localizada no topo absoluto da tela, indica visualmente o tempo restante para a troca da tela (intervalo padrão configurado para 15 segundos).
    *   O sistema passa automaticamente por **todos os subnavegadores de todas as abas** (ex: Comercial PPA -> Comercial Energia Fácil -> Comercial BESS -> Trading Energia, etc.).
*   **Controles Manuais:**
    *   Mesmo em Modo TV, o usuário pode assumir o controle clicando nas **Setas (Anterior `<` / Próximo `>`)**.
    *   **Paginação (Dots/Pílulas):** Na barra superior, há pequenos pontos ("dots"). O painel atual é representado por um formato em "pílula" vermelha (Vermelho Matrix). Ao clicar nesses pontos, o slide pula diretamente para o respectivo dashboard, resetando temporariamente o timer (barra de progresso).

---

## 🛠️ Stack Tecnológica

*   **Framework:** Next.js (App Router, Turbopack)
*   **Estilização:** Tailwind CSS + `shadcn/ui` (Radix UI)
*   **Animações:** GSAP (GreenSock) para transições de tela e entrada dos gráficos (`useGSAP`).
*   **Autenticação:** NextAuth.js (gerenciando controle de acesso à API e à sessão do usuário).
*   **Gráficos:** Recharts / Chart.js.
