/**
 * SR-002: API key authentication middleware for all HTTP endpoints.
 * SR-003: CORS enforcement for meeting room IP.
 */
import type { FastifyRequest, FastifyReply } from 'fastify';
import { timingSafeEqual } from 'crypto';

const API_KEY         = process.env['DASHSYNC_API_KEY'] ?? '';
const ALLOWED_ORIGINS = (process.env['ALLOWED_ORIGINS'] ?? '').split(',').map(s => s.trim()).filter(Boolean);
const PUBLIC_PATHS    = new Set(['/api/health', '/ws/control']);

function isValidApiKey(provided: string): boolean {
  if (!API_KEY) return true; // dev mode: no key configured → allow all
  if (provided.length !== API_KEY.length) return false;
  return timingSafeEqual(Buffer.from(provided), Buffer.from(API_KEY));
}

export async function apiKeyAuth(req: FastifyRequest, reply: FastifyReply): Promise<void> {
  if (PUBLIC_PATHS.has(req.routeOptions?.url ?? req.url)) return; // SR-001 handled by WS
  if (req.url.startsWith('/media/') || req.url.startsWith('/wall/') || req.url.startsWith('/tablet/')) return;

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
