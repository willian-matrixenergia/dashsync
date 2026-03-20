# Plan: UI Alignment (Stitch + Brand)

## Metodologia de Implementação
O alinhamento será feito em 3 fases: Fundação, Componentes e Refinamento.

### 1. Fundação (Estilos Globais)
- **`app/layout.tsx`**: Importar `Lexend` usando `next/font/google`.
- **`tailwind.config.ts`**: Adicionar tokens:
    - `matrix-orange`: `#FF4A00`
    - `matrix-graphite`: `#151B1C`
    - `matrix-offwhite`: `#F1F3F0`
- **`app/globals.css`**: Configurar reset e estilos base para scrollbars e backgrounds.

### 2. Componentização (Design System)
Refatorar componentes base para usar as novas cores:
- `KPICards.tsx`: Aplicar `bg-matrix-graphite` e bordas laranjas para estados críticos.
- `ProjectTable.tsx`: Cabeçalhos em grafite e listras sutis em off-white.

### 3. Layouts de Tela (Stitch Match)
- Ajustar `Screen2.tsx` (Curva S) para usar as cores da paleta na visualização do gráfico.
- Ajustar `Screen3.tsx` para suporte a exibição de mídia em grid moderno.
- Ajustar `Screen4.tsx` para visualização de monitoramento em tempo real com alertas em laranja.

## Verificação
- Comparar manualmente os componentes renderizados com os screenshots do Stitch.
- Validar se a fonte Lexend está sendo carregada corretamente.
