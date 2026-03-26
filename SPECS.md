# Dashboard Executivo — Especificação Funcional

**Produto:** Dashboard Executivo de Performance Energética
**Versão:** 1.0.0 (MVP)
**Data:** Março 2026
**Proprietário:** Matrix Energia LTDA
**Status:** ✅ Implementado

---

## 📋 Visão Geral

Dashboard executivo em tempo real para monitoramento de 4 áreas estratégicas:
1. **Geração Distribuída (GD)** — KPIs de plantas fotovoltaicas
2. **Comercial** — Originação, contratos e operações de armazenamento
3. **Trading & Risco** — Exposição energética e cenários de stress test
4. **Bitcoin & Operações** — Mining + pipeline estruturado de projetos

---

## 🎯 Objetivos de Negócio

- **Visibilidade em tempo real** de indicadores críticos por unidade de negócio
- **Suporte a decisões** via stress test, exposição anual e geração de caixa
- **Rastreamento de metas** com 3 variantes de confiança (Bom/Alerta/Crítico)
- **Integrabilidade** para futuros dados de APIs reais (atualmente mockados)

---

## 🏗️ Arquitetura

### Stack Tecnológico
- **Frontend:** Next.js 14 App Router, React 18, TypeScript strict
- **UI:** shadcn/ui (base-nova), Tailwind CSS v3, GSAP animations
- **Gráficos:** Recharts + shadcn Chart wrapper
- **Autenticação:** next-auth v5 (Google OAuth)
- **Estado:** React hooks (fetch + useState)
- **Dados:** APIs REST (atualmente mocked em `app/api/*`)

### Estrutura de Diretórios

```
src/
├── components/
│   ├── layout/
│   │   └── HomeClient.tsx          [Shell principal, nav, tabs]
│   ├── modules/                     [4 módulos principais]
│   │   ├── gd/
│   │   ├── commercial/
│   │   ├── trading/
│   │   └── bitcoin/
│   ├── charts/                      [5 componentes de visualização]
│   │   ├── CashGenChart.tsx         [BarChart: Esperado vs Realizado]
│   │   ├── ExposicaoLiquidaChart.tsx [BarChart: +/- colorido]
│   │   ├── MonthlyEvolutionChart.tsx [LineChart genérico]
│   │   └── StressTestHeatmap.tsx    [Table com cores de intensidade]
│   └── shared/                      [Componentes reutilizáveis]
│       ├── KpiBadge.tsx             [Badge com variantes success/warning/destructive]
│       ├── ProgressBar.tsx          [Barra colorida de progresso]
│       ├── TrendSparkline.tsx       [SVG sparkline 2-5 pontos]
│       └── SectionHeader.tsx        [Título + data PT-BR]
├── types/
│   └── energy.ts                    [13 interfaces de domínio]
└── lib/
    ├── auth.ts                      [Config next-auth v5]
    └── actions.ts                   [Server actions (signOut)]

app/
├── api/
│   ├── auth/[...nextauth]/route.ts [Rota OAuth]
│   ├── gd/route.ts                 [6 KPIs GD]
│   ├── commercial/
│   │   ├── ppa/route.ts            [3 contratos]
│   │   ├── energia-facil/route.ts  [Funil 3 colunas]
│   │   └── bess/route.ts           [Métricas + 12 meses]
│   ├── trading/route.ts            [Energia + Gás]
│   ├── bitcoin/route.ts            [Métricas + 12 meses]
│   └── operacoes/route.ts          [CAPEX + Asset Light]
├── login/page.tsx                  [Página de login Google]
├── layout.tsx                      [Root layout + SessionProvider]
├── page.tsx                        [Redirect → /]
└── globals.css                     [Tokens CSS, glass-card, animations]

middleware.ts                       [Proteção de rotas + OAuth]
```

---

## 📊 Módulos e Funcionalidades

### 1️⃣ Geração Distribuída (GD)

**Objetivo:** Monitorar performance de plantas fotovoltaicas
**Linha:** Grande Sertão II

