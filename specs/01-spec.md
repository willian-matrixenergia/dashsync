# 01-spec.md - SyncDash Pixel-Perfect UI Spec

## Objetivo
Garantir que as páginas desenvolvidas no projeto React (Next.js) sejam **100% fiéis** às telas geradas no Stitch MCP (Projeto: *Matrix Energia Pure Light - PRD*). O layout, grid, espaçamentos e tokens do Tailwind devem refletir exatamente o HTML de referência.

## Referencial Fonte (Stitch HTMLs)
As seguintes 4 telas foram exportadas e auditadas para formar esta especificação:
1. `f7808a92c97f482b95efdcf6ebef0b7c` -> **Portfolio Management** (Dashboard Principal)
2. `8a287d54735c4b42bf56ecf837adc510` -> **Phases & Progress**
3. `b6933821e66242aaa73aab81e42d4613` -> **Media Gallery** (Photographs & Videos)
4. `11e43c4808a04cefbe9431484f26adc7` -> **Real-time Monitoring**

---

## 1. Global Setup & Design Tokens

### Tailwind Config (Obrigatório)
As cores no `tailwind.config.ts` devem mapear extamente para:
```json
{
  "primary": "#FF6600", // Laranja Matrix
  "background-light": "#F4F5F7",
  "background-dark": "#221710",
  "surface": "#FFFFFF",
  "text-main": "#0F172A", // Usado em text-text-main / text-primary
  "muted": "#64748B",
  "accent-red": "#DC2626", // Usado para High Risk
  "border-color": "#E2E8F0"
}
```
*Tipografia*: `Plus Jakarta Sans` para todo o projeto (fonte secundário Lexend se exigido estritamente pelo Manual, mas o Stitch usa Plus Jakarta Sans). O ícone é `Material Symbols Outlined`.

---

## 2. Layout Master (Shell)
O Shell da aplicação é constante e difere radicalmente da implementação atual.
`body`: `bg-background-light dark:bg-background-dark text-text-main h-screen w-screen overflow-hidden flex flex-col font-display`.

### 2.1. Top Navigation (Header)
*   **Container**: `flex w-full flex-col bg-surface border-b border-border-color z-10`
*   **Logo/Títle**: SVG Laranja escuro + `Matrix Energia` (h2: `text-xl font-bold`) + Divider (`h-6 w-px`) + Contexto (`Command Center` / `Real-time Monitoring` etc).
*   **Nav Links**: Escondido no Mobile (`hidden md:flex`). Links ativos possuem `border-b-2 border-primary text-primary`. Inativos possuem `text-muted`.
*   **Trailing**: Ícone de Notificações + Avatar Redondo (`size-8` ou `size-10`). (Em algumas telas inclui um Search bar).

### 2.2. Page Layout (Main Area)
A estrutura interna se divide geralmente na proporção **20/80 (ou 25/75)** entre Sidebar e Main Content.
*   **Wrapper**: `<div class="flex flex-1 overflow-hidden">`
*   **Sidebar (Left)**: `<aside class="w-1/5 bg-surface border-r border-border-color flex flex-col h-full overflow-y-auto">`
    *   *Conteúdo*: Título "Filters" + listas de checkboxes estilizados (ex: Criticality, Program Type) OU "Project Folders" em modo árvore.
*   **Content (Right)**: `<main class="w-4/5 flex flex-col h-full overflow-hidden bg-background-light p-6 gap-6">`

---

## 3. Especificação por Tela (Componentes Exatos)

### Screen 1: Portfolio Management (Dashboard.tsx)
*   **Sidebar**: Filtros (Criticality: All, High Risk, On Track; Program Type: Solar, Wind, Storage).
*   **Top KPI Bar**: Grid de 4 colunas (`grid grid-cols-4 gap-6 shrink-0`).
    *   Cards (h: `120px`): Total Projects, Total Power (MW), Physical Progress (%), Financial Progress (%).
*   **Details Table**: Lista de projetos ocupando `flex-1`.
    *   Classes da Tabela: `w-full text-left border-collapse`. Colunas: Project Name, Location, Status (Badges específicos), Budget, Timeline.
*   **Gantt Chart (Bottom)**: Gráfico inferior (`h-[250px] shrink-0`) simulando timeline real/planejada com barras sobrepostas.

### Screen 2: Phases & Progress (Screen2.tsx)
*   **Layout Alternativo**: A Sidebar nesta tela está dentro de um container centralizado `.max-w-[1440px]`. As abas de navegação principal movem para a Sidebar esquerda.
*   **Dashboard Grid**: `grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-[320px]`.
*   **Cards Específicos**:
    *   *S-Curve (Financial)*: SVG Chart com linhas Planejadas (slate) vs Reais (laranja).
    *   *Labor Histogram*: Barras horizontais agrupadas.
    *   *EPC Progress (Speedometers)*: Três speedometers lado a lado (Engineering, Procurement, Construction) criados com bordas redondas rodadas (`border-[8px] border-primary rotate-[45deg]`).
    *   *Milestone Scroller*: Barras de progresso empilhadas (Site Prep, Foundation, Superstructure).
    *   *Regional Map*: SVG abstrato com plot points mapeados por coordenada absoluta.

### Screen 3: Media Gallery (Screen3.tsx)
*   **Sidebar**: "Project Folders" estruturado em árvore (Northeast > Project Alpha > October 2023). Usa `expand_more` icons.
*   **Main - Top (60%)**: VR Viewer para 360 Tours. Container `bg-black` reproduzindo imagem 360 com overlays UI translúcidos (backdrop-blur-sm, border-white/10).
*   **Main - Bottom (40%)**: Carrossel Horizontal "October Documentation" exibindo miniaturas com timestamp e hover effects agressivos (`group-hover:scale-105`). Oculta barra de rolagem nativa.

### Screen 4: Real-time Monitoring (Screen4.tsx)
*   **Layout**: Wrapper divide 75/25 (`w-3/4` e `w-1/4`).
*   **Live Area (75%)**: Container com visualização de câmera (Crane Cam).
    *   *Overlays*: Badge "LIVE" vermelho pulsante, Status verde "4K 60FPS", Weather Widget no rodapé (Temperatura/Vento).
*   **Side Area (25%)**: Box "Timelapse". Histórico de progresso + controles de velocidade (1x, 5x, 10x) + Log vertical "Key Milestones".

---

## 4. Critérios de Aceite (AC)
1. **Fidelidade Visual**: O arquivo React gerado no DOM deve usar extemamente o mesmo markup estrutural (as mesmas tags e classes chave) encontradas no Stitch HTML.
2. **Nenhuma Adaptação de Sobras**: Código legado do Fastify (`flex flex-col` genéricos sem mapear a sidebar/main ratio) que conflite com este grid 20/80 deve ser substituído por completo.
3. **Consistência Tailwind**: Cores roxas/azuis do dashboard antigo devem ser banidas. O Tailwind target é Matrix Pure Light.
