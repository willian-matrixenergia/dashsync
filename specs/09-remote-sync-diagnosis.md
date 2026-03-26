# Diagnóstico: Remote Control não sincroniza com Video Wall
**Data:** 2026-03-23 | **Status:** 🔴 Não funciona
**Usuário reportou:** Seleciona filtros no Remote, clica "Aplicar", nada acontece no Video Wall

---

## 1. Rastreamento da Chamada

### Fluxo esperado:
```
RemotePage.tsx:
  handleApply(payload)
    ↓
  sendFilter(payload)  [de useRealtimeBroadcast]
    ↓
  BroadcastChannel.postMessage({type: 'filter-update', payload})
    ↓
  VideowallPage.tsx:
    onFilterUpdate (listener de BroadcastChannel)
    ↓
  setFilters(payload)
    ↓
  usePortfolioFilter recomputa
    ↓
  KpiCards e Tabela atualizam
```

---

## 2. Problemas Identificados

### Problema A: `sessionId` está errado
**Linha:** `app/remote/page.tsx:20`

```tsx
const [sessionId] = useState(generateSessionId);
                                            ↑
                    Função NÃO foi CHAMADA!
```

**Impacto:** `sessionId` é a **função**, não o resultado
- `payload.session_id = "[Function generateSessionId]"` (string literal)
- Deveria ser: `"remote-1711270000000-abc123"`

**Esperado:**
```tsx
const [sessionId] = useState(generateSessionId());  // Chamar a função
```

---

### Problema B: Sem logs no console
**Arquivo:** `src/hooks/useRealtimeBroadcast.ts`

**Falta:** Logs de debug para rastrear:
- ❌ "BroadcastChannel criado"
- ❌ "postMessage chamado com payload: ..."
- ❌ "onmessage recebido com: ..."

**Impacto:** Impossível debugar sem DevTools > Console

---

### Problema C: Nenhum teste automatizado
**Situação:** Sem testes, bugs como `sessionId` passam despercebidos

**Falta:**
- ❌ Teste unitário de `useRealtimeBroadcast()`
- ❌ Teste de BroadcastChannel mock
- ❌ Teste de integração Remote → Video Wall

---

## 3. Reprodução do Bug (Manual)

### Passo 1: Verificar sessionId
```javascript
// No console do Remote (F12):
// Inspetar o componente Remote:
// <RemotePage>
// {sessionId} deverá ser "remote-TIMESTAMP-RANDOM"
// Se for "[Function generateSessionId]", é o bug!
```

### Passo 2: Verificar se postMessage é chamado
```javascript
// No console do Remote:
const originalPostMessage = BroadcastChannel.prototype.postMessage;
let postMessageCalled = false;
BroadcastChannel.prototype.postMessage = function(msg) {
  console.log('[DEBUG] postMessage called with:', msg);
  postMessageCalled = true;
  return originalPostMessage.call(this, msg);
};

// Clicar "Aplicar ao Video Wall"
// Se não ver log, postMessage não foi chamado
```

### Passo 3: Verificar se Video Wall recebe mensagem
```javascript
// No console do Video Wall:
const bc = new BroadcastChannel('videowall-sync');
bc.onmessage = (e) => {
  console.log('[DEBUG] Video Wall received:', e.data);
};

// Voltar para Remote, clicar "Aplicar"
// Deveria aparecer log no Video Wall
```

---

## 4. Plano de Testes Automatizados

### 4.1 Teste Unitário: `useRealtimeBroadcast`

**Arquivo a criar:** `src/hooks/useRealtimeBroadcast.test.ts`

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useRealtimeBroadcast } from './useRealtimeBroadcast';

// Mock BroadcastChannel
let mockBroadcastChannelInstance: any;
const mockBroadcastChannel = vi.fn(() => mockBroadcastChannelInstance);

