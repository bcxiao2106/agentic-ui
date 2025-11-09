# LangGraph Multi-Agent Application

A Node.js TypeScript application that implements a multi-agent system using LangChain and LangGraph.

## Features

- Multi-agent orchestration with LangGraph
- RESTful API for agent and graph management
- Modular architecture with separate agents for different tasks
- Configurable LLM providers (OpenAI, Anthropic, etc.)
- Comprehensive logging and error handling

## Project Structure

```
langgraph-multi-agent-app/
│
├── package.json
├── tsconfig.json
├── .env
├── .gitignore
│
├── src/
│   ├── server/
│   │   ├── index.ts                   # Express server entry
│   │   ├── routes/
│   │   │   ├── index.ts               # Base route loader
│   │   │   ├── agents.routes.ts       # REST endpoints for agents
│   │   │   ├── graph.routes.ts        # Endpoints to trigger LangGraph flows
│   │   │   └── health.routes.ts       # Health check
│   │   └── middlewares/
│   │       ├── errorHandler.ts
│   │       └── logger.ts
│   │
│   ├── langgraph/
│   │   ├── index.ts                   # Graph orchestrator entry
│   │   ├── graphs/
│   │   │   ├── main.graph.ts          # Root graph combining agents
│   │   │   └── subgraph.customer.ts   # Example subgraph
│   │   ├── nodes/
│   │   │   ├── memory.node.ts
│   │   │   ├── decision.node.ts
│   │   │   └── router.node.ts
│   │   ├── agents/
│   │   │   ├── agent.sales.ts         # Agent for sales logic
│   │   │   ├── agent.support.ts       # Agent for support tasks
│   │   │   ├── agent.planner.ts       # Coordination agent
│   │   │   └── agent.research.ts
│   │   ├── tools/
│   │   │   ├── webSearch.tool.ts
│   │   │   ├── database.tool.ts
│   │   │   └── api.tool.ts
│   │   └── utils/
│   │       ├── graphBuilder.ts
│   │       └── llmClient.ts           # e.g. OpenAI, Anthropic client wrapper
│   │
│   ├── config/
│   │   ├── app.config.ts
│   │   ├── openai.config.ts
│   │   └── langgraph.config.ts
│   │
│   ├── services/
│   │   ├── agentService.ts            # Manage agent registry
│   │   ├── graphService.ts            # Build and execute graphs
│   │   └── llmService.ts              # Unified LLM client
│   │
│   ├── utils/
│   │   ├── logger.ts
│   │   └── env.ts
│   │
│   └── index.ts                       # App entry point
│
├── test/
│   ├── agents/
│   ├── graphs/
│   ├── integration/
│   └── utils/
│
└── README.md
```

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env` and configure your environment variables
4. Build the project:
   ```bash
   npm run build
   ```

## Usage

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

## API Endpoints

- `GET /health` - Health check
- `GET /api/agents` - List all agents
- `POST /api/agents` - Create new agent
- `GET /api/agents/:id` - Get agent by ID
- `POST /api/graph/execute` - Execute a graph flow
- `GET /api/graph/status/:id` - Get graph execution status

## Configuration

Configure the application using environment variables in the `.env` file:

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `OPENAI_API_KEY` - OpenAI API key
- `OPENAI_MODEL` - OpenAI model (default: gpt-4)
- `LANGGRAPH_API_KEY` - LangGraph API key
- `LANGGRAPH_ENDPOINT` - LangGraph endpoint
- `LOG_LEVEL` - Logging level (default: info)

## Testing

```bash
npm test
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

ISC