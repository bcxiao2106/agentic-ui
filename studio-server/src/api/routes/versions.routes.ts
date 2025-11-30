import { Router } from 'express';
import type { Router as ExpressRouter } from 'express';
import { ToolVersionController } from '@/api/controllers/toolVersion.controller';

const router: ExpressRouter = Router();

/**
 * @swagger
 * /api/v1/versions/{id}:
 *   get:
 *     summary: Get version by ID
 *     description: Retrieve a specific tool version by its ID
 *     tags: [Versions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Version ID
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
 *   put:
 *     summary: Update a version
 *     description: Update an existing tool version
 *     tags: [Versions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Version ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               handler_code:
 *                 type: string
 *               handler_language:
 *                 type: string
 *                 enum: [javascript, typescript, python]
 *               input_schema:
 *                 type: object
 *               output_schema:
 *                 type: object
 *               changelog:
 *                 type: string
 *               updated_by:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Version updated successfully
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
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 *   delete:
 *     summary: Delete a version
 *     description: Permanently delete a tool version
 *     tags: [Versions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Version ID
 *     responses:
 *       200:
 *         description: Version deleted successfully
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
 *                   example: Version deleted successfully
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.get('/:id', ToolVersionController.getVersionById);
router.put('/:id', ToolVersionController.updateVersion);
router.delete('/:id', ToolVersionController.deleteVersion);

/**
 * @swagger
 * /api/v1/versions/{id}/activate:
 *   post:
 *     summary: Activate a version
 *     description: Set a version as the active version for its tool (deactivates other versions)
 *     tags: [Versions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Version ID
 *     responses:
 *       200:
 *         description: Version activated successfully
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
 *                   example: Version activated successfully
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.post('/:id/activate', ToolVersionController.activateVersion);

export default router;
