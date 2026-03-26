# Troubleshooting — Video Wall + Remote Control
**Versão:** 1.0 | **Data:** 2026-03-23

---

## Problema 1: Status "Offline" no Video Wall

### Sintomas
- Header mostra "● Offline" em vermelho
- Remote Control mostra "● Offline"
- Filtros no Remote não atualizam o Video Wall

### Diagnóstico

**Causa raiz:** Supabase não está configurado — `NEXT_PUBLIC_SUPABASE_URL` ou `NEXT_PUBLIC_SUPABASE_ANON_KEY` não estão em `.env.local`

### Solução

#### Passo 1: Criar projeto Supabase (gratuito)

1. Ir para https://supabase.com
2. Clicar "Sign Up"
3. Usar email/GitHub/Google
4. Criar novo projeto (qualquer região)
5. Aguardar inicialização (~30 segundos)

#### Passo 2: Obter credenciais

1. No dashboard Supabase, clicar **Settings** > **API**
2. Copiar:
   - `Project URL` (ex: `https://abc123.supabase.co`)
   - `anon` / `public` key (primeira chave listada)
3. **Não copiar** a chave `service_role` (privada)

#### Passo 3: Adicionar a `.env.local`

```bash
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Importante:** Começam com `NEXT_PUBLIC_` (variáveis públicas, seguro para browser)

#### Passo 4: Reiniciar servidor

```bash
npm run dev
# Ctrl+C para parar, depois npm run dev
```

#### Passo 5: Verificar

1. Abrir DevTools > Console
2. Procurar por erros Supabase (não deve haver)
3. Header do Video Wall deve agora mostrar "● Conectado"

### Verificação

```javascript
// No console do browser (/videowall aberto):
fetch('/api/portfolio').then(r => r.json()).then(d => console.log(d));
// Deve retornar: { success: true, data: [...] }
```

---

## Problema 2: Layout "Fugindo" — KPI Cards Desalinhados

### Sintomas
- KPI cards em grid 4 colunas, mas com valores muito pequenos/grandes
- Valores parecem "flutuando" (ex: "4", "1531")
- Altura inconsistente entre cards

### Diagnóstico

**Causa raiz:** Dados mock da API retornam valores placeholder que não refletem o portfólio real. Os cards estão corretos, mas os números são exemplo.

### Solução

#### Verificar dados da API

```bash
curl http://localhost:3000/api/portfolio | jq '.data | length'
# Deve retornar: 4 (no mock) ou mais (se Supabase configurado)
```

#### Se está rodando localhost com mock OK, layout deve estar assim:

```
┌────────────┬────────────┬────────────┬────────────┐
│   TOTAL    │ POTÊNCIA   │ PROGRESSO  │   RISCO    │
│    DE      │   TOTAL    │   FÍSICO   │    EM      │
│ PROJETOS   │            │            │   RISCO    │
├────────────┼────────────┼────────────┼────────────┤
│     4      │   1531 MW  │   71.0 %   │     01     │
│ projetos   │capacidade  │ média      │ criticidade│
└────────────┴────────────┴────────────┴────────────┘
```

**Se não estiver assim:** verificar console para erros CSS/TypeScript

#### Debug CSS

```bash
# Verificar se classes Tailwind estão sendo aplicadas:
# 1. DevTools > Elements
# 2. Inspecionar um KPI Card
# 3. Verificar classes: grid-cols-4, gap-6, px-8, py-4
# 4. Verificar se "dark" class está no <html>
```

### Corrigir (se necessário)

Se os valores estão certos mas o **spacing está errado:**

**Arquivo:** `src/components/videowall/KpiCards.tsx:25`

Verificar se existe:
```tsx
<div ref={containerRef} className="grid grid-cols-4 gap-6 px-8 py-4">
```

Se não, adicionar ou corrigir:
```tsx
// ❌ ERRADO
<div className="grid grid-cols-3 gap-4">

// ✅ CORRETO
<div className="grid grid-cols-4 gap-6 px-8 py-4">
```

---

## Problema 3: Botão "Aplicar ao Video Wall" Não Funciona

### Sintomas
- Clicar no botão não tem efeito
- Nada muda no Video Wall
- Console não mostra erros
- Status mostra "Offline"

### Diagnóstico

**Causa raiz #1:** Status de conexão é "offline" (ver Problema 1)
**Causa raiz #2:** Botão está desativado (requer `isConnected = true`)
**Causa raiz #3:** Broadcast falhou silenciosamente

### Solução

#### 1. Verificar status de conexão (Pré-requisito)

```bash
# No browser (/remote):
# Verificar header: "● Conectado" ou "● Offline"?

