import { toolService } from '../services/toolService';
import { z } from 'zod';

const schema = z.object({
  name: z.string(),
  kind: z.enum(['input-text','input-date','input-checkbox','custom']).default('custom'),
  description: z.string().optional(),
  schema: z.any().optional()
});

export const registerTool = async (req,res)=> {
  const parsed = schema.parse(req.body);
  const t = await toolService.registerTool(parsed);
  res.status(201).json(t);
};

export const listTools = async (_req,res)=>{
  res.json({data: await toolService.listTools()});
};

export const getTool = async (req,res)=>{
  const t = await toolService.getTool(req.params.id);
  if(!t) return res.status(404).json({error:'not found'});
  res.json(t);
};
