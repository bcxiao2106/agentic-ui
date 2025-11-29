import { Router } from 'express';
import toolRoutes from './tools';
import agentRoutes from './agents';
import executionRoutes from './executions';
import mcpRoutes from './mcp';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
router.use('/tools', toolRoutes);
router.use('/agents', agentRoutes);
router.use('/executions', executionRoutes);

// MCP Routes
router.use('/mcp', mcpRoutes);

export default router;
