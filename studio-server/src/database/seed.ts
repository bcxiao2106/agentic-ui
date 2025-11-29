import { query } from './connection';
import { logger } from '@/utils/logger';

export async function seedDatabase(): Promise<void> {
  logger.info('Seeding database with sample data...');

  try {
    // Create sample user
    const user = await query(
      `INSERT INTO users (email, username, full_name, password_hash)
       VALUES ('admin@agentic-ui.com', 'admin', 'Admin User', '$2b$10$dummyhash')
       ON CONFLICT (email) DO NOTHING
       RETURNING user_id`
    );

    const userId = user.length > 0 ? (user[0] as any).user_id : null;

    if (!userId) {
      logger.info('Sample user already exists');
      return;
    }

    // Create sample workspace
    const workspace = await query(
      `INSERT INTO workspaces (name, slug, owner_id, description)
       VALUES ('Default Workspace', 'default', $1, 'Default workspace for development')
       ON CONFLICT (slug) DO NOTHING
       RETURNING workspace_id`,
      [userId]
    );

    const workspaceId = workspace.length > 0 ? (workspace[0] as any).workspace_id : null;

    if (!workspaceId) {
      logger.info('Sample workspace already exists');
      return;
    }

    // Create sample tags
    const tags = [
      { name: 'API', slug: 'api', color: '#3b82f6' },
      { name: 'Database', slug: 'database', color: '#10b981' },
      { name: 'Computation', slug: 'computation', color: '#f59e0b' },
      { name: 'Read-Only', slug: 'read-only', color: '#6366f1' },
    ];

    for (const tag of tags) {
      await query(
        `INSERT INTO tool_tags (name, slug, color)
         VALUES ($1, $2, $3)
         ON CONFLICT (slug) DO NOTHING`,
        [tag.name, tag.slug, tag.color]
      );
    }

    // Create sample tools
    const tools = [
      {
        name: 'Web Search',
        slug: 'web-search',
        description: 'Search the web for information',
        category: 'api',
      },
      {
        name: 'Email Sender',
        slug: 'email-sender',
        description: 'Send emails',
        category: 'integration',
      },
      {
        name: 'Calculator',
        slug: 'calculator',
        description: 'Perform mathematical calculations',
        category: 'computation',
      },
    ];

    for (const tool of tools) {
      await query(
        `INSERT INTO tools (name, slug, description, category, created_by)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (slug) DO NOTHING`,
        [tool.name, tool.slug, tool.description, tool.category, userId]
      );
    }

    // Create sample agent
    await query(
      `INSERT INTO agents (workspace_id, name, slug, description, system_prompt, model_provider, model_name)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (workspace_id, slug) DO NOTHING`,
      [
        workspaceId,
        'Default Agent',
        'default-agent',
        'A helpful assistant agent',
        'You are a helpful assistant that can use tools to help users.',
        'openai',
        'gpt-4',
      ]
    );

    logger.info('Database seeded successfully');
  } catch (error) {
    logger.error('Error seeding database', error as Error);
    throw error;
  }
}

// Run if executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('Seeding complete');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}
