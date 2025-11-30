import { query } from '@/database/connection';
import {
  ToolExecution,
  CreateToolExecutionDTO,
  UpdateToolExecutionDTO,
  ToolExecutionQueryParams,
  PaginatedResponse,
} from '@/api/types/tool.types';

export class ToolExecutionService {
  /**
   * Get executions with filtering and pagination
   */
  async getExecutions(params: ToolExecutionQueryParams): Promise<PaginatedResponse<ToolExecution>> {
    const {
      tool_id,
      version_id,
      agent_id,
      workflow_id,
      status,
      user_id,
      from_date,
      to_date,
      page = 1,
      limit = 20,
    } = params;

    const offset = (page - 1) * limit;
    const conditions: string[] = [];
    const values: any[] = [];
    let valueIndex = 1;

    if (tool_id) {
      conditions.push(`tool_id = $${valueIndex++}`);
      values.push(tool_id);
    }

    if (version_id) {
      conditions.push(`version_id = $${valueIndex++}`);
      values.push(version_id);
    }

    if (agent_id) {
      conditions.push(`agent_id = $${valueIndex++}`);
      values.push(agent_id);
    }

    if (workflow_id) {
      conditions.push(`workflow_id = $${valueIndex++}`);
      values.push(workflow_id);
    }

    if (status) {
      conditions.push(`status = $${valueIndex++}`);
      values.push(status);
    }

    if (user_id) {
      conditions.push(`user_id = $${valueIndex++}`);
      values.push(user_id);
    }

    if (from_date) {
      conditions.push(`created_at >= $${valueIndex++}`);
      values.push(from_date);
    }

    if (to_date) {
      conditions.push(`created_at <= $${valueIndex++}`);
      values.push(to_date);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM tool_executions
      ${whereClause}
    `;
    const countResult = await query<{ total: string }>(countQuery, values);
    const total = parseInt(countResult[0].total, 10);

    // Get paginated data
    const dataQuery = `
      SELECT te.*,
        t.name as tool_name,
        tv.version_number
      FROM tool_executions te
      JOIN tools t ON te.tool_id = t.tool_id
      JOIN tool_versions tv ON te.version_id = tv.version_id
      ${whereClause}
      ORDER BY te.created_at DESC
      LIMIT $${valueIndex} OFFSET $${valueIndex + 1}
    `;

    values.push(limit, offset);
    const executions = await query<ToolExecution>(dataQuery, values);

    return {
      data: executions,
      pagination: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get execution by ID
   */
  async getExecutionById(executionId: number): Promise<ToolExecution | null> {
    const sql = `
      SELECT te.*,
        t.name as tool_name,
        tv.version_number
      FROM tool_executions te
      JOIN tools t ON te.tool_id = t.tool_id
      JOIN tool_versions tv ON te.version_id = tv.version_id
      WHERE te.execution_id = $1
    `;

    const result = await query<ToolExecution>(sql, [executionId]);
    return result.length > 0 ? result[0] : null;
  }

  /**
   * Get execution by request ID (for idempotency)
   */
  async getExecutionByRequestId(requestId: string): Promise<ToolExecution | null> {
    const sql = `
      SELECT *
      FROM tool_executions
      WHERE execution_request_id = $1
    `;

    const result = await query<ToolExecution>(sql, [requestId]);
    return result.length > 0 ? result[0] : null;
  }

  /**
   * Create a new execution
   */
  async createExecution(data: CreateToolExecutionDTO): Promise<ToolExecution> {
    const sql = `
      INSERT INTO tool_executions (
        tool_id,
        version_id,
        agent_id,
        workflow_id,
        execution_request_id,
        input_payload,
        llm_source,
        user_id,
        status,
        started_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending', NOW())
      RETURNING *
    `;

    const values = [
      data.tool_id,
      data.version_id,
      data.agent_id || null,
      data.workflow_id || null,
      data.execution_request_id,
      JSON.stringify(data.input_payload),
      data.llm_source || null,
      data.user_id || null,
    ];

    const result = await query<ToolExecution>(sql, values);
    return result[0];
  }

  /**
   * Update execution (typically for completion)
   */
  async updateExecution(executionId: number, data: UpdateToolExecutionDTO): Promise<ToolExecution | null> {
    const updates: string[] = [];
    const values: any[] = [];
    let valueIndex = 1;

    if (data.output_payload !== undefined) {
      updates.push(`output_payload = $${valueIndex++}`);
      values.push(JSON.stringify(data.output_payload));
    }

    if (data.error_message !== undefined) {
      updates.push(`error_message = $${valueIndex++}`);
      values.push(data.error_message);
    }

    if (data.error_stacktrace !== undefined) {
      updates.push(`error_stacktrace = $${valueIndex++}`);
      values.push(data.error_stacktrace);
    }

    if (data.execution_time_ms !== undefined) {
      updates.push(`execution_time_ms = $${valueIndex++}`);
      values.push(data.execution_time_ms);
    }

    if (data.status !== undefined) {
      updates.push(`status = $${valueIndex++}`);
      values.push(data.status);
    }

    if (data.http_status_code !== undefined) {
      updates.push(`http_status_code = $${valueIndex++}`);
      values.push(data.http_status_code);
    }

    if (data.completed_at !== undefined) {
      updates.push(`completed_at = $${valueIndex++}`);
      values.push(data.completed_at);
    } else if (data.status && ['succeeded', 'failed', 'timeout', 'cancelled'].includes(data.status)) {
      updates.push(`completed_at = NOW()`);
    }

    values.push(executionId);

    const sql = `
      UPDATE tool_executions
      SET ${updates.join(', ')}
      WHERE execution_id = $${valueIndex}
      RETURNING *
    `;

    const result = await query<ToolExecution>(sql, values);
    return result.length > 0 ? result[0] : null;
  }

  /**
   * Get execution statistics
   */
  async getExecutionStats(toolId?: number) {
    const whereClause = toolId ? 'WHERE tool_id = $1' : '';
    const values = toolId ? [toolId] : [];

    const sql = `
      SELECT
        COUNT(*) as total_executions,
        COUNT(*) FILTER (WHERE status = 'succeeded') as successful_executions,
        COUNT(*) FILTER (WHERE status = 'failed') as failed_executions,
        COUNT(*) FILTER (WHERE status = 'pending') as pending_executions,
        COUNT(*) FILTER (WHERE status = 'running') as running_executions,
        AVG(execution_time_ms) FILTER (WHERE execution_time_ms IS NOT NULL) as avg_execution_time_ms,
        MAX(execution_time_ms) as max_execution_time_ms,
        MIN(execution_time_ms) FILTER (WHERE execution_time_ms IS NOT NULL) as min_execution_time_ms
      FROM tool_executions
      ${whereClause}
    `;

    const result = await query(sql, values);
    return result[0];
  }
}
