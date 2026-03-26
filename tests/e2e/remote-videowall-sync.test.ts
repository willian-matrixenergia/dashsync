import { test, expect, chromium } from '@playwright/test';

let browser: import('@playwright/test').Browser;
let context: import('@playwright/test').BrowserContext;
let remotePage: import('@playwright/test').Page;
let videowallPage: import('@playwright/test').Page;

test.describe('Remote Control → Video Wall Sync (E2E)', () => {
  test.beforeAll(async () => {
    browser = await chromium.launch({ headless: true });
    context = await browser.newContext();

    remotePage = await context.newPage();
    videowallPage = await context.newPage();

    await remotePage.goto('http://localhost:3001/remote');
    await videowallPage.goto('http://localhost:3001/videowall');

    await remotePage.waitForLoadState('networkidle');
    await videowallPage.waitForLoadState('networkidle');
  });

  test.afterAll(async () => {
    await context.close();
    await browser.close();
  });

  test('SELECIONAR FILTRO TRANSMISSÃO NO REMOTE REFLETE NO VIDEOWALL', async () => {
    // 1. Pegar contagem inicial de projetos no Video Wall
    await videowallPage.waitForSelector('tbody tr', { timeout: 10000 });
    const initialRows = await videowallPage.$$('tbody tr');
    const initialCount = initialRows.length;
    console.log(`[ANTES] Video Wall tem ${initialCount} projetos`);

    // Pegar valores iniciais dos KPIs
    const kpiTextsBefore = await videowallPage.$$eval('.vw-kpi', (cards) =>
      cards.map((c) => c.textContent?.trim())
    );
    console.log(`[ANTES] KPIs:`, kpiTextsBefore.map((t: string | null) => t?.substring(0, 30)));

    // 2. No Remote, verificar se existe filtro TRANSMISSÃO
    const transmissaoButton = await remotePage.$('button:has-text("TRANSMISSÃO")');
    if (!transmissaoButton) {
      // Se não existir TRANSMISSÃO, tentar outro programa disponível
      const buttons = await remotePage.$$('button.px-4');
      console.log(`Botões de programas encontrados: ${buttons.length}`);
      
      // Clicar no primeiro botão de programa disponível
      if (buttons.length > 0) {
        await buttons[0].click();
        console.log(`Clicou no primeiro botão de programa`);
      }
    } else {
      // Clicar em TRANSMISSÃO
      await transmissaoButton.click();
      console.log(`Clicou em TRANSMISSÃO`);
    }

    // 3. Clicar em "Aplicar ao Video Wall"
    const applyButton = await remotePage.$('button:has-text("Aplicar ao Video Wall")');
    expect(applyButton).toBeTruthy();

    console.log(`Clicando em Aplicar ao Video Wall...`);
    const startTime = Date.now();
    await applyButton?.click();

    // 4. Aguardar o Video Wall atualizar (max 3 segundos)
    await videowallPage.waitForTimeout(1000);

    // 5. Verificar se a tabela mudou
    const newRows = await videowallPage.$$('tbody tr');
    const newCount = newRows.length;
    const latency = Date.now() - startTime;
    
    console.log(`[DEPOIS] Video Wall tem ${newCount} projetos`);
    console.log(`Latência: ${latency}ms`);

    // 6. Verificar KPIs depois
    const kpiTextsAfter = await videowallPage.$$eval('.vw-kpi', (cards) =>
      cards.map((c) => c.textContent?.trim())
    );
    console.log(`[DEPOIS] KPIs:`, kpiTextsAfter.map((t: string | null) => t?.substring(0, 30)));

    // 7. ASSERTIVAS FINAIS
    expect(latency).toBeLessThan(3000, 'Sincronização deve ser menor que 3 segundos');
    
    // Verificar que algo mudou (ou contagem ou KPIs)
    const countChanged = initialCount !== newCount;
    const kpisChanged = JSON.stringify(kpiTextsBefore) !== JSON.stringify(kpiTextsAfter);
    
    expect(countChanged || kpisChanged).toBe(true, 'Algo deve ter mudado no Video Wall após aplicar filtro');
    
    console.log(`✅ TESTE PASSOU: Filtro aplicado com sucesso!`);
  });

  test('VERIFICAR QUE BROADCASTCHANNEL ESTÁ ENVIANDO', async () => {
    // Habilitar logs de console no Remote
    const remoteLogs: string[] = [];
    remotePage.on('console', msg => remoteLogs.push(msg.text()));

    // Clicar em um programa
    const programButton = await remotePage.$('button.px-4');
    await programButton?.click();
    await remotePage.waitForTimeout(200);

    // Clicar em Aplicar
    const applyButton = await remotePage.$('button:has-text("Aplicar ao Video Wall")');
    await applyButton?.click();
    await remotePage.waitForTimeout(500);

    // Verificar logs
    const syncLogs = remoteLogs.filter(log => 
      log.includes('[SyncDash-BC]') || log.includes('sendFilter')
    );
    console.log(`Logs de sincronização:`, syncLogs);

    expect(syncLogs.length).toBeGreaterThan(0, 'Deve haver logs de sincronização');
  });
});
