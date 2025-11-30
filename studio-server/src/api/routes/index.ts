import { Router } from 'express';
import type { Router as ExpressRouter } from 'express';
import toolsRouter from './tools.routes';
import versionsRouter from './versions.routes';
import tagsRouter from './tags.routes';
import executionsRouter from './executions.routes';

const router: ExpressRouter = Router();

// API v1 routes
router.use('/v1/tools', toolsRouter);
router.use('/v1/versions', versionsRouter);
router.use('/v1/tags', tagsRouter);
router.use('/v1/executions', executionsRouter);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

// API info endpoint
router.get('/v1', (req, res) => {
  res.json({
    success: true,
    message: 'Agentic UI API v1',
    version: '1.0.0',
    endpoints: {
      tools: '/api/v1/tools',
      versions: '/api/v1/versions',
      tags: '/api/v1/tags',
      executions: '/api/v1/executions',
      health: '/api/health',
    },
    documentation: '/api/v1/docs',
  });
});

export default router;
