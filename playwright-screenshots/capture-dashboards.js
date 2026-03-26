/**
 * Playwright — captura de screenshots de todos os dashboards SyncDash.
 *
 * Na primeira execução: abre o browser, aguarda login manual (Google).
 * Nas próximas execuções: reutiliza a sessão salva automaticamente.
 *
 * Execução: node playwright-screenshots/capture-dashboards.js
 * Forçar novo login: node playwright-screenshots/capture-dashboards.js --fresh
 */
const { chromium } = require('playwright');
const fs   = require('fs');
const path = require('path');

const BASE_URL    = 'http://localhost:3000';
const OUT_DIR     = path.join(__dirname, 'captures');
const SESSION_FILE = path.join(__dirname, 'session.json');
const FRESH_LOGIN  = process.argv.includes('--fresh');

// Nav principal (texto exato no nav) + sub-abas opcionais
const DASHBOARDS = [
  { file: '01-geracao-distribuida',      mainNav: 'Geração Distribuída' },
  { file: '02-grande-sertao',            mainNav: 'Grande Sertão II' },
  { file: '03-comercial-ppa',            mainNav: 'Comercial',           subTab: 'PPA' },
  { file: '04-comercial-energia-facil',  mainNav: 'Comercial',           subTab: 'Energia Fácil' },
  { file: '05-comercial-bess',           mainNav: 'Comercial',           subTab: 'BESS' },
  { file: '06-trading-energia',          mainNav: 'Trading & Risco',     subTab: 'Energia' },
  { file: '07-trading-gas',              mainNav: 'Trading & Risco',     subTab: 'Gás' },
  { file: '08-bitcoin',                  mainNav: 'Bitcoin & Operações', subTab: 'Bitcoin' },
  { file: '09-operacoes-estruturadas',   mainNav: 'Bitcoin & Operações', subTab: 'Operações' },
];

// ─── helpers ──────────────────────────────────────────────────────────────────

async function waitForLogin(page) {
  console.log('\n🌐 Abrindo página de login...');
  await page.goto(`${BASE_URL}/login`, { waitUntil: 'domcontentloaded' });

  console.log('👤 Faça login com Google Corporativo no browser aberto.');
  console.log('   Aguardando redirecionamento para a home...\n');

  // Aguarda até o usuário completar o login (URL muda de /login)
  await page.waitForURL(url => !url.includes('/login'), { timeout: 120_000 });
  await page.waitForLoadState('networkidle');
  console.log('✅ Login realizado! URL:', page.url());
}

