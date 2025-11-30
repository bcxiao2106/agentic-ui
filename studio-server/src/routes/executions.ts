import { Router, Request, Response } from 'express';
import type { Router as ExpressRouter } from 'express';
import { logger } from '@/utils/logger';
import { query, queryOne } from '@/database/connection';
import { AppError } from '@/middleware/errorHandler';

const router: ExpressRouter = Router();

// List executions
router.get('/', async (req: Request, res: Response) => {
  try {
    const { tool_id, agent_id, status, limit = 50, offset = 0 } = req.query;

    let sql = 'SELECT * FROM tool_executions WHERE 1=1';
    const params: any[] = [];

    if (tool_id) {
      sql += ' AND tool_id = $' + (params.length + 1);
      params.push(tool_id);
    }

    if (agent_id) {
      sql += ' AND agent_id = $' + (params.length + 1);
      params.push(agent_id);
    }

    if (status) {
      sql += ' AND status = $' + (params.length + 1);
      params.push(status);
    }

    sql += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(limit, offset);

    const executions = await query(sql, params);
    res.json(executions);
  } catch (error) {
    logger.error('Error fetching executions', error as Error);
    throw new AppError(500, 'Failed to fetch executions');
  }
});

// Get execution by ID
router.get('/:executionId', async (req: Request, res: Response) => {
  try {
    const { executionId } = req.params;
    const execution = await queryOne(
      'SELECT * FROM tool_executions WHERE execution_id = $1',
      [executionId]
    );

    if (!execution) {
      throw new AppError(404, 'Execution not found');
    }

    res.json(execution);
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error('Error fetching execution', error as Error);
    throw new AppError(500, 'Failed to fetch execution');
  }
});

// Create execution (triggered by tool call)
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      tool_id,
      version_id,
      input_payload,
      llm_source,
      user_id,
    } = req.body;

    if (!tool_id || !version_id) {
      throw new AppError(400, 'Missing required fields: tool_id, version_id');
    }

    const execution = await queryOne(
      `INSERT INTO tool_executions (
        tool_id, version_id, execution_request_id,
        input_payload, status, llm_source, user_id,
        started_at
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
       RETURNING *`,
      [
        tool_id,
        version_id,
        require('uuid').v4(),
        input_payload,
        'pending',
        llm_source,
        user_id,
      ]
    );

    logger.info('Execution created', { executionId: (execution as any).execution_id });
    res.status(201).json(execution);
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error('Error creating execution', error as Error);
    throw new AppError(500, 'Failed to create execution');
  }
});

// Update execution (mark as completed)
router.put('/:executionId', async (req: Request, res: Response) => {
  try {
    const { executionId } = req.params;
    const { status, output_payload, error_message, error_stacktrace, execution_time_ms } = req.body;

    const execution = await queryOne(
      `UPDATE tool_executions
       SET status = COALESCE($2, status),
           output_payload = COALESCE($3, output_payload),
           error_message = COALESCE($4, error_message),
           error_stacktrace = COALESCE($5, error_stacktrace),
           execution_time_ms = COALESCE($6, execution_time_ms),
           completed_at = CASE WHEN $2::VARCHAR IN ('succeeded', 'failed', 'timeout', 'cancelled') THEN NOW() ELSE completed_at END
       WHERE execution_id = $1
       RETURNING *`,
      [executionId, status, output_payload, error_message, error_stacktrace, execution_time_ms]
    );

    if (!execution) {
      throw new AppError(404, 'Execution not found');
    }

    logger.info('Execution updated', { executionId, status });
    res.json(execution);
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error('Error updating execution', error as Error);
    throw new AppError(500, 'Failed to update execution');
  }
});

export default router;
