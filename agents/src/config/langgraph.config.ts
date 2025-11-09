// LangGraph configuration
// This file will contain LangGraph-specific configuration

export const langgraphConfig = {
  apiKey: process.env.LANGGRAPH_API_KEY,
  endpoint: process.env.LANGGRAPH_ENDPOINT || 'https://api.langgraph.com',
  timeout: 30000,
  retries: 3
};