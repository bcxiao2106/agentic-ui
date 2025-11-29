# Studio Server Setup Guide

## Overview

The **Studio Server** is the central backend for the Agentic UI platform that:
- Serves the Next.js frontend (studio)
- Provides REST APIs for tools, agents, and workflows
- Implements the MCP (Model Context Protocol) server
- Manages PostgreSQL database connections
- Handles tool execution and tracking

---

## Prerequisites

### System Requirements

- **Node.js**: 18.0.0 or later
- **npm**: 8.0.0 or later
- **PostgreSQL**: 14 or later
- **Git**: For version control

### Install Node.js

**macOS** (using Homebrew):
```bash
brew install node
```

**Ubuntu/Debian**:
```bash
sudo apt-get update
sudo apt-get install nodejs npm
```

**Windows**:
Download from https://nodejs.org/ and run the installer.

### Install PostgreSQL

**macOS**:
```bash
brew install postgresql
brew services start postgresql
```

**Ubuntu/Debian**:
```bash
sudo apt-get install postgresql postgresql-contrib
sudo service postgresql start
```

**Windows**:
Download from https://www.postgresql.org/download/windows/ and run the installer.

---

## Installation

### 1. Initialize PostgreSQL Database

Create a new PostgreSQL database for the project:

```bash
# Connect to PostgreSQL as default user
psql -U postgres

# Inside psql shell:
CREATE DATABASE agentic_ui;
CREATE USER agentic_user WITH PASSWORD 'your_secure_password';
ALTER ROLE agentic_user SET client_encoding TO 'utf8';
ALTER ROLE agentic_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE agentic_user SET default_transaction_deferrable TO on;
ALTER ROLE agentic_user SET default_timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE agentic_ui TO agentic_user;
\q
```

### 2. Configure Environment

Copy `.env.example` to `.env` and update with your database credentials:

```bash
cd studio-server
cp .env.example .env
```

Edit `.env`:
```env
# Database
DATABASE_URL=postgresql://agentic_user:your_secure_password@localhost:5432/agentic_ui
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=20
DATABASE_IDLE_TIMEOUT=30000

# Server
NODE_ENV=development
PORT=3001
HOST=localhost

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:3001

# Frontend
SERVE_FRONTEND=true
```

### 3. Install Dependencies

```bash
cd studio-server
npm install
```

### 4. Initialize Database Schema

```bash
npm run db:init
```

This runs the SQL schema from `src/database/schema.sql` which creates all tables.

### 5. Seed Sample Data (Optional)

```bash
npm run db:seed
```

This populates the database with sample users, workspaces, tools, and agents.

### 6. Build TypeScript

```bash
npm run build
```

---

## Development

### Start Development Server

```bash
npm run dev
```

The server will start at `http://localhost:3001` with hot-reload enabled.

### View Server Logs

Development logs are printed to console and saved to `logs/` directory:
- `logs/debug-*.log` - Debug level messages
- `logs/info-*.log` - Info level messages
- `logs/warn-*.log` - Warnings
- `logs/error-*.log` - Errors

### Database Management

#### Check Database Status

```bash
psql -U agentic_user -d agentic_ui -c "\dt"
```

#### Reset Database

```bash
psql -U postgres -d agentic_ui -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
npm run db:init
```

#### Run Migrations

```bash
npm run db:migrate
```

---

## Production Deployment

### Build for Production

```bash
npm run build
npm start
```

### Using Docker

```bash
docker build -t agentic-ui-studio-server .
docker run -p 3001:3001 \
  -e DATABASE_URL=postgresql://user:pass@postgres:5432/agentic_ui \
  -e NODE_ENV=production \
  agentic-ui-studio-server
```

### Using PM2

```bash
npm install -g pm2

# Start
pm2 start dist/index.js --name "studio-server"

# Monitor
pm2 monit

# Logs
pm2 logs studio-server

# Restart on reboot
pm2 startup
pm2 save
```

---

## API Documentation

### Health Check

```bash
curl http://localhost:3001/api/health
```

Response:
```json
{ "status": "ok", "timestamp": "2025-11-27T..." }
```

### Tools

