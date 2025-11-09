import express from 'express';
import { agentsRoutes } from './agents.routes.js';
import { graphRoutes } from './graph.routes.js';
import { healthRoutes } from './health.routes.js';

export const setupRoutes = (app: express.Application) => {
  app.use('/api/agents', agentsRoutes);
  app.use('/api/graph', graphRoutes);
  app.use('/health', healthRoutes);
};