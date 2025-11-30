import { Router } from 'express';
import type { Router as ExpressRouter } from 'express';
import { ToolExecutionController } from '@/api/controllers/toolExecution.controller';

const router: ExpressRouter = Router();

/**
 * @swagger
 * /api/v1/executions/stats:
 *   get:
 *     summary: Get execution statistics
 *     description: Retrieve statistical data about tool executions
 *     tags: [Executions]
 *     parameters:
 *       - in: query
 *         name: tool_id
 *         schema:
 *           type: integer
 *         description: Filter stats by tool ID
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     total_executions:
 *                       type: integer
 *                     success_count:
 *                       type: integer
 *                     failed_count:
 *                       type: integer
 *                     avg_execution_time_ms:
 *                       type: number
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.get('/stats', ToolExecutionController.getExecutionStats);

/**
 * @swagger
 * /api/v1/executions/request/{requestId}:
 *   get:
 *     summary: Get execution by request ID
 *     description: Retrieve an execution by its idempotency key (execution_request_id)
 *     tags: [Executions]
 *     parameters:
 *       - in: path
 *         name: requestId
 *         required: true
 *         schema:
 *           type: string
 *         description: Execution request ID (idempotency key)
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/ToolExecution'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.get('/request/:requestId', ToolExecutionController.getExecutionByRequestId);

/**
 * @swagger
 * /api/v1/executions:
 *   get:
 *     summary: Get all executions
 *     description: Retrieve a paginated list of executions with filtering options
 *     tags: [Executions]
 *     parameters:
 *       - in: query
 *         name: tool_id
 *         schema:
 *           type: integer
 *         description: Filter by tool ID
 *       - in: query
 *         name: version_id
 *         schema:
 *           type: integer
 *         description: Filter by version ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, running, success, failed, cancelled]
 *         description: Filter by execution status
 *       - in: query
 *         name: executed_by
 *         schema:
 *           type: integer
 *         description: Filter by user ID who executed
 *       - in: query
 *         name: from_date
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter executions after this date
 *       - in: query
 *         name: to_date
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter executions before this date
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/PaginatedResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/ToolExecution'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 *   post:
 *     summary: Create a new execution
 *     description: Start a new tool execution
 *     tags: [Executions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateToolExecutionDTO'
 *     responses:
 *       201:
 *         description: Execution created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/ToolExecution'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.get('/', ToolExecutionController.getExecutions);
router.post('/', ToolExecutionController.createExecution);

/**
 * @swagger
 * /api/v1/executions/{id}:
 *   get:
 *     summary: Get execution by ID
 *     description: Retrieve a single execution by its ID
 *     tags: [Executions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Execution ID
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/ToolExecution'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 *   put:
 *     summary: Update an execution
 *     description: Update execution status, output, or error information (typically used for completion)
 *     tags: [Executions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Execution ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, running, success, failed, cancelled]
 *               output_data:
 *                 type: object
 *               error_message:
 *                 type: string
 *               execution_time_ms:
 *                 type: integer
 *               completed_at:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Execution updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/ToolExecution'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.get('/:id', ToolExecutionController.getExecutionById);
router.put('/:id', ToolExecutionController.updateExecution);

export default router;
