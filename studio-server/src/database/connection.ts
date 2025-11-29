import { Pool, PoolClient } from 'pg';
import { env } from '@/config/env';
import { logger } from '@/utils/logger';

let pool: Pool | null = null;

export function initializePool(): Pool {
  if (pool) {
    return pool;
  }

  pool = new Pool({
    connectionString: env.databaseUrl,
    min: env.databasePoolMin,
    max: env.databasePoolMax,
    idleTimeoutMillis: env.databaseIdleTimeout,
  });

  pool.on('error', (err) => {
    logger.error('Unexpected error on idle client', err);
    process.exit(-1);
  });

  logger.info('Database pool initialized', {
    min: env.databasePoolMin,
    max: env.databasePoolMax,
  });

  return pool;
}

export function getPool(): Pool {
  if (!pool) {
    throw new Error('Database pool not initialized. Call initializePool() first.');
  }
  return pool;
}

export async function query<T = any>(
  text: string,
  values?: any[]
): Promise<T[]> {
  const client = await getPool().connect();
  try {
    const result = await client.query(text, values);
    return result.rows;
  } finally {
    client.release();
  }
}

export async function queryOne<T = any>(
  text: string,
  values?: any[]
): Promise<T | null> {
  const results = await query<T>(text, values);
  return results[0] || null;
}

export async function transaction<T>(
  callback: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await getPool().connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
    logger.info('Database pool closed');
  }
}
