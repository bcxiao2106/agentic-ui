# Complete API Endpoints Reference

## Base URL
`http://localhost:3001/api/v1`

---

## 🔧 Tools

### List Tools
```
GET /api/v1/tools
```
**Query Parameters:**
- `search` (string) - Search in name and description
- `category` (string) - Filter by category: api, database, computation, integration, utility
- `is_active` (boolean) - Filter by active status
- `page` (number) - Page number (default: 1)
- `limit` (number) - Items per page (default: 20)
- `sort_by` (string) - Sort field: name, created_at, updated_at
- `sort_order` (string) - Sort order: asc, desc

### Get Tool by ID
```
GET /api/v1/tools/:id
```

### Get Tool by Slug
```
GET /api/v1/tools/slug/:slug
```

### Create Tool
```
POST /api/v1/tools
```
**Body:**
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

### Update Tool
```
PUT /api/v1/tools/:id
```
**Body:** Same as create (all fields optional)

### Delete Tool
```
DELETE /api/v1/tools/:id
```

### Assign Tags to Tool
```
POST /api/v1/tools/:id/tags
```
**Body:**
```json
{
  "tag_ids": [1, 2, 3]
}
```

---

## 📦 Tool Versions

### Get All Versions for a Tool
```
GET /api/v1/tools/:toolId/versions
```

### Get Active Version for a Tool
```
GET /api/v1/tools/:toolId/versions/active
```

### Get Version by ID
```
GET /api/v1/versions/:id
```

### Create Version
```
POST /api/v1/tools/:toolId/versions
```
**Body:**
```json
{
  "version_number": "1.0.0",
  "semantic_version": "1.0.0",
  "input_schema": {
    "type": "object",
    "properties": {
      "location": { "type": "string" }
    }
  },
  "output_schema": {
    "type": "object",
    "properties": {
      "temperature": { "type": "number" }
    }
  },
  "handler_source_code": "async function handler(input) { ... }",
  "handler_language": "javascript",
  "is_active": false,
  "changelog": "Initial release",
  "created_by": "user-uuid"
}
```

### Update Version
```
PUT /api/v1/versions/:id
```
**Body:** Same as create (all fields optional)

### Activate Version
```
POST /api/v1/versions/:id/activate
```

### Delete Version
```
DELETE /api/v1/versions/:id
```

---

## 🏷️ Tags

### List All Tags
```
GET /api/v1/tags
```
**Query Parameters:**
- `is_active` (boolean) - Filter by active status

### Get Tag by ID
```
GET /api/v1/tags/:id
```

### Get Tag by Slug
```
GET /api/v1/tags/slug/:slug
```

### Get Tools by Tag
```
GET /api/v1/tags/:id/tools
```

### Create Tag
```
POST /api/v1/tags
```
**Body:**
```json
{
  "name": "Weather",
  "slug": "weather",
  "description": "Weather related tools",
  "color": "#3B82F6",
  "is_active": true
}
```

### Update Tag
```
PUT /api/v1/tags/:id
```
**Body:** Same as create (all fields optional)

### Delete Tag
```
DELETE /api/v1/tags/:id
```

---

## 🚀 Executions

### List Executions
```
GET /api/v1/executions
```
**Query Parameters:**
- `tool_id` (number) - Filter by tool
- `version_id` (number) - Filter by version
- `agent_id` (string) - Filter by agent UUID
- `workflow_id` (string) - Filter by workflow UUID
- `status` (string) - Filter by status: pending, running, succeeded, failed, timeout, cancelled
- `user_id` (string) - Filter by user UUID
- `from_date` (string) - Filter by start date (ISO format)
- `to_date` (string) - Filter by end date (ISO format)
- `page` (number) - Page number (default: 1)
- `limit` (number) - Items per page (default: 20)

### Get Execution by ID
```
GET /api/v1/executions/:id
```

### Get Execution by Request ID (Idempotency)
```
GET /api/v1/executions/request/:requestId
```

### Get Execution Statistics
```
GET /api/v1/executions/stats
```
**Query Parameters:**
- `tool_id` (number) - Optional: get stats for specific tool

**Response:**
```json
{
  "success": true,
  "data": {
    "total_executions": 1000,
    "successful_executions": 950,
    "failed_executions": 40,
    "pending_executions": 5,
    "running_executions": 5,
    "avg_execution_time_ms": 250,
    "max_execution_time_ms": 5000,
    "min_execution_time_ms": 50
  }
}
```

### Create Execution
```
POST /api/v1/executions
```
**Body:**
```json
{
  "tool_id": 1,
  "version_id": 1,
  "agent_id": "agent-uuid",
  "workflow_id": "workflow-uuid",
  "execution_request_id": "unique-request-uuid",
  "input_payload": {
    "location": "San Francisco"
  },
  "llm_source": "openai-gpt-4",
  "user_id": "user-uuid"
}
```

### Update Execution
```
PUT /api/v1/executions/:id
```
**Body:**
```json
{
  "output_payload": {
    "temperature": 72
  },
  "status": "succeeded",
  "execution_time_ms": 250,
  "http_status_code": 200
}
```

---

## 📊 Utility Endpoints

### API Health Check
```
GET /api/health
```

### API Info
```
GET /api/v1
```

---

## 📋 Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "total_pages": 5
  }
}
```

### Error Response
```json
{
  "error": {
    "message": "Resource not found",
    "code": "NOT_FOUND",
    "details": {}
  }
}
```

---

## 🔐 Status Codes

- `200` - OK
- `201` - Created
- `204` - No Content (successful deletion)
- `400` - Bad Request
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `500` - Internal Server Error

---

## 🧪 Testing Examples

### Using cURL

```bash
# Get all tools
curl http://localhost:3001/api/v1/tools

# Get tools with filtering
curl "http://localhost:3001/api/v1/tools?category=api&is_active=true&page=1&limit=10"

# Create a tool
curl -X POST http://localhost:3001/api/v1/tools \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Weather API",
    "slug": "weather-api",
    "description": "Get weather information",
    "category": "api"
  }'

# Create a version
curl -X POST http://localhost:3001/api/v1/tools/1/versions \
  -H "Content-Type: application/json" \
  -d '{
    "version_number": "1.0.0",
    "input_schema": {"type": "object"},
    "output_schema": {"type": "object"}
  }'

# Create an execution
curl -X POST http://localhost:3001/api/v1/executions \
  -H "Content-Type: application/json" \
  -d '{
    "tool_id": 1,
    "version_id": 1,
    "execution_request_id": "550e8400-e29b-41d4-a716-446655440000",
    "input_payload": {"location": "San Francisco"}
  }'

# Get execution stats
curl http://localhost:3001/api/v1/executions/stats?tool_id=1
```

---

## 📚 Related Documentation

- **API Implementation Details**: `src/api/README.md`
- **Database Schema**: `../../DB_DESIGN.md`
- **Implementation Summary**: `API_IMPLEMENTATION_SUMMARY.md`
