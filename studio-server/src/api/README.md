# API Documentation

## Overview

This API provides endpoints for managing tools, tool versions, tool tags, and tool executions in the Agentic UI platform.

**Base URL**: `/api/v1`

## Architecture

The API follows a professional, scalable structure:

```
src/api/
├── types/              # TypeScript interfaces and types
│   └── tool.types.ts   # Tool-related types
├── services/           # Business logic layer
│   ├── tool.service.ts
│   ├── toolVersion.service.ts
│   ├── toolTag.service.ts
│   └── toolExecution.service.ts
├── controllers/        # Request handlers
│   └── tool.controller.ts
└── routes/             # API routes
    ├── index.ts
    └── tools.routes.ts
```

## Endpoints

### Tools

#### GET `/api/v1/tools`
Get all tools with filtering and pagination.

**Query Parameters:**
- `search` (string): Search in name and description
- `category` (string): Filter by category (api, database, computation, integration, utility)
- `is_active` (boolean): Filter by active status
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20)
- `sort_by` (string): Sort field (name, created_at, updated_at)
- `sort_order` (string): Sort order (asc, desc)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "tool_id": 1,
      "name": "Weather API",
      "slug": "weather-api",
      "description": "Get weather information",
      "category": "api",
      "is_active": true,
      "created_at": "2025-11-30T10:00:00Z",
      "updated_at": "2025-11-30T10:00:00Z",
      "tags": [
        {
          "tag_id": 1,
          "name": "Weather",
          "slug": "weather",
          "color": "#3B82F6"
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "total_pages": 5
  }
}
```

#### GET `/api/v1/tools/:id`
Get a single tool by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "tool_id": 1,
    "name": "Weather API",
    "slug": "weather-api",
    "description": "Get weather information",
    "category": "api",
    "is_active": true,
    "created_at": "2025-11-30T10:00:00Z",
    "updated_at": "2025-11-30T10:00:00Z",
    "tags": [...],
    "versions": [
      {
        "version_id": 1,
        "version_number": "1.0.0",
        "is_active": true,
        "is_deprecated": false
      }
    ]
  }
}
```

#### GET `/api/v1/tools/slug/:slug`
Get a tool by slug.

#### POST `/api/v1/tools`
Create a new tool.

**Request Body:**
```json
{
  "name": "Weather API",
  "slug": "weather-api",
  "description": "Get weather information",
  "category": "api",
  "is_active": true,
  "created_by": "user-uuid"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "tool_id": 1,
    "name": "Weather API",
    ...
  }
}
```

#### PUT `/api/v1/tools/:id`
Update a tool.

**Request Body:**
```json
{
  "name": "Updated Weather API",
  "description": "Updated description",
  "is_active": false,
  "updated_by": "user-uuid"
}
```

#### DELETE `/api/v1/tools/:id`
Soft delete a tool.

**Response:** `204 No Content`

#### POST `/api/v1/tools/:id/tags`
Assign tags to a tool.

**Request Body:**
```json
{
  "tag_ids": [1, 2, 3]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Tags assigned successfully"
}
```

## Error Responses

All errors follow a consistent format:

```json
{
  "error": {
    "message": "Tool not found",
    "code": "TOOL_NOT_FOUND",
    "details": {}
  }
}
```

**Common Status Codes:**
- `200` - Success
- `201` - Created
- `204` - No Content
- `400` - Bad Request
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

## Data Types

### Tool
```typescript
interface Tool {
  tool_id: number;
  name: string;
  slug: string;
  description?: string | null;
  category: 'api' | 'database' | 'computation' | 'integration' | 'utility';
  is_active: boolean;
  created_by?: string | null;
  updated_by?: string | null;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
}
```

### ToolTag
```typescript
interface ToolTag {
  tag_id: number;
  name: string;
  slug: string;
  description?: string | null;
  color?: string | null;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}
```

### ToolVersion
```typescript
interface ToolVersion {
  version_id: number;
  tool_id: number;
  version_number: string;
  semantic_version?: string | null;
  input_schema: Record<string, any>;
  output_schema: Record<string, any>;
  handler_source_code?: string | null;
  handler_language?: 'javascript' | 'typescript' | 'python' | 'go' | 'rust' | null;
  is_active: boolean;
  is_deprecated: boolean;
  deprecation_message?: string | null;
  changelog?: string | null;
  created_by?: string | null;
  created_at: Date;
  updated_at: Date;
}
```

### ToolExecution
```typescript
interface ToolExecution {
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
  status: 'pending' | 'running' | 'succeeded' | 'failed' | 'timeout' | 'cancelled';
  http_status_code?: number | null;
  llm_source?: string | null;
  user_id?: string | null;
  started_at: Date;
  completed_at?: Date | null;
  created_at: Date;
}
```

## Examples

### Create a Tool
```bash
curl -X POST http://localhost:3001/api/v1/tools \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Weather API",
    "slug": "weather-api",
    "description": "Get weather information",
    "category": "api"
  }'
```

### Get Tools with Filtering
```bash
curl "http://localhost:3001/api/v1/tools?category=api&is_active=true&page=1&limit=10"
```

### Update a Tool
```bash
curl -X PUT http://localhost:3001/api/v1/tools/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Weather API",
    "description": "Updated description"
  }'
```

### Assign Tags to a Tool
```bash
curl -X POST http://localhost:3001/api/v1/tools/1/tags \
  -H "Content-Type: application/json" \
  -d '{
    "tag_ids": [1, 2, 3]
  }'
```

## Future Endpoints

The following endpoints are planned for future implementation:

- **Tool Versions**: `/api/v1/tools/:id/versions`
- **Tool Tags**: `/api/v1/tags`
- **Tool Executions**: `/api/v1/executions`
- **Tool Statistics**: `/api/v1/tools/:id/stats`

## Notes

- All endpoints support `express-async-errors` for automatic error handling
- Database queries use parameterized queries to prevent SQL injection
- Soft deletes are used for tools (set `deleted_at` timestamp)
- Pagination is available on list endpoints
- All timestamps are stored in UTC
