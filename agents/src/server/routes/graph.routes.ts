import express from 'express';

const router = express.Router();

// POST /api/graph/execute - Execute a graph flow
router.post('/execute', (req, res) => {
  res.json({ message: 'Graph execution started' });
});

// GET /api/graph/status/:id - Get graph execution status
router.get('/status/:id', (req, res) => {
  const { id } = req.params;
  res.json({ message: `Graph ${id} status` });
});

export const graphRoutes = router;