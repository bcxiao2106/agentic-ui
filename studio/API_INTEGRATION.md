# API Integration Guide

## 🎯 Overview

The Studio frontend is now integrated with the Studio Server API running at `http://localhost:3001`. All API calls are handled through:
- **Axios** for HTTP requests
- **React Query** for data fetching, caching, and state management

---

## 📁 Project Structure

```
studio/src/
├── lib/
│   └── apiClient.ts          # Axios instance with interceptors
├── types/
│   └── api.ts                # TypeScript types matching API schemas
├── services/
│   ├── tools.service.ts      # Tools API functions
│   ├── versions.service.ts   # Versions API functions
│   ├── tags.service.ts       # Tags API functions
│   ├── executions.service.ts # Executions API functions
│   └── index.ts              # Service exports
├── hooks/
│   ├── useTools.ts           # React Query hooks for tools
│   └── useTags.ts            # React Query hooks for tags
└── components/
    └── QueryProvider.tsx     # React Query provider
```

---

## 🔧 Configuration

### Environment Variables

Create `.env.local` in the studio root:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

Default: `http://localhost:3001`

---

## 📚 Usage Examples

### 1. Fetching Tools List

```typescript
import { useTools } from '@/hooks/useTools';

function ToolsList() {
  const { data, isLoading, error } = useTools({
    category: 'data',
    is_active: true,
    page: 1,
    limit: 20,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.data.map((tool) => (
        <div key={tool.id}>
          <h3>{tool.name}</h3>
          <p>{tool.description}</p>
        </div>
      ))}
      <p>Total: {data?.pagination.total}</p>
    </div>
  );
}
```

### 2. Creating a Tool

```typescript
import { useCreateTool } from '@/hooks/useTools';
import { ToolCategory } from '@/types/api';

function CreateToolForm() {
  const createTool = useCreateTool({
    onSuccess: (data) => {
      console.log('Tool created:', data.data);
    },
    onError: (error) => {
      console.error('Failed to create tool:', error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTool.mutate({
      name: 'My Tool',
      slug: 'my-tool',
      category: ToolCategory.DATA,
      description: 'A sample tool',
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={createTool.isPending}>
        {createTool.isPending ? 'Creating...' : 'Create Tool'}
      </button>
    </form>
  );
}
```

### 3. Updating a Tool

```typescript
import { useUpdateTool } from '@/hooks/useTools';

function UpdateToolButton({ toolId }: { toolId: number }) {
  const updateTool = useUpdateTool();

  const handleUpdate = () => {
    updateTool.mutate({
      id: toolId,
      data: {
        is_active: false,
      },
    });
  };

  return (
    <button onClick={handleUpdate} disabled={updateTool.isPending}>
      Deactivate Tool
    </button>
  );
}
```

### 4. Fetching Tags

```typescript
import { useTags } from '@/hooks/useTags';

function TagsList() {
  const { data, isLoading } = useTags();

  if (isLoading) return <div>Loading tags...</div>;

  return (
    <div>
      {data?.data.map((tag) => (
        <span
          key={tag.id}
          style={{ backgroundColor: tag.color }}
        >
          {tag.name}
        </span>
      ))}
    </div>
  );
}
```

### 5. Direct API Call (without hooks)

```typescript
import { toolsApi } from '@/services';

async function fetchToolById(id: number) {
  try {
    const response = await toolsApi.getToolById(id);
    console.log(response.data);
  } catch (error) {
    console.error('Error:', error);
  }
}
```

---

## 🎣 Available Hooks

### Tools Hooks (`useTools.ts`)

```typescript
useTools(params?, options?)           // Fetch all tools
useTool(id, options?)                 // Fetch single tool by ID
useToolBySlug(slug, options?)         // Fetch tool by slug
useCreateTool(options?)               // Create tool mutation
useUpdateTool(options?)               // Update tool mutation
useDeleteTool(options?)               // Delete tool mutation
useAssignTags(options?)               // Assign tags mutation
```

### Tags Hooks (`useTags.ts`)

```typescript
useTags(options?)                     // Fetch all tags
useTag(id, options?)                  // Fetch single tag
useTagBySlug(slug, options?)          // Fetch tag by slug
useToolsByTag(id, options?)           // Fetch tools with tag
useCreateTag(options?)                // Create tag mutation
useUpdateTag(options?)                // Update tag mutation
useDeleteTag(options?)                // Delete tag mutation
```

---

## 📦 Available Services

### Direct API Functions

All services are available at `@/services`:

```typescript
import { toolsApi, versionsApi, tagsApi, executionsApi } from '@/services';

// Tools
await toolsApi.getTools(params);
await toolsApi.getToolById(id);
await toolsApi.createTool(data);
await toolsApi.updateTool(id, data);
await toolsApi.deleteTool(id);
await toolsApi.assignTags(id, { tag_ids: [1, 2] });

// Versions
await versionsApi.getVersionsByToolId(toolId);
await versionsApi.getActiveVersion(toolId);
await versionsApi.createVersion(toolId, data);
await versionsApi.updateVersion(id, data);
await versionsApi.activateVersion(id);
await versionsApi.deleteVersion(id);

// Tags
await tagsApi.getAllTags();
await tagsApi.getTagById(id);
await tagsApi.createTag(data);
await tagsApi.updateTag(id, data);
await tagsApi.deleteTag(id);
await tagsApi.getToolsByTag(id);

// Executions
await executionsApi.getExecutions(params);
await executionsApi.getExecutionById(id);
await executionsApi.createExecution(data);
await executionsApi.updateExecution(id, data);
await executionsApi.getExecutionStats({ tool_id: 1 });
```

