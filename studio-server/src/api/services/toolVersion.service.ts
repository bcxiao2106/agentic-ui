import { query } from '@/database/connection';
import {
  ToolVersion,
  CreateToolVersionDTO,
  UpdateToolVersionDTO,
} from '@/api/types/tool.types';

export class ToolVersionService {
  /**
   * Get all versions for a tool
   */
  async getVersionsByToolId(toolId: number): Promise<ToolVersion[]> {
    const sql = `
      SELECT *
      FROM tool_versions
      WHERE tool_id = $1
      ORDER BY created_at DESC
    `;

    return await query<ToolVersion>(sql, [toolId]);
  }

  /**
   * Get a specific version by ID
   */
  async getVersionById(versionId: number): Promise<ToolVersion | null> {
    const sql = `
      SELECT *
      FROM tool_versions
      WHERE version_id = $1
    `;

    const result = await query<ToolVersion>(sql, [versionId]);
    return result.length > 0 ? result[0] : null;
  }

  /**
   * Get active version for a tool
   */
  async getActiveVersion(toolId: number): Promise<ToolVersion | null> {
    const sql = `
      SELECT *
      FROM tool_versions
      WHERE tool_id = $1 AND is_active = TRUE
      LIMIT 1
    `;

    const result = await query<ToolVersion>(sql, [toolId]);
    return result.length > 0 ? result[0] : null;
  }

  /**
   * Create a new tool version
   */
  async createVersion(data: CreateToolVersionDTO): Promise<ToolVersion> {
    const sql = `
      INSERT INTO tool_versions (
        tool_id,
        version_number,
        semantic_version,
        input_schema,
        output_schema,
        handler_source_code,
        handler_language,
        is_active,
        changelog,
        created_by
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;

    const values = [
      data.tool_id,
      data.version_number,
      data.semantic_version || data.version_number,
      JSON.stringify(data.input_schema),
      JSON.stringify(data.output_schema),
      data.handler_source_code || null,
      data.handler_language || null,
      data.is_active ?? false,
      data.changelog || null,
      data.created_by || null,
    ];

    const result = await query<ToolVersion>(sql, values);
    return result[0];
  }

  /**
   * Update a tool version
   */
  async updateVersion(versionId: number, data: UpdateToolVersionDTO): Promise<ToolVersion | null> {
    const updates: string[] = [];
    const values: any[] = [];
    let valueIndex = 1;

    if (data.version_number !== undefined) {
      updates.push(`version_number = $${valueIndex++}`);
      values.push(data.version_number);
    }

    if (data.semantic_version !== undefined) {
      updates.push(`semantic_version = $${valueIndex++}`);
      values.push(data.semantic_version);
    }

    if (data.input_schema !== undefined) {
      updates.push(`input_schema = $${valueIndex++}`);
      values.push(JSON.stringify(data.input_schema));
    }

    if (data.output_schema !== undefined) {
      updates.push(`output_schema = $${valueIndex++}`);
      values.push(JSON.stringify(data.output_schema));
    }

    if (data.handler_source_code !== undefined) {
      updates.push(`handler_source_code = $${valueIndex++}`);
      values.push(data.handler_source_code);
    }

    if (data.handler_language !== undefined) {
      updates.push(`handler_language = $${valueIndex++}`);
      values.push(data.handler_language);
    }

    if (data.is_active !== undefined) {
      updates.push(`is_active = $${valueIndex++}`);
      values.push(data.is_active);
    }

    if (data.is_deprecated !== undefined) {
      updates.push(`is_deprecated = $${valueIndex++}`);
      values.push(data.is_deprecated);
    }

    if (data.deprecation_message !== undefined) {
      updates.push(`deprecation_message = $${valueIndex++}`);
      values.push(data.deprecation_message);
    }

    if (data.changelog !== undefined) {
      updates.push(`changelog = $${valueIndex++}`);
      values.push(data.changelog);
    }

    updates.push(`updated_at = NOW()`);
    values.push(versionId);

    const sql = `
      UPDATE tool_versions
      SET ${updates.join(', ')}
      WHERE version_id = $${valueIndex}
      RETURNING *
    `;

    const result = await query<ToolVersion>(sql, values);
    return result.length > 0 ? result[0] : null;
  }

  /**
   * Activate a version (deactivate all others for the same tool)
   */
  async activateVersion(versionId: number): Promise<ToolVersion | null> {
    // Get the tool_id for this version
    const version = await this.getVersionById(versionId);
    if (!version) return null;

    // Deactivate all versions for this tool
    await query(
      'UPDATE tool_versions SET is_active = FALSE WHERE tool_id = $1',
      [version.tool_id]
    );

    // Activate the specified version
    return await this.updateVersion(versionId, { is_active: true });
  }

  /**
   * Delete a version
   */
  async deleteVersion(versionId: number): Promise<boolean> {
    const sql = `
      DELETE FROM tool_versions
      WHERE version_id = $1
      RETURNING version_id
    `;

    const result = await query(sql, [versionId]);
    return result.length > 0;
  }
}
