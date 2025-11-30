import { Request, Response } from 'express';
import { ToolVersionService } from '@/api/services/toolVersion.service';
import { CreateToolVersionDTO, UpdateToolVersionDTO } from '@/api/types/tool.types';
import { AppError } from '@/middleware/errorHandler';
import { logger } from '@/utils/logger';

const versionService = new ToolVersionService();

export class ToolVersionController {
  /**
   * GET /api/v1/tools/:toolId/versions
   * Get all versions for a tool
   */
  static async getVersionsByToolId(req: Request, res: Response): Promise<void> {
    try {
      const toolId = parseInt(req.params.toolId, 10);

      if (isNaN(toolId)) {
        throw new AppError(400, 'Invalid tool ID');
      }

      const versions = await versionService.getVersionsByToolId(toolId);

      res.json({
        success: true,
        data: versions,
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error fetching tool versions', error as Error);
      throw new AppError(500, 'Failed to fetch tool versions');
    }
  }

  /**
   * GET /api/v1/versions/:id
   * Get a specific version by ID
   */
  static async getVersionById(req: Request, res: Response): Promise<void> {
    try {
      const versionId = parseInt(req.params.id, 10);

      if (isNaN(versionId)) {
        throw new AppError(400, 'Invalid version ID');
      }

      const version = await versionService.getVersionById(versionId);

      if (!version) {
        throw new AppError(404, 'Version not found');
      }

      res.json({
        success: true,
        data: version,
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error fetching version', error as Error);
      throw new AppError(500, 'Failed to fetch version');
    }
  }

  /**
   * GET /api/v1/tools/:toolId/versions/active
   * Get the active version for a tool
   */
  static async getActiveVersion(req: Request, res: Response): Promise<void> {
    try {
      const toolId = parseInt(req.params.toolId, 10);

      if (isNaN(toolId)) {
        throw new AppError(400, 'Invalid tool ID');
      }

      const version = await versionService.getActiveVersion(toolId);

      if (!version) {
        throw new AppError(404, 'No active version found');
      }

      res.json({
        success: true,
        data: version,
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error fetching active version', error as Error);
      throw new AppError(500, 'Failed to fetch active version');
    }
  }

  /**
   * POST /api/v1/tools/:toolId/versions
   * Create a new version for a tool
   */
  static async createVersion(req: Request, res: Response): Promise<void> {
    try {
      const toolId = parseInt(req.params.toolId, 10);

      if (isNaN(toolId)) {
        throw new AppError(400, 'Invalid tool ID');
      }

      const data: CreateToolVersionDTO = {
        ...req.body,
        tool_id: toolId,
      };

      // Validation
      if (!data.version_number) {
        throw new AppError(400, 'Version number is required');
      }

      if (!/^\d+\.\d+\.\d+$/.test(data.version_number)) {
        throw new AppError(400, 'Version must follow semantic versioning (X.Y.Z)');
      }

      if (!data.input_schema || Object.keys(data.input_schema).length === 0) {
        throw new AppError(400, 'Input schema is required');
      }

      if (!data.output_schema || Object.keys(data.output_schema).length === 0) {
        throw new AppError(400, 'Output schema is required');
      }

      const version = await versionService.createVersion(data);

      logger.info('Version created successfully', { version_id: version.version_id });

      res.status(201).json({
        success: true,
        data: version,
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error creating version', error as Error);
      throw new AppError(500, 'Failed to create version');
    }
  }

  /**
   * PUT /api/v1/versions/:id
   * Update a version
   */
  static async updateVersion(req: Request, res: Response): Promise<void> {
    try {
      const versionId = parseInt(req.params.id, 10);

      if (isNaN(versionId)) {
        throw new AppError(400, 'Invalid version ID');
      }

      const data: UpdateToolVersionDTO = req.body;

      const version = await versionService.updateVersion(versionId, data);

      if (!version) {
        throw new AppError(404, 'Version not found');
      }

      logger.info('Version updated successfully', { version_id: versionId });

      res.json({
        success: true,
        data: version,
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error updating version', error as Error);
      throw new AppError(500, 'Failed to update version');
    }
  }

  /**
   * POST /api/v1/versions/:id/activate
   * Activate a version (deactivates all others for the same tool)
   */
  static async activateVersion(req: Request, res: Response): Promise<void> {
    try {
      const versionId = parseInt(req.params.id, 10);

      if (isNaN(versionId)) {
        throw new AppError(400, 'Invalid version ID');
      }

      const version = await versionService.activateVersion(versionId);

      if (!version) {
        throw new AppError(404, 'Version not found');
      }

      logger.info('Version activated successfully', { version_id: versionId });

      res.json({
        success: true,
        data: version,
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error activating version', error as Error);
      throw new AppError(500, 'Failed to activate version');
    }
  }

  /**
   * DELETE /api/v1/versions/:id
   * Delete a version
   */
  static async deleteVersion(req: Request, res: Response): Promise<void> {
    try {
      const versionId = parseInt(req.params.id, 10);

      if (isNaN(versionId)) {
        throw new AppError(400, 'Invalid version ID');
      }

      const deleted = await versionService.deleteVersion(versionId);

      if (!deleted) {
        throw new AppError(404, 'Version not found');
      }

      logger.info('Version deleted successfully', { version_id: versionId });

      res.status(204).send();
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error deleting version', error as Error);
      throw new AppError(500, 'Failed to delete version');
    }
  }
}
