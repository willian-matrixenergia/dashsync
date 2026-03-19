import path from 'path';
import { fileURLToPath } from 'url';
import staticFiles from '@fastify/static';
import websocket from '@fastify/websocket';
import { createApp } from './app.js';
import { startExcelWatcher } from './infrastructure/excel/ExcelWatcher.js';
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
  if (!isDevMode()) {
    requireEnv('WS_SECRET');
    requireEnv('DASHSYNC_API_KEY');
  }

  const { app, portfolioRepo, progressoRepo, hub } = createApp();

  // ─── Local-only: WebSocket + Static Files + Excel Watcher ──────────────────
  await app.register(websocket);
  await app.register(staticFiles, { root: MEDIA_DIR, prefix: '/media/' });
  await app.register(staticFiles, { root: WALL_DIST,   prefix: '/wall/',   decorateReply: false });
  await app.register(staticFiles, { root: TABLET_DIST, prefix: '/tablet/', decorateReply: false });

  // WebSocket endpoint (SR-001: token validation)
  app.get('/ws/control', { websocket: true }, (socket, req) => {
    const clientIp = req.ip ?? '0.0.0.0';
    const count    = wsConnectionsPerIp.get(clientIp) ?? 0;

    if (count >= WS_MAX_CONNECTIONS_PER_IP) {
      socket.close(1008, 'Too many connections from this IP');
      return;
    }

    if (!isDevMode()) {
      const token = (req.query as Record<string, string>)['token'];
      if (!token || !validateWsToken(token)) {
        socket.close(1008, 'Invalid session token');
        return;
      }
    }

    const role = (req.query as Record<string, string>)['role'] as 'wall' | 'tablet' | 'unknown';
    wsConnectionsPerIp.set(clientIp, count + 1);
    socket.on('close', () => {
      const c = wsConnectionsPerIp.get(clientIp) ?? 1;
      wsConnectionsPerIp.set(clientIp, Math.max(0, c - 1));
    });

    hub.addClient(socket, role ?? 'unknown');
  });

  // Excel file watcher
  startExcelWatcher(DATA_DIR, portfolioRepo, progressoRepo, {
    onReloaded: (ts) => {
      app.log.info(`Excel reloaded at ${ts.toISOString()}`);
      hub.broadcastDataUpdated(ts);
    },
    onError: (msg) => app.log.error(msg),
  });

  await app.listen({ port: PORT, host: '0.0.0.0' });
  app.log.info(`DashSync API running on http://0.0.0.0:${PORT}`);
}

bootstrap().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
