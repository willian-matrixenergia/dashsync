import Fastify from 'fastify';
import cors from '@fastify/cors';
import { InMemoryPortfolioRepository } from './infrastructure/repositories/InMemoryPortfolioRepository.js';
import { InMemoryProgressoRepository } from './infrastructure/repositories/InMemoryProgressoRepository.js';
import { ControlHub } from './infrastructure/ws/ControlHub.js';
import { registerRoutes } from './infrastructure/http/routes.js';
import { getCorsOptions } from './infrastructure/http/authMiddleware.js';
import { isRateLimited } from './infrastructure/http/rateLimiter.js';

export function createApp() {
  const app = Fastify({
    logger: { level: 'info' },
    disableRequestLogging: false,
  });

  const portfolioRepo = new InMemoryPortfolioRepository();
  const progressoRepo = new InMemoryProgressoRepository();
  const hub = new ControlHub();

  // Security Headers
  app.addHook('onSend', async (_req, reply) => {
    void reply.header('X-Content-Type-Options', 'nosniff');
    void reply.header('X-Frame-Options', 'DENY');
    void reply.header('Referrer-Policy', 'strict-origin-when-cross-origin');
    void reply.header('X-XSS-Protection', '0');
    void reply.header('Content-Security-Policy',
      "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; " +
      "img-src 'self' data: blob:; connect-src 'self' wss:; frame-src 'none'");
  });

  // Rate Limiter
  app.addHook('preHandler', async (req, reply) => {
    const ip = req.ip ?? '0.0.0.0';
    if (isRateLimited(ip, req.url)) {
      await reply.status(429).send({
        error: 'Too many requests. Please try again later.',
      });
    }
  });

  // CORS
  void app.register(cors, getCorsOptions());

  // Routes
  void registerRoutes(app, portfolioRepo, progressoRepo, hub);

  // Error handler (no internal details to client)
  app.setErrorHandler(async (error, _req, reply) => {
    console.error('API Error:', error);
    const statusCode = error.statusCode ?? 500;
    await reply.status(statusCode).send({
      error: statusCode >= 500 ? 'Internal server error' : error.message,
    });
  });

  return { app, portfolioRepo, progressoRepo, hub };
}
