import { nanoid } from 'nanoid';

type Tool = { id: string; createdAt: string;[key: string]: any };
const store = new Map<string, Tool>();

export class ToolService {

  async registerTool(data: Record<string, any>): Promise<Tool> {
    const id = nanoid();
    const t: Tool = { id, createdAt: new Date().toISOString(), ...data };
    store.set(id, t);
    return t;
  }

  async listTools(): Promise<Tool[]> {
    return Array.from(store.values());
  }
  
  async getTool(id: string): Promise<Tool | null> {
    return store.get(id) || null;
  }
}

export const toolService = new ToolService();
