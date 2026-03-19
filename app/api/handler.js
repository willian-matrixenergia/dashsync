import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Auth middleware
const authMiddleware = (req, res, next) => {
  if (req.path === '/' || req.path === '/health') {
    next();
    return;
  }

  const API_KEY = process.env.API_KEY;
  if (!API_KEY) {
    next();
    return;
  }

  const key = req.headers['x-api-key'] || req.query?.api_key;
  if (!key || key !== API_KEY) {
    res.status(401).json({ success: false, error: { message: 'Unauthorized', code: 'INVALID_API_KEY' } });
    return;
  }
  next();
};

app.use(authMiddleware);

// Root endpoint
app.get('/', (_req, res) => {
  res.json({
    api: 'DashSync API v1.0',
    status: 'operational',
    endpoints: ['/api/portfolio', '/api/evolution', '/api/activities', '/api/specs', '/health'],
  });
});

// Health check
app.get('/health', (_req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ success: false, error: { message: 'Not found' } });
});

export default app;
