import apiClient from '@/lib/apiClient';
import {
  ToolTag,
  CreateToolTagDTO,
  UpdateToolTagDTO,
  Tool,
  ApiResponse,
} from '@/types/api';

const BASE_PATH = '/api/v1/tags';

/**
 * Tool Tag API Service
 * Handles all tag-related API calls
 */
export const tagsApi = {
  /**
   * Get all tags
   */
  getAllTags: async (): Promise<ApiResponse<ToolTag[]>> => {
    const response = await apiClient.get<ApiResponse<ToolTag[]>>(BASE_PATH);
    return response.data;
  },

  /**
   * Get a single tag by ID
   */
  getTagById: async (id: number): Promise<ApiResponse<ToolTag>> => {
    const response = await apiClient.get<ApiResponse<ToolTag>>(`${BASE_PATH}/${id}`);
    return response.data;
  },

  /**
   * Get a tag by slug
   */
  getTagBySlug: async (slug: string): Promise<ApiResponse<ToolTag>> => {
    const response = await apiClient.get<ApiResponse<ToolTag>>(`${BASE_PATH}/slug/${slug}`);
    return response.data;
  },

  /**
   * Get all tools with a specific tag
   */
  getToolsByTag: async (id: number): Promise<ApiResponse<Tool[]>> => {
    const response = await apiClient.get<ApiResponse<Tool[]>>(`${BASE_PATH}/${id}/tools`);
    return response.data;
  },

  /**
   * Create a new tag
   */
  createTag: async (data: CreateToolTagDTO): Promise<ApiResponse<ToolTag>> => {
    const response = await apiClient.post<ApiResponse<ToolTag>>(BASE_PATH, data);
    return response.data;
  },

  /**
   * Update an existing tag
   */
  updateTag: async (id: number, data: UpdateToolTagDTO): Promise<ApiResponse<ToolTag>> => {
    const response = await apiClient.put<ApiResponse<ToolTag>>(`${BASE_PATH}/${id}`, data);
    return response.data;
  },

  /**
   * Delete a tag
   */
  deleteTag: async (id: number): Promise<ApiResponse<{ message: string }>> => {
    const response = await apiClient.delete<ApiResponse<{ message: string }>>(`${BASE_PATH}/${id}`);
    return response.data;
  },
};
