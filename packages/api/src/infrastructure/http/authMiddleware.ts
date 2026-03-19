/**
 * SR-002: API key authentication middleware for all HTTP endpoints.
 * SR-003: CORS enforcement for meeting room IP.
 */
import type { FastifyRequest, FastifyReply } from 'fastify';
import { timingSafeEqual } from 'crypto';

const API_KEY         = process.env['DASHSYNC_API_KEY'] ?? '';
const ALLOWED_ORIGINS = (process.env['ALLOWED_ORIGINS'] ?? '').split(',').map(s => s.trim()).filter(Boolean);
const PUBLIC_PATHS    = new Set(['/api/health', '/api/debug/auth', '/ws/control']);

function isValidApiKey(provided: string): boolean {
  if (!API_KEY) return true; // dev mode: no key configured → allow all
  if (provided.length !== API_KEY.length) return false;
  return timingSafeEqual(Buffer.from(provided), Buffer.from(API_KEY));
}

function getRoutePath(req: FastifyRequest): string {
  const fromRoute = req.routeOptions?.url;
  if (typeof fromRoute === 'string') return fromRoute;
  const rawUrl = req.url;
  if (typeof rawUrl !== 'string') return '';
  const qIndex = rawUrl.indexOf('?');
  return qIndex === -1 ? rawUrl : rawUrl.substring(0, qIndex);
}

export async function apiKeyAuth(req: FastifyRequest, reply: FastifyReply): Promise<void> {
  const path = getRoutePath(req);
  if (PUBLIC_PATHS.has(path)) return;
  if (path.startsWith('/media/') || path.startsWith('/wall/') || path.startsWith('/tablet/')) return;

  const key = (req.headers['x-api-key'] as string | undefined)
           ?? (req.query as Record<string, string>)['api_key']
           ?? '';

  if (!isValidApiKey(key)) {
    await reply.status(401).send({ error: 'Unauthorized', code: 'INVALID_API_KEY' });
  }
}

export function getCorsOptions() {
  return {
    origin: ALLOWED_ORIGINS.length > 0
      ? (origin: string | undefined, cb: (err: Error | null, allow: boolean) => void) => {
          if (!origin || ALLOWED_ORIGINS.includes(origin)) cb(null, true);
          else cb(new Error(`CORS: Origin not allowed: ${origin}`), false);
        }
      : true, // dev mode
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'X-Api-Key'],
    credentials: false,
  };
}
