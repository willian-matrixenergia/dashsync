import { test, expect, chromium } from '@playwright/test';

test('ABRIR NAVEGADOR E TIRAR FOTO', async () => {
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 500
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  console.log('Abrindo Remote Control...');
  await page.goto('http://localhost:3001/remote');
  await page.waitForLoadState('networkidle');
  
  await page.screenshot({ path: 'tests/e2e/remote-screen.png', fullPage: true });
  console.log('Foto: tests/e2e/remote-screen.png');
  
  const buttons = await page.$$('button');
  console.log('Botões:', buttons.length);
  
  await browser.close();
});
