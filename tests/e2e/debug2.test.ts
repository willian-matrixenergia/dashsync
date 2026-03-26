import { test, expect, chromium } from '@playwright/test';

test('TIRAR FOTO DO VIDEOWALL', async () => {
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 500
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  console.log('Abrindo Video Wall...');
  await page.goto('http://localhost:3001/videowall');
  await page.waitForLoadState('networkidle');
  
  await page.screenshot({ path: 'tests/e2e/videowall-screen.png', fullPage: true });
  console.log('Foto: tests/e2e/videowall-screen.png');
  
  const kpiCards = await page.$$('.vw-kpi');
  console.log('KPI Cards:', kpiCards.length);
  
  await browser.close();
});
