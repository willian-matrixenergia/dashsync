import { createServer } from 'node:http';
import { createReadStream, existsSync } from 'node:fs';
import path from 'node:path';
import { extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { WebSocketServer } from 'ws';
import { createApp } from './app.js';
import { startExcelWatcher } from './infrastructure/excel/ExcelWatcher.js';
import { validateWsToken, isDevMode } from './infrastructure/ws/WsSessionToken.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PORT        = parseInt(process.env['PORT']       ?? '3001', 10);
const DATA_DIR    = process.env['DATA_DIR']            ?? path.join(__dirname, '../../data');
const MEDIA_DIR   = process.env['MEDIA_DIR']           ?? path.join(__dirname, '../../media');
const WALL_DIST   = process.env['WALL_DIST_DIR']       ?? path.join(__dirname, '../../wall/dist');
const TABLET_DIST = process.env['TABLET_DIST_DIR']     ?? path.join(__dirname, '../../tablet/dist');

const WS_MAX_CONNECTIONS_PER_IP = 10;
const wsConnectionsPerIp = new Map<string, number>();

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript',
  '.mjs':  'application/javascript',
  '.css':  'text/css',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf':  'font/ttf',
  '.webp': 'image/webp',
  '.mp4':  'video/mp4',
};

function serveStatic(rootDir: string, prefix: string, urlPath: string, res: import('node:http').ServerResponse): boolean {
  if (!urlPath.startsWith(prefix)) return false;
  const relative = urlPath.slice(prefix.length) || 'index.html';
  const filePath = path.join(rootDir, relative);

  // Prevent path traversal
  if (!filePath.startsWith(rootDir)) {
    res.writeHead(403);
    res.end();
    return true;
  }

  if (!existsSync(filePath)) {
    // SPA fallback for wall/tablet: serve index.html
    const indexPath = path.join(rootDir, 'index.html');
    if (existsSync(indexPath)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      createReadStream(indexPath).pipe(res);
      return true;
    }
    return false;
  }

  const mime = MIME[extname(filePath)] ?? 'application/octet-stream';
  res.writeHead(200, { 'Content-Type': mime });
  createReadStream(filePath).pipe(res);
  return true;
}

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

  const { handler, portfolioRepo, progressoRepo, hub } = createApp();

  const server = createServer((req, res) => {
    const urlPath = new URL(req.url ?? '/', 'http://localhost').pathname;

    // Static file serving (before API handler)
    if (serveStatic(MEDIA_DIR,   '/media/',   urlPath, res)) return;
    if (serveStatic(WALL_DIST,   '/wall/',    urlPath, res)) return;
    if (serveStatic(TABLET_DIST, '/tablet/',  urlPath, res)) return;

    handler(req, res);
  });

  // WebSocket (SR-001: token validation)
  const wss = new WebSocketServer({ noServer: true });

  server.on('upgrade', (req, socket, head) => {
    const url = new URL(req.url ?? '/', 'http://localhost');
    if (url.pathname !== '/ws/control') {
      socket.destroy();
      return;
    }

    wss.handleUpgrade(req, socket, head, (ws) => {
      const clientIp = (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0]?.trim() ?? '0.0.0.0';
      const count = wsConnectionsPerIp.get(clientIp) ?? 0;

      if (count >= WS_MAX_CONNECTIONS_PER_IP) {
        ws.close(1008, 'Too many connections from this IP');
        return;
      }

      if (!isDevMode()) {
        const token = url.searchParams.get('token') ?? '';
        if (!token || !validateWsToken(token)) {
          ws.close(1008, 'Invalid session token');
          return;
        }
      }

      const role = (url.searchParams.get('role') ?? 'unknown') as 'wall' | 'tablet' | 'unknown';
      wsConnectionsPerIp.set(clientIp, count + 1);
      ws.on('close', () => {
        const c = wsConnectionsPerIp.get(clientIp) ?? 1;
        wsConnectionsPerIp.set(clientIp, Math.max(0, c - 1));
      });

      hub.addClient(ws, role);
    });
  });

  // Excel file watcher
  startExcelWatcher(DATA_DIR, portfolioRepo, progressoRepo, {
    onReloaded: (ts) => {
      console.info(`Excel reloaded at ${ts.toISOString()}`);
      hub.broadcastDataUpdated(ts);
    },
    onError: (msg) => console.error(msg),
  });

  server.listen(PORT, '0.0.0.0', () => {
    console.info(`DashSync API running on http://0.0.0.0:${PORT}`);
  });
}

bootstrap().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
