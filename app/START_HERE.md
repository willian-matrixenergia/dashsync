# 🚀 DashSync - Comece Agora!

**Tempo Total:** ~15 minutos
**Resultado:** Dashboard completo rodando localmente

---

## ⏱️ PASSO 1: Setup Supabase (3 min)

### **1.1 - Acesse seu Projeto Supabase**
```
https://supabase.com → Seu Projeto → SQL Editor
```

### **1.2 - Execute a Migração Principal**
Copie TODO o conteúdo de:
```
migrations/002_create_all_bases.sql
```

Cole no SQL Editor do Supabase e **EXECUTE** (⌘+Enter ou Ctrl+Enter)

✅ Você verá 4 tabelas criadas:
- `portfolio_master`
- `evolution_labor`
- `internal_activities`
- `technical_specs`

### **1.3 - Inserir Dados de Teste**
Copie TODO o conteúdo de:
```
seed-data.sql
```

Cole no SQL Editor e **EXECUTE**

✅ Você terá 3 projetos prontos:
- **Pacto** (BESS, 20.5MW)
- **SolarMax** (UFV, 15MW)
- **DataCenter Sul** (BTC, 5MW)

---

## 💻 PASSO 2: Setup Local (5 min)

### **2.1 - Instalar Dependências**
```bash
cd /tmp/dashsync-clean

# Backend
npm install

# Frontend
cd frontend && npm install && cd ..
```

✅ Aguarde até ver: "added XXX packages"

### **2.2 - Verificar .env**
```bash
cat .env
```

Você deve ver:
```
PORT=3000
SUPABASE_URL=https://scufhciccnwjtlpfbtqw.supabase.co
SUPABASE_ANON_KEY=eyJ...
```

✅ Se vir isso, está tudo certo!

---

## 🎬 PASSO 3: Rodar Localmente (2 min)

### **3.1 - Abrir 2 Terminais**

**Terminal 1 - API Backend:**
```bash
cd /tmp/dashsync-clean
npm run dev:api
```

Você verá:
```
✓ Server running on http://localhost:3000
```

**Terminal 2 - Frontend React:**
```bash
cd /tmp/dashsync-clean
npm run dev:web
```

Você verá:
```
➜  Local:   http://localhost:3001
```

### **3.2 - Abrir no Navegador**
```
http://localhost:3001
```

✅ **Você verá o DashSync rodando!**

---

## 🧪 PASSO 4: Testar Todas as Telas (5 min)

### **Tela 01: Gestão de Portfólio** ✅

1. Veja os **4 Cards KPI** no topo (Potência, Projetos, % Físico, % Financeiro)
2. Clique em **"Pacto"** na tabela
3. Veja o painel de detalhes com toda a informação
4. Teste os filtros à esquerda (Programa, Fase, Criticidade)

**Esperado:**
- 3 projetos na tabela
- Pacto: 20.5 MW, 68.5% físico
- Cards com valores corretos

### **Tela 02: Fases e Progressos** ✅

1. Com **Pacto** selecionado, clique no botão **📈 Tela 02**
2. Você verá:
   - **Curva S** com 3 linhas (azul, laranja, verde)
   - **Histograma MOD** com barras lado-a-lado
   - **4 Velocímetros** (Engenharia, Suprimentos, Construção, Comissionamento)

**Esperado:**
- Gráficos carregando com dados
- Velocímetros mostrando % previsto vs real
- Resumo com estatísticas

### **Tela 03: Galeria de Mídia** ✅

1. Clique no botão **📸 Tela 03**
2. Faça upload:
   - Arraste 3-5 imagens para o upload
   - Selecione categorias diferentes (Suprimentos, Obras, Aéreas)
3. Clique em uma imagem para abrir o Lightbox
4. Use:
   - Setas ← → para navegar
   - ESC para fechar
   - Click na imagem para zoom
5. Teste os filtros por categoria

**Esperado:**
- Upload funcionando
- Grid de imagens
- Lightbox com navegação
- Contadores atualizando

### **Tela 04: Tour 360° e Live Stream** ✅

1. Clique no botão **🎥 Tela 04**
2. Explore as 3 abas:
   - **🎥 Tour 360°**: Selecione um dos 3 tours
   - **📹 Live Stream**: Veja as 4 câmeras (2 online, 1 standby, 1 offline)
   - **ℹ️ Informações**: Veja info VR e integrações

