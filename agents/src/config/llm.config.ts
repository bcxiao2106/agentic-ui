export type LLMConfig = {
  baseUrl: string;
  defaultModel?: string;
  defaultTemperature?: number;
  defaultMaxTokens?: number;
  defaultStream?: boolean;
  apiKey?: string | undefined;
};

export const llmConfig: LLMConfig = {
  baseUrl: process.env.LLM_BASE_URL ?? 'http://localhost:1234',
  defaultModel: process.env.LLM_DEFAULT_MODEL ?? 'openai/gpt-oss-20b',
  defaultTemperature: process.env.LLM_DEFAULT_TEMPERATURE ? Number(process.env.LLM_DEFAULT_TEMPERATURE) : 0.7,
  defaultMaxTokens: process.env.LLM_DEFAULT_MAX_TOKENS ? Number(process.env.LLM_DEFAULT_MAX_TOKENS) : -1,
  defaultStream: process.env.LLM_DEFAULT_STREAM ? process.env.LLM_DEFAULT_STREAM === 'true' : false,
  apiKey: process.env.LLM_API_KEY ?? undefined,
};

export default llmConfig;