#### List Tools
```bash
curl http://localhost:3001/api/tools
```

#### Get Tool
```bash
curl http://localhost:3001/api/tools/1
```

#### Create Tool
```bash
curl -X POST http://localhost:3001/api/tools \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Tool",
    "slug": "my-tool",
    "description": "A tool",
    "category": "api"
  }'
```

#### Update Tool
```bash
curl -X PUT http://localhost:3001/api/tools/1 \
  -H "Content-Type: application/json" \
  -d '{ "is_active": false }'
```

#### Delete Tool
```bash
curl -X DELETE http://localhost:3001/api/tools/1
```

### Agents

#### List Agents
```bash
curl http://localhost:3001/api/agents?workspace_id=<uuid>
```

#### Create Agent
```bash
curl -X POST http://localhost:3001/api/agents \
  -H "Content-Type: application/json" \
  -d '{
    "workspace_id": "<uuid>",
    "name": "My Agent",
    "slug": "my-agent",
    "model_provider": "openai",
    "model_name": "gpt-4"
  }'
```

### Executions

#### List Executions
```bash
curl http://localhost:3001/api/executions?status=pending
```

#### Create Execution
```bash
curl -X POST http://localhost:3001/api/executions \
  -H "Content-Type: application/json" \
  -d '{
    "tool_id": 1,
    "version_id": 1,
    "input_payload": { "query": "test" }
  }'
```

### MCP Server

#### List Tools via MCP
```bash
curl -X POST http://localhost:3001/api/mcp/tools/list
```

#### Execute Tool via MCP
```bash
curl -X POST http://localhost:3001/api/mcp/tools/execute \
  -H "Content-Type: application/json" \
  -d '{
    "tool_id": 1,
    "version_id": 1,
    "input": { "query": "test" }
  }'
```

---

## Troubleshooting

### Database Connection Error

**Error**: `connect ECONNREFUSED 127.0.0.1:5432`

**Solution**:
1. Ensure PostgreSQL is running: `pg_isready -h localhost`
2. Check `DATABASE_URL` in `.env`
3. Verify database exists: `psql -l`

### Port Already in Use

**Error**: `Error: listen EADDRINUSE :::3001`

**Solution**:
```bash
# Find process using port 3001
lsof -i :3001

# Kill the process
kill -9 <PID>

# Or use a different port
PORT=3002 npm run dev
```

### TypeScript Compilation Errors

**Solution**:
```bash
npm run type-check
npm run build
```

### Module Not Found

**Solution**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## Project Structure

```
studio-server/
├── src/
│   ├── config/
│   │   └── env.ts                 # Environment configuration
│   ├── database/
│   │   ├── connection.ts          # Database pool and queries
│   │   ├── init.ts                # Schema initialization
│   │   ├── seed.ts                # Sample data
│   │   ├── migrate.ts             # Migrations
│   │   └── schema.sql             # SQL schema
│   ├── middleware/
│   │   └── errorHandler.ts        # Error handling
│   ├── routes/
│   │   ├── index.ts               # Route aggregator
│   │   ├── tools.ts               # Tool endpoints
│   │   ├── agents.ts              # Agent endpoints
│   │   ├── executions.ts          # Execution endpoints
│   │   └── mcp.ts                 # MCP endpoints
│   ├── utils/
│   │   └── logger.ts              # Logging utility
│   └── index.ts                   # Server entry point
├── dist/                          # Compiled JavaScript
├── logs/                          # Log files
├── .env.example                   # Environment template
├── package.json                   # Dependencies
├── tsconfig.json                  # TypeScript config
├── README.md                      # Project README
├── setup.sh                       # Setup script
└── SETUP_GUIDE.md                 # This file
```

---

## Next Steps

1. **Start the server**: `npm run dev`
2. **Test API endpoints**: Use curl or Postman
3. **Build frontend**: `cd ../studio && npm run build`
4. **Deploy**: Follow production deployment guide

## Support

For issues or questions:
1. Check logs in `logs/` directory
2. Review error messages in console
3. Check database connection: `psql -U agentic_user -d agentic_ui -c "SELECT 1"`
4. Verify environment variables: `cat .env`
