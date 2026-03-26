# PRD — Correções de Segurança e Funcionalidade (Audit Sprint)

**Data:** 2026-03-25
**Origem:** Auditoria completa de segurança e teste funcional de todos os módulos
**Prioridade global:** P0 (segurança) → P1 (autenticação) → P2 (funcional)

---

## Parte 1 — Correções de Segurança

### SEC-01 · APIs sem autenticação (CRÍTICO)

**Problema:**
`middleware.ts` linha 8 declara `isPublicApi = true` para qualquer rota `/api/*`. Isso exclui todas as APIs da verificação de login. Qualquer pessoa sem sessão pode acessar `/api/trading`, `/api/bitcoin`, `/api/gd`, etc. diretamente pelo navegador ou via `curl`.

**Arquivo:** `middleware.ts`

**Código atual (linha 8-10):**
```typescript
const isPublicApi = req.nextUrl.pathname.startsWith('/api/');

if (!isLoggedIn && !isLoginPage && !isAuthApi && !isPublicApi) {
```

**Comportamento esperado após correção:**
- Rotas `/api/auth/**` permanecem públicas (necessário para o fluxo OAuth).
- Todas as demais rotas `/api/**` exigem sessão autenticada.
- Requisição sem sessão retorna `401 Unauthorized` (não redirect — é uma API).

**Critério de aceite:**
- `GET /api/trading` sem cookie de sessão → resposta `401 { error: "Unauthorized" }`
- `GET /api/bitcoin` sem cookie de sessão → `401`
- `GET /api/auth/session` sem cookie → continua funcionando (pública)
- Login e navegação normais não são afetados

---

### SEC-02 · Credenciais de teste hardcoded (CRÍTICO)

**Problema:**
`src/lib/auth.ts` linha 20 contém email e senha fixos no código-fonte:
```typescript
if (credentials?.email === 'teste@matrixenergia.com' && credentials?.password === 'Teste@123')
```
Qualquer pessoa com acesso ao repositório pode autenticar-se como usuário de teste.

**Arquivo:** `src/lib/auth.ts`

**Comportamento esperado após correção:**
- Remover completamente o bloco de credenciais hardcoded.
- O único acesso via `credentials` permitido deve ser via variável de ambiente.
  Sugestão: `ADMIN_EMAIL` / `ADMIN_PASSWORD_HASH` (hash bcrypt, nunca senha em texto puro).
- Se as env vars não estiverem definidas, o provider `Credentials` deve ser desabilitado — nunca fazer fallback para valor padrão.

**Critério de aceite:**
- Login com `teste@matrixenergia.com` / `Teste@123` → `Acesso negado`
- O provider `Credentials` só aceita credenciais definidas via env vars
- Ausência das env vars → provider Credentials retorna `null` (sem autenticação)

---

### SEC-03 · Qualquer senha aceita para domínio @matrixenergia.com (CRÍTICO)

**Problema:**
`src/lib/auth.ts` linhas 23-28: qualquer usuário com email terminando em `@matrixenergia.com` é autenticado independente da senha fornecida.
```typescript
if (email.endsWith('@matrixenergia.com') && credentials?.password) {
  return { id: "1", name: "Colaborador Matrix", ... }
}
```
`credentials?.password` é `true` para qualquer string não-vazia, incluindo `"a"`.

**Arquivo:** `src/lib/auth.ts`

**Comportamento esperado após correção:**
- Remover completamente o bloco de autorização por domínio sem validação de senha.
- Autenticação via `credentials` deve sempre validar email + hash da senha contra env var ou banco de dados.
- Recomendação: migrar 100% do acesso para Google OAuth (`@matrixenergia.com`) e **remover** o provider `Credentials` se não houver necessidade real de login por senha.

**Critério de aceite:**
- `qualquer@matrixenergia.com` + senha aleatória → `Acesso negado`
- Apenas o fluxo Google OAuth (com email `@matrixenergia.com`) autentica com sucesso

---

### SEC-04 · Fallback hardcoded do AUTH_SECRET (ALTO)

