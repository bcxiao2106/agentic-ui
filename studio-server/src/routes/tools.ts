import { Router, Request, Response } from 'express';
import { logger } from '@/utils/logger';
import { query, queryOne } from '@/database/connection';
import { AppError } from '@/middleware/errorHandler';

const router = Router();

// List all tools
router.get('/', async (req: Request, res: Response) => {
  try {
    const { category, is_active, limit = 20, offset = 0 } = req.query;

    let sql = 'SELECT * FROM tools WHERE 1=1';
    const params: any[] = [];

    if (category) {
      sql += ' AND category = $' + (params.length + 1);
      params.push(category);
    }

    if (is_active !== undefined) {
      sql += ' AND is_active = $' + (params.length + 1);
      params.push(is_active === 'true');
    }

    sql += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(limit, offset);

    const tools = await query(sql, params);
    res.json(tools);
  } catch (error) {
    logger.error('Error fetching tools', error as Error);
    throw new AppError(500, 'Failed to fetch tools');
  }
});

// Get tool by ID
router.get('/:toolId', async (req: Request, res: Response) => {
  try {
    const { toolId } = req.params;
    const tool = await queryOne('SELECT * FROM tools WHERE tool_id = $1', [toolId]);

    if (!tool) {
      throw new AppError(404, 'Tool not found');
    }

    res.json(tool);
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error('Error fetching tool', error as Error);
    throw new AppError(500, 'Failed to fetch tool');
  }
});

// Create new tool
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, slug, description, category } = req.body;

    if (!name || !slug) {
      throw new AppError(400, 'Missing required fields: name, slug');
    }

    const tool = await queryOne(
      `INSERT INTO tools (name, slug, description, category)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, slug, description, category]
    );

    logger.info('Tool created', { toolId: (tool as any).tool_id, name });
    res.status(201).json(tool);
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error('Error creating tool', error as Error);
    throw new AppError(500, 'Failed to create tool');
  }
});

// Update tool
router.put('/:toolId', async (req: Request, res: Response) => {
  try {
    const { toolId } = req.params;
    const { name, description, category, is_active } = req.body;

    const tool = await queryOne(
      `UPDATE tools
       SET name = COALESCE($2, name),
           description = COALESCE($3, description),
           category = COALESCE($4, category),
           is_active = COALESCE($5, is_active),
           updated_at = NOW()
       WHERE tool_id = $1
       RETURNING *`,
      [toolId, name, description, category, is_active]
    );

    if (!tool) {
      throw new AppError(404, 'Tool not found');
    }

    logger.info('Tool updated', { toolId });
    res.json(tool);
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error('Error updating tool', error as Error);
    throw new AppError(500, 'Failed to update tool');
  }
});

// Delete tool
router.delete('/:toolId', async (req: Request, res: Response) => {
  try {
    const { toolId } = req.params;

    const result = await query(
      'UPDATE tools SET deleted_at = NOW(), is_active = FALSE WHERE tool_id = $1',
      [toolId]
    );

    if (result.length === 0) {
      throw new AppError(404, 'Tool not found');
    }

    logger.info('Tool deleted', { toolId });
    res.status(204).send();
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error('Error deleting tool', error as Error);
    throw new AppError(500, 'Failed to delete tool');
  }
});

// Get tool versions
router.get('/:toolId/versions', async (req: Request, res: Response) => {
  try {
    const { toolId } = req.params;

    const versions = await query(
      'SELECT * FROM tool_versions WHERE tool_id = $1 ORDER BY created_at DESC',
      [toolId]
    );

    res.json(versions);
  } catch (error) {
    logger.error('Error fetching tool versions', error as Error);
    throw new AppError(500, 'Failed to fetch tool versions');
  }
});

export default router;
