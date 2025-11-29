import fs from 'fs';
import path from 'path';
import { query } from './connection';
import { logger } from '@/utils/logger';

export async function initializeDatabase(): Promise<void> {
  logger.info('Initializing database schema...');

  const schemaPath = path.join(__dirname, 'schema.sql');
  
  if (!fs.existsSync(schemaPath)) {
    logger.warn('Schema file not found at', schemaPath);
    return;
  }

  const schema = fs.readFileSync(schemaPath, 'utf-8');
  const statements = schema.split(';').filter(stmt => stmt.trim().length > 0);

  for (const statement of statements) {
    try {
      await query(statement);
    } catch (error: any) {
      // Ignore "already exists" errors
      if (!error.message.includes('already exists')) {
        logger.error('Error executing statement', { statement, error });
        throw error;
      }
    }
  }

  logger.info('Database schema initialized successfully');
}

export async function checkDatabase(): Promise<boolean> {
  try {
    await query('SELECT NOW()');
    return true;
  } catch (error) {
    logger.error('Database connection check failed', error);
    return false;
  }
}
