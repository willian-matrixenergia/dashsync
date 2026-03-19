# SPEC: Fix /api/debug/auth returning 401 — Root Cause Analysis

**Data:** 2026-03-19
**Status:** Aguardando aprovação
**Branch:** claude/select-best-option-zADDn

---

## 1. Situação Atual (Fatos Observados)

| Endpoint | Header | Resposta | Status |
|----------|--------|----------|--------|
| `GET /api/health` | Nenhum | `{ ok: true }` | 200 OK |
| `GET /api/projects` | `X-Api-Key: KEY_...` | `[]` | 200 OK |
| `GET /api/debug/auth` | Nenhum | `{ error: "Unauthorized" }` | 401 |

**Evidências:**
- `/api/health` funciona como rota pública ✅
- `/api/projects` funciona com chave válida ✅
- `/api/debug/auth` deveria ser pública, mas retorna 401 ❌

---

## 2. Análise da Causa Raiz

### 2.1 Configuração do tsconfig.json

```json
{
  "strict": true,
  "noUncheckedIndexedAccess": true
}
```

`noUncheckedIndexedAccess: true` faz com que `array[index]` retorne `T | undefined`.
Isto causou os erros de build repetidos ao usar `url.split('?')[0]`.

### 2.2 Fluxo de Execução do Middleware

```
Request → Vercel Rewrite → api/index.ts → Fastify
  → preHandler[0]: rateLimiter (app.ts:32)
  → preHandler[1]: apiKeyAuth  (routes.ts:26)
  → Route Handler
```

O middleware `apiKeyAuth` verifica:
```typescript
const PUBLIC_PATHS = new Set(['/api/health', '/api/debug/auth', '/ws/control']);

function getRoutePath(req: FastifyRequest): string {
  const fromRoute = req.routeOptions?.url;    // ← usa routeOptions
  if (typeof fromRoute === 'string') return fromRoute;
  // fallback para req.url
}
```

### 2.3 Hipótese Principal

`/api/health` funciona e `/api/debug/auth` não. Ambas estão no `PUBLIC_PATHS`.
A diferença está no **valor que `req.routeOptions?.url` retorna** para cada rota.

Possíveis causas:
1. **Fastify `routeOptions.url` retorna valor inesperado** para rotas com paths aninhados
   (`/api/debug/auth` tem 3 segmentos vs `/api/health` com 2)
2. **Build cache da Vercel** servindo JavaScript antigo de um build anterior onde
   `PUBLIC_PATHS` não continha `/api/debug/auth`
3. **Versão do Fastify** pode ter comportamento diferente para `routeOptions` em hooks
   registrados via `addHook` no nível da app

### 2.4 Por que não podemos diagnosticar remotamente

O endpoint de debug foi criado justamente para inspecionar o que está acontecendo,
mas ele próprio está bloqueado pelo middleware. Precisamos de uma abordagem diferente.

---

## 3. Solução Proposta

**Estratégia: Não depender de `PUBLIC_PATHS` no middleware — usar config por rota do Fastify.**

Em vez de manter uma lista estática de paths públicos no middleware e comparar strings,
usamos o mecanismo nativo do Fastify: `route.config`.

### 3.1 Como Funciona

Cada rota declara se é pública via `config`:
```typescript
app.get('/api/health', { config: { isPublic: true } }, handler);
app.get('/api/debug/auth', { config: { isPublic: true } }, handler);
```

O middleware verifica `req.routeOptions.config.isPublic`:
```typescript
const config = req.routeOptions?.config as Record<string, unknown> | undefined;
if (config?.['isPublic'] === true) return;
```

### 3.2 Vantagens

- **Não depende de string matching** → elimina bugs de path
- **Declarativo** → cada rota sabe se é pública
- **Compatível com Fastify 4** → usa API nativa
- **Não precisa de `split`, `indexOf`, `startsWith`** → código mais simples

### 3.3 Arquivos Afetados

| Arquivo | Mudança |
|---------|---------|
| `authMiddleware.ts` | Substituir `PUBLIC_PATHS` + `getRoutePath()` por check de `routeOptions.config.isPublic` |
| `routes.ts` | Adicionar `{ config: { isPublic: true } }` nas rotas health e debug |

### 3.4 Mudanças no authMiddleware.ts (diff conceitual)

**Antes:**
```typescript
const PUBLIC_PATHS = new Set(['/api/health', '/api/debug/auth', '/ws/control']);

function getRoutePath(req) { ... } // 8 linhas de lógica

export async function apiKeyAuth(req, reply) {
  const path = getRoutePath(req);
  if (PUBLIC_PATHS.has(path)) return;
  if (path.startsWith('/media/') || ...) return;
  // ... check key
}
```

**Depois:**
```typescript
export async function apiKeyAuth(req, reply) {
  const routeConfig = req.routeOptions?.config as Record<string, unknown> | undefined;
  if (routeConfig?.['isPublic'] === true) return;
  // ... check key
}
```

### 3.5 Mudanças no routes.ts (diff conceitual)

**Antes:**
```typescript
app.get('/api/health', async () => ({ ok: true, ... }));
app.get('/api/debug/auth', async (req) => { ... });
```

**Depois:**
```typescript
app.get('/api/health', { config: { isPublic: true } }, async () => ({ ok: true, ... }));
app.get('/api/debug/auth', { config: { isPublic: true } }, async (req) => { ... });
```

---

## 4. Plano de Execução

| Etapa | Ação | Critério de Aceite |
|-------|------|--------------------|
| 1 | Alterar `authMiddleware.ts` — usar `routeOptions.config.isPublic` | Código compila sem erros |
| 2 | Alterar `routes.ts` — adicionar config nas rotas públicas | Código compila sem erros |
| 3 | Build local: `pnpm --filter @dashsync/shared build && pnpm --filter @dashsync/api build` | Exit code 0 |
| 4 | Commit + Push | Push sem erros |
| 5 | Verificar deploy na Vercel | Build status: Ready |
| 6 | Testar `GET /api/health` sem header | 200 OK |
| 7 | Testar `GET /api/debug/auth` sem header | 200 OK com info de diagnóstico |
| 8 | Testar `GET /api/projects` com `X-Api-Key` | 200 OK |
| 9 | Testar `GET /api/projects` sem header | 401 Unauthorized |

---

## 5. Rollback

Se a solução não funcionar:
1. Reverter commit
2. Remover endpoint `/api/debug/auth` completamente
3. Manter apenas as rotas que já funcionam (`/api/health`, `/api/projects`)

---

## 6. Lição Aprendida

1. **Sempre compilar localmente** antes de fazer push
2. **`noUncheckedIndexedAccess`** requer cuidado especial com acesso a arrays
3. **Não depender de string matching** para segurança — usar mecanismos nativos do framework
4. **Specs antes de código** evita ciclos de push/falha
