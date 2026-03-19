import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authMiddleware } from './middleware/auth.js';
import portfolioRoutes from './routes/portfolio.js';
import evolutionRoutes from './routes/evolution.js';
import activitiesRoutes from './routes/activities.js';
import specsRoutes from './routes/specs.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
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

// Routes (4 Bases)
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/evolution', evolutionRoutes);
app.use('/api/activities', activitiesRoutes);
app.use('/api/specs', specsRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ success: false, error: { message: 'Not found' } });
});

export default app;
