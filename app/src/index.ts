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
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(authMiddleware);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    api: 'DashSync API v1.0',
    status: 'operational',
    endpoints: ['/api/portfolio', '/api/evolution', '/api/activities', '/api/specs', '/health'],
    docs: 'https://github.com/willian-matrixenergia/dashsync'
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

// Routes (4 Bases)
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/evolution', evolutionRoutes);
app.use('/api/activities', activitiesRoutes);
app.use('/api/specs', specsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: { message: 'Not found' } });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, error: { message: 'Internal server error' } });
});

// Start server
app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
});
