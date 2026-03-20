# 02-plan.md - Plano de Implementação (Stitch Match)

## 🎯 Objetivo Arquitetural
Refatorar massivamente o componente `HomeClient.tsx` e seus filhos (`Dashboard.tsx`, `Screen2.tsx`, `Screen3.tsx`, `Screen4.tsx`) para descartar o layout antigo e implementar a exata estrutura HTML gerada no Stitch MCP, componente a componente.

## 🚧 Fases de Implementação

### Fase 1: Atualização dos Design Tokens
*   **Alvo:** `tailwind.config.ts`, `app/globals.css`.
*   **Ação:** Atualizar a paleta `theme.extend.colors` para os exatos valores do Stitch (`background-light`, `background-dark`, `text-main`, `border-color`, `surface`, etc.).
*   **Justificativa:** Sem isso, as classes do HTML costurado não aplicarão efeito.

### Fase 2: Refatoração do App Shell (`HomeClient.tsx`)
*   **Alvo:** `src/components/layout/HomeClient.tsx`
*   **Ação:** 
    *   Substituir toda a estrutura flex superior. 
    *   Implementar o componente de **Header/Top Navigation** fixo conforme o HTML `stitch_screen1`.
    *   Estruturar o wrapper `<div className="flex flex-1 overflow-hidden">` principal, que irá receber a `Sidebar` e o `Main Content` dependendo da tela ativa.
    *   (Nota: A aba 2 usa um layout diferente max-w-1440px. A lógica de shell do `HomeClient` precisará expor uma prop `layoutType` ou passar o controle total para cada Tela renderizar seu próprio layout estrutural. Para máxima fidelidade, o controle da Sidebar/Layout principal descerá para os componentes Screen).

### Fase 3: Reconstrução das Telas (Pixel-Perfect React Translations)
Esta é a fase pesada. O código React atual será apagado e trocado pelo React/JSX puro gerado ao converter o HTML Stitch.

1.  **Tab 1 (Portfolio Management) -> `Dashboard.tsx`**:
    *   Implementar a `<aside class="w-1/5">` com checboxes de filtro "Criticality" e "Program Type".
    *   Implementar `<main class="w-4/5">` com:
        *   Barra de 4 KPIs.
        *   Tabela "Project Details" com styling exato.
        *   Gráfico de Gantt "Timeline (Selected)".

2.  **Tab 2 (Phases & Progress) -> `Screen2.tsx`**:
    *   Aplicar o container centralizado `max-w-[1440px]`.
    *   Implementar o grid `grid-cols-3` e auto-rows 320px.
    *   Desenhar nativamente os SVGs de S-Curve, Histogram e Speedometers fornecidos pelo Stitch em componentes React locais isolados (`SCurve.tsx`, `SpeedometerGrid.tsx` etc. na pasta components, ou inline caso simples).

3.  **Tab 3 (Media Gallery) -> `Screen3.tsx`**:
    *   Sidebar: Estrutura de botões `folder_open`.
    *   Cima (60%): Container negro VR Tour com botões e badges absolutos.
    *   Baixo (40%): Componente de overflow-x ocultando scrollbar com aspect-video containers.

4.  **Tab 4 (Real-time Monitoring) -> `Screen4.tsx`**:
    *   Wrapper dividido entre 75% Live Feed e 25% Timelapse.
    *   Aplicar os CSS filters `bg-noise` e animações `animate-blink` (irão exigir extensão no Tailwind).

### Fase 4: Limpeza e Verificação
*   **Ação:** Excluir componentes legados que deixaram de ser usados (`ScreenNav.tsx` que foi movido para o header global, `KPICards.tsx` antigo, `ProjectTable.tsx` antigo se não for aproveitável) para evitar sujeira de código.
*   **Check:** Rodar `checklist.py`.

---

## 🚦 Decisões Técnicas Críticas (Requer Aprovação)
1. **Componentização vs Hardcode HTML**: O HTML do Stitch é rico, porém repetitivo (ex: Múltiplas Rows na tabela, múltiplos KPIs). O plano é pegar o JSX exato, transformá-lo em React (trocando `class` por `className`, fechando tags) e então usar `map()` para popular dados mockados visualmente fiéis, mantendo a responsividade do Stitch. **Concorda?**
2. **Abandono do Layout Antigo**: Confirmo que o design anterior será **totalmente jogado fora** a favor dessa UI Premium Spec-Driven. **Confirma o "override" das telas atuais?**

Se este plano for aprovado, iniciarei imediatamente a Fase 1 e 2.
