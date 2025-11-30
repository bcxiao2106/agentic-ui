# Swagger API Documentation Guide

## 🎯 Overview

The Studio Server API includes comprehensive Swagger/OpenAPI 3.0 documentation for all 26 endpoints. This provides an interactive, web-based interface to explore, test, and understand the API.

---

## 📍 Accessing Swagger UI

### Development
```
http://localhost:3001/api-docs
```

### Production
```
https://your-domain.com/api-docs
```

---

## 🚀 Quick Start

1. **Start the server:**
   ```bash
   cd studio-server
   pnpm install
   pnpm run dev
   ```

2. **Open Swagger UI:**
   - Navigate to `http://localhost:3001/api-docs` in your browser

3. **Explore the API:**
   - Browse all endpoints organized by tags (Tools, Versions, Tags, Executions)
   - View request/response schemas
   - Test endpoints directly from the interface

---

## 📚 Features

### Interactive Documentation
- **Try It Out**: Test endpoints directly from the browser
- **Request Schemas**: See required and optional parameters
- **Response Examples**: View sample responses with data types
- **Error Codes**: Understand error responses

### Organized by Tags
- 🛠️ **Tools**: Tool management endpoints (7 endpoints)
- 📦 **Versions**: Version control endpoints (9 endpoints)
- 🏷️ **Tags**: Tag management endpoints (7 endpoints)
- ▶️ **Executions**: Execution tracking endpoints (6 endpoints)
- ❤️ **Health**: System status endpoints (2 endpoints)

### Reusable Schemas
All data models are defined as reusable schemas:
- `Tool`, `CreateToolDTO`, `UpdateToolDTO`
- `ToolVersion`, `CreateToolVersionDTO`
- `ToolTag`, `CreateToolTagDTO`
- `ToolExecution`, `CreateToolExecutionDTO`
- `PaginatedResponse`, `Error`

---

## 🔍 Using Swagger UI

### Testing an Endpoint

1. **Select an endpoint** from the list
2. **Click "Try it out"**
3. **Fill in parameters:**
   - Path parameters (e.g., `id`, `slug`)
   - Query parameters (e.g., `page`, `limit`, `search`)
   - Request body (for POST/PUT requests)
4. **Click "Execute"**
5. **View the response:**
   - Response code (200, 201, 404, etc.)
   - Response body with actual data
   - Response headers

### Example: Creating a Tool

1. Navigate to **POST /api/v1/tools**
2. Click **"Try it out"**
3. Enter request body:
   ```json
   {
     "name": "Data Analyzer",
     "slug": "data-analyzer",
     "category": "data",
     "description": "Analyzes and processes data",
     "icon_url": "https://example.com/icon.png"
   }
   ```
4. Click **"Execute"**
5. View the created tool in the response

### Example: Listing Tools with Filters

1. Navigate to **GET /api/v1/tools**
2. Click **"Try it out"**
3. Set parameters:
   - `category`: "data"
   - `is_active`: true
   - `page`: 1
   - `limit`: 10
4. Click **"Execute"**
5. See paginated results

---

## 📖 OpenAPI Specification

### Accessing the Raw Spec

The OpenAPI specification is available programmatically:

```typescript
import { swaggerSpec } from '@/config/swagger.config';
console.log(swaggerSpec);
```

### Exporting the Spec

You can export the specification as JSON:

```bash
# Add this to package.json scripts:
"swagger:export": "node -e \"const {swaggerSpec} = require('./dist/config/swagger.config'); console.log(JSON.stringify(swaggerSpec, null, 2))\" > swagger.json"
```

---

## 🔧 Configuration

### Swagger Config Location
```
studio-server/src/config/swagger.config.ts
```

### Customization Options

#### Change Server URLs
```typescript
servers: [
  {
    url: 'http://localhost:3001',
    description: 'Development server',
  },
  {
    url: 'https://api.production.com',
    description: 'Production server',
  },
],
```

#### Update API Info
```typescript
info: {
  title: 'Studio Server API',
  version: '1.0.0',
  description: 'Your custom description',
  contact: {
    name: 'Your Name',
    email: 'your@email.com',
  },
},
```

#### Customize UI Theme
In `src/index.ts`:
```typescript
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'My API Docs',
  customfavIcon: '/favicon.ico',
}));
```

---

## 📝 Adding New Endpoints

### Step 1: Add JSDoc Comments

In your route file (e.g., `src/api/routes/tools.routes.ts`):

```typescript
/**
 * @swagger
 * /api/v1/tools:
 *   get:
 *     summary: Get all tools
 *     description: Retrieve a paginated list of tools
 *     tags: [Tools]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 */
router.get('/', ToolController.getTools);
```

### Step 2: Swagger Auto-Detects

The swagger-jsdoc library automatically picks up all `@swagger` comments from:
- `./src/api/routes/*.ts`
- `./src/routes/*.ts`

