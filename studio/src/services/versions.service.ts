import apiClient from '@/lib/apiClient';
import {
  ToolVersion,
  CreateToolVersionDTO,
  UpdateToolVersionDTO,
  ApiResponse,
} from '@/types/api';

const BASE_PATH = '/api/v1';

/**
 * Tool Version API Service
 * Handles all version-related API calls
 */
export const versionsApi = {
  /**
   * Get all versions for a specific tool
   */
  getVersionsByToolId: async (toolId: number): Promise<ApiResponse<ToolVersion[]>> => {
    const response = await apiClient.get<ApiResponse<ToolVersion[]>>(`${BASE_PATH}/tools/${toolId}/versions`);
    return response.data;
  },

  /**
   * Get the active version for a tool
   */
  getActiveVersion: async (toolId: number): Promise<ApiResponse<ToolVersion>> => {
    const response = await apiClient.get<ApiResponse<ToolVersion>>(`${BASE_PATH}/tools/${toolId}/versions/active`);
    return response.data;
  },

  /**
   * Create a new version for a tool
   */
  createVersion: async (toolId: number, data: CreateToolVersionDTO): Promise<ApiResponse<ToolVersion>> => {
    const response = await apiClient.post<ApiResponse<ToolVersion>>(`${BASE_PATH}/tools/${toolId}/versions`, data);
    return response.data;
  },

  /**
   * Get a specific version by ID
   */
  getVersionById: async (id: number): Promise<ApiResponse<ToolVersion>> => {
    const response = await apiClient.get<ApiResponse<ToolVersion>>(`${BASE_PATH}/versions/${id}`);
    return response.data;
  },

  /**
   * Update a version
   */
  updateVersion: async (id: number, data: UpdateToolVersionDTO): Promise<ApiResponse<ToolVersion>> => {
    const response = await apiClient.put<ApiResponse<ToolVersion>>(`${BASE_PATH}/versions/${id}`, data);
    return response.data;
  },

  /**
   * Delete a version
   */
  deleteVersion: async (id: number): Promise<ApiResponse<{ message: string }>> => {
    const response = await apiClient.delete<ApiResponse<{ message: string }>>(`${BASE_PATH}/versions/${id}`);
    return response.data;
  },

  /**
   * Activate a version (sets it as the active version for its tool)
   */
  activateVersion: async (id: number): Promise<ApiResponse<{ message: string }>> => {
    const response = await apiClient.post<ApiResponse<{ message: string }>>(`${BASE_PATH}/versions/${id}/activate`);
    return response.data;
  },
};
