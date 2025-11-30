import apiClient from '@/lib/apiClient';
import {
  Tool,
  CreateToolDTO,
  UpdateToolDTO,
  AssignTagsDTO,
  ToolQueryParams,
  ApiResponse,
  PaginatedResponse,
} from '@/types/api';

const BASE_PATH = '/api/v1/tools';

/**
 * Tool API Service
 * Handles all tool-related API calls
 */
export const toolsApi = {
  /**
   * Get all tools with optional filtering and pagination
   */
  getTools: async (params?: ToolQueryParams): Promise<PaginatedResponse<Tool>> => {
    const response = await apiClient.get<PaginatedResponse<Tool>>(BASE_PATH, { params });
    return response.data;
  },

  /**
   * Get a single tool by ID
   */
  getToolById: async (id: number): Promise<ApiResponse<Tool>> => {
    const response = await apiClient.get<ApiResponse<Tool>>(`${BASE_PATH}/${id}`);
    return response.data;
  },

  /**
   * Get a tool by slug
   */
  getToolBySlug: async (slug: string): Promise<ApiResponse<Tool>> => {
    const response = await apiClient.get<ApiResponse<Tool>>(`${BASE_PATH}/slug/${slug}`);
    return response.data;
  },

  /**
   * Create a new tool
   */
  createTool: async (data: CreateToolDTO): Promise<ApiResponse<Tool>> => {
    const response = await apiClient.post<ApiResponse<Tool>>(BASE_PATH, data);
    return response.data;
  },

  /**
   * Update an existing tool
   */
  updateTool: async (id: number, data: UpdateToolDTO): Promise<ApiResponse<Tool>> => {
    const response = await apiClient.put<ApiResponse<Tool>>(`${BASE_PATH}/${id}`, data);
    return response.data;
  },

  /**
   * Delete a tool (soft delete)
   */
  deleteTool: async (id: number): Promise<ApiResponse<{ message: string }>> => {
    const response = await apiClient.delete<ApiResponse<{ message: string }>>(`${BASE_PATH}/${id}`);
    return response.data;
  },

  /**
   * Assign tags to a tool
   */
  assignTags: async (id: number, data: AssignTagsDTO): Promise<ApiResponse<{ message: string }>> => {
    const response = await apiClient.post<ApiResponse<{ message: string }>>(`${BASE_PATH}/${id}/tags`, data);
    return response.data;
  },
};
