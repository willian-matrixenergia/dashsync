/**
 * SR-001: Signed session token for WebSocket authentication.
 * Uses HMAC-SHA256. Token = base64(sessaoId + '.' + hmac(sessaoId, WS_SECRET))
 */
import { createHmac, timingSafeEqual } from 'crypto';

const WS_SECRET = process.env['WS_SECRET'] ?? 'dev-insecure-secret-change-in-prod';

export function generateWsToken(sessaoId: string): string {
  const hmac = createHmac('sha256', WS_SECRET)
    .update(sessaoId)
    .digest('hex');
  return Buffer.from(`${sessaoId}.${hmac}`).toString('base64url');
}

export function validateWsToken(token: string): string | null {
  try {
    const decoded  = Buffer.from(token, 'base64url').toString('utf8');
    const dotIdx   = decoded.lastIndexOf('.');
    if (dotIdx < 0) return null;

    const sessaoId = decoded.slice(0, dotIdx);
    const provided = decoded.slice(dotIdx + 1);
    const expected = createHmac('sha256', WS_SECRET).update(sessaoId).digest('hex');

    if (!timingSafeEqual(Buffer.from(provided, 'hex'), Buffer.from(expected, 'hex'))) return null;
    return sessaoId;
  } catch {
    return null;
  }
}

// Dev mode: if WS_SECRET = 'dev-insecure-secret-change-in-prod', skip validation
export function isDevMode(): boolean {
  return WS_SECRET === 'dev-insecure-secret-change-in-prod';
}
