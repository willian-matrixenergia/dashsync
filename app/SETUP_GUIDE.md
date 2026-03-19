# DashSync - Guia Completo de Setup

## 🚀 Início Rápido (5 minutos)

### 1️⃣ Clonar Repository
```bash
cd /tmp/dashsync-clean
```

### 2️⃣ Configurar Banco de Dados
**Abra seu projeto Supabase** → SQL Editor → **Cole o SQL abaixo e Execute:**

```sql
-- Copiar e colar todo o conteúdo de: migrations/002_create_all_bases.sql
```

### 3️⃣ Instalar Dependências
```bash
# Backend
npm install

# Frontend
cd frontend && npm install && cd ..
```

### 4️⃣ Configurar .env
```bash
# Já está preenchido com suas credenciais Supabase
cat .env
```

### 5️⃣ Rodar Localmente
```bash
# Terminal 1: API (http://localhost:3000)
npm run dev:api

# Terminal 2: Frontend (http://localhost:3001)
npm run dev:web
```

### 6️⃣ (Opcional) Inserir Dados de Teste
**Supabase** → SQL Editor → **Cole o SQL de:**
```
seed-data.sql
```

---

## 📊 O que foi implementado

### ✅ **Backend API (Node.js + Express + TypeScript)**
- 4 rotas para as 4 Bases de Dados
- Autenticação opcional com API Key
- CORS habilitado
- Tipos TypeScript completos

### ✅ **Frontend React (Tailwind + Chart.js)**

#### **Tela 01: Gestão de Portfólio** ✓
- Filtros dinâmicos (Programa, Fase, Criticidade)
- 4 Cards KPI (Potência, Projetos, % Físico, % Financeiro)
- Tabela com barras de progresso
- Painel de detalhes expandido com specs técnicas

#### **Tela 02: Fases e Progressos** ✓
- **Curva S**: Gráfico de linha com Planejado, Tendência, Realizado
- **Histograma MOD**: Barras comparativas MOD Prevista vs Real
- **4 Velocímetros**: Engenharia, Suprimentos, Construção, Comissionamento
- Sistema de navegação entre telas

#### **Telas 03 e 04**: Placeholders prontos para implementação
- Tela 03: Galeria de mídia
- Tela 04: Tour 360° e Live Stream

### ✅ **Banco de Dados (Supabase)**
```
portfolio_master       → Base 01 (Master/Gestão)
evolution_labor       → Base 02 (Evolução/Curva S)
internal_activities   → Base 03 (Atividades/Gantt)
technical_specs       → Base 04 (Características)
```

---

## 🔌 API Endpoints Disponíveis

### **Portfolio (Base 01)**
```bash
GET  /api/portfolio                    # Listar todos
GET  /api/portfolio?programa=BESS      # Com filtro
GET  /api/portfolio/:projeto           # Detalhes de um
POST /api/portfolio                    # Criar/Atualizar
GET  /api/portfolio/stats/summary      # KPIs agregados
```

### **Evolution (Base 02)**
```bash
GET  /api/evolution?projeto=Pacto
GET  /api/evolution/:projeto/curva-s   # Para gráfico Curva S
GET  /api/evolution/:projeto/mod       # Para histograma MOD
```

### **Activities (Base 03)**
```bash
GET  /api/activities?projeto=Pacto
GET  /api/activities/:projeto/gantt        # Para Gantt
GET  /api/activities/:projeto/speedometer  # Para velocímetros
```

### **Specs (Base 04)**
```bash
GET  /api/specs
GET  /api/specs/:projeto
POST /api/specs
```

---

## 🧪 Dados de Teste

Já inclusos em `seed-data.sql`:
- **3 Projetos**: Pacto (BESS), SolarMax (UFV), DataCenter Sul (BTC)
- **11 Registros de Evolução Semanal**: Para alimentar Curva S e MOD
- **7 Atividades Macro**: Para alimentar Gantt e Velocímetros
- **3 Especificações Técnicas**: Para painel de detalhes

