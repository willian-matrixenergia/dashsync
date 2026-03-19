import express from 'express';
import cors from 'cors';
import { authMiddleware } from '../dist/middleware/auth.js';
import portfolioRoutes from '../dist/routes/portfolio.js';
import evolutionRoutes from '../dist/routes/evolution.js';
import activitiesRoutes from '../dist/routes/activities.js';
import specsRoutes from '../dist/routes/specs.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(authMiddleware);

app.get('/', (_req, res) => {
  res.json({
    api: 'DashSync API v1.0',
    status: 'operational',
    endpoints: ['/api/portfolio', '/api/evolution', '/api/activities', '/api/specs', '/health'],
  });
});

app.get('/health', (_req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

app.use('/api/portfolio', portfolioRoutes);
app.use('/api/evolution', evolutionRoutes);
app.use('/api/activities', activitiesRoutes);
app.use('/api/specs', specsRoutes);

app.use((_req, res) => {
  res.status(404).json({ success: false, error: { message: 'Not found' } });
});

export default app;
