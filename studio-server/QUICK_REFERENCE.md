# Quick Reference: Studio Server Commands

## 🚀 Quick Start (5 minutes)

```bash
# 1. Setup database
psql -U postgres -c "CREATE DATABASE agentic_ui;"

# 2. Configure server
cd studio-server
cp .env.example .env
# Edit .env with your database URL

# 3. Install & init
npm install
npm run db:init

# 4. Run!
npm run dev
```

Server running at: **http://localhost:3001**

---

## 📋 Essential Commands

### Development
```bash
npm run dev               # Start with hot reload
npm run build            # Compile TypeScript
npm start                # Run production build
npm run type-check       # Check for type errors
npm run lint             # Run ESLint
```

### Database
```bash
npm run db:init          # Create tables
npm run db:seed          # Add sample data
npm run db:migrate       # Run migrations
```

### Verification
```bash
curl http://localhost:3001/api/health    # Health check
curl http://localhost:3001/api/tools     # List tools
```

---

## 🐳 Docker Quick Start

```bash
# One command setup
docker-compose up -d

# Check logs
docker-compose logs -f studio-server

# Stop all
docker-compose down
```

---

## 📡 API Endpoints

### Tools
```
GET    /api/tools                 List tools
POST   /api/tools                 Create tool
GET    /api/tools/:id             Get tool
PUT    /api/tools/:id             Update tool
DELETE /api/tools/:id             Delete tool
GET    /api/tools/:id/versions    Get versions
```

### Agents
```
GET    /api/agents                List agents
POST   /api/agents                Create agent
GET    /api/agents/:id            Get agent
PUT    /api/agents/:id            Update agent
DELETE /api/agents/:id            Delete agent
GET    /api/agents/:id/tools      Get agent tools
POST   /api/agents/:id/tools/:tid Assign tool
```

### Executions
```
GET    /api/executions            List executions
POST   /api/executions            Create execution
GET    /api/executions/:id        Get execution
PUT    /api/executions/:id        Update execution
```

### MCP Server
```
POST   /api/mcp/tools/list        List tools (MCP)
POST   /api/mcp/tools/execute     Execute tool (MCP)
POST   /api/mcp/agents/list       List agents (MCP)
GET    /api/mcp/agents/:id        Get agent (MCP)
```

### Health
```
GET    /api/health                Health check
```

---

## 🔧 Configuration

### .env Variables

```env
# Database (required)
DATABASE_URL=postgresql://user:pass@localhost:5432/agentic_ui

# Server
NODE_ENV=development|production
PORT=3001
HOST=localhost

# Logging
LOG_LEVEL=debug|info|warn|error
LOG_DIR=./logs

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:3001

# Frontend
SERVE_FRONTEND=true|false
FRONTEND_PATH=../studio/out
```

---

## 🐛 Troubleshooting

### Database connection error
```bash
# Check PostgreSQL is running
pg_isready -h localhost

# Verify database exists
psql -l

# Check .env DATABASE_URL
cat .env | grep DATABASE_URL
```

### Port already in use
```bash
# Find process on port 3001
lsof -i :3001

# Kill it
kill -9 <PID>

# Or use different port
PORT=3002 npm run dev
```

### Module not found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Build fails
```bash
# Check TypeScript errors
npm run type-check

# Rebuild
npm run build

# Check for circular imports
npm run lint
```

---

## 📊 Database Verification

```bash
# Connect to database
psql -U agentic_user -d agentic_ui

# List tables
\dt

# Check table structure
\d tools

# Count rows
SELECT COUNT(*) FROM tools;

# Quit
\q
```

---

## 📝 API Examples

### Create a Tool
```bash
curl -X POST http://localhost:3001/api/tools \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Tool",
    "slug": "my-tool",
    "description": "Tool description",
    "category": "api"
  }'
```

### List Tools
```bash
curl "http://localhost:3001/api/tools?limit=10&offset=0"
```

### Create Agent
```bash
curl -X POST http://localhost:3001/api/agents \
  -H "Content-Type: application/json" \
  -d '{
    "workspace_id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "My Agent",
    "slug": "my-agent",
    "model_provider": "openai",
    "model_name": "gpt-4"
  }'
```

### Execute Tool (MCP)
```bash
curl -X POST http://localhost:3001/api/mcp/tools/execute \
  -H "Content-Type: application/json" \
  -d '{
    "tool_id": 1,
    "version_id": 1,
    "input": {"param": "value"}
  }'
```

---

## 📂 Project Structure

```
studio-server/
├── src/
│   ├── config/env.ts           # Environment config
│   ├── database/               # DB layer
│   │   ├── connection.ts       # Connection pool
│   │   ├── init.ts             # Schema init
│   │   ├── seed.ts             # Sample data
│   │   └── schema.sql          # SQL schema
│   ├── middleware/             # Express middleware
│   ├── routes/                 # API routes
│   ├── utils/logger.ts         # Logging
│   └── index.ts                # Server entry
├── dist/                       # Compiled JS
├── logs/                       # Log files
├── .env                        # Config (not in git)
├── .env.example                # Config template
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript config
├── Dockerfile                  # Docker image
├── docker-compose.yml          # Docker compose
├── README.md                   # Project readme
├── SETUP_GUIDE.md              # Setup instructions
├── INTEGRATION_GUIDE.md        # Frontend integration
└── IMPLEMENTATION_SUMMARY.md   # What was built
```

---

## 🚢 Deployment Checklist

- [ ] Build frontend: `cd studio && npm run build`
- [ ] Update `.env` with production database URL
- [ ] Build backend: `npm run build`
- [ ] Initialize database: `npm run db:init`
- [ ] Start server: `npm start`
- [ ] Test health endpoint: `curl http://localhost:3001/api/health`
- [ ] Test APIs with Postman or curl
- [ ] Enable HTTPS/SSL
- [ ] Set up logging and monitoring
- [ ] Configure backups
- [ ] Load test with production data

---

## 📞 Support Resources

- **Setup**: See `SETUP_GUIDE.md`
- **Integration**: See `INTEGRATION_GUIDE.md`
- **Implementation**: See `IMPLEMENTATION_SUMMARY.md`
- **Database**: See `../DB_DESIGN.md`

---

## ⚡ Performance Tips

1. **Connection pooling**: Configured (2-20 connections)
2. **Database indexes**: All major columns indexed
3. **Caching**: Add Redis for frequent queries
4. **Frontend**: Enable CDN for static assets
5. **Monitoring**: Check logs for slow queries

---

## 🔒 Security Checklist

- [ ] Use environment variables for secrets
- [ ] Enable HTTPS in production
- [ ] Implement authentication (JWT)
- [ ] Add rate limiting
- [ ] Validate all inputs
- [ ] Use prepared statements (done by default)
- [ ] Enable CORS whitelist
- [ ] Add request logging
- [ ] Monitor error logs
- [ ] Regular backups

---

Last Updated: November 27, 2025
Version: 1.0.0
