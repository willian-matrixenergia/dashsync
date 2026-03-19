import { describe, it, expect, vi, beforeEach } from 'vitest';

// Reset module between tests to clear the windows Map
beforeEach(() => {
  vi.resetModules();
});

describe('isRateLimited', () => {
  it('permite requisições abaixo do limite', async () => {
    const { isRateLimited } = await import('./rateLimiter.js');
    for (let i = 0; i < 5; i++) {
      expect(isRateLimited('1.2.3.4', '/api/projects')).toBe(false);
    }
  });

  it('bloqueia após exceder limite de AI endpoint', async () => {
    const { isRateLimited } = await import('./rateLimiter.js');
    for (let i = 0; i < 20; i++) isRateLimited('10.0.0.1', '/api/ai/summary');
    expect(isRateLimited('10.0.0.1', '/api/ai/summary')).toBe(true);
  });

  it('IPs diferentes têm janelas independentes', async () => {
    const { isRateLimited } = await import('./rateLimiter.js');
    for (let i = 0; i < 20; i++) isRateLimited('192.168.1.1', '/api/ai/risk');
    expect(isRateLimited('192.168.1.2', '/api/ai/risk')).toBe(false);
  });

  it('endpoint admin tem limite de 10/min', async () => {
    const { isRateLimited } = await import('./rateLimiter.js');
    for (let i = 0; i < 10; i++) isRateLimited('10.0.0.2', '/api/admin/reload');
    expect(isRateLimited('10.0.0.2', '/api/admin/reload')).toBe(true);
  });
});
