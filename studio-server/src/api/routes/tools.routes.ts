import { Router } from 'express';
import type { Router as ExpressRouter } from 'express';
import { ToolController } from '@/api/controllers/tool.controller';
import { ToolVersionController } from '@/api/controllers/toolVersion.controller';

const router: ExpressRouter = Router();

/**
 * @swagger
 * /api/v1/tools:
 *   get:
 *     summary: Get all tools
 *     description: Retrieve a paginated list of tools with optional filtering by search, category, and active status
 *     tags: [Tools]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for tool name or description
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [data, text, image, audio, video, utility, other]
 *         description: Filter by tool category
 *       - in: query
 *         name: is_active
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of items per page
 *       - in: query
 *         name: sort_by
 *         schema:
 *           type: string
 *           default: created_at
 *         description: Field to sort by
 *       - in: query
 *         name: sort_order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
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
 *                         $ref: '#/components/schemas/Tool'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.get('/', ToolController.getTools);

/**
 * @swagger
 * /api/v1/tools/slug/{slug}:
 *   get:
 *     summary: Get tool by slug
 *     description: Retrieve a single tool by its URL-friendly slug identifier
 *     tags: [Tools]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Tool slug
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
 *                   $ref: '#/components/schemas/Tool'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.get('/slug/:slug', ToolController.getToolBySlug);

/**
 * @swagger
 * /api/v1/tools/{id}:
 *   get:
 *     summary: Get tool by ID
 *     description: Retrieve a single tool by its numeric ID
 *     tags: [Tools]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Tool ID
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
 *                   $ref: '#/components/schemas/Tool'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.get('/:id', ToolController.getToolById);

/**
 * @swagger
 * /api/v1/tools:
 *   post:
 *     summary: Create a new tool
 *     description: Create a new tool with the provided information
 *     tags: [Tools]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateToolDTO'
 *     responses:
 *       201:
 *         description: Tool created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Tool'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.post('/', ToolController.createTool);

/**
 * @swagger
 * /api/v1/tools/{id}:
 *   put:
 *     summary: Update a tool
 *     description: Update an existing tool's information
 *     tags: [Tools]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Tool ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateToolDTO'
 *     responses:
 *       200:
 *         description: Tool updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Tool'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 *   delete:
 *     summary: Delete a tool
 *     description: Soft delete a tool (sets is_active to false and adds deleted_at timestamp)
 *     tags: [Tools]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Tool ID
 *     responses:
 *       200:
 *         description: Tool deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Tool deleted successfully
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.put('/:id', ToolController.updateTool);
router.delete('/:id', ToolController.deleteTool);

/**
 * @swagger
 * /api/v1/tools/{id}/tags:
 *   post:
 *     summary: Assign tags to a tool
 *     description: Associate one or more tags with a tool
 *     tags: [Tools]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Tool ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tag_ids
 *             properties:
 *               tag_ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: Array of tag IDs to assign
 *                 example: [1, 2, 3]
 *     responses:
 *       200:
 *         description: Tags assigned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Tags assigned successfully
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.post('/:id/tags', ToolController.assignTags);

/**
 * @swagger
 * /api/v1/tools/{toolId}/versions:
 *   get:
 *     summary: Get all versions for a tool
 *     description: Retrieve all versions associated with a specific tool
 *     tags: [Versions]
 *     parameters:
 *       - in: path
 *         name: toolId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Tool ID
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
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ToolVersion'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 *   post:
 *     summary: Create a new version for a tool
 *     description: Create a new version for a specific tool
 *     tags: [Versions]
 *     parameters:
 *       - in: path
 *         name: toolId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Tool ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateToolVersionDTO'
 *     responses:
 *       201:
 *         description: Version created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/ToolVersion'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.get('/:toolId/versions', ToolVersionController.getVersionsByToolId);
router.post('/:toolId/versions', ToolVersionController.createVersion);

/**
 * @swagger
 * /api/v1/tools/{toolId}/versions/active:
 *   get:
 *     summary: Get active version for a tool
 *     description: Retrieve the currently active version for a specific tool
 *     tags: [Versions]
 *     parameters:
 *       - in: path
 *         name: toolId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Tool ID
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
 *                   $ref: '#/components/schemas/ToolVersion'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.get('/:toolId/versions/active', ToolVersionController.getActiveVersion);

export default router;
