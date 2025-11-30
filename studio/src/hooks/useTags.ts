import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { tagsApi } from '@/services/tags.service';
import {
  ToolTag,
  CreateToolTagDTO,
  UpdateToolTagDTO,
  Tool,
  ApiResponse,
} from '@/types/api';
import { handleApiError } from '@/lib/apiClient';

// Query Keys
export const tagKeys = {
  all: ['tags'] as const,
  lists: () => [...tagKeys.all, 'list'] as const,
  list: () => [...tagKeys.lists()] as const,
  details: () => [...tagKeys.all, 'detail'] as const,
  detail: (id: number) => [...tagKeys.details(), id] as const,
  bySlug: (slug: string) => [...tagKeys.all, 'slug', slug] as const,
  tools: (id: number) => [...tagKeys.all, id, 'tools'] as const,
};

/**
 * Hook to fetch all tags
 */
export function useTags(
  options?: Omit<UseQueryOptions<ApiResponse<ToolTag[]>>, 'queryKey' | 'queryFn'>
) {
  return useQuery<ApiResponse<ToolTag[]>>({
    queryKey: tagKeys.list(),
    queryFn: () => tagsApi.getAllTags(),
    ...options,
  });
}

/**
 * Hook to fetch a single tag by ID
 */
export function useTag(
  id: number,
  options?: Omit<UseQueryOptions<ApiResponse<ToolTag>>, 'queryKey' | 'queryFn'>
) {
  return useQuery<ApiResponse<ToolTag>>({
    queryKey: tagKeys.detail(id),
    queryFn: () => tagsApi.getTagById(id),
    enabled: !!id,
    ...options,
  });
}

/**
 * Hook to fetch a tag by slug
 */
export function useTagBySlug(
  slug: string,
  options?: Omit<UseQueryOptions<ApiResponse<ToolTag>>, 'queryKey' | 'queryFn'>
) {
  return useQuery<ApiResponse<ToolTag>>({
    queryKey: tagKeys.bySlug(slug),
    queryFn: () => tagsApi.getTagBySlug(slug),
    enabled: !!slug,
    ...options,
  });
}

/**
 * Hook to fetch all tools with a specific tag
 */
export function useToolsByTag(
  id: number,
  options?: Omit<UseQueryOptions<ApiResponse<Tool[]>>, 'queryKey' | 'queryFn'>
) {
  return useQuery<ApiResponse<Tool[]>>({
    queryKey: tagKeys.tools(id),
    queryFn: () => tagsApi.getToolsByTag(id),
    enabled: !!id,
    ...options,
  });
}

/**
 * Hook to create a new tag
 */
export function useCreateTag(
  options?: UseMutationOptions<ApiResponse<ToolTag>, Error, CreateToolTagDTO>
) {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<ToolTag>, Error, CreateToolTagDTO>({
    mutationFn: (data) => tagsApi.createTag(data),
    onSuccess: () => {
      // Invalidate and refetch tags list
      queryClient.invalidateQueries({ queryKey: tagKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to create tag:', handleApiError(error));
    },
    ...options,
  });
}

/**
 * Hook to update a tag
 */
export function useUpdateTag(
  options?: UseMutationOptions<ApiResponse<ToolTag>, Error, { id: number; data: UpdateToolTagDTO }>
) {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<ToolTag>, Error, { id: number; data: UpdateToolTagDTO }>({
    mutationFn: ({ id, data }) => tagsApi.updateTag(id, data),
    onSuccess: (_, variables) => {
      // Invalidate specific tag and lists
      queryClient.invalidateQueries({ queryKey: tagKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: tagKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to update tag:', handleApiError(error));
    },
    ...options,
  });
}

/**
 * Hook to delete a tag
 */
export function useDeleteTag(
  options?: UseMutationOptions<ApiResponse<{ message: string }>, Error, number>
) {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<{ message: string }>, Error, number>({
    mutationFn: (id) => tagsApi.deleteTag(id),
    onSuccess: (_, id) => {
      // Invalidate specific tag and lists
      queryClient.invalidateQueries({ queryKey: tagKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: tagKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to delete tag:', handleApiError(error));
    },
    ...options,
  });
}
