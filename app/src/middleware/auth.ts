import { Request, Response, NextFunction } from 'express';

const API_KEY = process.env.API_KEY;

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  // Skip auth for public endpoints
  if (req.path === '/' || req.path === '/health') {
    next();
    return;
  }

  // If no API key configured, allow all requests (dev mode)
  if (!API_KEY) {
    next();
    return;
  }

  const key = (req.headers['x-api-key'] as string) || (req.query.api_key as string);

  if (!key || key !== API_KEY) {
    res.status(401).json({ success: false, error: { message: 'Unauthorized', code: 'INVALID_API_KEY' } });
    return;
  }

  next();
}
