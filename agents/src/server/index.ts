import express from 'express';
import dotenv from 'dotenv';
import { setupRoutes } from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.js';

dotenv.config();

export const startServer = () => {
  const app = express();
  app.use(express.json());
  setupRoutes(app);
  app.use(errorHandler);

  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
};