async function navigateTo(page, dash) {
  // Clicar na aba principal
  const mainBtn = page.locator('nav').getByRole('button', { name: new RegExp(escapeRegex(dash.mainNav), 'i') }).first();
  await mainBtn.click({ timeout: 8000 }).catch(async () => {
    await page.getByRole('button', { name: new RegExp(escapeRegex(dash.mainNav), 'i') }).first().click({ timeout: 8000 });
  });
  await page.waitForTimeout(600);

  // Clicar na sub-aba se existir
  if (dash.subTab) {
    // Tenta role="tab" primeiro, depois button genérico
    const tab = page.getByRole('tab', { name: new RegExp(escapeRegex(dash.subTab), 'i') }).first();
    await tab.click({ timeout: 4000 }).catch(async () => {
      await page.getByRole('button', { name: new RegExp(escapeRegex(dash.subTab), 'i') }).first()
        .click({ timeout: 4000 }).catch(() => {});
    });
    await page.waitForTimeout(600);
  }

  // Aguarda dados renderizarem
  await page.waitForTimeout(2500);
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ─── main ─────────────────────────────────────────────────────────────────────

async function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const hasSession = !FRESH_LOGIN && fs.existsSync(SESSION_FILE);

  const browser = await chromium.launch({
    headless: false,
    slowMo: 80,
    args: ['--start-maximized'],
  });

  let ctx;

  if (hasSession) {
    console.log('📂 Sessão salva encontrada — reutilizando...');
    ctx = await browser.newContext({
      viewport:     { width: 1440, height: 900 },
      locale:       'pt-BR',
      colorScheme:  'dark',
      storageState: SESSION_FILE,
    });
  } else {
    ctx = await browser.newContext({
      viewport:    { width: 1440, height: 900 },
      locale:      'pt-BR',
      colorScheme: 'dark',
    });
  }

  const page = await ctx.newPage();

  // ── LOGIN ──────────────────────────────────────────────────────────────────
  if (!hasSession) {
    await waitForLogin(page);
    // Salva a sessão para reutilizar depois
    await ctx.storageState({ path: SESSION_FILE });
    console.log(`💾 Sessão salva em: ${SESSION_FILE}\n`);
  } else {
    // Verifica se a sessão ainda é válida
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    if (page.url().includes('/login')) {
      console.log('⚠️  Sessão expirou — aguardando novo login...');
      await waitForLogin(page);
      await ctx.storageState({ path: SESSION_FILE });
      console.log(`💾 Sessão atualizada.\n`);
    } else {
      console.log('✅ Sessão válida —', page.url());
    }
  }

  // Screenshot da home
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(OUT_DIR, '00-home.png') });

  // ── CAPTURA DOS DASHBOARDS ─────────────────────────────────────────────────
  console.log('\n📸 Capturando dashboards...');
  const results = { ok: [], fail: [] };

  for (const dash of DASHBOARDS) {
    const label = dash.subTab ? `${dash.mainNav} › ${dash.subTab}` : dash.mainNav;
    process.stdout.write(`  ${label}... `);
    try {
      await navigateTo(page, dash);
      const out = path.join(OUT_DIR, `${dash.file}.png`);
      await page.screenshot({ path: out, fullPage: false });
      results.ok.push(label);
      console.log('✅');
    } catch (err) {
      results.fail.push({ label, error: err.message.split('\n')[0] });
      console.log('❌', err.message.split('\n')[0]);
      await page.screenshot({ path: path.join(OUT_DIR, `${dash.file}-ERROR.png`) }).catch(() => {});
    }
  }

  // ── MODO TV ────────────────────────────────────────────────────────────────
  console.log('\n📺 Capturando Modo TV...');
  try {
    // Volta para o início e ativa TV mode
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);

    // Busca o botão do modo TV pelo ícone Tv2 (lucide) ou texto
    const tvBtn = page.locator('button').filter({ hasText: /TV/i }).first();
    await tvBtn.click({ timeout: 5000 });
    await page.waitForTimeout(1200);

    for (let i = 1; i <= 9; i++) {
      await page.screenshot({ path: path.join(OUT_DIR, `tv-slide-${String(i).padStart(2, '0')}.png`) });
      if (i < 9) {
        // ChevronRight — último botão com SVG na barra de controles
        const btns = page.locator('button svg').locator('..');
        const count = await btns.count();
        if (count > 0) await btns.nth(count - 1).click({ timeout: 3000 }).catch(() => {});
        await page.waitForTimeout(1000);
      }
    }
    console.log('  ✅ 9 slides capturados');
  } catch (err) {
    console.log('  ⚠️ Modo TV:', err.message.split('\n')[0]);
  }

  // ── RELATÓRIO ──────────────────────────────────────────────────────────────
  console.log('\n' + '═'.repeat(55));
  console.log('RESULTADO');
  console.log('═'.repeat(55));
  console.log(`✅ ${results.ok.length}/${DASHBOARDS.length} dashboards capturados com sucesso`);
  if (results.fail.length) {
    console.log(`❌ Falhas (${results.fail.length}):`);
    results.fail.forEach(f => console.log(`   • ${f.label}: ${f.error}`));
  }
  console.log(`\n📁 Capturas salvas em:\n   ${OUT_DIR}`);
  console.log('═'.repeat(55));

  await browser.close();
}

main().catch(err => { console.error('Erro fatal:', err); process.exit(1); });