# Se "● Offline":
# → Resolver Problema 1 primeiro
```

#### 2. Verificar se botão está habilitado

```bash
# DevTools > Elements
# Inspecionar: <button>Aplicar ao Video Wall</button>
# Verificar atributo: disabled={!isConnected}
# Se disabled="disabled", botão está desativado
```

#### 3. Verificar envio do broadcast (se conectado)

No console do Remote (`/remote`):

```javascript
// Adicionar log ao clicar "Aplicar"
// Abrir DevTools > Console
// Clicar "Aplicar ao Video Wall"
// Procurar por:
// [SyncDash] sendFilter() called with payload: {...}
// [SyncDash] broadcast sent: filterUpdate
```

Se **não** aparecer, adicionar log ao código:

**Arquivo:** `src/hooks/useRealtimeBroadcast.ts:47`

```typescript
const sendFilter = useCallback(async (payload: FilterPayload) => {
  const channel = channelRef.current;
  if (!channel) {
    console.warn('[SyncDash] No channel available, broadcast not sent');
    return;
  }

  console.log('[SyncDash] sendFilter() called with payload:', payload);

  const result = await channel.send({
    type: 'broadcast',
    event: FILTER_EVENT,
    payload,
  });

  console.log('[SyncDash] broadcast result:', result);
}, []);
```

#### 4. Verificar recebimento no Video Wall

No console do Video Wall (`/videowall`):

```javascript
// Abrir DevTools > Console
// Aplicar filtro no Remote
// Procurar por:
// [SyncDash] filter received: {programas: [...], ...}
```

Se **não** aparecer, adicionar log ao código:

**Arquivo:** `app/videowall/page.tsx:24`

```typescript
const handleFilterUpdate = useCallback((payload: FilterPayload) => {
  console.log('[SyncDash] filter received:', payload);
  setFilters(payload);
}, []);
```

#### 5. Verificar DOM do Video Wall

Após aplicar filtro:

```javascript
// No console do Video Wall:
// Contar número de linhas da tabela
document.querySelectorAll('tbody tr').length;

// Se mudou (ex: 4 em vez de 12), filtro funcionou! ✅
```

### Checklist de Solução

- [ ] Status é "Conectado" (não "Offline")
- [ ] Botão "Aplicar" não está desativado (`disabled` não aparece)
- [ ] Console do Remote mostra `sendFilter() called`
- [ ] Console do Video Wall mostra `filter received`
- [ ] Tabela do Video Wall atualizou (contagem mudou)
- [ ] KPIs atualizaram (números refletem novo filtro)

### Se ainda não funciona

**Opção A:** Verificar logs do Supabase

1. Ir para dashboard Supabase
2. **Logs** > **Realtime**
3. Procurar por erros de broadcast

**Opção B:** Verificar se CSP está bloqueando

```javascript
// No console:
// Procurar por erros CSP (Content-Security-Policy)
// Ex: "Refused to connect to wss://..."

// Se houver erro, o CSP em next.config.mjs precisa ser atualizado
// Verificar: https://...supabase.co deve estar em connect-src
```

**Opção C:** Reiniciar tudo

```bash
# Parar servidor
Ctrl+C

# Limpar cache
rm -rf .next

# Reiniciar
npm run dev

# Testar novamente
```

---

## Problema 4: Gantt Chart não renderiza

### Sintomas
- Seção Gantt vazia ou não aparece
- Nenhuma barra horizontal

### Diagnóstico

**Causa:** Projetos sem datas (`inicio` ou `termino` = null)

### Solução

O componente filtra automaticamente projetos sem datas. Se todos os projetos não tiverem datas, o Gantt fica vazio (correto).

**Para testar:**

```javascript
// No console do Video Wall:
fetch('/api/portfolio').then(r => r.json()).then(d => {
  console.log('Projetos com datas:', d.data.filter(p => p.inicio && p.termino).length);
});
```

Se retornar 0, adicionar dados com datas via Supabase.

---

## Problema 5: Estilos Dark não aplicam

### Sintomas
- Video Wall fica com fundo claro (branco)
- Texto fica ilegível
- Cores do design não aparecem

### Diagnóstico

**Causa:** HTML não tem classe `dark` no elemento `<html>`

### Solução

**Arquivo:** `app/videowall/layout.tsx`

Verificar se existe:

```tsx
export default function VideowallLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dark h-screen w-screen overflow-hidden bg-[#151B1C]">
      {children}
    </div>
  );
}
```

Se não tiver `className="dark"`, adicionar. Isso ativa o CSS customizado do dark mode.

---

## Verificação Rápida (Checklist)

Antes de relatar bug, verificar:

| Item | Como verificar | Status |
|------|---|---|
| Supabase configurado | Header mostra "Conectado" não "Offline" | ☐ |
| Projetos carregam | Tabela tem > 0 linhas | ☐ |
| KPIs aparecem | 4 cards com números | ☐ |
| Filtros renderizam | Remote tem botões/selects | ☐ |
| Botão está habilitado | "Aplicar" não está desativado | ☐ |
| Tema dark funciona | Fundo é escuro (#151B1C) | ☐ |
| Broadcast funciona | Console mostra `filter received` | ☐ |
| Tabela atualiza | Contagem muda após filtro | ☐ |

---

## Suporte

Se ainda tiver problemas:

1. Coletar console logs (`Ctrl+Shift+J`)
2. Tirar screenshot
3. Reportar com:
   - URL que estava acessando
   - Passos para reproduzir
   - Console errors
   - Valores esperados vs. observados

---

*Última atualização: 2026-03-23*
