Como Arquiteto Líder, compilei a **SDD (Software Design Document)** definitiva. Este documento une a precisão técnica do Node.js/Tailwind com a fidelidade estética absoluta exigida pelo manual da marca e pelos dados operacionais da Matrix.

---

# SDD - Módulos Operacionais KPI (War Room) | Matrix SyncDash

## 1. Visão Geral e Escopo
O **Matrix SyncDash** é um ecossistema de monitoramento de performance em tempo real. Sua missão é converter o relatório "Indicadores Semanais" em uma interface viva. O sistema é otimizado para **War Rooms (TVs)**, tablets de gestão e smartphones operacionais, garantindo que a hierarquia de informação e as cores de status sejam idênticas em qualquer dispositivo.

---

## 2. Diretrizes de Design System (Brand Guidelines)
A implementação deve utilizar o arquivo de configuração do **Tailwind CSS** para centralizar a identidade visual:

* **Tipografia:** Primária `Inter` ou `Roboto`. Utilizar `font-feature-settings: 'tnum'` (tabular-nums) em todas as células numéricas para garantir alinhamento vertical perfeito de valores financeiros e decimais.
* **Paleta de Cores (Tailwind Config):**
    * `bg-matrix-dark`: `#121212` (Fundo de tela cheia).
    * `bg-matrix-panel`: `#1E1E1E` (Fundo de cards e linhas de tabela).
    * `text-matrix-orange`: `#FF6B00` (Primária - Logotipo, títulos de destaque e destaques de navegação).
    * `text-matrix-silver`: `#E0E0E0` (Texto principal/numérico).
    * `text-matrix-muted`: `#94A3B8` (Legendas e IDs de KPI).
* **Semântica de Status:**
    * **Confiante:** `bg-green-500/10` | `text-green-400` | Borda `border-green-500/20`.
    * **Atenção:** `bg-amber-500/10` | `text-amber-400` | Borda `border-amber-500/20`.
    * **Risco:** `bg-red-500/10` | `text-red-400` | Borda `border-red-500/20`.

---

## 3. Especificação de Módulos e Fidelidade de Dados

### Módulo A: Geração Distribuída (Performance Semanal)
* **Layout:** Tabela densa com listras horizontais (Zebra-striping suave).
* **KPI 1 (Vendas GD):** Valor `553` / Target `1,895` | Atingimento `57%` | Status: **Confiante**.
* **KPI 2 (Recebimento):** Valor `3.6 MM` / Target `10.7 MM` | Atingimento `51%` | Status: **Confiante**.
* **KPI 3 (Newco/Bitcoin):** Valor `0` / Target `1,238` | Atingimento `0%` | Status: **Risco** (Destaque em Vermelho).
* **KPI 4 (Distrato):** Valor `3.3 MM` / Target `11.7 MM` | Atingimento `69%` | Status: **Atenção**.
* **KPI 5 (Crédito GD):** Valor mensal `3%`.
* **Nº UCs Ativas:** `18.6k` clientes (82% de `22.8k`) | Status: **Confiante**.

### Módulo B: Grande Sertão II (Operação Solar)
* **KPI 1 (Geração):** Real `4,133 MWh` / Target `18,038 MWh` (43% atingimento) | Status: **Confiante**.
* **KPI 2 (Irradiação):** Real `53.7` / Target `211.8` (47% atingimento).
* **KPI 3 (Disponibilidade):** Valor fixo mensal `98.8%` | Status: **Confiante**.

### Módulo C: Áreas Comerciais (PPA, Energia Fácil e BESS)
* **PPA:** Originação `R$ 39.6k` | Renegociação `R$ 3,893k` (693% do atingimento mensal).
* **Energia Fácil:** Funil com `86` novos clientes. Ícone de alta `▲` na formalização semanal. Faturamento exibido como `0%`.
* **BESS (Armazenamento):** Capacidade `86.4 MWh` (105%) | Faturamento `1,610k R$` (106%) | Status: **Confiante**.

### Módulo D: Funil de Operações Estruturadas
* **Visual:** Gráfico de pipeline/funil descendente.
* **Etapa Prospecção:** Valor `4,505.0 MM R$`. 
* **Micro-interação:** Badge de evolução ao lado do valor `↑ +5.0` com animação de pulso verde suave.

### Módulo E: Bitcoin e Uptime de Máquinas
* **Gráfico ASICS:** Line Chart com linha horizontal estática (Baseline) em `98.6%`. 
* **Regra de Negócio:** Meses sem dados devem exibir o rótulo: *"Valores são budget. Produto ainda não operacional"*.
* **Energia:** Barras comparativas. Real: `367` | Budget: `332`.

---

## 4. Arquitetura do Sistema e Funcionalidades de TV

### Backend (Node.js + Socket.IO)
1.  **Sincronização Ativa:** O servidor mantém uma conexão persistente. Ao detectar alteração no SQL/Data Warehouse, dispara o evento `broadcast_kpi_update`.
2.  **Payload Rigoroso:**
    ```json
    {
      "module": "comercial_bess",
      "data": { "atual": 86.4, "target": 82.2, "perc": 105, "status": "Confiante" },
      "timestamp": "2026-02-26T14:00:00Z"
    }
    ```

### Frontend e Modos de Exibição (TV/Desktop)
1.  **Grid Layout War Room:** Utilização de `grid-cols-12`. Módulos de Geração ocupam 8 colunas, enquanto Bitcoin e BESS ocupam 4 colunas laterais.
2.  **Carousel Inteligente (Modo TV):** * Alternância automática de "Páginas" a cada 15 segundos.
    * **Funcionalidade Preservada:** Se um mouse for detectado ou toque na tela, o timer do carrossel é pausado por 60 segundos.
    * Progresso visual (Progress Bar fina no topo) indicando quanto tempo resta para a próxima tela.
3.  **Animações de Atualização (Hot-Swap):** Quando o Socket.IO recebe um dado novo, a célula específica deve realizar um *flash* na cor `primary-orange` (0.5s) e atualizar o número com efeito de "contador subindo".

---

## 5. Requisitos Não-Funcionais e Resiliência
* **Performance:** Uso de `Chart.js` com a opção `parsing: false` para gráficos de alta densidade, garantindo 60fps em navegadores de Smart TVs.
* **Resiliência de Conexão:** * Implementação de um **Keep-Alive** visual.
    * Caso o Socket perca conexão, um indicador discreto `[OFFLINE]` surge em vermelho próximo ao relógio, mas os dados atuais permanecem na tela (evitando telas em branco na War Room).
* **Segurança:** Acesso restrito via IP da Matrix ou VPN, com cabeçalhos de autenticação via Token JWT no handshake do Socket.

---

**Aprovação do Arquiteto:** Esta SPEC está pronta para desenvolvimento. O foco deve ser a precisão dos decimais e a cor exata do `#FF6B00` sobre o fundo `#121212`.