import dotenv from 'dotenv';

dotenv.config();

export const env = {
  // Server
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3001', 10),
  host: process.env.HOST || 'localhost',

  // Database
  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:123456@localhost:5432/mcp_tools',
  databasePoolMin: parseInt(process.env.DATABASE_POOL_MIN || '2', 10),
  databasePoolMax: parseInt(process.env.DATABASE_POOL_MAX || '20', 10),
  databaseIdleTimeout: parseInt(process.env.DATABASE_IDLE_TIMEOUT || '30000', 10),

  // Logging
  logLevel: process.env.LOG_LEVEL || 'debug',
  logDir: process.env.LOG_DIR || './logs',

  // CORS
  corsOrigin: (process.env.CORS_ORIGIN || 'http://localhost:3000,http://localhost:3001').split(','),

  // MCP
  mcpEnabled: process.env.MCP_ENABLED === 'true',
  mcpPort: parseInt(process.env.MCP_PORT || '3001', 10),
  mcpPath: process.env.MCP_PATH || '/mcp',

  // Frontend
  frontendPath: process.env.FRONTEND_PATH || '../studio/out',
  serveFrontend: process.env.SERVE_FRONTEND !== 'false',

  // Validation
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
};

export function validateEnv() {
  const required = ['DATABASE_URL'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}
