import { Router } from 'express';
import type { Router as ExpressRouter } from 'express';
import toolRoutes from './tools';
import agentRoutes from './agents';
import executionRoutes from './executions';
import mcpRoutes from './mcp';
import apiRoutes from '@/api/routes';

const router: ExpressRouter = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// New API Routes (v1)
router.use('/', apiRoutes);

// Legacy API Routes (to be migrated)
router.use('/tools', toolRoutes);
router.use('/agents', agentRoutes);
router.use('/executions', executionRoutes);

// MCP Routes
router.use('/mcp', mcpRoutes);

export default router;
