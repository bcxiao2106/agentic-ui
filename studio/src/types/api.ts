// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  success: false;
  error: string;
}

// Tool Types
export enum ToolCategory {
  DATA = 'data',
  TEXT = 'text',
  IMAGE = 'image',
  AUDIO = 'audio',
  VIDEO = 'video',
  UTILITY = 'utility',
  OTHER = 'other',
}

export interface Tool {
  id: number;
  name: string;
  slug: string;
  description?: string;
  category: ToolCategory;
  icon_url?: string;
  is_active: boolean;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
  created_by?: number;
  updated_by?: number;
  deleted_at?: string;
}

export interface CreateToolDTO {
  name: string;
  slug: string;
  description?: string;
  category: ToolCategory;
  icon_url?: string;
  metadata?: Record<string, any>;
  created_by?: number;
}

export interface UpdateToolDTO {
  name?: string;
  description?: string;
  category?: ToolCategory;
  icon_url?: string;
  is_active?: boolean;
  metadata?: Record<string, any>;
  updated_by?: number;
}

export interface AssignTagsDTO {
  tag_ids: number[];
}

// Tool Version Types
export enum HandlerLanguage {
  JAVASCRIPT = 'javascript',
  TYPESCRIPT = 'typescript',
  PYTHON = 'python',
}

export interface ToolVersion {
  id: number;
  tool_id: number;
  version_number: string;
  handler_code: string;
  handler_language: HandlerLanguage;
  input_schema: Record<string, any>;
  output_schema: Record<string, any>;
  is_active: boolean;
  changelog?: string;
  created_at: string;
  created_by?: number;
}

export interface CreateToolVersionDTO {
  tool_id: number;
  version_number: string;
  handler_code: string;
  handler_language: HandlerLanguage;
  input_schema: Record<string, any>;
  output_schema: Record<string, any>;
  changelog?: string;
  created_by?: number;
}

export interface UpdateToolVersionDTO {
  handler_code?: string;
  handler_language?: HandlerLanguage;
  input_schema?: Record<string, any>;
  output_schema?: Record<string, any>;
  changelog?: string;
  updated_by?: number;
}

// Tool Tag Types
export interface ToolTag {
  tag_id: number;
  name: string;
  slug: string;
  color?: string | null;
  description?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateToolTagDTO {
  name: string;
  slug: string;
  color: string;
  description?: string;
}

export interface UpdateToolTagDTO {
  name?: string;
  color?: string;
  description?: string;
}

// Tool Execution Types
export enum ExecutionStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  SUCCESS = 'success',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export interface ToolExecution {
  id: number;
  tool_id: number;
  version_id: number;
  execution_request_id?: string;
  status: ExecutionStatus;
  input_data: Record<string, any>;
  output_data?: Record<string, any>;
  error_message?: string;
  execution_time_ms?: number;
  started_at: string;
  completed_at?: string;
  executed_by?: number;
}

export interface CreateToolExecutionDTO {
  tool_id: number;
  version_id: number;
  execution_request_id?: string;
  input_data: Record<string, any>;
  executed_by?: number;
}

export interface UpdateToolExecutionDTO {
  status?: ExecutionStatus;
  output_data?: Record<string, any>;
  error_message?: string;
  execution_time_ms?: number;
  completed_at?: string;
}

export interface ExecutionStats {
  total_executions: number;
  success_count: number;
  failed_count: number;
  avg_execution_time_ms: number;
}

// Query Parameters
export interface ToolQueryParams {
  search?: string;
  category?: ToolCategory;
  is_active?: boolean;
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface ExecutionQueryParams {
  tool_id?: number;
  version_id?: number;
  status?: ExecutionStatus;
  executed_by?: number;
  from_date?: string;
  to_date?: string;
  page?: number;
  limit?: number;
}

export interface ExecutionStatsParams {
  tool_id?: number;
}
