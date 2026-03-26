# Guia de Testes — Dashboard Executivo

**Objetivo:** Validar que cada módulo renderiza corretamente com dados mockados
**Pré-requisitos:** Node 20+, `npm install` já executado

---

## 🚀 Quick Start

```bash
# 1. Setup
npm install

# 2. Build (validar TypeScript)
npm run build

# 3. Desenvolver
npm run dev

# 4. Abrir browser
open http://localhost:3000
```

---

## 🧪 Testes por Módulo

### 1️⃣ Autenticação & Login
**Rota:** `GET http://localhost:3000/`

**Esperado:**
- [ ] Redireciona para `/login` (não autenticado)
- [ ] Página login mostra logo Matrix
- [ ] Botão "Entrar com Google" visível
- [ ] Clique abre popup Google OAuth

**Se passou:** Autenticação ✅

---

### 2️⃣ Dashboard Shell & Navegação
**Rota:** `GET http://localhost:3000/` (após login)

**Esperado:**
- [ ] Header com logo Matrix, 4 abas de nav, avatar + nome + email
- [ ] Nav items com ícones: Zap (GD), TrendingUp (Comercial), BarChart3 (Trading), Cpu (Bitcoin)
- [ ] Animações GSAP: header desça, nav items stagger
- [ ] Botão logout no canto direito
- [ ] Aba ativa (GD) destaca em laranja
- [ ] Conteúdo preenche 100% da tela

**Se passou:** Shell ✅

---

### 3️⃣ Módulo Geração Distribuída (GD)
**Rota:** Tab 1 "Geração Distribuída" → deve estar selecionado por padrão

**Esperado:**
- [ ] Título "Geração Distribuída" com data atual (DD/MM/YYYY)
- [ ] Tabela com 8 colunas: Indicador, Semana, Target Mês, Atingimento %, Confiança, Evolução, Target Ano, Ating. Ano %
- [ ] 6 linhas de KPIs (Vendas GD, Contratação, Operacionalização, etc.)
- [ ] **Coluna Atingimento:**
  - Barras de progresso coloridas (verde/amarelo/vermelho)
  - Badges com percentual (ex: "57%")
  - Cores correspondem a confiança (success/warning/destructive)
- [ ] **Coluna Evolução:** Sparklines (linhas SVG pequenas)
- [ ] Sem loading spinner (dados mock carregam instantaneamente)

**Teste detalhado:**
```
Row 1: Vendas GD (MWh)
  - Semana: 553
  - Target Mês: 1895
  - Atingimento: 57% (badge amarelo)
  - Sparkline: 2-5 pontos
```

**Se passou:** GD Module ✅

---

### 4️⃣ Módulo Comercial
**Rota:** Tab 2 "Comercial"

**Expected:**
- [ ] 3 sub-abas: PPA | Energia Fácil | BESS
- [ ] Padrão tab layout (TabsList + TabsContent)

#### 4a. PPA
- [ ] Card topo mostra: "R$ XXXk Total PPA"
- [ ] 3 subcards (Originação, Comissionamento, Renegociação)
- [ ] Cada subcard mostra:
  - Título
  - Valor atual (R$ k)
  - "vs sem. +/-XXX"
  - ProgressBar + Badge com %
  - Target mensal/anual
- [ ] Cores badges condizem com atingimento (≥80% verde, 40-79% amarelo, <40% vermelho)

#### 4b. Energia Fácil
- [ ] 3 colunas (grid)
- [ ] Card 1: "86 Clientes"
- [ ] Card 2: "9 Contratos"
- [ ] Card 3: "R$ 0k Faturamento"
- [ ] Cada card mostra semana + atingimento %

#### 4c. BESS
- [ ] 3 métricas topo: Capacidade (86.1 MWh), MWh Médio (16.9), Faturamento (R$ 1610k)
- [ ] Chart 1: Linha azul (Real) + linha tracejada (Budget) — 12 meses (Jan-Dez)
- [ ] Chart 2: Igual, Faturamento
- [ ] Tooltip ao hover mostra valores exatos

**Se passou:** Commercial Module ✅

---

### 5️⃣ Módulo Trading & Risco
**Rota:** Tab 3 "Trading & Risco"

**Expected:**
- [ ] 2 sub-abas: Energia | Gás

#### 5a. Energia
- [ ] **6 Métricas (grid 3 colunas em desktop):**
  - Resultado Caixa: R$ 22.5 MM (verde ✓)
  - MtM 2026: R$ 217.7 MM
  - VaR Trading: R$ -22.3 MM (vermelho ✗)
  - VaR Portfólio: R$ -62.5 MM (vermelho ✗)
  - PLD 2026: R$ 358.6
  - Exposição 2026: 236.7 GWh

- [ ] **Chart 1: Cash Gen (BarChart)**
  - Dois tipos de barras: Esperado (azul) vs Realizado (laranja)
  - 12 meses (Jan-Dez)
  - Tooltip mostra valores ao hover

- [ ] **Chart 2: Exposição Líquida (BarChart colorido)**
  - Barras verdes (2026: +236.9 GWh)
  - Barras vermelhas (2027-2034: negativos)
  - Tooltip ao hover

- [ ] **Stress Test Heatmap (Table)**
  - 3 cenários: ΔP +10, +20, +50 R$/MWh
  - 6 anos: 2026-2031
  - Células vermelhas/amarelas para maiores impactos
  - Total por linha

