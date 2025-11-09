import express from 'express';

const router = express.Router();

// GET /health - Health check endpoint
router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'langgraph-multi-agent-app'
  });
});

export const healthRoutes = router;