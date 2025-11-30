/**
 * Tool Entity Types
 * Based on DB_DESIGN.md
 */

export type ToolCategory = 'api' | 'database' | 'computation' | 'integration' | 'utility';

export interface Tool {
  tool_id: number;
  name: string;
  slug: string;
  description?: string | null;
  category: ToolCategory;
  is_active: boolean;
  created_by?: string | null;
  updated_by?: string | null;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
}

export interface CreateToolDTO {
  name: string;
  slug: string;
  description?: string;
  category: ToolCategory;
  is_active?: boolean;
  created_by?: string;
}

export interface UpdateToolDTO {
  name?: string;
  slug?: string;
  description?: string;
  category?: ToolCategory;
  is_active?: boolean;
  updated_by?: string;
}

export interface ToolQueryParams {
  search?: string;
  category?: ToolCategory;
  is_active?: boolean;
  page?: number;
  limit?: number;
  sort_by?: 'name' | 'created_at' | 'updated_at';
  sort_order?: 'asc' | 'desc';
}

export interface ToolResponse extends Tool {
  tags?: ToolTag[];
  versions?: ToolVersion[];
}

/**
 * Tool Tag Types
 */
export interface ToolTag {
  tag_id: number;
  name: string;
  slug: string;
  description?: string | null;
  color?: string | null;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateToolTagDTO {
  name: string;
  slug: string;
  description?: string;
  color?: string;
  is_active?: boolean;
}

export interface UpdateToolTagDTO {
  name?: string;
  slug?: string;
  description?: string;
  color?: string;
  is_active?: boolean;
}

/**
 * Tool Version Types
 */
export type HandlerLanguage = 'javascript' | 'typescript' | 'python' | 'go' | 'rust';

export interface ToolVersion {
  version_id: number;
  tool_id: number;
  version_number: string;
  semantic_version?: string | null;
  input_schema: Record<string, any>;
  output_schema: Record<string, any>;
  handler_source_code?: string | null;
  handler_language?: HandlerLanguage | null;
  is_active: boolean;
  is_deprecated: boolean;
  deprecation_message?: string | null;
  changelog?: string | null;
  created_by?: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface CreateToolVersionDTO {
  tool_id: number;
  version_number: string;
  semantic_version?: string;
  input_schema: Record<string, any>;
  output_schema: Record<string, any>;
  handler_source_code?: string;
  handler_language?: HandlerLanguage;
  is_active?: boolean;
  changelog?: string;
  created_by?: string;
}

export interface UpdateToolVersionDTO {
  version_number?: string;
  semantic_version?: string;
  input_schema?: Record<string, any>;
  output_schema?: Record<string, any>;
  handler_source_code?: string;
  handler_language?: HandlerLanguage;
  is_active?: boolean;
  is_deprecated?: boolean;
  deprecation_message?: string;
  changelog?: string;
}

/**
 * Tool Execution Types
 */
export type ExecutionStatus = 'pending' | 'running' | 'succeeded' | 'failed' | 'timeout' | 'cancelled';

export interface ToolExecution {
  execution_id: number;
  tool_id: number;
  version_id: number;
  agent_id?: string | null;
  workflow_id?: string | null;
  execution_request_id: string;
  input_payload: Record<string, any>;
  output_payload?: Record<string, any> | null;
  error_message?: string | null;
  error_stacktrace?: string | null;
  execution_time_ms?: number | null;
  status: ExecutionStatus;
  http_status_code?: number | null;
  llm_source?: string | null;
  user_id?: string | null;
  started_at: Date;
  completed_at?: Date | null;
  created_at: Date;
}

export interface CreateToolExecutionDTO {
  tool_id: number;
  version_id: number;
  agent_id?: string;
  workflow_id?: string;
  execution_request_id: string;
  input_payload: Record<string, any>;
  llm_source?: string;
  user_id?: string;
}

export interface UpdateToolExecutionDTO {
  output_payload?: Record<string, any>;
  error_message?: string;
  error_stacktrace?: string;
  execution_time_ms?: number;
  status?: ExecutionStatus;
  http_status_code?: number;
  completed_at?: Date;
}

export interface ToolExecutionQueryParams {
  tool_id?: number;
  version_id?: number;
  agent_id?: string;
  workflow_id?: string;
  status?: ExecutionStatus;
  user_id?: string;
  from_date?: string;
  to_date?: string;
  page?: number;
  limit?: number;
}

/**
 * Common Response Types
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: any;
  };
}