**Problema:**
`src/lib/auth.ts` linha 6:
```typescript
secret: process.env.AUTH_SECRET || 'secret-matrix-dev-only'
```
Se a variável de ambiente `AUTH_SECRET` for removida acidentalmente, os tokens de sessão passam a ser assinados com um segredo público e previsível. Qualquer pessoa pode forjar tokens de sessão válidos.

**Arquivo:** `src/lib/auth.ts`

**Comportamento esperado após correção:**
- Se `AUTH_SECRET` não estiver definida, a aplicação deve **falhar na inicialização** com erro explícito, não fazer fallback silencioso.
- Sugestão:
```typescript
const secret = process.env.AUTH_SECRET;
if (!secret) throw new Error('AUTH_SECRET env var is required');
```

**Critério de aceite:**
- Aplicação sem `AUTH_SECRET` definida → erro de boot com mensagem clara
- Aplicação com `AUTH_SECRET` válida → boot normal

---

### SEC-05 · Header de debug ativo em produção (ALTO)

**Problema:**
`next.config.mjs` expõe `X-Vercel-Debug: 1` em todas as respostas, incluindo produção. Esse header vaza informações sobre a infraestrutura interna do deployment.

**Arquivo:** `next.config.mjs`

**Comportamento esperado após correção:**
- Remover completamente o header `X-Vercel-Debug` do arquivo de configuração.

**Critério de aceite:**
- Resposta HTTP de qualquer rota não contém o header `X-Vercel-Debug`

---

### SEC-06 · Content Security Policy permissiva (MÉDIO)

**Problema:**
`next.config.mjs` define:
```
script-src 'self' 'unsafe-eval' 'unsafe-inline'
```
`'unsafe-eval'` permite execução de `eval()` e `Function()` — vetor direto de XSS.
`'unsafe-inline'` permite execução de scripts inline sem nonce.

**Arquivo:** `next.config.mjs`

**Comportamento esperado após correção:**
- Remover `'unsafe-eval'` da diretiva `script-src`.
- Manter `'unsafe-inline'` somente se houver dependência comprovada (Next.js injeta alguns scripts inline). Documentar a razão se mantido.
- Remover `blob:` de `img-src` se não houver uso comprovado.

**Critério de aceite:**
- Header `Content-Security-Policy` na resposta HTTP não contém `unsafe-eval`
- Aplicação carrega e funciona normalmente após remoção

---

### SEC-07 · Verificar exposição do .env.local no git (CRÍTICO — ação manual)

**Problema:**
O arquivo `.env.local` contém credenciais reais de produção (Google OAuth, Supabase, AUTH_SECRET). Se esse arquivo foi commitado em algum momento no histórico do repositório, as credenciais estão comprometidas permanentemente no histórico git.

**Ação requerida (manual, fora do código):**

1. Verificar se `.env.local` está no `.gitignore`:
   ```bash
   grep ".env.local" .gitignore
   ```

2. Verificar se o arquivo já foi commitado:
   ```bash
   git log --all --full-history -- .env.local
   ```

3. Se aparecer no histórico, rotacionar **imediatamente**:
   - Google Cloud Console → OAuth 2.0 → regenerar `GOOGLE_CLIENT_SECRET`
   - Supabase Dashboard → Settings → API → regenerar `anon key` e `service_role key`
   - Gerar novo `AUTH_SECRET`: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

4. Remover do histórico git com `git filter-repo` (não `filter-branch`):
   ```bash
   git filter-repo --path .env.local --invert-paths
   git push --force-with-lease
   ```

**Critério de aceite:**
- `.env.local` listado no `.gitignore`
- `git log --all -- .env.local` retorna vazio
- Todas as credenciais rotacionadas se houver histórico

---

## Parte 2 — Correções Funcionais

### FUNC-01 · GDModule hardcoded — sem consumo de API (ALTO)

