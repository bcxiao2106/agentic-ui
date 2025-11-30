import { query } from '@/database/connection';
import {
  Tool,
  CreateToolDTO,
  UpdateToolDTO,
  ToolQueryParams,
  ToolResponse,
  PaginatedResponse,
} from '@/api/types/tool.types';

export class ToolService {
  /**
   * Get all tools with filtering and pagination
   */
  async getTools(params: ToolQueryParams): Promise<PaginatedResponse<ToolResponse>> {
    const {
      search,
      category,
      is_active,
      page = 1,
      limit = 20,
      sort_by = 'created_at',
      sort_order = 'desc',
    } = params;

    const offset = (page - 1) * limit;
    const conditions: string[] = ['deleted_at IS NULL'];
    const values: any[] = [];
    let valueIndex = 1;

    if (search) {
      conditions.push(`(name ILIKE $${valueIndex} OR description ILIKE $${valueIndex})`);
      values.push(`%${search}%`);
      valueIndex++;
    }

    if (category) {
      conditions.push(`category = $${valueIndex}`);
      values.push(category);
      valueIndex++;
    }

    if (is_active !== undefined) {
      conditions.push(`is_active = $${valueIndex}`);
      values.push(is_active);
      valueIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const orderClause = `ORDER BY ${sort_by} ${sort_order.toUpperCase()}`;

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM tools
      ${whereClause}
    `;
    const countResult = await query<{ total: string }>(countQuery, values);
    const total = parseInt(countResult[0].total, 10);

    // Get paginated data
    const dataQuery = `
      SELECT 
        t.*,
        COALESCE(
          json_agg(
            json_build_object(
              'tag_id', tt.tag_id,
              'name', tt.name,
              'slug', tt.slug,
              'color', tt.color
            )
          ) FILTER (WHERE tt.tag_id IS NOT NULL),
          '[]'
        ) as tags
      FROM tools t
      LEFT JOIN tool_tool_tags ttt ON t.tool_id = ttt.tool_id
      LEFT JOIN tool_tags tt ON ttt.tag_id = tt.tag_id AND tt.is_active = TRUE
      ${whereClause}
      GROUP BY t.tool_id
      ${orderClause}
      LIMIT $${valueIndex} OFFSET $${valueIndex + 1}
    `;

    values.push(limit, offset);
    const tools = await query<ToolResponse>(dataQuery, values);

    return {
      data: tools,
      pagination: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get a single tool by ID
   */
  async getToolById(toolId: number): Promise<ToolResponse | null> {
    const sql = `
      SELECT 
        t.*,
        COALESCE(
          json_agg(
            json_build_object(
              'tag_id', tt.tag_id,
              'name', tt.name,
              'slug', tt.slug,
              'color', tt.color
            )
          ) FILTER (WHERE tt.tag_id IS NOT NULL),
          '[]'
        ) as tags,
        COALESCE(
          json_agg(
            DISTINCT json_build_object(
              'version_id', tv.version_id,
              'version_number', tv.version_number,
              'is_active', tv.is_active,
              'is_deprecated', tv.is_deprecated
            )
          ) FILTER (WHERE tv.version_id IS NOT NULL),
          '[]'
        ) as versions
      FROM tools t
      LEFT JOIN tool_tool_tags ttt ON t.tool_id = ttt.tool_id
      LEFT JOIN tool_tags tt ON ttt.tag_id = tt.tag_id AND tt.is_active = TRUE
      LEFT JOIN tool_versions tv ON t.tool_id = tv.tool_id
      WHERE t.tool_id = $1 AND t.deleted_at IS NULL
      GROUP BY t.tool_id
    `;

    const result = await query<ToolResponse>(sql, [toolId]);
    return result.length > 0 ? result[0] : null;
  }

  /**
   * Get a tool by slug
   */
  async getToolBySlug(slug: string): Promise<ToolResponse | null> {
    const sql = `
      SELECT 
        t.*,
        COALESCE(
          json_agg(
            json_build_object(
              'tag_id', tt.tag_id,
              'name', tt.name,
              'slug', tt.slug,
              'color', tt.color
            )
          ) FILTER (WHERE tt.tag_id IS NOT NULL),
          '[]'
        ) as tags
      FROM tools t
      LEFT JOIN tool_tool_tags ttt ON t.tool_id = ttt.tool_id
      LEFT JOIN tool_tags tt ON ttt.tag_id = tt.tag_id AND tt.is_active = TRUE
      WHERE t.slug = $1 AND t.deleted_at IS NULL
      GROUP BY t.tool_id
    `;

    const result = await query<ToolResponse>(sql, [slug]);
    return result.length > 0 ? result[0] : null;
  }

  /**
   * Create a new tool
   */
  async createTool(data: CreateToolDTO): Promise<Tool> {
    const sql = `
      INSERT INTO tools (name, slug, description, category, is_active, created_by)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    const values = [
      data.name,
      data.slug,
      data.description || null,
      data.category,
      data.is_active ?? true,
      data.created_by || null,
    ];

    const result = await query<Tool>(sql, values);
    return result[0];
  }

  /**
   * Update an existing tool
   */
  async updateTool(toolId: number, data: UpdateToolDTO): Promise<Tool | null> {
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

    if (data.category !== undefined) {
      updates.push(`category = $${valueIndex++}`);
      values.push(data.category);
    }

    if (data.is_active !== undefined) {
      updates.push(`is_active = $${valueIndex++}`);
      values.push(data.is_active);
    }

    if (data.updated_by !== undefined) {
      updates.push(`updated_by = $${valueIndex++}`);
      values.push(data.updated_by);
    }

    updates.push(`updated_at = NOW()`);
    values.push(toolId);

    const sql = `
      UPDATE tools
      SET ${updates.join(', ')}
      WHERE tool_id = $${valueIndex} AND deleted_at IS NULL
      RETURNING *
    `;

    const result = await query<Tool>(sql, values);
    return result.length > 0 ? result[0] : null;
  }

  /**
   * Soft delete a tool
   */
  async deleteTool(toolId: number): Promise<boolean> {
    const sql = `
      UPDATE tools
      SET deleted_at = NOW()
      WHERE tool_id = $1 AND deleted_at IS NULL
      RETURNING tool_id
    `;

    const result = await query(sql, [toolId]);
    return result.length > 0;
  }

  /**
   * Assign tags to a tool
   */
  async assignTags(toolId: number, tagIds: number[]): Promise<void> {
    // Remove existing tags
    await query('DELETE FROM tool_tool_tags WHERE tool_id = $1', [toolId]);

    // Add new tags
    if (tagIds.length > 0) {
      const values = tagIds.map((tagId, index) => 
        `($1, $${index + 2})`
      ).join(', ');

      const sql = `
        INSERT INTO tool_tool_tags (tool_id, tag_id)
        VALUES ${values}
        ON CONFLICT DO NOTHING
      `;

      await query(sql, [toolId, ...tagIds]);
    }
  }
}
