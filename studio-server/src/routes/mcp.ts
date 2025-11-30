import { Router, Request, Response } from 'express';
import type { Router as ExpressRouter } from 'express';
import { logger } from '@/utils/logger';
import { query, queryOne } from '@/database/connection';

const router: ExpressRouter = Router();

// MCP: List available tools
router.post('/tools/list', async (req: Request, res: Response) => {
  try {
    const tools = await query(
      `SELECT t.tool_id, t.name, t.slug, t.description, t.category,
              tv.version_id, tv.version_number, tv.input_schema, tv.output_schema
       FROM tools t
       LEFT JOIN tool_versions tv ON t.tool_id = tv.tool_id AND tv.is_active = TRUE
       WHERE t.is_active = TRUE`
    );

    res.json({
      tools: tools.map((tool: any) => ({
        id: tool.tool_id,
        name: tool.name,
        slug: tool.slug,
        description: tool.description,
        category: tool.category,
        version: tool.version_number,
        inputSchema: tool.input_schema,
        outputSchema: tool.output_schema,
      })),
    });
  } catch (error) {
    logger.error('Error listing MCP tools', error as Error);
    res.status(500).json({ error: 'Failed to list tools' });
  }
});

// MCP: Execute tool
router.post('/tools/execute', async (req: Request, res: Response) => {
  try {
    const { tool_id, version_id, input } = req.body;

    if (!tool_id || !version_id || !input) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get tool version details
    const version = await queryOne(
      'SELECT * FROM tool_versions WHERE version_id = $1 AND tool_id = $2',
      [version_id, tool_id]
    );

    if (!version) {
      return res.status(404).json({ error: 'Tool version not found' });
    }

    // Create execution record
    const { v4: uuidv4 } = require('uuid');
    const execution = await queryOne(
      `INSERT INTO tool_executions (
        tool_id, version_id, execution_request_id,
        input_payload, status, started_at
       ) VALUES ($1, $2, $3, $4, $5, NOW())
       RETURNING *`,
      [tool_id, version_id, uuidv4(), input, 'running']
    );

    logger.info('MCP execution started', { executionId: (execution as any).execution_id });

    // TODO: Execute actual tool based on handler_source_code
    // For now, return mock response
    res.json({
      executionId: (execution as any).execution_id,
      status: 'running',
      input: input,
    });
  } catch (error) {
    logger.error('Error executing MCP tool', error as Error);
    res.status(500).json({ error: 'Failed to execute tool' });
  }
});

// MCP: List agents
router.post('/agents/list', async (req: Request, res: Response) => {
  try {
    const agents = await query(
      `SELECT agent_id, name, slug, description, model_provider, model_name
       FROM agents
       WHERE is_active = TRUE`
    );

    res.json({ agents });
  } catch (error) {
    logger.error('Error listing MCP agents', error as Error);
    res.status(500).json({ error: 'Failed to list agents' });
  }
});

// MCP: Get agent details with available tools
router.get('/agents/:agentId', async (req: Request, res: Response) => {
  try {
    const { agentId } = req.params;

    const agent = await queryOne(
      'SELECT * FROM agents WHERE agent_id = $1',
      [agentId]
    );

    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    const tools = await query(
      `SELECT t.*, at.priority
       FROM agent_tools at
       JOIN tools t ON at.tool_id = t.tool_id
       WHERE at.agent_id = $1 AND at.enabled = TRUE
       ORDER BY at.priority ASC`,
      [agentId]
    );

    res.json({
      ...agent,
      tools: tools,
    });
  } catch (error) {
    logger.error('Error fetching MCP agent', error as Error);
    res.status(500).json({ error: 'Failed to fetch agent' });
  }
});

export default router;
