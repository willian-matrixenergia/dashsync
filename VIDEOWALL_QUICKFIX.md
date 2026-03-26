# Quick Fix — Video Wall + Remote (3 Problemas da Screenshot)

## ⚠️ Problema 1: Status "Offline"

**Sintoma:** Header mostra "● Offline"

**Causa:** Faltam variáveis de ambiente Supabase

**Solução em 2 minutos:**

1. Criar `.env.local` na raiz do projeto:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=seu-chave-aqui
```

2. Se não tem Supabase: criar em https://supabase.com (grátis)
   - Sign up
   - Criar novo projeto
   - Copiar URL e chave de **Settings > API**

3. Reiniciar servidor:
```bash
npm run dev
```

**Verificação:** Header agora mostra "● Conectado" ✅

---

## ⚠️ Problema 2: Layout "Fugindo" — KPI Cards com valores errados

**Sintoma:** Cards mostram "4", "1531", "71", "01" desalinhados

**Causa:** Dados mock não refletem portfólio real (esperado)

**Solução:** Nenhuma — é por design

O layout está **correto**. Os valores (4 projetos, 1531 MW, 71% progresso, 01 em risco) são do mock. Quando conectar com Supabase real, os números mudarão.

**Se layout está quebrando (não é grid 4 colunas):**

Verificar arquivo: `src/components/videowall/KpiCards.tsx` linha 25

Deve ter:
```tsx
<div className="grid grid-cols-4 gap-6 px-8 py-4">
```

Se não estiver assim, adicionar a classe.

**Verificação:** KPIs em 4 colunas alinhadas ✅

---

## ⚠️ Problema 3: Botão "Aplicar ao Video Wall" Não Funciona

**Sintoma:** Clicar no botão Remote não atualiza Video Wall

**Causa:** Status é "offline" OU broadcast falhou

**Solução em 3 passos:**

### Passo 1: Verificar status
```
No Remote (/remote) → Header deve mostrar "● Conectado"

Se mostra "● Offline":
→ Resolver Problema 1 primeiro ⬆️
```

### Passo 2: Clicar "Aplicar ao Video Wall"
```
Abrir DevTools do Remote (Ctrl+Shift+J)
→ Console deve mostrar:
   "[SyncDash] sendFilter() called..."

Se não aparecer:
→ Código não foi atualizado, ver Passo 3
```

### Passo 3: Verificar Video Wall recebeu filtro
```
Abrir DevTools do Video Wall
→ Console deve mostrar:
   "[SyncDash] filter received: {...}"

→ Tabela deve atualizar (menos linhas visíveis)
```

**Se ainda não funciona:**
```bash
# Limpar cache e reiniciar
rm -rf .next
npm run dev

# Testar novamente
```

**Verificação:** Clicar filtro no Remote → Video Wall atualiza em < 1s ✅

---

## 🎯 Resumo: Checklist Antes de Testar

```
☐ .env.local existe e tem SUPABASE_URL + SUPABASE_ANON_KEY
☐ npm run dev está rodando (não travou)
☐ /videowall mostra "● Conectado" (não "Offline")
☐ /remote mostra "● Conectado"
☐ 4 KPI cards visíveis no /videowall
☐ Tabela tem > 0 projetos
☐ Botão "Aplicar" no /remote NÃO está desativado
☐ Clicar "Aplicar" → Video Wall tabela atualiza
```

Se todos OK → Implementação funcionando ✅

---

## 📊 Fluxo de Teste Correto

```
1. npm run dev                          [inicia servidor]
   ↓
2. Abrir http://localhost:3000/videowall [Tab 1]
   ↓
3. Abrir http://localhost:3000/remote   [Tab 2]
   ↓
4. No Remote: selecionar "BESS" (programa)
   ↓
5. No Remote: clicar "Aplicar ao Video Wall"
   ↓
6. No Video Wall: tabela atualiza (menos linhas)
   ↓
7. KPI cards recalculam (números mudam)
   ✅ Sucesso!
```

---

## 🚨 Se Ainda Tiver Problema

Coletar info:

```bash
# 1. URL que estava testando
echo "URL: http://localhost:3000/videowall"

# 2. Versão do Node
node --version

# 3. Status da build
npm run build 2>&1 | tail -20

# 4. Console log completo (screenshot)
# DevTools > Console (copiar tudo)

# 5. Arquivo .env.local existe?
cat .env.local
```

Enviar junto com relatório de bug.

---

**Versão:** 1.0
**Data:** 2026-03-23
**Status:** Pronto para teste
