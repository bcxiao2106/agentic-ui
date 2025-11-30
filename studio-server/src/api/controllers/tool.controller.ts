import { Request, Response } from 'express';
import { ToolService } from '@/api/services/tool.service';
import { CreateToolDTO, UpdateToolDTO, ToolQueryParams } from '@/api/types/tool.types';
import { AppError } from '@/middleware/errorHandler';
import { logger } from '@/utils/logger';

const toolService = new ToolService();

export class ToolController {
  /**
   * GET /api/tools
   * Get all tools with filtering and pagination
   */
  static async getTools(req: Request, res: Response): Promise<void> {
    try {
      const params: ToolQueryParams = {
        search: req.query.search as string,
        category: req.query.category as any,
        is_active: req.query.is_active === 'true' ? true : req.query.is_active === 'false' ? false : undefined,
        page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 20,
        sort_by: (req.query.sort_by as any) || 'created_at',
        sort_order: (req.query.sort_order as any) || 'desc',
      };

      const result = await toolService.getTools(params);
      res.json({
        success: true,
        ...result,
      });
    } catch (error) {
      logger.error('Error fetching tools', error as Error);
      throw new AppError(500, 'Failed to fetch tools');
    }
  }

  /**
   * GET /api/tools/:id
   * Get a single tool by ID
   */
  static async getToolById(req: Request, res: Response): Promise<void> {
    try {
      const toolId = parseInt(req.params.id, 10);

      if (isNaN(toolId)) {
        throw new AppError(400, 'Invalid tool ID');
      }

      const tool = await toolService.getToolById(toolId);

      if (!tool) {
        throw new AppError(404, 'Tool not found');
      }

      res.json({
        success: true,
        data: tool,
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error fetching tool by ID', error as Error);
      throw new AppError(500, 'Failed to fetch tool');
    }
  }

  /**
   * GET /api/tools/slug/:slug
   * Get a tool by slug
   */
  static async getToolBySlug(req: Request, res: Response): Promise<void> {
    try {
      const slug = req.params.slug;
      const tool = await toolService.getToolBySlug(slug);

      if (!tool) {
        throw new AppError(404, 'Tool not found');
      }

      res.json({
        success: true,
        data: tool,
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error fetching tool by slug', error as Error);
      throw new AppError(500, 'Failed to fetch tool');
    }
  }

  /**
   * POST /api/tools
   * Create a new tool
   */
  static async createTool(req: Request, res: Response): Promise<void> {
    try {
      const data: CreateToolDTO = req.body;

      // Validation
      if (!data.name || data.name.trim().length < 3) {
        throw new AppError(400, 'Tool name must be at least 3 characters');
      }

      if (!data.slug || !/^[a-z0-9-]+$/.test(data.slug)) {
        throw new AppError(400, 'Invalid slug format');
      }

      if (!data.category) {
        throw new AppError(400, 'Category is required');
      }

      // Check if slug already exists
      const existingTool = await toolService.getToolBySlug(data.slug);
      if (existingTool) {
        throw new AppError(409, 'A tool with this slug already exists');
      }

      const tool = await toolService.createTool(data);

      logger.info('Tool created successfully', { tool_id: tool.tool_id });

      res.status(201).json({
        success: true,
        data: tool,
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error creating tool', error as Error);
      throw new AppError(500, 'Failed to create tool');
    }
  }

  /**
   * PUT /api/tools/:id
   * Update a tool
   */
  static async updateTool(req: Request, res: Response): Promise<void> {
    try {
      const toolId = parseInt(req.params.id, 10);

      if (isNaN(toolId)) {
        throw new AppError(400, 'Invalid tool ID');
      }

      const data: UpdateToolDTO = req.body;

      // Check if slug is being updated and is unique
      if (data.slug) {
        const existingTool = await toolService.getToolBySlug(data.slug);
        if (existingTool && existingTool.tool_id !== toolId) {
          throw new AppError(409, 'A tool with this slug already exists');
        }
      }

      const tool = await toolService.updateTool(toolId, data);

      if (!tool) {
        throw new AppError(404, 'Tool not found');
      }

      logger.info('Tool updated successfully', { tool_id: toolId });

      res.json({
        success: true,
        data: tool,
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error updating tool', error as Error);
      throw new AppError(500, 'Failed to update tool');
    }
  }

  /**
   * DELETE /api/tools/:id
   * Soft delete a tool
   */
  static async deleteTool(req: Request, res: Response): Promise<void> {
    try {
      const toolId = parseInt(req.params.id, 10);

      if (isNaN(toolId)) {
        throw new AppError(400, 'Invalid tool ID');
      }

      const deleted = await toolService.deleteTool(toolId);

      if (!deleted) {
        throw new AppError(404, 'Tool not found');
      }

      logger.info('Tool deleted successfully', { tool_id: toolId });

      res.status(204).send();
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error deleting tool', error as Error);
      throw new AppError(500, 'Failed to delete tool');
    }
  }

  /**
   * POST /api/tools/:id/tags
   * Assign tags to a tool
   */
  static async assignTags(req: Request, res: Response): Promise<void> {
    try {
      const toolId = parseInt(req.params.id, 10);
      const { tag_ids } = req.body;

      if (isNaN(toolId)) {
        throw new AppError(400, 'Invalid tool ID');
      }

      if (!Array.isArray(tag_ids)) {
        throw new AppError(400, 'tag_ids must be an array');
      }

      await toolService.assignTags(toolId, tag_ids);

      logger.info('Tags assigned to tool', { tool_id: toolId, tag_ids });

      res.json({
        success: true,
        message: 'Tags assigned successfully',
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error assigning tags', error as Error);
      throw new AppError(500, 'Failed to assign tags');
    }
  }
}