---

## 🎨 React Query Features

### Automatic Caching
Data is cached for 30 seconds by default. Subsequent requests within that time use cached data.

### Background Refetching
Data is automatically refetched in the background when it becomes stale.

### Optimistic Updates
Mutations automatically invalidate and refetch related queries.

### Error Handling
Automatic retry with exponential backoff for failed requests.

### Devtools
React Query Devtools available in development mode (bottom-right corner).

---

## 🔑 Query Keys

Query keys are centralized for cache management:

```typescript
// Tools
toolKeys.all                          // ['tools']
toolKeys.lists()                      // ['tools', 'list']
toolKeys.list(params)                 // ['tools', 'list', params]
toolKeys.detail(id)                   // ['tools', 'detail', id]
toolKeys.bySlug(slug)                 // ['tools', 'slug', slug]

// Tags
tagKeys.all                           // ['tags']
tagKeys.list()                        // ['tags', 'list']
tagKeys.detail(id)                    // ['tags', 'detail', id]
tagKeys.tools(id)                     // ['tags', id, 'tools']
```

---

## 🛠️ Advanced Usage

### Custom Query Options

```typescript
const { data } = useTools(
  { category: 'data' },
  {
    staleTime: 60000,      // Data fresh for 1 minute
    gcTime: 300000,        // Cache for 5 minutes
    refetchInterval: 5000, // Poll every 5 seconds
    enabled: isReady,      // Conditional fetching
  }
);
```

### Manual Cache Invalidation

```typescript
import { useQueryClient } from '@tanstack/react-query';
import { toolKeys } from '@/hooks/useTools';

function RefreshButton() {
  const queryClient = useQueryClient();

  const handleRefresh = () => {
    // Invalidate all tools queries
    queryClient.invalidateQueries({ queryKey: toolKeys.all });
  };

  return <button onClick={handleRefresh}>Refresh</button>;
}
```

### Prefetching Data

```typescript
import { useQueryClient } from '@tanstack/react-query';
import { toolsApi } from '@/services';
import { toolKeys } from '@/hooks/useTools';

function ToolLink({ toolId }: { toolId: number }) {
  const queryClient = useQueryClient();

  const handleMouseEnter = () => {
    // Prefetch tool data on hover
    queryClient.prefetchQuery({
      queryKey: toolKeys.detail(toolId),
      queryFn: () => toolsApi.getToolById(toolId),
    });
  };

  return (
    <a href={`/tools/${toolId}`} onMouseEnter={handleMouseEnter}>
      View Tool
    </a>
  );
}
```

---

## 🐛 Error Handling

### Global Error Handler

Errors are logged automatically by axios interceptors. Check console for details.

### Component-Level Error Handling

```typescript
const { data, error, isError } = useTools();

if (isError) {
  return (
    <div className="error">
      <h3>Error Loading Tools</h3>
      <p>{error.message}</p>
      <button onClick={() => refetch()}>Retry</button>
    </div>
  );
}
```

### Mutation Error Handling

```typescript
const createTool = useCreateTool({
  onError: (error) => {
    if (error.response?.status === 400) {
      alert('Invalid tool data');
    } else if (error.response?.status === 409) {
      alert('Tool with this slug already exists');
    } else {
      alert('Failed to create tool');
    }
  },
});
```

---

## 🚀 Getting Started

1. **Start the API server:**
   ```bash
   cd studio-server
   pnpm run dev
   ```

2. **Start the frontend:**
   ```bash
   cd studio
   pnpm run dev
   ```

3. **Open React Query Devtools:**
   - Look for the React Query icon in the bottom-right corner
   - Click to inspect queries, mutations, and cache

4. **Test the integration:**
   - Navigate to components using the hooks
   - Watch the Devtools to see queries execute
   - Check the console for API request/response logs

---

## 📖 TypeScript Support

All types are fully typed with TypeScript:

```typescript
import type { 
  Tool, 
  ToolCategory, 
  CreateToolDTO,
  PaginatedResponse 
} from '@/types/api';

// Fully typed response
const tools: PaginatedResponse<Tool> = await toolsApi.getTools();

// Type-safe creation
const newTool: CreateToolDTO = {
  name: 'Test',
  slug: 'test',
  category: ToolCategory.DATA, // Enum autocomplete
};
```

---

## ✅ Best Practices

1. **Use hooks for components** - Automatic caching and refetching
2. **Use services for utilities** - Direct API calls for non-UI logic
3. **Handle loading states** - Show spinners/skeletons
4. **Handle errors gracefully** - Show error messages with retry
5. **Use optimistic updates** - Update UI before API confirms
6. **Invalidate queries** - Refresh data after mutations
7. **Use query keys consistently** - Centralized key management

---

## 🎉 Summary

Your Studio frontend is now fully integrated with the Studio Server API:

- ✅ Axios client configured with interceptors
- ✅ React Query for state management
- ✅ TypeScript types matching API schemas
- ✅ Service functions for all 26 endpoints
- ✅ React hooks for data fetching
- ✅ Automatic caching and background refetching
- ✅ Error handling and retry logic
- ✅ Development tools for debugging

**Start using the API in your components now!** 🚀
