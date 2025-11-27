import { Router } from 'express';
import { registerTool, listTools, getTool } from '../controllers/toolController';

const r = Router();
r.post('/', registerTool);
r.get('/', listTools);
r.get('/:id', getTool);
export default r;
