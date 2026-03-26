# Especificação: Modo TV (Auto-Rotation)

## 1. Visão Geral
O **Modo TV** foi criado para permitir a exibição contínua e automatizada dos dashboards da Matrix Energia em telas interativas ou Video Walls (ex: para apresentação ao CEO ou monitoramento em sala de controle). Como essas telas frequentemente não possuem mouse ou teclado de fácil acesso, o sistema cicla automaticamente pelas áreas de negócio.

## 2. Requisitos de Negócio (O Quê)
- O sistema deve alternar automaticamente entre os dashboards a cada intervalo de tempo pré-definido (padrão: 15 segundos).
- Cada módulo de negócio que possui múltiplas visões (ex: Comercial PPA, Comercial Energia Fácil, Comercial BESS) deve ter seus gráficos exibidos um por vez, em tela cheia, para maximizar a legibilidade.
- A interface deve se adaptar ao Modo TV, minimizando distrações (como de tamanho de logos e menus de navegação), focando 100% nos dados.
- O usuário deve poder pausar a rotação ou avançar/voltar manualmente.
- Em caso de iteração manual, o cronômetro de auto-rotação deve ser reiniciado para garantir tempo suficiente de leitura.

## 3. Arquitetura Técnica (Como)
A arquitetura foi desenhada utilizando uma **Slide Registry (Lista de Slides)** centralizada no componente host principal (`HomeClient.tsx`):

### 3.1. Slide Registry
Um array estático mapeia todos os sub-slides disponíveis no sistema:
```typescript
const TV_SLIDES = [
  { moduleId: 'gd',       label: 'Geração Distribuída',      tvSlide: 0 },
  { moduleId: 'comercial', label: 'Comercial — PPA',          tvSlide: 0 },
  { moduleId: 'comercial', label: 'Comercial — Energia Fácil', tvSlide: 1 },
  { moduleId: 'comercial', label: 'Comercial — BESS',          tvSlide: 2 },
  { moduleId: 'trading',  label: 'Trading Energia',           tvSlide: 0 },
  { moduleId: 'trading',  label: 'Trading Gás',               tvSlide: 1 },
  { moduleId: 'bitcoin',  label: 'Bitcoin',                   tvSlide: 0 },
  { moduleId: 'bitcoin',  label: 'Operações Estruturadas',    tvSlide: 1 },
]
```
Totalizando **8 visões sequenciais**.

### 3.2. Prop `tvSlide` nos Módulos
Cada módulo principal (`CommercialModule.tsx`, `TradingModule.tsx`, `BitcoinOperacoesModule.tsx`) foi atualizado para aceitar uma prop opcional `tvSlide?: number`.
- Se a prop **não** for enviada, o módulo renderiza seu comportamento padrão (normalmente visões empilhadas por scroll ou abas).
- Se a prop **for** enviada, o módulo renderiza *exclusivamente* o sub-conteúdo associado àquele índice, ocupando toda a altura (`h-full`) e omitindo as outras visões.

### 3.3. Ciclo de Auto-Rotação
O controle de estado no `HomeClient` utiliza dois `setInterval`:
1. **Timer de Progressão (100ms):** Alimenta a barra de carregamento contínua no topo da tela (`top-0`).
2. **Timer de Rotação (15s):** Avança o índice do array `TV_SLIDES` de forma circular.

### 3.4. UX / UI (Shadcn + Tailwind)
- Animação Premium: O uso do atributo React `key` dinâmico (`key={currentTvSlide.moduleId + tvSlideIndex}`) aciona uma nova renderização completa do container de conteúdo, garantindo que as classes de transição (`animate-in fade-in slide-in-from-bottom-4 duration-700`) sejam re-executadas em toda transição.
- Header Compacto: No Modo TV, o logo principal diminui (de `h-8` para `h-6`), o Navigation de abas recebe um `scale-95 opacity-0`, e as informações da sessão (avatar, e-mail) são ocultadas para preservar espaço de tela.
- Indicadores (Dots): Agrupam visões do mesmo módulo. Quando o slide pertence ao módulo atual, os "dots" irmãos acendem em uma cor intermediária, indicando contextualização.

## 4. Testes e Validação
- **Ativação:** Garantir que o clique no toggle 📺 inicie o contador e aplique os layouts compactos.
- **Transição Automática:** Verificar se os slides avançam precisamente a cada 15 segundos.
- **Navegação Manual:** Acionar as setas `‹` e `›` (ou via teclado) e verificar o reset progress bar, conferindo se os dados se mantêm sincronizados.
- **Redimensionamento:** Validar legibilidade dos gráficos em telas 1080p ou superiores.
