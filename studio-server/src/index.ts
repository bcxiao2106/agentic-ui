import express, { Express } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import 'express-async-errors';
import path from 'path';

import { env, validateEnv } from '@/config/env';
import { initializePool, closePool } from '@/database/connection';
import { initializeDatabase, checkDatabase } from '@/database/init';
import { logger } from '@/utils/logger';
import { errorHandler } from '@/middleware/errorHandler';

// Routes
import apiRoutes from '@/routes';

async function startServer(): Promise<void> {
  try {
    // Validate environment
    validateEnv();
    logger.info('Environment validated');

    // Initialize database
    initializePool();
    const dbHealthy = await checkDatabase();
    if (!dbHealthy) {
      throw new Error('Failed to connect to database');
    }
    logger.info('Database connection established');

    // Initialize schema
    await initializeDatabase();
    logger.info('Database schema initialized');

    // Create Express app
    const app: Express = express();

    // Middleware
    app.use(cors({
      origin: env.corsOrigin,
      credentials: true,
    }));
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ limit: '10mb', extended: true }));

    // Logging
    app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"'));

    // API Routes
    app.use('/api', apiRoutes);

    // Serve frontend if enabled
    if (env.serveFrontend) {
      const frontendPath = path.resolve(__dirname, '..', env.frontendPath);
      logger.info('Serving frontend from', { path: frontendPath });
      app.use(express.static(frontendPath));

      // SPA fallback
      app.get('*', (req, res) => {
        res.sendFile(path.join(frontendPath, 'index.html'));
      });
    }

    // Error handling
    app.use(errorHandler);

    // Start server
    const server = app.listen(env.port, env.host, () => {
      logger.info(`🚀 Server running at http://${env.host}:${env.port}`);
      if (env.serveFrontend) {
        logger.info(`📊 Studio available at http://${env.host}:${env.port}`);
      }
      logger.info(`📡 API available at http://${env.host}:${env.port}/api`);
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      logger.info('SIGTERM signal received: closing HTTP server');
      server.close(async () => {
        await closePool();
        logger.info('HTTP server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', async () => {
      logger.info('SIGINT signal received: closing HTTP server');
      server.close(async () => {
        await closePool();
        logger.info('HTTP server closed');
        process.exit(0);
      });
    });
  } catch (error) {
    logger.error('Failed to start server', error instanceof Error ? error : new Error(String(error)));
    process.exit(1);
  }
}

startServer();