---

## 📦 Estrutura de Arquivos

```
dashsync-clean/
├── src/                              # Backend (API)
│   ├── index.ts                      # Express server
│   ├── types.ts                      # Tipos compartilhados
│   ├── middleware/auth.ts            # Autenticação
│   └── routes/
│       ├── portfolio.ts              # Base 01
│       ├── evolution.ts              # Base 02
│       ├── activities.ts             # Base 03
│       └── specs.ts                  # Base 04
│
├── frontend/                         # Frontend (React + Vite)
│   ├── src/
│   │   ├── App.tsx                  # Componente raiz
│   │   ├── types.ts                 # Tipos TypeScript
│   │   ├── index.css                # Estilos (Tailwind)
│   │   ├── main.tsx                 # Entry point
│   │   └── components/
│   │       ├── Filters.tsx          # Filtros (Tela 01)
│   │       ├── KPICards.tsx         # Cards KPI (Tela 01)
│   │       ├── ProjectTable.tsx     # Tabela (Tela 01)
│   │       ├── Dashboard.tsx        # Detalhes (Tela 01)
│   │       ├── Screen2.tsx          # Tela 02
│   │       ├── Screen3.tsx          # Tela 03 (placeholder)
│   │       ├── Screen4.tsx          # Tela 04 (placeholder)
│   │       ├── ScreenNav.tsx        # Navegação entre telas
│   │       └── charts/
│   │           ├── CurvaS.tsx       # Gráfico Curva S
│   │           ├── MODHistogram.tsx # Histograma MOD
│   │           └── Speedometer.tsx  # Velocímetros
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── migrations/
│   ├── 001_create_dashboards.sql    # (deprecated)
│   └── 002_create_all_bases.sql     # 4 tabelas
│
├── seed-data.sql                    # Dados de teste
├── package.json                     # Backend
├── tsconfig.json
├── .env                             # Supabase credentials
├── .env.example
└── README.md
```

---

## 🚢 Deploy no Vercel

### **Setup no Vercel**
```bash
# 1. Push para GitHub
git init && git add . && git commit -m "Initial commit"
git remote add origin https://github.com/seu-usuario/dashsync.git
git push -u origin main

# 2. Importar no Vercel
# → vercel.com → New Project → selecionar repositório

# 3. Environment Variables no Vercel
# Adicionar: SUPABASE_URL e SUPABASE_ANON_KEY
```

### **Build & Deploy**
```bash
# Local
npm run build        # Compila tanto API quanto Frontend
vercel --prod        # Faz deploy automaticamente
```

---

## 🔧 Troubleshooting

### **Erro: "Table portfolio_master does not exist"**
→ Você não executou o SQL em `migrations/002_create_all_bases.sql` no Supabase

### **Erro: "Missing Supabase credentials"**
→ Verifique se `.env` tem `SUPABASE_URL` e `SUPABASE_ANON_KEY`

### **Frontend não carrega dados**
→ Certifique-se de que a API está rodando em `http://localhost:3000`

---

## 📝 Próximas Melhorias

- [ ] Tela 03: Upload de fotos (Supabase Storage)
- [ ] Tela 04: Integração com câmeras ao vivo
- [ ] Autenticação Supabase completa (Login/Logout)
- [ ] Gráfico Gantt completo na Tela 02
- [ ] Gráfico Scroller (movimentação contínua)
- [ ] Export de relatórios (PDF/Excel)
- [ ] Dashboard em fullscreen para parede
- [ ] Sincronização em tempo real (Realtime Supabase)

---

## 📞 Suporte

Dúvidas? Verifique:
1. Terminal do API: `npm run dev:api`
2. Console do Browser: DevTools F12
3. Logs do Supabase: Dashboard SQL Editor

---

**Última atualização**: 19/03/2026
**Versão**: 1.0.0 MVP