**Problema:**
`src/components/modules/gd/GDModule.tsx` (370 linhas) é um componente 100% estático. Todos os valores (553 MWh, 57%, 1.895 target, etc.) estão fixos no JSX. O endpoint `/api/gd` existe, retorna dados válidos tipados como `GDKpiRow[]`, mas nunca é chamado.

**Componente existente e funcional para reutilização:** `src/components/modules/gd/GDKpiTable.tsx` — já aceita `GDKpiRow[]` como prop e renderiza dinamicamente.

**Comportamento esperado após correção:**
- `GDModule` faz `fetch('/api/gd')` no `useEffect`.
- Enquanto carrega: exibe `Skeleton` (já disponível via shadcn).
- Após carga: passa `data` para `GDKpiTable` como prop.
- Em erro: exibe mensagem de erro com `Card` de destructive.
- Os valores do header (`Semana 09Fev vs. Semana 02Fev`, `Fev - 2026`) devem vir de uma prop ou ser derivados da data atual — não hardcoded.

**Critério de aceite:**
- `GDModule` renderiza dados vindos da API, não valores hardcoded
- Alterar os dados em `/api/gd/route.ts` reflete imediatamente no componente
- Estado de loading visível durante fetch
- Estado de erro visível se `/api/gd` retornar falha

---

### FUNC-02 · GrandeSertaoModule hardcoded — sem consumo de API (ALTO)

**Problema:**
`src/components/modules/grandesertao/GrandeSertaoModule.tsx` exibe todos os KPIs com valores fixos no código. Não existe endpoint `/api/grandesertao` ainda.

**Comportamento esperado após correção:**
- Criar endpoint `app/api/grandesertao/route.ts` com os dados mock atuais extraídos do componente.
- `GrandeSertaoModule` faz fetch e renderiza dinamicamente.
- Mesma estrutura de loading/error dos demais módulos.

**Critério de aceite:**
- Dados de GrandeSertão vêm da API, não do JSX
- Endpoint `/api/grandesertao` documentado e tipado em `src/types/energy.ts`

---

### FUNC-03 · CommercialModule usando componentes errados (ALTO)

**Problema:**
`CommercialModule.tsx` importa e renderiza três componentes hardcoded:
- `CommercialPPA` → hardcoded, sem props
- `CommercialEnergiaFacil` → hardcoded, sem props
- `CommercialBESS` → hardcoded, sem props

Existem componentes corretos com data-binding que **não estão sendo usados**:
- `PPAModule.tsx` → aceita `PPAContract[]` como prop ✅
- `EnergiaFacilModule.tsx` → aceita `EnergiaFacilFunnel` como prop ✅
- `BESSModule.tsx` → aceita `BESSMetrics` como prop ✅

**Comportamento esperado após correção:**
- `CommercialModule` deve:
  1. Fazer fetch de `/api/commercial/ppa`, `/api/commercial/energia-facil`, `/api/commercial/bess` (paralelo com `Promise.all`)
  2. Renderizar `PPAModule`, `EnergiaFacilModule` e `BESSModule` (não os componentes `Commercial*`)
  3. Excluir os arquivos `CommercialPPA.tsx`, `CommercialEnergiaFacil.tsx`, `CommercialBESS.tsx` (mortos)
- Loading/error state no nível do `CommercialModule`

**Critério de aceite:**
- PPA exibe valores vindos de `/api/commercial/ppa`
- Energia Fácil exibe valores vindos de `/api/commercial/energia-facil`
- BESS exibe valores vindos de `/api/commercial/bess`
- Os três arquivos `Commercial*.tsx` hardcoded foram deletados
- Alterar mock na API reflete no componente

---

### FUNC-04 · EnergiaFacilModule — badges de confiança hardcoded (MÉDIO)

**Problema:**
`src/components/modules/commercial/EnergiaFacilModule.tsx` linhas 126, 139 e 152 ignoram o valor `confianca` vindo dos dados e usam strings literais:
```typescript
confianca="success"    // linha 126 — hardcoded
confianca="success"    // linha 139 — hardcoded
confianca="destructive" // linha 152 — hardcoded
```

