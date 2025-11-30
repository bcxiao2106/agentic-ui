'use client';

import { useTools, useCreateTool, useDeleteTool } from '@/hooks/useTools';
import { useTags } from '@/hooks/useTags';
import { ToolCategory } from '@/types/api';
import { useState } from 'react';

/**
 * Example Component demonstrating API integration
 * Shows how to fetch, create, and delete tools using React Query hooks
 */
export default function ToolsExample() {
  const [category, setCategory] = useState<ToolCategory | undefined>(undefined);
  const [page, setPage] = useState(1);

  // Fetch tools with pagination and filtering
  const { data: toolsData, isLoading, error, refetch } = useTools({
    category,
    is_active: true,
    page,
    limit: 10,
  });

  // Fetch all tags
  const { data: tagsData } = useTags();

  // Create tool mutation
  const createTool = useCreateTool({
    onSuccess: (data) => {
      console.log('✅ Tool created:', data.data);
      alert(`Tool "${data.data.name}" created successfully!`);
    },
    onError: (error) => {
      console.error('❌ Failed to create tool:', error);
      alert('Failed to create tool');
    },
  });

  // Delete tool mutation
  const deleteTool = useDeleteTool({
    onSuccess: () => {
      alert('Tool deleted successfully!');
    },
  });

  // Handle create tool
  const handleCreateTool = () => {
    createTool.mutate({
      name: `Test Tool ${Date.now()}`,
      slug: `test-tool-${Date.now()}`,
      category: ToolCategory.DATA,
      description: 'A test tool created from the UI',
      icon_url: 'https://via.placeholder.com/64',
    });
  };

  // Handle delete tool
  const handleDeleteTool = (id: number, name: string) => {
    if (confirm(`Delete tool "${name}"?`)) {
      deleteTool.mutate(id);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-semibold mb-2">Error Loading Tools</h3>
          <p className="text-red-600 mb-4">{error.message}</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Tools API Integration Example</h1>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex gap-4 items-center flex-wrap">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Category
            </label>
            <select
              value={category || ''}
              onChange={(e) => setCategory(e.target.value as ToolCategory || undefined)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">All Categories</option>
              {Object.values(ToolCategory).map((cat) => (
                <option key={cat} value={cat}>
                  {cat.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {/* Create Tool Button */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Actions
            </label>
            <button
              onClick={handleCreateTool}
              disabled={createTool.isPending}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createTool.isPending ? 'Creating...' : '+ Create Test Tool'}
            </button>
          </div>

          {/* Refresh Button */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              &nbsp;
            </label>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              🔄 Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-blue-600">Total Tools: {toolsData?.pagination.total}</p>
            <p className="text-sm text-blue-600">
              Page {toolsData?.pagination.page} of {toolsData?.pagination.totalPages}
            </p>
          </div>
          <div>
            <p className="text-sm text-blue-600">Tags Available: {tagsData?.data.length || 0}</p>
          </div>
        </div>
      </div>

      {/* Tools List */}
      <div className="space-y-4">
        {toolsData?.data.map((tool) => (
          <div
            key={tool.id}
            className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {tool.icon_url && (
                    <img
                      src={tool.icon_url}
                      alt={tool.name}
                      className="w-12 h-12 rounded"
                    />
                  )}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{tool.name}</h3>
                    <p className="text-sm text-gray-500">
                      {tool.slug} • {tool.category}
                    </p>
                  </div>
                </div>
                {tool.description && (
                  <p className="text-gray-600 mb-3">{tool.description}</p>
                )}
                <div className="flex gap-2 text-xs text-gray-500">
                  <span>ID: {tool.id}</span>
                  <span>•</span>
                  <span>Active: {tool.is_active ? '✅' : '❌'}</span>
                  <span>•</span>
                  <span>Created: {new Date(tool.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              <button
                onClick={() => handleDeleteTool(tool.id, tool.name)}
                disabled={deleteTool.isPending}
                className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {toolsData?.data.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">No tools found</p>
            <p className="text-sm">Try changing the filter or create a new tool</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {toolsData && toolsData.pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {page} of {toolsData.pagination.totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === toolsData.pagination.totalPages}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {/* Tags Preview */}
      {tagsData && tagsData.data.length > 0 && (
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Available Tags</h2>
          <div className="flex flex-wrap gap-2">
            {tagsData.data.map((tag) => (
              <span
                key={tag.tag_id}
                className="px-3 py-1 rounded-full text-sm text-white"
                style={{ backgroundColor: tag.color || '#6B7280' }}
              >
                {tag.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
