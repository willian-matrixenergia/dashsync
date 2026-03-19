/**
 * SR-005: In-process sliding window rate limiter (no Redis dependency for MVP).
 * Keyed by IP address. Limits WebSocket connections and API calls.
 */

interface Window { count: number; resetAt: number }

const MAX_WINDOWS = 10_000; // H-003: cap memory usage (~10k unique IPs × paths)
const windows = new Map<string, Window>();

const LIMITS: Record<string, { max: number; windowMs: number }> = {
  '/api/admin/reload': { max: 10,  windowMs: 60_000 },   // 10/min
  '/api/ai/':          { max: 20,  windowMs: 60_000 },   // 20/min (AI is expensive)
  '/api/':             { max: 200, windowMs: 60_000 },   // 200/min general
  'ws':                { max: 10,  windowMs: 60_000 },   // 10 WS connections/min
};

function getLimit(path: string): { max: number; windowMs: number } {
  for (const [prefix, limit] of Object.entries(LIMITS)) {
    if (path.startsWith(prefix)) return limit;
  }
  return { max: 300, windowMs: 60_000 };
}

/** Returns true if rate limit exceeded. */
export function isRateLimited(ip: string, path: string): boolean {
  const limit = getLimit(path);
  const key   = `${ip}:${path.split('/').slice(0, 3).join('/')}`;
  const now   = Date.now();

  const w = windows.get(key);
  if (!w || now > w.resetAt) {
    if (windows.size >= MAX_WINDOWS) {
      // Evict oldest expired entry to prevent unbounded growth
      for (const [k, v] of windows.entries()) {
        if (now > v.resetAt) { windows.delete(k); break; }
      }
    }
    windows.set(key, { count: 1, resetAt: now + limit.windowMs });
    return false;
  }
  w.count++;
  if (w.count > limit.max) return true;
  return false;
}

// Cleanup expired windows every 5 minutes to prevent memory leak
setInterval(() => {
  const now = Date.now();
  for (const [key, w] of windows.entries()) {
    if (now > w.resetAt) windows.delete(key);
  }
}, 300_000);