#### Dados Exibidos
| Métrica | Tipo | Fonte |
|---------|------|-------|
| Vendas GD (MWh) | KPI Tabela | `/api/gd` |
| Atingimento % | Badge + ProgressBar | Cálculo: atual/target |
| Evolução Semanal | TrendSparkline | Vetor 2-5 pontos |
| Target Anual | Display | Tabela |

#### Interface
- **Tabela de 8 colunas** (Indicador, Semana, Target Mês, Atingimento %, Confiança, Evolução, Target Ano, Ating. Ano %)
- **Linhas:** 6 KPIs (Vendas, Contratação, Operacionalização, etc.)
- **Badges de Confiança:** Success (≥80%), Warning (40-79%), Destructive (<40%)

---

### 2️⃣ Comercial

**Objetivo:** Rastrear originação, contratos e armazenamento
**Sub-módulos:** PPA | Energia Fácil | BESS

#### PPA (Power Purchase Agreements)
- **Card principal:** Total R$ k
- **3 subcards:**
  - Originação (R$ k, target mensal/anual)
  - Comissionamento (R$ k, target mensal/anual)
  - Renegociação (R$ k, target mensal/anual)
- Cada subcard mostra: valor atual, vs semana anterior, atingimento mensal, badge confiança

#### Energia Fácil
- **3 colunas (funnel)**:
  - Originação: Clientes
  - Fechamento: Contratos
  - Faturamento: R$ k

#### BESS (Battery Energy Storage System)
- **Métricas de topo:** Capacidade, MWh Médio, Faturamento Total
- **2 charts LineChart genéricos:**
  - Capacidade (Real vs Budget) — 12 meses
  - Faturamento (Real vs Budget) — 12 meses

---

### 3️⃣ Trading & Risco

**Objetivo:** Visibilidade de exposição, caixa gerado, cenários de stress
**Sub-módulos:** Energia | Gás

#### Energia
- **6 métricas topo:** Resultado Caixa, MtM 2026, VaR Trading, VaR Portfólio, PLD 2026, Exposição 2026
- **3 visualizações:**
  1. **CashGenChart** — BarChart (Esperado vs Realizado) 12 meses
  2. **ExposicaoLiquidaChart** — BarChart com barras verdes (+) e vermelhas (-) 2026-2034
  3. **StressTestHeatmap** — Table com 3 cenários (ΔP +10, +20, +50 R$/MWh) e 6 anos

#### Gás
- **4 métricas:** Margem Total, Margem Spot, Exposição, Penalidade
- **2 charts genéricos:**
  - Margem Total vs Spot — 12 meses
  - Exposição & Penalidade — 12 meses

---

### 4️⃣ Bitcoin & Operações Estruturadas

**Objetivo:** Mining + pipeline de projetos
**Sub-módulos:** Bitcoin | Operações Estruturadas

#### Bitcoin
- **4 métricas:** Hashrate (EH/s), Uptime Budget (%), BTC Minados, Consumo Energia (MWh)
- **3 charts genéricos:**
  - Hashrate (Real vs Budget) — 12 meses
  - BTC Minados (Real vs Budget) — 12 meses
  - Consumo Energia (Real vs Budget) — 12 meses

#### Operações Estruturadas
- **Pipeline CAPEX:** 5+ projetos com estágios (Prospecção → Expansão)
- **Pipeline Asset Light:** 4+ projetos com estágios
- **Card por operação:**
  - Nome + ícone de variação (%)
  - Badge colorido por estágio (Cinza → Amarelo → Azul → Verde)
  - Valor (R$ MM)

---

## 🔐 Autenticação

### Fluxo Google OAuth
1. Usuário clica "Entrar com Google" em `/login`
2. `signIn('google')` redireciona para Google Accounts
3. Google retorna código → troca por token
4. next-auth cria sessão em cookie
5. Middleware redireciona `/` → authenticated
6. `useSession()` fornece `user.name`, `user.email`, `user.image`

### Proteção de Rotas
- ✅ Unauthenticated → `/login`
- ✅ `/api/auth/*` público
- ✅ `/_next/*` público (assets)
- ✅ Tudo mais requer auth