**Esperado:**
- Tours selecionáveis
- Câmeras com status visual
- Info completa do projeto
- Links para integrações

---

## ✅ CHECKLIST DE FUNCIONAMENTO

```
Tela 01 - Gestão de Portfólio:
  ☐ KPI Cards mostram valores corretos
  ☐ Tabela mostra 3 projetos
  ☐ Filtros funcionam
  ☐ Clique em projeto mostra detalhes

Tela 02 - Fases e Progressos:
  ☐ Curva S tem 3 linhas
  ☐ Histograma MOD mostra barras
  ☐ 4 Velocímetros aparecem
  ☐ Dados carregam corretamente

Tela 03 - Galeria:
  ☐ Upload drag & drop funciona
  ☐ Grid mostra imagens
  ☐ Lightbox abre com zoom
  ☐ Navegação com setas funciona
  ☐ Filtros por categoria funcionam

Tela 04 - Tour 360°:
  ☐ Tours selecionáveis
  ☐ Câmeras mostram status
  ☐ Informações carregam
  ☐ Abas mudam corretamente
```

Se tudo está marcado ✅ → **Seu projeto está funcionando!**

---

## 🚢 PASSO 5: Deploy no Vercel (5 min)

### **5.1 - Build Local**
```bash
npm run build
```

Você verá:
```
✓ built in 2.71s
```

✅ Se vir isso, está tudo certo!

### **5.2 - Deploy**
```bash
vercel --prod
```

### **5.3 - Seguir as Instruções**
- Escolha seu scope (team/personal)
- Escolha o projeto (ou crie novo)
- Adicione environment variables:
  ```
  SUPABASE_URL=https://scufhciccnwjtlpfbtqw.supabase.co
  SUPABASE_ANON_KEY=eyJ...
  ```

✅ Em ~2 minutos seu projeto estará live!

---

## 🔗 URLs IMPORTANTES

### **Local Development**
```
Frontend:  http://localhost:3001
API:       http://localhost:3000
Health:    http://localhost:3000/health
```

### **Production (após deploy)**
```
Seu domínio Vercel
Ex: dashsync-api-git-xxx-seu-usuario.vercel.app
```

---

## 🐛 TROUBLESHOOTING RÁPIDO

### **"Cannot GET /api/portfolio"**
→ API não está rodando
```bash
# Terminal 1:
npm run dev:api
```

### **"Failed to fetch projects"**
→ Verificar SUPABASE_URL e SUPABASE_ANON_KEY
```bash
cat .env
```

### **"Tables not found in database"**
→ Execute o SQL da migração:
```sql
migrations/002_create_all_bases.sql
```

### **"No data appearing"**
→ Execute o seed data:
```sql
seed-data.sql
```

### **"Blank page no frontend"**
→ Abrir DevTools (F12) → Console
→ Procurar por erros
→ Verificar se API está rodando

---

## 📞 Próximos Passos

### **Curto Prazo (Hoje)**
1. ✅ Setup SQL Supabase
2. ✅ Rodar localmente
3. ✅ Testar todas as 4 telas
4. ✅ Deploy no Vercel

### **Médio Prazo (Esta Semana)**
- [ ] Configurar domínio customizado
- [ ] Adicionar mais projetos
- [ ] Integrar Supabase Storage (galeria)
- [ ] Conectar Acompanha360

### **Longo Prazo**
- [ ] Autenticação de usuários
- [ ] Integração com ERP
- [ ] App mobile
- [ ] Notificações em tempo real

---

## 📊 Resumo do Projeto

```
Backend:  Node.js + Express + TypeScript
Frontend: React 19 + Vite + Tailwind
DB:       Supabase (PostgreSQL)
Deploy:   Vercel

Telas:    4 (100% completas)
Gráficos: 5 (Curva S, MOD, 4 Velocímetros)
Tabelas:  4 (Master, Evolution, Activities, Specs)
Endpoints: 15+
```

---

## 🎯 Você Consegue!

Tudo está pronto. Siga os passos acima e em 15 minutos terá:

✅ Dashboard funcionando localmente
✅ Todas as 4 telas com dados
✅ Gráficos interativos
✅ Galeria e upload
✅ Tours 360° configurados
✅ Deployado no Vercel

**Bom luck!** 🚀

---

**Tempo: 15 minutos**
**Dificuldade: ⭐ Fácil**
**Resultado: Production-Ready Dashboard**