### Step 3: Restart Server

Changes take effect after server restart:
```bash
pnpm run dev
```

---

## 🎨 Swagger UI Features

### Interactive Testing
- **Try endpoints** without writing code
- **See real responses** from your API
- **Test error cases** by providing invalid data

### Schema Validation
- **See required fields** highlighted
- **View data types** for all properties
- **Check enum values** for restricted fields

### Response Examples
- **Sample data** for each endpoint
- **Multiple response codes** (200, 400, 404, 500)
- **Error message formats**

---

## 📊 All Documented Endpoints

### Tools (7 endpoints)
- `GET /api/v1/tools` - List all tools (with pagination/filtering)
- `GET /api/v1/tools/:id` - Get tool by ID
- `GET /api/v1/tools/slug/:slug` - Get tool by slug
- `POST /api/v1/tools` - Create new tool
- `PUT /api/v1/tools/:id` - Update tool
- `DELETE /api/v1/tools/:id` - Soft delete tool
- `POST /api/v1/tools/:id/tags` - Assign tags to tool

### Versions (9 endpoints)
- `GET /api/v1/tools/:toolId/versions` - Get versions for tool
- `GET /api/v1/tools/:toolId/versions/active` - Get active version
- `POST /api/v1/tools/:toolId/versions` - Create version for tool
- `GET /api/v1/versions/:id` - Get version by ID
- `PUT /api/v1/versions/:id` - Update version
- `DELETE /api/v1/versions/:id` - Delete version
- `POST /api/v1/versions/:id/activate` - Activate version

### Tags (7 endpoints)
- `GET /api/v1/tags` - List all tags
- `GET /api/v1/tags/:id` - Get tag by ID
- `GET /api/v1/tags/slug/:slug` - Get tag by slug
- `GET /api/v1/tags/:id/tools` - Get tools with tag
- `POST /api/v1/tags` - Create new tag
- `PUT /api/v1/tags/:id` - Update tag
- `DELETE /api/v1/tags/:id` - Delete tag

### Executions (6 endpoints)
- `GET /api/v1/executions` - List executions (with filtering)
- `GET /api/v1/executions/:id` - Get execution by ID
- `GET /api/v1/executions/request/:requestId` - Get by request ID (idempotency)
- `GET /api/v1/executions/stats` - Get execution statistics
- `POST /api/v1/executions` - Create new execution
- `PUT /api/v1/executions/:id` - Update execution

### Health (2 endpoints)
- `GET /api/health` - Health check
- `GET /api/v1` - API info

**Total: 26 endpoints fully documented**

---

## 🔐 Authentication (Future)

When authentication is added, Swagger will support:

```typescript
components: {
  securitySchemes: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    },
  },
},
security: [
  {
    bearerAuth: [],
  },
],
```

Users can then add JWT tokens in the Swagger UI:
1. Click **"Authorize"** button
2. Enter token: `Bearer <your-jwt-token>`
3. All requests include the token

---

## 🐛 Troubleshooting

### Swagger UI Not Loading

**Check server is running:**
```bash
curl http://localhost:3001/api-docs
```

**Check logs for errors:**
```bash
pnpm run dev
# Look for swagger-related errors
```

### Endpoints Not Appearing

**Verify route files are in correct location:**
- Routes must be in `src/api/routes/*.ts` or `src/routes/*.ts`
- Check `swagger.config.ts` apis array

**Check JSDoc syntax:**
- Must start with `@swagger`
- YAML must be properly indented
- Schema references must exist

### Schema Validation Errors

**Check schema definitions:**
- All `$ref` must point to existing schemas
- Schema properties must have correct types
- Required fields must be specified

---

## 📚 Additional Resources

### Official Documentation
- [Swagger UI](https://swagger.io/tools/swagger-ui/)
- [OpenAPI 3.0 Spec](https://swagger.io/specification/)
- [swagger-jsdoc](https://github.com/Surnet/swagger-jsdoc)

### Example Specs
- View your spec: `http://localhost:3001/api-docs`
- See schema definitions in `src/config/swagger.config.ts`
- Check route annotations in `src/api/routes/*.ts`

### Next Steps
1. ✅ Explore all endpoints in Swagger UI
2. ✅ Test API calls directly from browser
3. ✅ Use schemas to understand data models
4. ✅ Export OpenAPI spec for client generation
5. ✅ Share documentation with frontend team

---

## 🎉 Summary

Your API now has:
- ✅ **Interactive Swagger UI** at `/api-docs`
- ✅ **26 fully documented endpoints**
- ✅ **Complete schema definitions**
- ✅ **Request/response examples**
- ✅ **In-browser testing**
- ✅ **Professional API documentation**

Start exploring: **http://localhost:3001/api-docs** 🚀
