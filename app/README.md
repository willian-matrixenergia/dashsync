# DashSync - Monitorização de Portfólio de Infraestrutura

Stack moderno com **Node.js + TypeScript + React + Supabase** para visualização em tempo real de portfólios BESS, BTC, UFV e Data Centers.

## 🚀 Quick Start

### 1. Clonar e instalar
```bash
git clone <repository>
cd dashsync-clean

# Backend
npm install

# Frontend
cd frontend && npm install && cd ..
```

### 2. Setup Supabase
```bash
cp .env.example .env
# Preencher com credenciais Supabase
```

### 3. Criar schema do banco
- Abra seu projeto Supabase → SQL Editor
- Execute o SQL em `migrations/002_create_all_bases.sql`

### 4. Rodar localmente
```bash
# Terminal 1: API (Node) na porta 3000
npm run dev:api

# Terminal 2: Frontend (React) na porta 3001
npm run dev:web
```

Acessar: **http://localhost:3001**

## 📊 Estrutura do Projeto

```
dashsync/
├── src/                    # Backend (API)
│   ├── index.ts           # Express server
│   ├── types.ts           # Tipos compartilhados
│   ├── middleware/
│   │   └── auth.ts        # Autenticação
│   └── routes/            # Endpoints das 4 Bases
│       ├── portfolio.ts   # Base 01: Master (Gestão)
│       ├── evolution.ts   # Base 02: Evolução (Curva S)
│       ├── activities.ts  # Base 03: Atividades (Gantt)
│       └── specs.ts       # Base 04: Características Técnicas
│
├── frontend/              # Frontend (React)
│   ├── src/
│   │   ├── App.tsx       # App principal
│   │   ├── components/   # Componentes reutilizáveis
│   │   ├── types.ts      # Tipos TypeScript
│   │   └── index.css     # Estilos (Tailwind)
│   ├── index.html
│   └── vite.config.ts
│
└── migrations/            # SQL schema
    ├── 001_create_dashboards.sql  # Tabela base (deprecated)
    └── 002_create_all_bases.sql   # 4 Bases completas
```

## 🗄️ Base de Dados (4 Tabelas)

### **Base 01: `portfolio_master`** (Master/Gestão)
Alimenta a **Tela 01** com dados macro de projetos.

| Campo | Tipo | Exemplo |
|-------|------|---------|
| `programa` | TEXT | BESS, BTC, UFV |
| `projeto` | TEXT | Pacto |
| `potencia_mw` | DECIMAL | 20.5 |
| `fase` | TEXT | Execução |
| `avanco_fisico_real` | DECIMAL | 68.5 |
| `avanco_financeiro_real` | DECIMAL | 69.2 |
| `mod_real` | INTEGER | 42 |
| `cod_tendencia` | DATE | 2026-02-26 |
| `criticidade_risco` | TEXT | Alta/Média/Baixa |

### **Base 02: `evolution_labor`** (Evolução/Curva S)
Alimenta **Tela 02** com séries históricas semanais.

| Campo | Tipo |
|-------|------|
| `projeto` | TEXT |
| `semana` | DATE |
| `pct_planejado_lb` | DECIMAL |
| `pct_realizado` | DECIMAL |
| `mod_prevista` | INTEGER |
| `mod_real` | INTEGER |

### **Base 03: `internal_activities`** (Atividades/Gantt)
Alimenta **Tela 02** com cronograma de disciplinas.

| Campo | Tipo |
|-------|------|
| `atividade` | TEXT | "BOS - Engenharia" |
| `pct_fisico_previsto` | DECIMAL |
| `pct_fisico_real` | DECIMAL |
| `inicio`, `termino` | DATE |

### **Base 04: `technical_specs`** (Características)
Alimenta **Telas 03/04** com dados técnicos e media.

| Campo | Tipo |
|-------|------|
| `caracteristicas_macro` | TEXT |
| `caracteristicas_detalhadas` | TEXT |

## 🔌 API Endpoints

### Portfolio (Base 01)
```bash
GET  /api/portfolio                # Listar todos
GET  /api/portfolio/:projeto       # Detalhes de um
POST /api/portfolio                # Criar/Atualizar
GET  /api/portfolio/stats/summary  # KPIs agregados
```

### Evolution (Base 02)
```bash
GET  /api/evolution                   # Listar evolução
GET  /api/evolution/:projeto/curva-s  # Dados para Curva S
GET  /api/evolution/:projeto/mod      # Dados MOD
```

### Activities (Base 03)
```bash
GET  /api/activities                     # Listar atividades
GET  /api/activities/:projeto/gantt      # Dados Gantt
GET  /api/activities/:projeto/speedometer # Velocímetros
```

### Specs (Base 04)
```bash
GET  /api/specs             # Listar specs
GET  /api/specs/:projeto    # Detalhes
```

## 🎨 Telas Implementadas

### ✅ Tela 01: Gestão de Portfólio
- Filtros dinâmicos (Programa, Fase, Criticidade)
- Cards KPI (Potência, Projetos, % Físico, % Financeiro)
- Tabela de projetos com barras de progresso
- Painel de detalhes do projeto

### 🔄 Telas 02-04 (Em desenvolvimento)
- Curva S e Histograma MOD
- Gantt executivo e velocímetros
- Galeria de fotos e tours 360°

## 📱 Deploy

### Vercel (API + Frontend)
```bash
# Build
npm run build

# Deploy
vercel --prod
```

## 🔑 Autenticação

Opcional. Configure `API_KEY` em `.env` para habilitar:

```bash
curl http://localhost:3000/api/portfolio \
  -H "X-API-Key: sua-chave-secreta"
```

## 📝 Licença

Proprietário - Willian Matriz Energias