beforeEach(() => {
  // Setup mock BroadcastChannel
  mockBroadcastChannelInstance = {
    postMessage: vi.fn(),
    onmessage: null,
    close: vi.fn(),
  };

  // @ts-ignore
  global.BroadcastChannel = mockBroadcastChannel;
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('useRealtimeBroadcast', () => {
  it('cria BroadcastChannel ao montar', () => {
    renderHook(() => useRealtimeBroadcast());
    expect(mockBroadcastChannel).toHaveBeenCalledWith('videowall-sync');
  });

  it('envia payload via postMessage quando sendFilter é chamado', async () => {
    const { result } = renderHook(() => useRealtimeBroadcast());

    const payload = {
      programas: ['BESS'],
      fases: [],
      coordenadores: [],
      apenas_risco_alto: false,
      timestamp: new Date().toISOString(),
      session_id: 'test-session',
    };

    await result.current.sendFilter(payload);

    await waitFor(() => {
      expect(mockBroadcastChannelInstance.postMessage).toHaveBeenCalledWith({
        type: 'filter-update',
        payload,
      });
    });
  });

  it('chama onFilterUpdate quando recebe mensagem', async () => {
    const onFilterUpdate = vi.fn();
    renderHook(() => useRealtimeBroadcast({ onFilterUpdate }));

    const payload = {
      programas: ['UFV'],
      fases: [],
      coordenadores: [],
      apenas_risco_alto: false,
      timestamp: new Date().toISOString(),
      session_id: 'test-session',
    };

    // Simular recebimento de mensagem
    const messageHandler = mockBroadcastChannelInstance.onmessage;
    messageHandler({
      data: { type: 'filter-update', payload },
    });

    await waitFor(() => {
      expect(onFilterUpdate).toHaveBeenCalledWith(payload);
    });
  });

  it('retorna connectionState "connected" com BroadcastChannel', () => {
    const { result } = renderHook(() => useRealtimeBroadcast());
    expect(result.current.connectionState).toBe('connected');
  });

  it('fecha BroadcastChannel ao desmontar', () => {
    const { unmount } = renderHook(() => useRealtimeBroadcast());
    unmount();
    expect(mockBroadcastChannelInstance.close).toHaveBeenCalled();
  });
});
```

**Executar:**
```bash
npm test -- useRealtimeBroadcast.test.ts
# Deve passar 5 testes
```

---

### 4.2 Teste de Integração: Remote → Video Wall

**Arquivo a criar:** `tests/remote-videowall-sync.test.ts`

```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Browser, BrowserContext, Page } from 'playwright';
import playwright from 'playwright';

// ⚠️ Requer: npm install --save-dev @playwright/test playwright
// E servidor rodando: npm run dev

describe('Remote Control → Video Wall Sync (E2E)', () => {
  let browser: Browser;
  let context: BrowserContext;
  let remotePage: Page;
  let videowallPage: Page;

  beforeAll(async () => {
    browser = await playwright.chromium.launch();
    context = await browser.createContext();

    // Abrir duas abas
    remotePage = await context.newPage();
    videowallPage = await context.newPage();

    await remotePage.goto('http://localhost:3000/remote');
    await videowallPage.goto('http://localhost:3000/videowall');

    // Aguardar carregamento
    await remotePage.waitForLoadState('networkidle');
    await videowallPage.waitForLoadState('networkidle');
  });

  afterAll(async () => {
    await context.close();
    await browser.close();
  });

  it('Remote carrega com botão "Aplicar" ativo', async () => {
    const applyButton = await remotePage.$('button:has-text("Aplicar ao Video Wall")');
    expect(applyButton).toBeTruthy();
    const isDisabled = await applyButton?.evaluate((el) =>
      el.hasAttribute('disabled')
    );
    expect(isDisabled).toBe(false);
  });

  it('Video Wall carrega com 4 KPI cards', async () => {
    const kpiCards = await videowallPage.$$('.vw-kpi');
    expect(kpiCards.length).toBe(4);
  });

  it('Clicar filtro no Remote atualiza contagem', async () => {
    // Encontrar primeiro botão de programa
    const programButton = await remotePage.$('button:first-of-type');
    const beforeClick = await remotePage.textContent('text=Mostrando');

    await programButton?.click();

    // Aguardar re-render
    await remotePage.waitForTimeout(300);

    const afterClick = await remotePage.textContent('text=Mostrando');
    expect(beforeClick).not.toBe(afterClick);
  });

  it('Clicar "Aplicar" no Remote sincroniza com Video Wall em < 500ms', async () => {
    // Ler contagem inicial do Video Wall
    const beforeApply = await videowallPage.$$('tbody tr');
    const countBefore = beforeApply.length;

    // Selecionar filtro no Remote
    const filterButton = await remotePage.$('button[class*="bg-primary"]');
    if (!filterButton) return; // Skip se nenhum botão selecionado

    // Clicar "Aplicar"
    const applyButton = await remotePage.$('button:has-text("Aplicar")');
    const startTime = Date.now();
    await applyButton?.click();

    // Aguardar mudança na tabela do Video Wall
    await videowallPage.waitForFunction(
      (oldCount) => {
        const newRows = document.querySelectorAll('tbody tr');
        return newRows.length !== oldCount;
      },
      countBefore,
      { timeout: 500 }
    );

    const latency = Date.now() - startTime;
    expect(latency).toBeLessThan(500);

    // Verificar que contagem mudou
    const afterApply = await videowallPage.$$('tbody tr');
    expect(afterApply.length).not.toBe(countBefore);
  });

  it('KPI cards recalculam após filtro', async () => {
    const beforeValues = await videowallPage.$$eval('.vw-kpi', (cards) =>
      cards.map((c) => c.textContent)
    );

    // Aplicar novo filtro (assumindo que um já foi selecionado)
    const clearButton = await remotePage.$('button:has-text("Limpar")');
    await clearButton?.click();

    // Aguardar re-render
    await videowallPage.waitForTimeout(500);

    const afterValues = await videowallPage.$$eval('.vw-kpi', (cards) =>
      cards.map((c) => c.textContent)
    );

    expect(beforeValues).not.toEqual(afterValues);
  });
});
```

**Executar:**
```bash
npm test -- remote-videowall-sync.test.ts
# Deve passar 5 testes E2E
```

---

### 4.3 Teste: Logs de Debug

**Arquivo a corrigir:** `src/hooks/useRealtimeBroadcast.ts`

```typescript
// Adicionar logs em cada ponto crítico:

// [1] Criar BroadcastChannel
const bc = new BroadcastChannel(CHANNEL_NAME);
console.log('[SyncDash] BroadcastChannel criado:', CHANNEL_NAME);

// [2] Receber mensagem
bc.onmessage = (event) => {
  console.log('[SyncDash] BroadcastChannel.onmessage recebido:', event.data);
  const payload = event.data.payload as FilterPayload;
  onFilterUpdateRef.current?.(payload);
};

// [3] Enviar mensagem
const sendFilter = useCallback(async (payload: FilterPayload) => {
  console.log('[SyncDash] sendFilter() chamado com payload:', payload);

  const bc = broadcastChannelRef.current;
  if (bc) {
    try {
      bc.postMessage({
        type: 'filter-update',
        payload,
      });
      console.log('[SyncDash] postMessage enviado com sucesso');
    } catch (err) {
      console.error('[SyncDash] postMessage falhou:', err);
    }
  }
}, []);
```

**Teste manual:**
```bash
npm run dev

# No console do Remote:
# Deve aparecer:
# [SyncDash] BroadcastChannel criado: videowall-sync

# Ao clicar "Aplicar":
# [SyncDash] sendFilter() chamado com payload: {...}
# [SyncDash] postMessage enviado com sucesso

# No console do Video Wall:
# [SyncDash] BroadcastChannel.onmessage recebido: {...}
```

---

## 5. Checklist de Testes

### Antes de corrigir:
- [ ] Confirmar bug com `sessionId` sendo função
- [ ] Executar logs de debug manualmente
- [ ] Verificar que `postMessage` não está sendo chamado

### Depois de corrigir:
- [ ] `npm test` — 5 testes unitários passam
- [ ] `npm run dev` + E2E manual — sincronização funciona
- [ ] Console mostra logs `[SyncDash]` em cada passo
- [ ] Latência < 500ms

---

## 6. Correções Necessárias

| Arquivo | Linha | Problema | Solução |
|---------|-------|----------|---------|
| `app/remote/page.tsx` | 20 | `useState(generateSessionId)` | `useState(generateSessionId())` |
| `src/hooks/useRealtimeBroadcast.ts` | ~60 | Sem logs | Adicionar `console.log` em 3 pontos |
| `src/hooks/useRealtimeBroadcast.test.ts` | N/A | Arquivo não existe | Criar testes unitários |
| `tests/remote-videowall-sync.test.ts` | N/A | Arquivo não existe | Criar testes E2E |

---

**Próximas ações:**
1. ✅ Este documento (diagnóstico)
2. ⏳ Criar testes automatizados (sem corrigir código ainda)
3. ⏳ Executar testes (confirmar que falham)
4. ⏳ Corrigir bugs identificados
5. ⏳ Executar testes novamente (confirmar que passam)

