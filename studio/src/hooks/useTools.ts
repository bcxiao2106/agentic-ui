import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { toolsApi } from '@/services/tools.service';
import {
  Tool,
  CreateToolDTO,
  UpdateToolDTO,
  AssignTagsDTO,
  ToolQueryParams,
  ApiResponse,
  PaginatedResponse,
} from '@/types/api';
import { handleApiError } from '@/lib/apiClient';

// Query Keys
export const toolKeys = {
  all: ['tools'] as const,
  lists: () => [...toolKeys.all, 'list'] as const,
  list: (params?: ToolQueryParams) => [...toolKeys.lists(), params] as const,
  details: () => [...toolKeys.all, 'detail'] as const,
  detail: (id: number) => [...toolKeys.details(), id] as const,
  bySlug: (slug: string) => [...toolKeys.all, 'slug', slug] as const,
};

/**
 * Hook to fetch all tools with pagination and filtering
 */
export function useTools(
  params?: ToolQueryParams,
  options?: Omit<UseQueryOptions<PaginatedResponse<Tool>>, 'queryKey' | 'queryFn'>
) {
  return useQuery<PaginatedResponse<Tool>>({
    queryKey: toolKeys.list(params),
    queryFn: () => toolsApi.getTools(params),
    ...options,
  });
}

/**
 * Hook to fetch a single tool by ID
 */
export function useTool(
  id: number,
  options?: Omit<UseQueryOptions<ApiResponse<Tool>>, 'queryKey' | 'queryFn'>
) {
  return useQuery<ApiResponse<Tool>>({
    queryKey: toolKeys.detail(id),
    queryFn: () => toolsApi.getToolById(id),
    enabled: !!id,
    ...options,
  });
}

/**
 * Hook to fetch a tool by slug
 */
export function useToolBySlug(
  slug: string,
  options?: Omit<UseQueryOptions<ApiResponse<Tool>>, 'queryKey' | 'queryFn'>
) {
  return useQuery<ApiResponse<Tool>>({
    queryKey: toolKeys.bySlug(slug),
    queryFn: () => toolsApi.getToolBySlug(slug),
    enabled: !!slug,
    ...options,
  });
}

/**
 * Hook to create a new tool
 */
export function useCreateTool(
  options?: UseMutationOptions<ApiResponse<Tool>, Error, CreateToolDTO>
) {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<Tool>, Error, CreateToolDTO>({
    mutationFn: (data) => toolsApi.createTool(data),
    onSuccess: () => {
      // Invalidate and refetch tools list
      queryClient.invalidateQueries({ queryKey: toolKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to create tool:', handleApiError(error));
    },
    ...options,
  });
}

/**
 * Hook to update a tool
 */
export function useUpdateTool(
  options?: UseMutationOptions<ApiResponse<Tool>, Error, { id: number; data: UpdateToolDTO }>
) {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<Tool>, Error, { id: number; data: UpdateToolDTO }>({
    mutationFn: ({ id, data }) => toolsApi.updateTool(id, data),
    onSuccess: (_, variables) => {
      // Invalidate specific tool and lists
      queryClient.invalidateQueries({ queryKey: toolKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: toolKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to update tool:', handleApiError(error));
    },
    ...options,
  });
}

/**
 * Hook to delete a tool
 */
export function useDeleteTool(
  options?: UseMutationOptions<ApiResponse<{ message: string }>, Error, number>
) {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<{ message: string }>, Error, number>({
    mutationFn: (id) => toolsApi.deleteTool(id),
    onSuccess: (_, id) => {
      // Invalidate specific tool and lists
      queryClient.invalidateQueries({ queryKey: toolKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: toolKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to delete tool:', handleApiError(error));
    },
    ...options,
  });
}

/**
 * Hook to assign tags to a tool
 */
export function useAssignTags(
  options?: UseMutationOptions<ApiResponse<{ message: string }>, Error, { id: number; data: AssignTagsDTO }>
) {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<{ message: string }>, Error, { id: number; data: AssignTagsDTO }>({
    mutationFn: ({ id, data }) => toolsApi.assignTags(id, data),
    onSuccess: (_, variables) => {
      // Invalidate specific tool to refetch with new tags
      queryClient.invalidateQueries({ queryKey: toolKeys.detail(variables.id) });
    },
    onError: (error) => {
      console.error('Failed to assign tags:', handleApiError(error));
    },
    ...options,
  });
}
