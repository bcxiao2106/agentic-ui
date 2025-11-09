// OpenAI configuration
// This file will contain OpenAI API configuration

export const openaiConfig = {
  apiKey: process.env.OPENAI_API_KEY,
  model: process.env.OPENAI_MODEL || 'gpt-4',
  temperature: 0.7,
  maxTokens: 1000
};