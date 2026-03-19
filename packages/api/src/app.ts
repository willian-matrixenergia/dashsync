import type { IncomingMessage, ServerResponse } from 'node:http';
import { InMemoryPortfolioRepository } from './infrastructure/repositories/InMemoryPortfolioRepository.js';
import { InMemoryProgressoRepository } from './infrastructure/repositories/InMemoryProgressoRepository.js';
import { ControlHub } from './infrastructure/ws/ControlHub.js';
import { buildRouter } from './infrastructure/http/routes.js';
import { applyCors, applySecurityHeaders, apiKeyAuth, sendJson } from './infrastructure/http/authMiddleware.js';
import { isRateLimited } from './infrastructure/http/rateLimiter.js';

export function createApp() {
  const portfolioRepo = new InMemoryPortfolioRepository();
  const progressoRepo = new InMemoryProgressoRepository();
  const hub = new ControlHub();
  const router = buildRouter(portfolioRepo, progressoRepo, hub);

  function handler(req: IncomingMessage, res: ServerResponse): void {
    // CORS
    if (applyCors(req, res)) return;

    // Security headers
    applySecurityHeaders(res);

    const url = new URL(req.url ?? '/', 'http://localhost');
    const pathname = url.pathname;
    const method = req.method ?? 'GET';

    // Rate limit
    const ip = (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0]?.trim() ?? '0.0.0.0';
    if (isRateLimited(ip, pathname)) {
      sendJson(res, 429, { error: 'Too many requests. Please try again later.' });
      return;
    }

    // Auth
    if (apiKeyAuth(req, res, pathname)) return;

    // Route
    const match = router.match(method, pathname);
    if (!match) {
      sendJson(res, 404, { error: 'Not found' });
      return;
    }

    match.handler(req, res, match.params).catch((err: unknown) => {
      console.error(err);
      if (!res.headersSent) {
        sendJson(res, 500, { error: 'Internal server error' });
      }
    });
  }

  return { handler, portfolioRepo, progressoRepo, hub };
}