**Comportamento esperado após correção:**
- O valor `confianca` de cada seção deve ser derivado dos dados recebidos da API.
- A função `getConfianca(pct: number)` já existe em `/api/commercial/energia-facil/route.ts` — deve ser movida para `src/lib/utils.ts` ou para o componente e chamada com o percentual real.

**Critério de aceite:**
- Badge "Confiante" aparece quando `atingimentoMensal >= 80%`
- Badge "Atenção" aparece quando entre 40% e 80%
- Badge "Risco" aparece quando `< 40%`
- Alterando dados da API, o badge muda de forma automática

---

### FUNC-05 · ProgressBar com renderização duplicada (BAIXO)

**Problema:**
`src/components/shared/ProgressBar.tsx` renderiza o componente `Progress` do shadcn/ui e, por cima dele, um `<div>` com `position: absolute` reproduzindo a mesma barra manualmente. Isso causa sobreposição visual, peso de DOM desnecessário e comportamento imprevisível em dark mode.

**Comportamento esperado após correção:**
- Manter apenas o componente `Progress` do shadcn/ui.
- Remover o `<div>` absoluto duplicado.
- Aplicar a coloração por variante via `className` no `Progress` (usando `cn()` e as classes semânticas do design system).

**Critério de aceite:**
- Inspeção do DOM mostra apenas um elemento de barra de progresso por componente `ProgressBar`
- Variantes de cor (`success`, `warning`, `destructive`) aplicadas via `className`

---

## Resumo Priorizado

| ID | Tipo | Prioridade | Arquivo principal | Risco se não corrigido |
|---|---|---|---|---|
| SEC-01 | Segurança | 🔴 P0 | `middleware.ts` | Exposição total de dados sensíveis |
| SEC-02 | Segurança | 🔴 P0 | `src/lib/auth.ts` | Backdoor de autenticação |
| SEC-03 | Segurança | 🔴 P0 | `src/lib/auth.ts` | Bypass de senha para domínio |
| SEC-07 | Segurança | 🔴 P0 | `.gitignore` + git history | Credenciais comprometidas |
| SEC-04 | Segurança | 🟠 P1 | `src/lib/auth.ts` | Forjamento de sessão |
| SEC-05 | Segurança | 🟠 P1 | `next.config.mjs` | Vazamento de infra |
| SEC-06 | Segurança | 🟡 P2 | `next.config.mjs` | Superfície de XSS |
| FUNC-03 | Funcional | 🟠 P1 | `CommercialModule.tsx` | Módulo Comercial inteiro com dados mortos |
| FUNC-01 | Funcional | 🟡 P2 | `GDModule.tsx` | GD com dados congelados |
| FUNC-02 | Funcional | 🟡 P2 | `GrandeSertaoModule.tsx` | Grande Sertão com dados congelados |
| FUNC-04 | Funcional | 🟢 P3 | `EnergiaFacilModule.tsx` | Indicadores de confiança incorretos |
| FUNC-05 | Funcional | 🟢 P3 | `ProgressBar.tsx` | Redundância visual no DOM |

---

## Ordem de Execução Recomendada

```
Sprint 1 (segurança crítica):
  SEC-07 → ação manual (verificar git + rotacionar credenciais)
  SEC-01 → middleware.ts (30 min)
  SEC-02 + SEC-03 → auth.ts (1h — fazem parte do mesmo arquivo)
  SEC-04 → auth.ts (15 min — mesmo arquivo)

Sprint 2 (hardening):
  SEC-05 → next.config.mjs (10 min)
  SEC-06 → next.config.mjs (30 min — testar CSP sem unsafe-eval)

Sprint 3 (funcional):
  FUNC-03 → CommercialModule (2h — maior impacto, precisa de fetch + swap de componentes)
  FUNC-01 → GDModule (2h — fetch + integração com GDKpiTable existente)
  FUNC-02 → GrandeSertaoModule (1h — criar API + fetch)
  FUNC-04 → EnergiaFacilModule (30 min)
  FUNC-05 → ProgressBar (15 min)
```
