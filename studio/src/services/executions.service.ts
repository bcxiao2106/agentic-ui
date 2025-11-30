import apiClient from '@/lib/apiClient';
import {
  ToolExecution,
  CreateToolExecutionDTO,
  UpdateToolExecutionDTO,
  ExecutionStats,
  ExecutionQueryParams,
  ExecutionStatsParams,
  ApiResponse,
  PaginatedResponse,
} from '@/types/api';

const BASE_PATH = '/api/v1/executions';

/**
 * Tool Execution API Service
 * Handles all execution-related API calls
 */
export const executionsApi = {
  /**
   * Get all executions with optional filtering and pagination
   */
  getExecutions: async (params?: ExecutionQueryParams): Promise<PaginatedResponse<ToolExecution>> => {
    const response = await apiClient.get<PaginatedResponse<ToolExecution>>(BASE_PATH, { params });
    return response.data;
  },

  /**
   * Get a single execution by ID
   */
  getExecutionById: async (id: number): Promise<ApiResponse<ToolExecution>> => {
    const response = await apiClient.get<ApiResponse<ToolExecution>>(`${BASE_PATH}/${id}`);
    return response.data;
  },

  /**
   * Get an execution by request ID (for idempotency)
   */
  getExecutionByRequestId: async (requestId: string): Promise<ApiResponse<ToolExecution>> => {
    const response = await apiClient.get<ApiResponse<ToolExecution>>(`${BASE_PATH}/request/${requestId}`);
    return response.data;
  },

  /**
   * Get execution statistics
   */
  getExecutionStats: async (params?: ExecutionStatsParams): Promise<ApiResponse<ExecutionStats>> => {
    const response = await apiClient.get<ApiResponse<ExecutionStats>>(`${BASE_PATH}/stats`, { params });
    return response.data;
  },

  /**
   * Create a new execution
   */
  createExecution: async (data: CreateToolExecutionDTO): Promise<ApiResponse<ToolExecution>> => {
    const response = await apiClient.post<ApiResponse<ToolExecution>>(BASE_PATH, data);
    return response.data;
  },

  /**
   * Update an execution (typically for completion)
   */
  updateExecution: async (id: number, data: UpdateToolExecutionDTO): Promise<ApiResponse<ToolExecution>> => {
    const response = await apiClient.put<ApiResponse<ToolExecution>>(`${BASE_PATH}/${id}`, data);
    return response.data;
  },
};
