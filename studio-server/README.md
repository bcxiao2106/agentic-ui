# Studio Server

The central server for the Agentic UI platform that combines:
- **Node.js + Express**: REST API server
- **PostgreSQL**: Data persistence
- **MCP Server**: Tool and agent management
- **Frontend Serving**: Static file serving for the Next.js studio

## Quick Start

### 1. Environment Setup

```bash
cp .env.example .env
```

Edit `.env` with your PostgreSQL credentials.

### 2. Install Dependencies

```bash
npm install
```

### 3. Initialize Database

```bash
npm run db:init
npm run db:seed  # Optional: add sample data
```

### 4. Start Development Server

```bash
npm run dev
```

Server runs on `http://localhost:3001` by default.

## API Endpoints

### Tools
- `GET /api/tools` - List all tools
- `POST /api/tools` - Create new tool
- `GET /api/tools/:toolId` - Get tool details
- `PUT /api/tools/:toolId` - Update tool
- `DELETE /api/tools/:toolId` - Delete tool
- `GET /api/tools/:toolId/versions` - List versions

### Agents
- `GET /api/agents` - List agents
- `POST /api/agents` - Create agent
- `GET /api/agents/:agentId` - Get agent
- `PUT /api/agents/:agentId` - Update agent
- `DELETE /api/agents/:agentId` - Delete agent
- `POST /api/agents/:agentId/execute` - Execute agent

### Executions
- `GET /api/executions` - List executions
- `GET /api/executions/:executionId` - Get execution details
- `GET /api/executions?status=running` - Filter by status

### MCP Server
- `POST /mcp/tools/list` - List available tools
- `POST /mcp/tools/execute` - Execute tool
- `POST /mcp/agents/list` - List agents

## Development

### Build

```bash
npm run build
```

### Type Checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

## Database

### Schema

All tables from `DB_DESIGN.md` are automatically initialized:
- `tools`, `tool_tags`, `tool_tool_tags`
- `tool_versions`, `tool_executions`
- `agents`, `agent_tools`
- `workflows`, `workflow_executions`
- `users`, `workspaces`

### Migrations

```bash
npm run db:migrate
```

### Seeding

```bash
npm run db:seed
```

## Architecture

```
studio-server/
├── src/
│   ├── index.ts           # Entry point
│   ├── config/            # Configuration
│   │   ├── database.ts
│   │   ├── env.ts
│   │   └── mcp.ts
│   ├── database/          # Database layer
│   │   ├── connection.ts
│   │   ├── init.ts
│   │   ├── seed.ts
│   │   └── queries/
│   ├── controllers/       # API handlers
│   │   ├── toolController.ts
│   │   ├── agentController.ts
│   │   └── executionController.ts
│   ├── routes/            # API routes
│   │   ├── tools.ts
│   │   ├── agents.ts
│   │   ├── executions.ts
│   │   ├── mcp.ts
│   │   └── index.ts
│   ├── services/          # Business logic
│   │   ├── toolService.ts
│   │   ├── agentService.ts
│   │   └── executionService.ts
│   ├── middleware/        # Express middleware
│   │   ├── errorHandler.ts
│   │   ├── logger.ts
│   │   └── auth.ts
│   ├── types/             # TypeScript definitions
│   │   └── index.ts
│   └── utils/             # Utilities
│       ├── logger.ts
│       └── validators.ts
└── dist/                  # Compiled output
```

## Deployment

### Docker

```bash
docker build -t agentic-ui-studio-server .
docker run -p 3001:3001 \
  -e DATABASE_URL=postgresql://user:pass@postgres:5432/agentic_ui \
  agentic-ui-studio-server
```

### Environment Variables

See `.env.example` for all available options.

## Integration

### With Frontend

The server automatically serves the compiled Next.js frontend from `studio/out` at `/`.

### With MCP Client

Connect to the MCP server endpoints at:
- `POST http://localhost:3001/mcp/*`

### With Agents

Agents can be configured to use this server's API endpoints for tool execution.

## Monitoring

- Logs are written to `logs/` directory
- Request logging via Morgan
- Error tracking via structured logging
- Database query logging

## Support

For issues or questions, refer to the main project README and documentation.
