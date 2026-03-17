import Fastify from 'fastify';
import cors from '@fastify/cors';
import staticFiles from '@fastify/static';
import websocket from '@fastify/websocket';
import path from 'path';
import { fileURLToPath } from 'url';
import { InMemoryPortfolioRepository } from './infrastructure/repositories/InMemoryPortfolioRepository.js';
import { InMemoryProgressoRepository } from './infrastructure/repositories/InMemoryProgressoRepository.js';
import { ControlHub } from './infrastructure/ws/ControlHub.js';
import { startExcelWatcher } from './infrastructure/excel/ExcelWatcher.js';
import { registerRoutes } from './infrastructure/http/routes.js';
import { getCorsOptions } from './infrastructure/http/authMiddleware.js';
import { isRateLimited } from './infrastructure/http/rateLimiter.js';
import { validateWsToken, isDevMode } from './infrastructure/ws/WsSessionToken.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PORT        = parseInt(process.env['PORT']       ?? '3001', 10);
const DATA_DIR    = process.env['DATA_DIR']            ?? path.join(__dirname, '../../data');
const MEDIA_DIR   = process.env['MEDIA_DIR']           ?? path.join(__dirname, '../../media');
const WALL_DIST   = process.env['WALL_DIST_DIR']       ?? path.join(__dirname, '../../wall/dist');
const TABLET_DIST = process.env['TABLET_DIST_DIR']     ?? path.join(__dirname, '../../tablet/dist');

const WS_MAX_CONNECTIONS_PER_IP  = 10;
const wsConnectionsPerIp = new Map<string, number>();

function requireEnv(name: string): string {
  const val = process.env[name];
  if (!val) throw new Error(`Missing required env var: ${name}`);
  return val;
}

async function bootstrap(): Promise<void> {
  // Validate critical secrets on startup
  if (!isDevMode()) {
    requireEnv('WS_SECRET');
    requireEnv('DASHSYNC_API_KEY');
  }

  const app = Fastify({
    logger: { level: 'info' },
    // SR-010: Never expose internal error details to clients
    disableRequestLogging: false,
  });

  // ─── Security Headers ────────────────────────────────────────────────────────
  app.addHook('onSend', async (_req, reply) => {
    void reply.header('X-Content-Type-Options', 'nosniff');
    void reply.header('X-Frame-Options', 'DENY');
    void reply.header('Referrer-Policy', 'strict-origin-when-cross-origin');
    void reply.header('X-XSS-Protection', '0'); // modern browsers: use CSP instead
    void reply.header('Content-Security-Policy',
      "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; " +
      "img-src 'self' data: blob:; connect-src 'self' wss:; frame-src 'none'");
  });

  // ─── Rate Limiter Hook ───────────────────────────────────────────────────────
  app.addHook('preHandler', async (req, reply) => {
    const ip = req.ip ?? '0.0.0.0';
    if (isRateLimited(ip, req.url)) {
      await reply.status(429).send({ error: 'Too many requests. Please try again later.' });
    }
  });

  // ─── CORS (SR-003) ───────────────────────────────────────────────────────────
  await app.register(cors, getCorsOptions());
  await app.register(websocket);

  // Serve static files — media requires auth token via query param in production
  await app.register(staticFiles, { root: MEDIA_DIR, prefix: '/media/' });
  await app.register(staticFiles, { root: WALL_DIST,   prefix: '/wall/',   decorateReply: false });
  await app.register(staticFiles, { root: TABLET_DIST, prefix: '/tablet/', decorateReply: false });

  const portfolioRepo = new InMemoryPortfolioRepository();
  const progressoRepo = new InMemoryProgressoRepository();
  const hub = new ControlHub();

  await registerRoutes(app, portfolioRepo, progressoRepo, hub);

  // ─── WebSocket endpoint (SR-001: token validation) ───────────────────────────
  app.get('/ws/control', { websocket: true }, (socket, req) => {
    const clientIp = req.ip ?? '0.0.0.0';
    const count    = wsConnectionsPerIp.get(clientIp) ?? 0;

    // SR-005: Max connections per IP
    if (count >= WS_MAX_CONNECTIONS_PER_IP) {
      socket.close(1008, 'Too many connections from this IP');
      return;
    }

    // SR-001: Validate WS token (skip in dev mode)
    const token = (req.query as Record<string, string>)['token'];
    if (!isDevMode() && (!token || !validateWsToken(token))) {
      socket.close(1008, 'Invalid session token');
      return;
    }

    const role = (req.query as Record<string, string>)['role'] as 'wall' | 'tablet' | 'unknown';
    wsConnectionsPerIp.set(clientIp, count + 1);
    socket.on('close', () => {
      const c = wsConnectionsPerIp.get(clientIp) ?? 1;
      wsConnectionsPerIp.set(clientIp, Math.max(0, c - 1));
    });

    hub.addClient(socket, role ?? 'unknown');
  });

  // ─── Excel file watcher ───────────────────────────────────────────────────────
  startExcelWatcher(DATA_DIR, portfolioRepo, progressoRepo, {
    onReloaded: (ts) => {
      app.log.info(`Excel reloaded at ${ts.toISOString()}`);
      hub.broadcastDataUpdated(ts);
    },
    onError: (msg) => app.log.error(msg),
  });

  // ─── Error handler (SR-010: no internal details to client) ───────────────────
  app.setErrorHandler(async (error, _req, reply) => {
    app.log.error(error);
    const statusCode = error.statusCode ?? 500;
    await reply.status(statusCode).send({
      error: statusCode >= 500 ? 'Internal server error' : error.message,
    });
  });

  await app.listen({ port: PORT, host: '0.0.0.0' });
  app.log.info(`DashSync API running on http://0.0.0.0:${PORT}`);
}

bootstrap().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
