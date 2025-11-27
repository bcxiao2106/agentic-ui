import { Router } from 'express';
import { ok } from '../controllers/healthController';
const r = Router(); r.get('/', ok);
export default r;