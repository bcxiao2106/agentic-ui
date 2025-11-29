# Integration Guide: Frontend + Backend

This guide shows how to integrate the Next.js frontend (studio) with the Node.js backend (studio-server).

---

## Architecture Overview

```
┌─────────────────────────────────────────┐
│         Next.js Frontend (Studio)       │
│         http://localhost:3001           │
│  (served by Node.js server via static)  │
└────────────┬────────────────────────────┘
             │
             │ HTTP/REST Requests
             │ GET/POST/PUT/DELETE
             │
┌────────────▼────────────────────────────┐
│    Node.js + Express (studio-server)    │
│         http://localhost:3001           │
│                                         │
│  - /api/tools        (Tools API)        │
│  - /api/agents       (Agents API)       │
│  - /api/executions   (Executions API)   │
│  - /api/mcp          (MCP Server)       │
│  - /api/health       (Health Check)     │
│                                         │
└────────────┬────────────────────────────┘
             │
             │ SQL Queries
             │
┌────────────▼────────────────────────────┐
│      PostgreSQL Database                │
│  (users, tools, agents, executions)     │
│      localhost:5432                     │
└─────────────────────────────────────────┘
```

---

## Setup Instructions

### 1. Build Frontend

First, build the Next.js frontend:

```bash
cd studio
npm install
npm run build
```

This creates an optimized build in `studio/.next/static/` or `studio/out/` depending on your Next.js configuration.

### 2. Configure Studio Server

In `studio-server/.env`:

```env
# Enable frontend serving
SERVE_FRONTEND=true

# Path to frontend build (relative to studio-server/)
FRONTEND_PATH=../studio/.next
# OR for static export:
# FRONTEND_PATH=../studio/out

# CORS origin should allow frontend
CORS_ORIGIN=http://localhost:3001,http://localhost:3000

# Database connection
DATABASE_URL=postgresql://agentic_user:password@localhost:5432/agentic_ui
```

### 3. Start Server

```bash
cd studio-server
npm install
npm run build
npm run db:init
npm start
```

Now visit: `http://localhost:3001`

---

## Single Port vs Multi-Port Setup

### Option A: Single Port (Recommended for Production)

Both frontend and backend run on the same port (3001).

```
studio-server/.env:
SERVE_FRONTEND=true
FRONTEND_PATH=../studio/out
PORT=3001
```

**Benefits**:
- ✅ Single port to manage
- ✅ No CORS issues
- ✅ Easier deployment
- ✅ Better for Docker

**Request flow**:
1. `GET http://localhost:3001/` → Serves frontend (index.html)
2. `GET /api/tools` → Routes to REST API

### Option B: Multi-Port (Development)

Frontend and backend on different ports.

```
studio/.env.local:
NEXT_PUBLIC_API_URL=http://localhost:3001

studio-server/.env:
SERVE_FRONTEND=false
CORS_ORIGIN=http://localhost:3000
PORT=3001
```

**Frontend server** (separate terminal):
```bash
cd studio
npm run dev
# Runs at http://localhost:3000
```

**Backend server**:
```bash
cd studio-server
npm run dev
# Runs at http://localhost:3001
```

**Benefits**:
- ✅ Separate concerns
- ✅ Faster frontend rebuild
- ✅ Independent scaling

---

## API Integration Examples

### Frontend → Backend API Calls

**Using Fetch API**:

```typescript
// src/utils/api.ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function fetchTools() {
  const response = await fetch(`${API_BASE}/api/tools`);
  return response.json();
}

export async function createTool(tool: Tool) {
  const response = await fetch(`${API_BASE}/api/tools`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tool),
  });
  return response.json();
}

export async function executeTool(toolId: number, input: any) {
  const response = await fetch(`${API_BASE}/api/executions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tool_id: toolId,
      version_id: 1,
      input_payload: input,
    }),
  });
  return response.json();
}
```

**Using React Hooks**:

```typescript
// src/hooks/useTools.ts
import { useState, useEffect } from 'react';

export function useTools() {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTools()
      .then(setTools)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { tools, loading, error };
}
```

**Using the hook in components**:

```typescript
// src/app/studio/page.tsx
import { useTools } from '@/hooks/useTools';

