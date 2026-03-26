import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  retries: 0,
  use: {
    baseURL: 'http://localhost:3001',
    viewport: { width: 1920, height: 1080 },
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'npm run dev -- -p 3001',
    port: 3001,
    timeout: 30_000,
    reuseExistingServer: true,
  },
});