#### 5b. Gás
- [ ] **4 Métricas:** Margem Total, Margem Spot, Exposição, Penalidade
- [ ] **2 Charts genéricos:** Margem vs Spot, Exposição & Penalidade

**Se passou:** Trading Module ✅

---

### 6️⃣ Módulo Bitcoin & Operações Estruturadas
**Rota:** Tab 4 "Bitcoin & Operações"

**Expected:**
- [ ] 2 sub-abas: Bitcoin | Operações Estruturadas

#### 6a. Bitcoin
- [ ] **4 Métricas:** Hashrate (0.2 EH/s), Uptime Budget (98.6%), BTC Minados (0), Consumo (367 MWh)
- [ ] **3 Charts:** Hashrate, BTC Minados, Consumo (cada um Real vs Budget)
- [ ] Todos os charts mostram 12 meses

#### 6b. Operações Estruturadas
- [ ] Dois pipelines: CAPEX e Asset Light
- [ ] **Pipeline CAPEX:**
  - Total: R$ 7375 MM
  - 5+ operações (cards)
  - Cada card mostra: nome, estágio (badge colorido), valor R$ MM, variação %
  - Cores: Cinza (Prospecção), Amarelo (Qualificação), Azul (Diagnóstico), Verde (Fechamento)

- [ ] **Pipeline Asset Light:**
  - Total: R$ 72 MM
  - 4 operações
  - Mesmo formato CAPEX

**Se passou:** Bitcoin Module ✅

---

## 🔍 Testes de Integração

### Test Suite A: Navegação
```bash
# Verificar que cada tab carrega sem erro
Passo 1: Click Tab 1 (GD) → Renderiza GDModule
Passo 2: Click Tab 2 (Comercial) → Renderiza CommercialModule
Passo 3: Click Tab 3 (Trading) → Renderiza TradingModule
Passo 4: Click Tab 4 (Bitcoin) → Renderiza BitcoinOperacoesModule
```

### Test Suite B: Responsividade
```bash
# Abrir DevTools (F12) → Toggle device toolbar

Teste em:
- Desktop (1920x1080) — 3 colunas em Commercial
- Tablet (768x1024) — 2 colunas em Commercial
- Mobile (375x667) — 1 coluna em Commercial

Verificar: Grids reflow corretamente, sem overflow
```

### Test Suite C: Dark Mode
```bash
# Abrir DevTools Console
document.documentElement.classList.add('dark');
document.documentElement.classList.remove('dark');

Verificar: Cores invertem de forma legível
- Background escuro
- Texto claro
- Borders visíveis
```

### Test Suite D: Performance
```bash
# DevTools → Performance → Record 5 segundos

Abrir cada tab, verificar:
- Cada tab < 100ms para renderizar
- Charts < 500ms
- Sem janky animations
```

---

## 🚨 Testes de Erro

### Test Suite E: API Fallback
```bash
# DevTools → Network → Throttle (Slow 3G)

Passo 1: Abrir Tab 2 (Comercial)
Esperado: Skeleton loaders aparecem durante 2-3s
Esperado: Dados aparecem após carregamento

Passo 2: DevTools → Network → Offline
Passo 3: F5 (reload)
Esperado: Erro "Erro na requisição" em cada módulo
```

### Test Suite F: Logout
```bash
Passo 1: Click botão logout (canto direito)
Esperado: Redireciona para /login
Esperado: Sessão destruída (F5 → /login novamente)
```

---

## ✅ Checklist Final

### Funcionalidades
- [ ] Login Google OAuth funciona
- [ ] 4 módulos renderizam sem erros
- [ ] Charts Recharts mostram dados
- [ ] Badges coloridos aparecem
- [ ] Tables renderizam com 8+ colunas
- [ ] Sparklines SVG aparecem em GD
- [ ] Responsive em mobile/tablet/desktop
- [ ] Dark mode suportado
- [ ] Logout funciona

### Qualidade
- [ ] Sem console errors
- [ ] Sem console warnings (exceto middleware deprecated)
- [ ] Build limpo (`npm run build` → ✅)
- [ ] Todas labels em PT-BR
- [ ] Dados mockados representam PRD
- [ ] UI responsiva (cols-1 md:cols-2 lg:cols-3)

### Performance
- [ ] Dev server inicia < 5s
- [ ] Build < 30s
- [ ] Charts renderizam < 500ms
- [ ] Animações smooth (60fps)

---

## 📝 Relatar Bugs

Se encontrar problema:

1. **Capturar screenshot** com erro visível
2. **Verificar console** (F12 → Console tab)
3. **Anotar:**
   - URL exata (`http://localhost:3000/tab-que-quebrou`)
   - Passos para reproduzir
   - Erro de console (se houver)
   - Browser/sistema operacional
4. **Enviar** com contexto completo

---

## 🎉 Se Todos Os Testes Passarem

Parabéns! O Dashboard Executivo é **Production-Ready**.

Próximas ações:
1. Configurar `.env.local` com credentials Google reais
2. Fazer deploy (Vercel, Netlify, etc.)
3. Trocar endpoints `/api/*` por dados reais
4. Monitorar performance em produção

---

**Tempo estimado de testes:** 15-30 minutos
**Versão documento:** 1.0.0
**Última atualização:** 2026-03-24