---

## 📈 Padrões de Componentes

### KpiBadge
```typescript
<KpiBadge variant="success">95%</KpiBadge> // Verde
<KpiBadge variant="warning">45%</KpiBadge> // Amarelo
<KpiBadge variant="destructive">10%</KpiBadge> // Vermelho
```

### ProgressBar
```typescript
<ProgressBar value={75} variant="success" showLabel /> // Barra verde + label
```

### TrendSparkline
```typescript
<TrendSparkline data={[10, 15, 12, 20, 18]} variant="warning" /> // SVG colorido
```

### MonthlyEvolutionChart (Genérico)
```typescript
<MonthlyEvolutionChart
  data={evolution}
  realKey="capacidade"
  budgetKey="capacidadeBudget"
  realLabel="Capacidade Real"
  budgetLabel="Capacidade Budget"
/>
```

---

## 🎨 Design System

### Cores Semânticas
| Token | Hex | Uso |
|-------|-----|-----|
| `--success` | #22C55E | KPIs positivos, barras acima de 80% |
| `--warning` | #EAB308 | KPIs médios, 40-79% |
| `--destructive` | #EF4444 | KPIs críticos, <40%, negativos |
| `--primary` | #FF4A00 | Buttons ativos, highlights |

### Componentes Essenciais
- **Card:** `bg-card/50 border-white/10` — fundo translúcido
- **Tabela:** shadcn Table + `hover:bg-white/[0.02]`
- **Badge:** shadcn Badge com opacity (`/10`, `/20`)
- **Buttons:** shadcn Button (variant="ghost" padrão)
- **Tabs:** shadcn Tabs com TabsList + TabsContent

### Animações
- **Header:** Fade-in 1s (expo.out) + blur
- **Nav Items:** Stagger 0.1s (power4.out)
- **Floating:** Loop infinito ±10px

---

## 🔄 Fluxo de Dados

### Fetch Pattern
```typescript
useEffect(() => {
  const fetchData = async () => {
    const res = await fetch('/api/endpoint');
    const json = await res.json();
    if (json.success) {
      setData(json.data);
    } else {
      setError('Erro ao carregar');
    }
  };
  fetchData();
}, []);
```

### API Response Envelope
```typescript
{
  success: boolean;
  data?: T;
  error?: { message: string };
}
```

### Estados de Loading
- **Loading:** `<Skeleton className="h-[400px] w-full" />`
- **Error:** `<Card className="border-destructive/20">` + mensagem
- **Vazio:** Display "Dados não disponíveis"

---

## ✅ Critérios de Aceitação (MVP)

- [x] `npm run build` sem erros TypeScript
- [x] Autenticação Google via next-auth v5
- [x] 4 módulos com dados mockados
- [x] Badges de confiança (success/warning/destructive)
- [x] Charts Recharts renderizando
- [x] Responsive design (grid cols-1 md:cols-2 lg:cols-3)
- [x] Tema escuro suportado (`.dark` class)
- [x] GSAP animações de entrada
- [x] PT-BR em todos os rótulos

---

## 🔮 Roadmap Pós-MVP

### Fase 2 — Integração de APIs Reais
- Trocar endpoints `/api/*` por real data (Supabase, ClickHouse)
- Autenticação via tokens JWT
- Refresh automático (WebSocket ou polling)

### Fase 3 — Recursos Avançados
- Export PDF de relatórios
- Filtros por período (semana, mês, ano)
- Favoritos/bookmarks de gráficos
- Alertas customizáveis
- Modo compartilhável (read-only)

### Fase 4 — Otimizações
- Suspense + React Server Components
- Incremental Static Regeneration (ISR)
- Service Workers para offline
- Analytics tracking (Mixpanel/Amplitude)

---

## 📞 Contato & Suporte

- **Proprietário do Produto:** Equipe Executiva Matrix Energia
- **Desenvolvedor:** Claude Code
- **Documentação:** [CLAUDE.md](./CLAUDE.md)
- **Issues:** GitHub Issues (se aplicável)

---

**Última atualização:** 2026-03-24
