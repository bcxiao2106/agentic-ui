// Unified LLM service client
// Implements a small client compatible with the example curl request:
// POST http://localhost:1234/v1/chat/completions
// body: { model, messages, temperature, max_tokens, stream }

import http from 'http';
import https from 'https';
import { URL } from 'url';
import { llmConfig } from '../config/llm.config.js';

export type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export type ChatCompletionRequest = {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
  apiKey?: string;
  // allow extra fields
  [k: string]: any;
};

export class LLMService {
  constructor(public baseUrl: string = llmConfig.baseUrl) {}

  async chatCompletion(req: ChatCompletionRequest): Promise<any> {
    const url = new URL('/v1/chat/completions', this.baseUrl);
    const payload = JSON.stringify({
      model: req.model ?? llmConfig.defaultModel,
      messages: req.messages,
      temperature: req.temperature ?? llmConfig.defaultTemperature ?? 0.7,
      max_tokens: req.max_tokens ?? llmConfig.defaultMaxTokens ?? -1,
      stream: req.stream ?? llmConfig.defaultStream ?? false,
      ...Object.fromEntries(Object.entries(req).filter(([k]) => !['model', 'messages', 'temperature', 'max_tokens', 'stream'].includes(k)))
    });

    const isHttps = url.protocol === 'https:';
    const options: any = {
      method: 'POST',
      hostname: url.hostname,
      port: url.port || (isHttps ? 443 : 80),
      path: url.pathname + url.search,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
      },
    };
    // Attach API key if provided in request or config
    const apiKey = req.apiKey ?? llmConfig.apiKey;
    if (apiKey) {
      // Prefer Authorization: Bearer <key>
      options.headers = { ...options.headers, Authorization: `Bearer ${apiKey}` };
    }

    return await new Promise((resolve, reject) => {
      const lib = isHttps ? https : http;
      const reqObj = lib.request(options, (res) => {
        const chunks: Buffer[] = [];
        res.on('data', (chunk: Buffer) => chunks.push(chunk));
        res.on('end', () => {
          const raw = Buffer.concat(chunks).toString('utf8');
          const contentType = String(res.headers['content-type'] || '');
          try {
            if (contentType.includes('application/json')) {
              const json = JSON.parse(raw);
              resolve(json);
            } else {
              resolve(raw);
            }
          } catch (err) {
            // return raw if JSON parsing fails
            resolve(raw);
          }
        });
      });

      reqObj.on('error', (err: Error) => reject(err));
      reqObj.write(payload);
      reqObj.end();
    });
  }
}
