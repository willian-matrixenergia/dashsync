/**
 * SR-002: API key authentication middleware for all HTTP endpoints.
 * SR-003: CORS enforcement for meeting room IP.
 */
import type { IncomingMessage, ServerResponse } from 'node:http';
import { timingSafeEqual } from 'node:crypto';

const API_KEY         = process.env['DASHSYNC_API_KEY'] ?? '';
const ALLOWED_ORIGINS = (process.env['ALLOWED_ORIGINS'] ?? '').split(',').map(s => s.trim()).filter(Boolean);
const PUBLIC_PATHS    = new Set(['/api/health', '/ws/control']);

function isValidApiKey(provided: string): boolean {
  if (!API_KEY) return true; // dev mode: no key configured → allow all
  if (provided.length !== API_KEY.length) return false;
  return timingSafeEqual(Buffer.from(provided), Buffer.from(API_KEY));
}

/** Returns true if the request was blocked (401 already written). */
export function apiKeyAuth(req: IncomingMessage, res: ServerResponse, pathname: string): boolean {
  if (PUBLIC_PATHS.has(pathname)) return false;
  if (pathname.startsWith('/media/') || pathname.startsWith('/wall/') || pathname.startsWith('/tablet/')) return false;

  const key = (req.headers['x-api-key'] as string | undefined)
           ?? parseQueryParam(req.url ?? '', 'api_key')
           ?? '';

  if (!isValidApiKey(key)) {
    sendJson(res, 401, { error: 'Unauthorized', code: 'INVALID_API_KEY' });
    return true;
  }
  return false;
}

/** Applies CORS headers. Returns true if the request was a preflight (OPTIONS) already handled. */
export function applyCors(req: IncomingMessage, res: ServerResponse): boolean {
  const origin = req.headers['origin'];
  const devMode = ALLOWED_ORIGINS.length === 0;
  if (origin && (devMode || ALLOWED_ORIGINS.includes(origin))) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Api-Key');
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return true;
  }
  return false;
}

export function applySecurityHeaders(res: ServerResponse): void {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-XSS-Protection', '0');
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: blob:; connect-src 'self' wss:; frame-src 'none'",
  );
}

export function sendJson(res: ServerResponse, status: number, body: unknown): void {
  const payload = JSON.stringify(body);
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(payload);
}

export async function readJson(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk: Buffer) => { body += chunk.toString(); });
    req.on('end', () => {
      try { resolve(body ? JSON.parse(body) : {}); }
      catch { reject(new Error('Invalid JSON')); }
    });
    req.on('error', reject);
  });
}

function parseQueryParam(rawUrl: string, name: string): string | undefined {
  try {
    const url = new URL(rawUrl, 'http://localhost');
    return url.searchParams.get(name) ?? undefined;
  } catch {
    return undefined;
  }
}
