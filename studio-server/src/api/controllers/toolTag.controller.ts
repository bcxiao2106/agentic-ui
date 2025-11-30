import { Request, Response } from 'express';
import { ToolTagService } from '@/api/services/toolTag.service';
import { CreateToolTagDTO, UpdateToolTagDTO } from '@/api/types/tool.types';
import { AppError } from '@/middleware/errorHandler';
import { logger } from '@/utils/logger';

const tagService = new ToolTagService();

export class ToolTagController {
  /**
   * GET /api/v1/tags
   * Get all tags
   */
  static async getAllTags(req: Request, res: Response): Promise<void> {
    try {
      const isActive = req.query.is_active === 'true' ? true : req.query.is_active === 'false' ? false : undefined;

      const tags = await tagService.getAllTags(isActive);

      res.json({
        success: true,
        data: tags,
      });
    } catch (error) {
      logger.error('Error fetching tags', error as Error);
      throw new AppError(500, 'Failed to fetch tags');
    }
  }

  /**
   * GET /api/v1/tags/:id
   * Get a single tag by ID
   */
  static async getTagById(req: Request, res: Response): Promise<void> {
    try {
      const tagId = parseInt(req.params.id, 10);

      if (isNaN(tagId)) {
        throw new AppError(400, 'Invalid tag ID');
      }

      const tag = await tagService.getTagById(tagId);

      if (!tag) {
        throw new AppError(404, 'Tag not found');
      }

      res.json({
        success: true,
        data: tag,
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error fetching tag by ID', error as Error);
      throw new AppError(500, 'Failed to fetch tag');
    }
  }

  /**
   * GET /api/v1/tags/slug/:slug
   * Get a tag by slug
   */
  static async getTagBySlug(req: Request, res: Response): Promise<void> {
    try {
      const slug = req.params.slug;
      const tag = await tagService.getTagBySlug(slug);

      if (!tag) {
        throw new AppError(404, 'Tag not found');
      }

      res.json({
        success: true,
        data: tag,
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error fetching tag by slug', error as Error);
      throw new AppError(500, 'Failed to fetch tag');
    }
  }

  /**
   * GET /api/v1/tags/:id/tools
   * Get all tools with this tag
   */
  static async getToolsByTag(req: Request, res: Response): Promise<void> {
    try {
      const tagId = parseInt(req.params.id, 10);

      if (isNaN(tagId)) {
        throw new AppError(400, 'Invalid tag ID');
      }

      const tools = await tagService.getToolsByTag(tagId);

      res.json({
        success: true,
        data: tools,
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error fetching tools by tag', error as Error);
      throw new AppError(500, 'Failed to fetch tools');
    }
  }

  /**
   * POST /api/v1/tags
   * Create a new tag
   */
  static async createTag(req: Request, res: Response): Promise<void> {
    try {
      const data: CreateToolTagDTO = req.body;

      // Validation
      if (!data.name || data.name.trim().length < 2) {
        throw new AppError(400, 'Tag name must be at least 2 characters');
      }

      if (!data.slug || !/^[a-z0-9-]+$/.test(data.slug)) {
        throw new AppError(400, 'Invalid slug format');
      }

      if (data.color && !/^#[0-9A-Fa-f]{6}$/.test(data.color)) {
        throw new AppError(400, 'Color must be in hex format (#RRGGBB)');
      }

      // Check if slug already exists
      const existingTag = await tagService.getTagBySlug(data.slug);
      if (existingTag) {
        throw new AppError(409, 'A tag with this slug already exists');
      }

      const tag = await tagService.createTag(data);

      logger.info('Tag created successfully', { tag_id: tag.tag_id });

      res.status(201).json({
        success: true,
        data: tag,
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error creating tag', error as Error);
      throw new AppError(500, 'Failed to create tag');
    }
  }

  /**
   * PUT /api/v1/tags/:id
   * Update a tag
   */
  static async updateTag(req: Request, res: Response): Promise<void> {
    try {
      const tagId = parseInt(req.params.id, 10);

      if (isNaN(tagId)) {
        throw new AppError(400, 'Invalid tag ID');
      }

      const data: UpdateToolTagDTO = req.body;

      // Validate color if provided
      if (data.color && !/^#[0-9A-Fa-f]{6}$/.test(data.color)) {
        throw new AppError(400, 'Color must be in hex format (#RRGGBB)');
      }

      // Check if slug is being updated and is unique
      if (data.slug) {
        const existingTag = await tagService.getTagBySlug(data.slug);
        if (existingTag && existingTag.tag_id !== tagId) {
          throw new AppError(409, 'A tag with this slug already exists');
        }
      }

      const tag = await tagService.updateTag(tagId, data);

      if (!tag) {
        throw new AppError(404, 'Tag not found');
      }

      logger.info('Tag updated successfully', { tag_id: tagId });

      res.json({
        success: true,
        data: tag,
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error updating tag', error as Error);
      throw new AppError(500, 'Failed to update tag');
    }
  }

  /**
   * DELETE /api/v1/tags/:id
   * Delete a tag
   */
  static async deleteTag(req: Request, res: Response): Promise<void> {
    try {
      const tagId = parseInt(req.params.id, 10);

      if (isNaN(tagId)) {
        throw new AppError(400, 'Invalid tag ID');
      }

      const deleted = await tagService.deleteTag(tagId);

      if (!deleted) {
        throw new AppError(404, 'Tag not found');
      }

      logger.info('Tag deleted successfully', { tag_id: tagId });

      res.status(204).send();
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error deleting tag', error as Error);
      throw new AppError(500, 'Failed to delete tag');
    }
  }
}
