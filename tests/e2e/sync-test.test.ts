import { test, expect, chromium } from '@playwright/test';

let browser: import('@playwright/test').Browser;
let context: import('@playwright/test').BrowserContext;
let remotePage: import('@playwright/test').Page;
let videowallPage: import('@playwright/test').Page;
let initialRowCount: number;

test.describe('Sincronização Remote → Video Wall', () => {
  test.beforeAll(async () => {
    browser = await chromium.launch({ headless: false });
    context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });

    // Abrir VideoWall primeiro para garantir que o listener está ativo
    videowallPage = await context.newPage();

    // Limpar localStorage para evitar estado residual
    await videowallPage.goto('http://localhost:3001/videowall');
    await videowallPage.evaluate(() => localStorage.removeItem('syncdash-filter-sync'));
    await videowallPage.reload();
    await videowallPage.waitForLoadState('networkidle');

    // Esperar tabela carregar
    await videowallPage.waitForSelector('tbody tr', { timeout: 10000 });
    await videowallPage.waitForTimeout(500);

    // Capturar contagem inicial
    initialRowCount = await videowallPage.$$eval('tbody tr', rows => rows.length);
    console.log('Projetos no banco:', initialRowCount);

    // Abrir Remote
    remotePage = await context.newPage();
    await remotePage.goto('http://localhost:3001/remote');
    await remotePage.waitForLoadState('networkidle');
    await remotePage.waitForSelector('button', { timeout: 5000 });

    console.log('Páginas carregadas. Projetos:', initialRowCount);
  });

  test.afterAll(async () => {
    // Limpar filtro antes de fechar
    if (videowallPage && !videowallPage.isClosed()) {
      await videowallPage.evaluate(() => localStorage.removeItem('syncdash-filter-sync'));
    }
    await context?.close();
    await browser?.close();
  });

  test('Remote mostra status Conectado', async () => {
    await expect(remotePage.getByText('Conectado')).toBeVisible({ timeout: 5000 });
  });

  test('Video Wall mostra todos os projetos inicialmente', async () => {
    expect(initialRowCount).toBeGreaterThanOrEqual(1);
    console.log('Video Wall com', initialRowCount, 'projetos');
  });

  test('Selecionar programa e aplicar filtra o Video Wall', async () => {
    // 1. Encontrar o primeiro botão de programa no Remote
    const programButtons = await remotePage.$$('section:first-of-type button');
    expect(programButtons.length).toBeGreaterThanOrEqual(1);

    const firstProgramText = await programButtons[0].textContent();
    console.log('Selecionando programa:', firstProgramText);

    // Clicar para selecionar o programa
    await programButtons[0].click();

    // 2. Clicar "Aplicar ao Video Wall"
    const applyButton = remotePage.getByRole('button', { name: /Aplicar ao Video Wall/ });
    await expect(applyButton).toBeEnabled();
    await applyButton.click();
    console.log('Filtro aplicado');

    // 3. Aguardar que o Video Wall atualize
    // O filtro deve mudar a quantidade de linhas (a menos que todos pertençam ao mesmo programa)
    await videowallPage.waitForTimeout(2000);

    const newRowCount = await videowallPage.$$eval('tbody tr', rows => rows.length);
    console.log('Linhas após filtro:', newRowCount);

    // O filtro foi recebido se: linhas mudaram OU rodapé mostra "Filtros ativos"
    const footerText = await videowallPage.evaluate(() => {
      const footer = document.querySelector('footer');
      return footer?.textContent || '';
    });
    console.log('Rodapé:', footerText);

    const filterReceived = newRowCount <= initialRowCount && footerText.includes('Filtros ativos');
    console.log('Filtro recebido pelo Video Wall:', filterReceived);

    expect(filterReceived).toBe(true);

    // Screenshots
    await remotePage.screenshot({ path: 'tests/e2e/after-apply-remote.png', fullPage: true });
    await videowallPage.screenshot({ path: 'tests/e2e/after-apply-videowall.png', fullPage: true });
  });

  test('Limpar filtros restaura todos os projetos', async () => {
    // Clicar "Limpar Filtros"
    const clearButton = remotePage.getByRole('button', { name: /Limpar Filtros/ });
    await clearButton.click();
    console.log('Limpou filtros');

    // Aguardar que o Video Wall restaure os projetos
    await videowallPage.waitForFunction(
      (expected) => {
        const rows = document.querySelectorAll('tbody tr');
        return rows.length === expected;
      },
      initialRowCount,
      { timeout: 5000 },
    );

    const restoredCount = await videowallPage.$$eval('tbody tr', rows => rows.length);
    console.log('Linhas restauradas:', restoredCount);
    expect(restoredCount).toBe(initialRowCount);
  });
});