export default function StudioPage() {
  const { tools, loading } = useTools();

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1>Available Tools</h1>
      <ul>
        {tools.map(tool => (
          <li key={tool.tool_id}>{tool.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

---

## Environment Configuration

### Development (Multi-Port)

**studio/.env.local**:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**studio-server/.env**:
```env
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://agentic_user:password@localhost:5432/agentic_ui
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
SERVE_FRONTEND=false
```

### Production (Single Port)

**studio-server/.env**:
```env
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://user:password@db-host:5432/agentic_ui
CORS_ORIGIN=https://yourdomain.com
SERVE_FRONTEND=true
FRONTEND_PATH=../studio/out
```

---

## Docker Compose Setup

Use `docker-compose.yml` for integrated deployment:

```bash
cd studio-server
docker-compose up -d
```

This starts:
- PostgreSQL (port 5432)
- Studio Server (port 3001) with frontend included
- Auto-initializes database

**What happens**:
1. Docker builds studio-server image
2. Starts PostgreSQL container
3. Waits for database to be ready
4. Starts server with database initialized
5. Serves frontend at `http://localhost:3001`

---

## Deployment Options

### Option 1: Heroku

```bash
cd studio-server
git push heroku main

# Set environment variables
heroku config:set DATABASE_URL=postgresql://...
heroku config:set NODE_ENV=production
```

### Option 2: AWS Elastic Beanstalk

```bash
eb init -p node.js-18 agentic-ui
eb create agentic-ui-env
eb deploy
```

### Option 3: DigitalOcean App Platform

```bash
# Push to GitHub
git push origin main

# Create new App on DigitalOcean dashboard
# Connect GitHub repository
# Deploy automatically
```

### Option 4: Docker + EC2/VPS

```bash
# Build image
docker build -t agentic-ui-server .

# Push to registry
docker tag agentic-ui-server:latest your-registry/agentic-ui-server:latest
docker push your-registry/agentic-ui-server:latest

# On EC2/VPS
docker run -d \
  -p 3001:3001 \
  -e DATABASE_URL=postgresql://... \
  your-registry/agentic-ui-server:latest
```

---

## Testing the Integration

### 1. Health Check

```bash
curl http://localhost:3001/api/health
```

Response:
```json
{ "status": "ok", "timestamp": "..." }
```

### 2. Create a Tool

```bash
curl -X POST http://localhost:3001/api/tools \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Tool",
    "slug": "test-tool",
    "description": "A test tool",
    "category": "api"
  }'
```

### 3. List Tools

```bash
curl http://localhost:3001/api/tools
```

### 4. Test Frontend

Open browser to: `http://localhost:3001/`

Should see the Next.js studio interface.

---

## Troubleshooting

### CORS Error

**Error**: `Access to XMLHttpRequest blocked by CORS policy`

**Solution**: Update `CORS_ORIGIN` in `.env`:
```env
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
```

### Frontend 404

**Error**: Cannot find module or route returns 404

**Solution**: Ensure frontend is built:
```bash
cd studio
npm run build
```

And `SERVE_FRONTEND=true` in backend `.env`.

### API Not Responding

**Error**: `Cannot connect to server`

**Solution**:
1. Check backend is running: `curl http://localhost:3001/api/health`
2. Check environment variables
3. Check database connection: `npm run db:init`

### Database Connection Failed

**Error**: `connect ECONNREFUSED`

**Solution**:
1. Start PostgreSQL: `brew services start postgresql` (macOS)
2. Create database: See SETUP_GUIDE.md
3. Update `DATABASE_URL` in `.env`

---

## Performance Optimization

### Frontend

```typescript
// Enable image optimization
// In next.config.js
module.exports = {
  images: {
    unoptimized: false,
    formats: ['image/avif', 'image/webp'],
  },
}
```

### Backend

```typescript
// Use caching for frequently accessed data
// In routes/tools.ts
router.get('/', (req, res) => {
  res.set('Cache-Control', 'public, max-age=300');
  // ... fetch and return tools
});
```

### Database

```bash
# Add indexes for common queries
CREATE INDEX idx_tools_active ON tools(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_executions_status ON tool_executions(status);
```

---

## Monitoring

### Logs

**Frontend logs**:
```bash
# Browser console
console.log('API call:', response);
```

**Backend logs**:
```bash
# Check logs directory
tail -f logs/error-*.log
tail -f logs/info-*.log
```

### Metrics

**Health endpoint**:
```bash
curl http://localhost:3001/api/health
```

**Database query time**:
```bash
# Enable query logging in PostgreSQL
ALTER DATABASE agentic_ui SET log_statement = 'all';
```

---

## Next Steps

1. ✅ Build frontend: `cd studio && npm run build`
2. ✅ Start backend: `cd studio-server && npm run dev`
3. ✅ Test APIs with curl or Postman
4. ✅ Integrate with your deployment platform
5. ✅ Set up monitoring and logging

---

## Support

For issues:
1. Check logs in `studio-server/logs/`
2. Verify database connection
3. Check CORS configuration
4. Review API responses in browser DevTools
5. See SETUP_GUIDE.md for troubleshooting
