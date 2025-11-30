import swaggerJsdoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Studio Server API',
    version: '1.0.0',
    description: 'Comprehensive API for managing tools, versions, tags, and executions in the Agentic UI Studio platform',
    contact: {
      name: 'API Support',
      email: 'support@example.com',
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
  servers: [
    {
      url: 'http://localhost:3001',
      description: 'Development server',
    },
    {
      url: 'https://api.example.com',
      description: 'Production server',
    },
  ],
  tags: [
    {
      name: 'Tools',
      description: 'Tool management endpoints',
    },
    {
      name: 'Versions',
      description: 'Tool version management endpoints',
    },
    {
      name: 'Tags',
      description: 'Tag management and assignment endpoints',
    },
    {
      name: 'Executions',
      description: 'Tool execution tracking and statistics endpoints',
    },
    {
      name: 'Health',
      description: 'System health and status endpoints',
    },
  ],
  components: {
    schemas: {
      Tool: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            description: 'Tool ID',
            example: 1,
          },
          name: {
            type: 'string',
            description: 'Tool name',
            example: 'Data Analyzer',
          },
          slug: {
            type: 'string',
            description: 'URL-friendly identifier',
            example: 'data-analyzer',
          },
          description: {
            type: 'string',
            description: 'Tool description',
            example: 'Analyzes and processes data',
          },
          category: {
            type: 'string',
            enum: ['data', 'text', 'image', 'audio', 'video', 'utility', 'other'],
            description: 'Tool category',
            example: 'data',
          },
          icon_url: {
            type: 'string',
            nullable: true,
            description: 'Icon URL',
            example: 'https://example.com/icon.png',
          },
          is_active: {
            type: 'boolean',
            description: 'Active status',
            example: true,
          },
          metadata: {
            type: 'object',
            nullable: true,
            description: 'Additional metadata',
            example: { author: 'John Doe' },
          },
          created_at: {
            type: 'string',
            format: 'date-time',
            description: 'Creation timestamp',
          },
          updated_at: {
            type: 'string',
            format: 'date-time',
            description: 'Last update timestamp',
          },
          created_by: {
            type: 'integer',
            nullable: true,
            description: 'Creator user ID',
          },
          updated_by: {
            type: 'integer',
            nullable: true,
            description: 'Last updater user ID',
          },
        },
      },
      CreateToolDTO: {
        type: 'object',
        required: ['name', 'slug', 'category'],
        properties: {
          name: {
            type: 'string',
            description: 'Tool name',
            example: 'Data Analyzer',
          },
          slug: {
            type: 'string',
            description: 'URL-friendly identifier',
            example: 'data-analyzer',
          },
          description: {
            type: 'string',
            description: 'Tool description',
            example: 'Analyzes and processes data',
          },
          category: {
            type: 'string',
            enum: ['data', 'text', 'image', 'audio', 'video', 'utility', 'other'],
            description: 'Tool category',
            example: 'data',
          },
          icon_url: {
            type: 'string',
            nullable: true,
            description: 'Icon URL',
          },
          metadata: {
            type: 'object',
            nullable: true,
            description: 'Additional metadata',
          },
          created_by: {
            type: 'integer',
            nullable: true,
            description: 'Creator user ID',
          },
        },
      },
      UpdateToolDTO: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'Tool name',
          },
          description: {
            type: 'string',
            description: 'Tool description',
          },
          category: {
            type: 'string',
            enum: ['data', 'text', 'image', 'audio', 'video', 'utility', 'other'],
            description: 'Tool category',
          },
          icon_url: {
            type: 'string',
            nullable: true,
            description: 'Icon URL',
          },
          is_active: {
            type: 'boolean',
            description: 'Active status',
          },
          metadata: {
            type: 'object',
            nullable: true,
            description: 'Additional metadata',
          },
          updated_by: {
            type: 'integer',
            nullable: true,
            description: 'Updater user ID',
          },
        },
      },
      ToolVersion: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            description: 'Version ID',
            example: 1,
          },
          tool_id: {
            type: 'integer',
            description: 'Associated tool ID',
            example: 1,
          },
          version_number: {
            type: 'string',
            description: 'Semantic version number',
            example: '1.0.0',
          },
          handler_code: {
            type: 'string',
            description: 'Handler implementation code',
            example: 'function handler() { ... }',
          },
          handler_language: {
            type: 'string',
            enum: ['javascript', 'typescript', 'python'],
            description: 'Handler language',
            example: 'typescript',
          },
          input_schema: {
            type: 'object',
            description: 'JSON schema for inputs',
            example: { type: 'object', properties: {} },
          },
          output_schema: {
            type: 'object',
            description: 'JSON schema for outputs',
            example: { type: 'object', properties: {} },
          },
          is_active: {
            type: 'boolean',
            description: 'Active version flag',
            example: true,
          },
          changelog: {
            type: 'string',
            nullable: true,
            description: 'Version changelog',
            example: 'Added new features',
          },
          created_at: {
            type: 'string',
            format: 'date-time',
            description: 'Creation timestamp',
          },
          created_by: {
            type: 'integer',
            nullable: true,
            description: 'Creator user ID',
          },
        },
      },
      CreateToolVersionDTO: {
        type: 'object',
        required: ['tool_id', 'version_number', 'handler_code', 'handler_language', 'input_schema', 'output_schema'],
        properties: {
          tool_id: {
            type: 'integer',
            description: 'Associated tool ID',
            example: 1,
          },
          version_number: {
            type: 'string',
            description: 'Semantic version number',
            example: '1.0.0',
          },
          handler_code: {
            type: 'string',
            description: 'Handler implementation code',
          },
          handler_language: {
            type: 'string',
            enum: ['javascript', 'typescript', 'python'],
            description: 'Handler language',
          },
          input_schema: {
            type: 'object',
            description: 'JSON schema for inputs',
          },
          output_schema: {
            type: 'object',
            description: 'JSON schema for outputs',
          },
          changelog: {
            type: 'string',
            nullable: true,
            description: 'Version changelog',
          },
          created_by: {
            type: 'integer',
            nullable: true,
            description: 'Creator user ID',
          },
        },
      },
      ToolTag: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            description: 'Tag ID',
            example: 1,
          },
          name: {
            type: 'string',
            description: 'Tag name',
            example: 'Machine Learning',
          },
          slug: {
            type: 'string',
            description: 'URL-friendly identifier',
            example: 'machine-learning',
          },
          color: {
            type: 'string',
            description: 'Hex color code',
            example: '#3B82F6',
          },
          description: {
            type: 'string',
            nullable: true,
            description: 'Tag description',
          },
          created_at: {
            type: 'string',
            format: 'date-time',
            description: 'Creation timestamp',
          },
        },
      },
      CreateToolTagDTO: {
        type: 'object',
        required: ['name', 'slug', 'color'],
        properties: {
          name: {
            type: 'string',
            description: 'Tag name',
            example: 'Machine Learning',
          },
          slug: {
            type: 'string',
            description: 'URL-friendly identifier',
            example: 'machine-learning',
          },
          color: {
            type: 'string',
            description: 'Hex color code',
            example: '#3B82F6',
          },
          description: {
            type: 'string',
            nullable: true,
            description: 'Tag description',
          },
        },
      },
      ToolExecution: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            description: 'Execution ID',
            example: 1,
          },
          tool_id: {
            type: 'integer',
            description: 'Associated tool ID',
            example: 1,
          },
          version_id: {
            type: 'integer',
            description: 'Version used',
            example: 1,
          },
          execution_request_id: {
            type: 'string',
            description: 'Idempotency key',
            example: 'req_abc123',
          },
          status: {
            type: 'string',
            enum: ['pending', 'running', 'success', 'failed', 'cancelled'],
            description: 'Execution status',
            example: 'success',
          },
          input_data: {
            type: 'object',
            description: 'Input data provided',
            example: { query: 'test' },
          },
          output_data: {
            type: 'object',
            nullable: true,
            description: 'Output data returned',
            example: { result: 'success' },
          },
          error_message: {
            type: 'string',
            nullable: true,
            description: 'Error message if failed',
          },
          execution_time_ms: {
            type: 'integer',
            nullable: true,
            description: 'Execution duration in ms',
            example: 150,
          },
          started_at: {
            type: 'string',
            format: 'date-time',
            description: 'Start timestamp',
          },
          completed_at: {
            type: 'string',
            format: 'date-time',
            nullable: true,
            description: 'Completion timestamp',
          },
          executed_by: {
            type: 'integer',
            nullable: true,
            description: 'User who executed',
          },
        },
      },
      CreateToolExecutionDTO: {
        type: 'object',
        required: ['tool_id', 'version_id', 'input_data'],
        properties: {
          tool_id: {
            type: 'integer',
            description: 'Associated tool ID',
            example: 1,
          },
          version_id: {
            type: 'integer',
            description: 'Version to use',
            example: 1,
          },
          execution_request_id: {
            type: 'string',
            description: 'Idempotency key (optional)',
            example: 'req_abc123',
          },
          input_data: {
            type: 'object',
            description: 'Input data',
            example: { query: 'test' },
          },
          executed_by: {
            type: 'integer',
            nullable: true,
            description: 'User ID executing',
          },
        },
      },
      PaginatedResponse: {
        type: 'object',
        properties: {
          data: {
            type: 'array',
            items: {},
            description: 'Array of data items',
          },
          pagination: {
            type: 'object',
            properties: {
              page: {
                type: 'integer',
                description: 'Current page',
                example: 1,
              },
              limit: {
                type: 'integer',
                description: 'Items per page',
                example: 20,
              },
              total: {
                type: 'integer',
                description: 'Total items',
                example: 100,
              },
              totalPages: {
                type: 'integer',
                description: 'Total pages',
                example: 5,
              },
            },
          },
        },
      },
      Error: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false,
          },
          error: {
            type: 'string',
            description: 'Error message',
            example: 'Resource not found',
          },
        },
      },
    },
    responses: {
      NotFound: {
        description: 'Resource not found',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error',
            },
          },
        },
      },
      BadRequest: {
        description: 'Bad request - validation error',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error',
            },
          },
        },
      },
      InternalError: {
        description: 'Internal server error',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error',
            },
          },
        },
      },
    },
  },
};

const options: swaggerJsdoc.Options = {
  swaggerDefinition,
  // Path to the API routes files
  apis: [
    './src/api/routes/*.ts',
    './src/routes/*.ts',
  ],
};

export const swaggerSpec = swaggerJsdoc(options);
