import { initializePool, closePool } from './connection';
import { seedDatabase } from './seed';
import { logger } from '@/utils/logger';

async function runMigration(): Promise<void> {
  logger.info('Running database migration...');

  try {
    initializePool();

    // Seed sample data
    await seedDatabase();

    logger.info('Migration complete');
  } catch (error) {
    logger.error('Migration failed', error as Error);
    throw error;
  } finally {
    await closePool();
  }
}

runMigration()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
