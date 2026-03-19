# PRD: Autenticação Robusta em Serverless (Vercel)

## Problema Atual
```
Status: 401 Unauthorized
Code: INVALID_API_KEY
```
O handler serverless está ativo, mas a validação de API key falha porque:
1. Variável `DASHSYNC_API_KEY` não configurada na Vercel
2. Middleware de autenticação rejeita requisições sem chave válida
3. Em produção, requisições são bloqueadas imediatamente

---

## Objetivo
Implementar autenticação **robusta e configurável** que:
- ✅ Funcione em serverless (Vercel) com variáveis de ambiente
- ✅ Permita desenvolvimento local sem obrigar variáveis
- ✅ Validação de tokens em endpoints críticos (WebSocket, admin)
- ✅ Rate limiting por API key (não só por IP)
- ✅ Logs de falha de autenticação (segurança)

---

## Requisitos Funcionais

### RF1: Carregamento de Credenciais
- [ ] Carrega `DASHSYNC_API_KEY` da Vercel/environment
- [ ] Em dev mode: gera chave dummy se não definida
- [ ] Validação ao bootstrap (aviso de erro, não falha fatalmente)

### RF2: Middleware de Autenticação
- [ ] Extrai token do header `Authorization: Bearer <token>`
- [ ] Compara com `DASHSYNC_API_KEY` usando timing-safe comparison
- [ ] Retorna 401 se inválido (não expõe detalhes internos)
- [ ] Permite bypass para dev mode (configurável)

### RF3: Endpoints Públicos vs Autenticados
- [ ] **Públicos** (sem auth): `/health`, `/metrics`
- [ ] **Autenticados**: `/api/*`, `/ws/control`
- [ ] Configuração centralizadaem `authMiddleware.ts`

### RF4: Logging de Segurança
- [ ] Log de tentativas falhadas (IP, timestamp, motivo)
- [ ] Log de sucesso (user agent, endpoint)
- [ ] Dados sensíveis nunca logados (ex: token inteiro)

### RF5: Rate Limiting por Chave
- [ ] Limite atual por IP: 5 req/15min (auth endpoints)
- [ ] Novo por API key: 100 req/15min (endpoints autenticados)
- [ ] Retorna 429 com `Retry-After` header

---

## Requisitos Técnicos

### Arquitetura
```
packages/api/
├── src/
│   ├── infrastructure/
│   │   └── http/
│   │       ├── authMiddleware.ts (↑ novo: env loader + bypass)
│   │       └── rateLimiter.ts (↑ novo: by-key tracking)
│   ├── domain/
│   │   └── security/
│   │       └── ApiKeyValidator.ts (↑ novo: timing-safe compare)
│   ├── app.ts (↑ ajustar: register auth hook)
│   └── server.ts (↑ nenhuma mudança)
├── api/
│   └── index.ts (↑ nenhuma mudança)
└── vercel.json (↑ adicionar env vars & build)
```

### Stack
- TypeScript strict mode
- `crypto.timingSafeEqual()` para comparação de tokens
- `Map<string, number>` para tracking de rate limit
- Variáveis de ambiente como fonte de verdade

---

## Plano de Implementação

### Fase 1: Segurança de Tokens (High Priority)
1. Criar `ApiKeyValidator.ts` com `timingSafeEqual()`
2. Atualizar `authMiddleware.ts` para usar validator
3. Adicionar env loader com fallback para dev
4. **Teste**: Verificar 401 com chave inválida

### Fase 2: Rate Limiting por Chave (Medium Priority)
1. Estender `rateLimiter.ts` com rastreamento por API key
2. Adicionar header `X-RateLimit-*` nas respostas
3. Log de rate limit exceeded
4. **Teste**: Exceder limite, verificar 429

### Fase 3: Configuração Vercel (High Priority)
1. Atualizar `vercel.json`:
   - Adicionar `env` section com defaults
   - Documentar valores obrigatórios
2. Instruções para configurar na UI da Vercel
3. Script de geração de chaves seguras
4. **Teste**: Deploy em production, verificar logs

### Fase 4: Logging & Observabilidade (Medium Priority)
1. Estruturar logs de autenticação (JSON)
2. Alertas de múltiplas falhas (possível ataque)
3. Dashboard de falhas de auth (futuro)

---

## Testes

| Cenário | Caso | Esperado | Status |
|---------|------|----------|--------|
| Dev mode | Sem `DASHSYNC_API_KEY` | Funciona com warning | TODO |
| Produção | Chave válida | 200 OK | TODO |
| Produção | Chave inválida | 401 Unauthorized | TODO |
| Produção | Sem chave | 401 Unauthorized | TODO |
| Rate limit | >100 req/15min por chave | 429 Too Many Requests | TODO |
| Timing attack | Comparação de tokens | Resiste a timing attack | TODO |

---

## Variáveis de Ambiente

### Obrigatórias em Produção
```
DASHSYNC_API_KEY=<chave_aleatoria_minimo_32_caracteres>
WS_SECRET=<segredo_minimo_32_caracteres>
```

### Opcionais
```
API_KEY_BYPASS=false (dev only, default: true em isDevMode)
LOG_AUTH_DETAILS=true (verbosidade, default: false)
```

### Geração Segura
```bash
# Terminal
node -e "console.log('KEY_' + require('crypto').randomBytes(32).toString('hex'))"
```

---

## Entrega

✅ **Código**: Todos os arquivos modificados commitados
✅ **Testes**: Casos manuais + unit tests (5+ cenários)
✅ **Docs**: README.md atualizado com setup Vercel
✅ **Deploy**: Instruções passo-a-passo para configurar na Vercel UI
✅ **Rollback**: Plan B se configuração falhar

---

## Critério de Sucesso

- [x] Handler serverless responde (não é mais FUNCTION_INVOCATION_FAILED)
- [ ] Autenticação funciona com `DASHSYNC_API_KEY` definida
- [ ] Dev mode funciona sem `DASHSYNC_API_KEY`
- [ ] Endpoints retornam 401 sem chave válida
- [ ] Logs claros de tentativas falhadas
- [ ] Deploy em Vercel + teste end-to-end bem-sucedido

---

## Dependências & Bloqueadores

- ✅ Node.js crypto built-in (sem deps novas)
- ⚠️ Vercel: Necessário configurar env vars via UI (manual)
- ⚠️ WebSocket: Não suportado em serverless (fica para server.ts local)
