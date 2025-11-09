import express from 'express';

const router = express.Router();

// GET /api/agents - List all agents
router.get('/', (req, res) => {
  res.json({ message: 'List of agents' });
});

// POST /api/agents - Create new agent
router.post('/', (req, res) => {
  res.json({ message: 'Agent created' });
});

// GET /api/agents/:id - Get agent by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  res.json({ message: `Agent ${id}` });
});

export const agentsRoutes = router;