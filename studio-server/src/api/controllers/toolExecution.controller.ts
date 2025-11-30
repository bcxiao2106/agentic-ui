import { Request, Response } from 'express';
import { ToolExecutionService } from '@/api/services/toolExecution.service';
import { CreateToolExecutionDTO, UpdateToolExecutionDTO, ToolExecutionQueryParams } from '@/api/types/tool.types';
import { AppError } from '@/middleware/errorHandler';
import { logger } from '@/utils/logger';

const executionService = new ToolExecutionService();

export class ToolExecutionController {
  /**
   * GET /api/v1/executions
   * Get all executions with filtering and pagination
   */
  static async getExecutions(req: Request, res: Response): Promise<void> {
    try {
      const params: ToolExecutionQueryParams = {
        tool_id: req.query.tool_id ? parseInt(req.query.tool_id as string, 10) : undefined,
        version_id: req.query.version_id ? parseInt(req.query.version_id as string, 10) : undefined,
        agent_id: req.query.agent_id as string,
        workflow_id: req.query.workflow_id as string,
        status: req.query.status as any,
        user_id: req.query.user_id as string,
        from_date: req.query.from_date as string,
        to_date: req.query.to_date as string,
        page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 20,
      };

      const result = await executionService.getExecutions(params);

      res.json({
        success: true,
        ...result,
      });
    } catch (error) {
      logger.error('Error fetching executions', error as Error);
      throw new AppError(500, 'Failed to fetch executions');
    }
  }

  /**
   * GET /api/v1/executions/:id
   * Get a single execution by ID
   */
  static async getExecutionById(req: Request, res: Response): Promise<void> {
    try {
      const executionId = parseInt(req.params.id, 10);

      if (isNaN(executionId)) {
        throw new AppError(400, 'Invalid execution ID');
      }

      const execution = await executionService.getExecutionById(executionId);

      if (!execution) {
        throw new AppError(404, 'Execution not found');
      }

      res.json({
        success: true,
        data: execution,
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error fetching execution by ID', error as Error);
      throw new AppError(500, 'Failed to fetch execution');
    }
  }

  /**
   * GET /api/v1/executions/request/:requestId
   * Get an execution by request ID (for idempotency)
   */
  static async getExecutionByRequestId(req: Request, res: Response): Promise<void> {
    try {
      const requestId = req.params.requestId;
      const execution = await executionService.getExecutionByRequestId(requestId);

      if (!execution) {
        throw new AppError(404, 'Execution not found');
      }

      res.json({
        success: true,
        data: execution,
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error fetching execution by request ID', error as Error);
      throw new AppError(500, 'Failed to fetch execution');
    }
  }

  /**
   * POST /api/v1/executions
   * Create a new execution
   */
  static async createExecution(req: Request, res: Response): Promise<void> {
    try {
      const data: CreateToolExecutionDTO = req.body;

      // Validation
      if (!data.tool_id) {
        throw new AppError(400, 'tool_id is required');
      }

      if (!data.version_id) {
        throw new AppError(400, 'version_id is required');
      }

      if (!data.execution_request_id) {
        throw new AppError(400, 'execution_request_id is required');
      }

      if (!data.input_payload) {
        throw new AppError(400, 'input_payload is required');
      }

      // Check for existing execution with same request ID (idempotency)
      const existingExecution = await executionService.getExecutionByRequestId(data.execution_request_id);
      if (existingExecution) {
        res.status(200).json({
          success: true,
          data: existingExecution,
          message: 'Execution already exists',
        });
        return;
      }

      const execution = await executionService.createExecution(data);

      logger.info('Execution created successfully', { execution_id: execution.execution_id });

      res.status(201).json({
        success: true,
        data: execution,
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error creating execution', error as Error);
      throw new AppError(500, 'Failed to create execution');
    }
  }

  /**
   * PUT /api/v1/executions/:id
   * Update an execution (typically for completion)
   */
  static async updateExecution(req: Request, res: Response): Promise<void> {
    try {
      const executionId = parseInt(req.params.id, 10);

      if (isNaN(executionId)) {
        throw new AppError(400, 'Invalid execution ID');
      }

      const data: UpdateToolExecutionDTO = req.body;

      const execution = await executionService.updateExecution(executionId, data);

      if (!execution) {
        throw new AppError(404, 'Execution not found');
      }

      logger.info('Execution updated successfully', { execution_id: executionId });

      res.json({
        success: true,
        data: execution,
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error updating execution', error as Error);
      throw new AppError(500, 'Failed to update execution');
    }
  }

  /**
   * GET /api/v1/executions/stats
   * Get execution statistics
   */
  static async getExecutionStats(req: Request, res: Response): Promise<void> {
    try {
      const toolId = req.query.tool_id ? parseInt(req.query.tool_id as string, 10) : undefined;

      const stats = await executionService.getExecutionStats(toolId);

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      logger.error('Error fetching execution stats', error as Error);
      throw new AppError(500, 'Failed to fetch execution stats');
    }
  }
}
