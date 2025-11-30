import { Router, Request, Response } from 'express';
import type { Router as ExpressRouter } from 'express';
import { logger } from '@/utils/logger';
import { query, queryOne } from '@/database/connection';
import { AppError } from '@/middleware/errorHandler';

const router: ExpressRouter = Router();

// List all agents
router.get('/', async (req: Request, res: Response) => {
  try {
    const { workspace_id, is_active, limit = 20, offset = 0 } = req.query;

    let sql = 'SELECT * FROM agents WHERE 1=1';
    const params: any[] = [];

    if (workspace_id) {
      sql += ' AND workspace_id = $' + (params.length + 1);
      params.push(workspace_id);
    }

    if (is_active !== undefined) {
      sql += ' AND is_active = $' + (params.length + 1);
      params.push(is_active === 'true');
    }

    sql += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(limit, offset);

    const agents = await query(sql, params);
    res.json(agents);
  } catch (error) {
    logger.error('Error fetching agents', error as Error);
    throw new AppError(500, 'Failed to fetch agents');
  }
});

// Get agent by ID
router.get('/:agentId', async (req: Request, res: Response) => {
  try {
    const { agentId } = req.params;
    const agent = await queryOne('SELECT * FROM agents WHERE agent_id = $1', [agentId]);

    if (!agent) {
      throw new AppError(404, 'Agent not found');
    }

    res.json(agent);
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error('Error fetching agent', error as Error);
    throw new AppError(500, 'Failed to fetch agent');
  }
});

// Create new agent
router.post('/', async (req: Request, res: Response) => {
  try {
    const { workspace_id, name, slug, description, system_prompt, model_provider, model_name } = req.body;

    if (!workspace_id || !name || !slug) {
      throw new AppError(400, 'Missing required fields: workspace_id, name, slug');
    }

    const agent = await queryOne(
      `INSERT INTO agents (workspace_id, name, slug, description, system_prompt, model_provider, model_name)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [workspace_id, name, slug, description, system_prompt, model_provider, model_name]
    );

    logger.info('Agent created', { agentId: (agent as any).agent_id, name });
    res.status(201).json(agent);
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error('Error creating agent', error as Error);
    throw new AppError(500, 'Failed to create agent');
  }
});

// Update agent
router.put('/:agentId', async (req: Request, res: Response) => {
  try {
    const { agentId } = req.params;
    const { name, description, system_prompt, model_provider, model_name, is_active } = req.body;

    const agent = await queryOne(
      `UPDATE agents
       SET name = COALESCE($2, name),
           description = COALESCE($3, description),
           system_prompt = COALESCE($4, system_prompt),
           model_provider = COALESCE($5, model_provider),
           model_name = COALESCE($6, model_name),
           is_active = COALESCE($7, is_active),
           updated_at = NOW()
       WHERE agent_id = $1
       RETURNING *`,
      [agentId, name, description, system_prompt, model_provider, model_name, is_active]
    );

    if (!agent) {
      throw new AppError(404, 'Agent not found');
    }

    logger.info('Agent updated', { agentId });
    res.json(agent);
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error('Error updating agent', error as Error);
    throw new AppError(500, 'Failed to update agent');
  }
});

// Delete agent
router.delete('/:agentId', async (req: Request, res: Response) => {
  try {
    const { agentId } = req.params;

    const result = await query(
      'UPDATE agents SET deleted_at = NOW(), is_active = FALSE WHERE agent_id = $1',
      [agentId]
    );

    if (result.length === 0) {
      throw new AppError(404, 'Agent not found');
    }

    logger.info('Agent deleted', { agentId });
    res.status(204).send();
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error('Error deleting agent', error as Error);
    throw new AppError(500, 'Failed to delete agent');
  }
});

// Assign tool to agent
router.post('/:agentId/tools/:toolId', async (req: Request, res: Response) => {
  try {
    const { agentId, toolId } = req.params;
    const { priority = 100, enabled = true } = req.body;

    await query(
      `INSERT INTO agent_tools (agent_id, tool_id, priority, enabled)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (agent_id, tool_id) DO UPDATE
       SET priority = EXCLUDED.priority, enabled = EXCLUDED.enabled`,
      [agentId, toolId, priority, enabled]
    );

    logger.info('Tool assigned to agent', { agentId, toolId });
    res.status(201).json({ message: 'Tool assigned successfully' });
  } catch (error) {
    logger.error('Error assigning tool to agent', error as Error);
    throw new AppError(500, 'Failed to assign tool to agent');
  }
});

// Get agent tools
router.get('/:agentId/tools', async (req: Request, res: Response) => {
  try {
    const { agentId } = req.params;

    const tools = await query(
      `SELECT t.*, at.priority, at.enabled
       FROM agent_tools at
       JOIN tools t ON at.tool_id = t.tool_id
       WHERE at.agent_id = $1`,
      [agentId]
    );

    res.json(tools);
  } catch (error) {
    logger.error('Error fetching agent tools', error as Error);
    throw new AppError(500, 'Failed to fetch agent tools');
  }
});

export default router;
