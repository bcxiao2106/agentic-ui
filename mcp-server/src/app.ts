import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import healthRoutes from './routes/health';
import toolRoutes from './routes/tools';
import { errorHandler } from './middleware/errorHandler';

export function createServer() {
  const app = express();
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(morgan('combined'));
  app.use('/health', healthRoutes);
  app.use('/api/tools', toolRoutes);
  app.use(errorHandler);
  return app;
}
