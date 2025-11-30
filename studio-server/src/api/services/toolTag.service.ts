import { query } from '@/database/connection';
import {
  ToolTag,
  CreateToolTagDTO,
  UpdateToolTagDTO,
} from '@/api/types/tool.types';

export class ToolTagService {
  /**
   * Get all tags
   */
  async getAllTags(isActive?: boolean): Promise<ToolTag[]> {
    const whereClause = isActive !== undefined ? 'WHERE is_active = $1' : '';
    const values = isActive !== undefined ? [isActive] : [];

    const sql = `
      SELECT *
      FROM tool_tags
      ${whereClause}
      ORDER BY name ASC
    `;

    return await query<ToolTag>(sql, values);
  }

  /**
   * Get tag by ID
   */
  async getTagById(tagId: number): Promise<ToolTag | null> {
    const sql = `
      SELECT *
      FROM tool_tags
      WHERE tag_id = $1
    `;

    const result = await query<ToolTag>(sql, [tagId]);
    return result.length > 0 ? result[0] : null;
  }

  /**
   * Get tag by slug
   */
  async getTagBySlug(slug: string): Promise<ToolTag | null> {
    const sql = `
      SELECT *
      FROM tool_tags
      WHERE slug = $1
    `;

    const result = await query<ToolTag>(sql, [slug]);
    return result.length > 0 ? result[0] : null;
  }

  /**
   * Create a new tag
   */
  async createTag(data: CreateToolTagDTO): Promise<ToolTag> {
    const sql = `
      INSERT INTO tool_tags (name, slug, description, color, is_active)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const values = [
      data.name,
      data.slug,
      data.description || null,
      data.color || null,
      data.is_active ?? true,
    ];

    const result = await query<ToolTag>(sql, values);
    return result[0];
  }

  /**
   * Update a tag
   */
  async updateTag(tagId: number, data: UpdateToolTagDTO): Promise<ToolTag | null> {
    const updates: string[] = [];
    const values: any[] = [];
    let valueIndex = 1;

    if (data.name !== undefined) {
      updates.push(`name = $${valueIndex++}`);
      values.push(data.name);
    }

    if (data.slug !== undefined) {
      updates.push(`slug = $${valueIndex++}`);
      values.push(data.slug);
    }

    if (data.description !== undefined) {
      updates.push(`description = $${valueIndex++}`);
      values.push(data.description);
    }

    if (data.color !== undefined) {
      updates.push(`color = $${valueIndex++}`);
      values.push(data.color);
    }

    if (data.is_active !== undefined) {
      updates.push(`is_active = $${valueIndex++}`);
      values.push(data.is_active);
    }

    updates.push(`updated_at = NOW()`);
    values.push(tagId);

    const sql = `
      UPDATE tool_tags
      SET ${updates.join(', ')}
      WHERE tag_id = $${valueIndex}
      RETURNING *
    `;

    const result = await query<ToolTag>(sql, values);
    return result.length > 0 ? result[0] : null;
  }

  /**
   * Delete a tag
   */
  async deleteTag(tagId: number): Promise<boolean> {
    const sql = `
      DELETE FROM tool_tags
      WHERE tag_id = $1
      RETURNING tag_id
    `;

    const result = await query(sql, [tagId]);
    return result.length > 0;
  }

  /**
   * Get tools by tag
   */
  async getToolsByTag(tagId: number) {
    const sql = `
      SELECT t.*
      FROM tools t
      JOIN tool_tool_tags ttt ON t.tool_id = ttt.tool_id
      WHERE ttt.tag_id = $1 AND t.deleted_at IS NULL
      ORDER BY t.name ASC
    `;

    return await query(sql, [tagId]);
  }
}
