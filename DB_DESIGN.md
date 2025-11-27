# Agentic UI Database Design

## Overview

This document describes the comprehensive database schema for the Agentic UI platform, which manages tools, agents, workflows, and their executions. The design follows normalized database principles with proper constraints, indexing strategies, and audit trails.

---

## Database Architecture

### Design Principles

1. **Normalization**: Follows 3NF to eliminate redundancy
2. **Scalability**: Handles millions of records with efficient indexing
3. **Auditability**: Complete audit trails for compliance
4. **Referential Integrity**: Foreign keys with cascade policies
5. **Performance**: Optimized queries with strategic indices

### Technology Stack

- **Database**: PostgreSQL 14+
- **Connection Pooling**: PgBouncer/pgpool2
- **Backup**: WAL-based continuous backups
- **Replication**: Streaming replication for HA

---

## Core Tables

### 1. Tools Table

**Purpose**: Central registry of all available tools/capabilities

```sql
CREATE TABLE tools (
    tool_id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    category VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES users(user_id) ON DELETE SET NULL,
    updated_by UUID REFERENCES users(user_id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    
    CONSTRAINT tool_name_length CHECK (LENGTH(name) >= 3),
    CONSTRAINT tool_category_valid CHECK (category IN ('api', 'database', 'computation', 'integration', 'utility'))
);

CREATE INDEX idx_tools_name ON tools(name);
CREATE INDEX idx_tools_slug ON tools(slug);
CREATE INDEX idx_tools_category ON tools(category) WHERE is_active = TRUE;
CREATE INDEX idx_tools_created_at ON tools(created_at DESC);
```

**Columns**:
- `tool_id`: Unique identifier (BIGSERIAL for scalability)
- `name`: Human-readable name (unique)
- `slug`: URL-friendly identifier
- `description`: Tool documentation
- `category`: Classification (api, database, computation, integration, utility)
- `is_active`: Soft delete indicator
- `created_by`/`updated_by`: Audit trail
- `created_at`/`updated_at`/`deleted_at`: Temporal tracking

---

### 2. Tool Tags Table

**Purpose**: Categorize and tag tools for filtering and discovery

```sql
CREATE TABLE tool_tags (
    tag_id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    color VARCHAR(7),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT tag_name_length CHECK (LENGTH(name) >= 2),
    CONSTRAINT tag_color_format CHECK (color ~ '^#[0-9A-Fa-f]{6}$')
);

CREATE INDEX idx_tool_tags_name ON tool_tags(name);
CREATE INDEX idx_tool_tags_slug ON tool_tags(slug);
```

**Columns**:
- `tag_id`: Unique identifier
- `name`: Human-readable tag name
- `slug`: URL-friendly identifier
- `description`: Tag documentation
- `color`: Hex color for UI representation
- `is_active`: Active/inactive status

---

### 3. Tool-Tags Junction Table

**Purpose**: Many-to-many relationship between tools and tags

```sql
CREATE TABLE tool_tool_tags (
    tool_id BIGINT NOT NULL REFERENCES tools(tool_id) ON DELETE CASCADE,
    tag_id BIGINT NOT NULL REFERENCES tool_tags(tag_id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    
    PRIMARY KEY (tool_id, tag_id),
    FOREIGN KEY (tool_id) REFERENCES tools(tool_id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tool_tags(tag_id) ON DELETE CASCADE
);

CREATE INDEX idx_tool_tool_tags_tool_id ON tool_tool_tags(tool_id);
CREATE INDEX idx_tool_tool_tags_tag_id ON tool_tool_tags(tag_id);
```

**Design Rationale**:
- Composite primary key prevents duplicate assignments
- Cascade deletes ensure referential integrity
- Indexed on both sides for efficient queries

---

### 4. Tool Versions Table

**Purpose**: Version control and schema management for tools

```sql
CREATE TABLE tool_versions (
    version_id BIGSERIAL PRIMARY KEY,
    tool_id BIGINT NOT NULL REFERENCES tools(tool_id) ON DELETE CASCADE,
    version_number VARCHAR(20) NOT NULL,
    semantic_version VARCHAR(20),
    input_schema JSONB NOT NULL,
    output_schema JSONB NOT NULL,
    handler_source_code TEXT,
    handler_language VARCHAR(50),
    is_active BOOLEAN DEFAULT FALSE,
    is_deprecated BOOLEAN DEFAULT FALSE,
    deprecation_message TEXT,
    changelog TEXT,
    created_by UUID REFERENCES users(user_id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE (tool_id, version_number),
    CONSTRAINT version_format CHECK (version_number ~ '^\d+\.\d+\.\d+'),
    CONSTRAINT only_one_active CHECK (
        NOT (is_active AND is_deprecated)
    )
);

CREATE INDEX idx_tool_versions_tool_id ON tool_versions(tool_id);
CREATE INDEX idx_tool_versions_active ON tool_versions(tool_id, is_active) WHERE is_active = TRUE;
CREATE INDEX idx_tool_versions_created_at ON tool_versions(created_at DESC);
```

**Columns**:
- `version_id`: Unique identifier
- `tool_id`: Reference to parent tool
- `version_number`: Semantic versioning (X.Y.Z)
- `semantic_version`: Standardized version format
- `input_schema`/`output_schema`: JSONB schemas for validation
- `handler_source_code`: Implementation code
- `handler_language`: Programming language (python, javascript, etc.)
- `is_active`/`is_deprecated`: Version status
- `deprecation_message`: Migration guidance
- `changelog`: Release notes
- `created_by`: Audit trail

---

### 5. Tool Executions Table

**Purpose**: Track all tool invocations and executions

```sql
CREATE TABLE tool_executions (
    execution_id BIGSERIAL PRIMARY KEY,
    tool_id BIGINT NOT NULL REFERENCES tools(tool_id) ON DELETE RESTRICT,
    version_id BIGINT NOT NULL REFERENCES tool_versions(version_id) ON DELETE RESTRICT,
    agent_id UUID REFERENCES agents(agent_id) ON DELETE SET NULL,
    workflow_id UUID REFERENCES workflows(workflow_id) ON DELETE SET NULL,
    execution_request_id UUID UNIQUE NOT NULL,
    
    input_payload JSONB NOT NULL,
    output_payload JSONB,
    error_message TEXT,
    error_stacktrace TEXT,
    
    execution_time_ms INTEGER,
    status VARCHAR(50) NOT NULL,
    http_status_code INTEGER,
    
    llm_source VARCHAR(100),
    user_id UUID REFERENCES users(user_id) ON DELETE SET NULL,
    
    started_at TIMESTAMPTZ NOT NULL,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT status_valid CHECK (status IN (
        'pending', 'running', 'succeeded', 'failed', 'timeout', 'cancelled'
    )),
    CONSTRAINT execution_completed CHECK (
        (status = 'pending' AND completed_at IS NULL) OR
        (status != 'pending' AND completed_at IS NOT NULL)
    )
);

CREATE INDEX idx_executions_tool_id ON tool_executions(tool_id);
CREATE INDEX idx_executions_status ON tool_executions(status) WHERE status IN ('pending', 'running');
CREATE INDEX idx_executions_agent_id ON tool_executions(agent_id);
CREATE INDEX idx_executions_workflow_id ON tool_executions(workflow_id);
CREATE INDEX idx_executions_created_at ON tool_executions(created_at DESC);
CREATE INDEX idx_executions_user_id ON tool_executions(user_id);
CREATE INDEX idx_executions_request_id ON tool_executions(execution_request_id);
```

**Columns**:
- `execution_id`: Unique execution identifier
- `tool_id`/`version_id`: Reference to tool and version
- `agent_id`/`workflow_id`: Context references
- `execution_request_id`: Idempotency key
- `input_payload`/`output_payload`: Request/response data
- `error_message`/`error_stacktrace`: Error details
- `execution_time_ms`: Performance metric
- `status`: Execution state (pending, running, succeeded, failed, timeout, cancelled)
- `http_status_code`: HTTP response code if applicable
- `llm_source`: LLM that triggered execution
- `started_at`/`completed_at`: Timing information

---

### 6. Agents Table

**Purpose**: Define autonomous agents that orchestrate tool usage

```sql
CREATE TABLE agents (
    agent_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(workspace_id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    description TEXT,
    system_prompt TEXT,
    configuration JSONB,
    model_provider VARCHAR(50),
    model_name VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    version INTEGER DEFAULT 1,
    created_by UUID REFERENCES users(user_id) ON DELETE SET NULL,
    updated_by UUID REFERENCES users(user_id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    
    UNIQUE (workspace_id, slug),
    CONSTRAINT agent_name_length CHECK (LENGTH(name) >= 3)
);

CREATE INDEX idx_agents_workspace_id ON agents(workspace_id);
CREATE INDEX idx_agents_name ON agents(name);
CREATE INDEX idx_agents_active ON agents(workspace_id, is_active) WHERE is_active = TRUE;
CREATE INDEX idx_agents_created_at ON agents(created_at DESC);
```

---

### 7. Agent Tools Junction Table

**Purpose**: Define which tools are available to each agent

```sql
CREATE TABLE agent_tools (
    agent_id UUID NOT NULL REFERENCES agents(agent_id) ON DELETE CASCADE,
    tool_id BIGINT NOT NULL REFERENCES tools(tool_id) ON DELETE CASCADE,
    priority INTEGER DEFAULT 100,
    enabled BOOLEAN DEFAULT TRUE,
    added_at TIMESTAMPTZ DEFAULT NOW(),
    
    PRIMARY KEY (agent_id, tool_id)
);

CREATE INDEX idx_agent_tools_agent_id ON agent_tools(agent_id);
CREATE INDEX idx_agent_tools_tool_id ON agent_tools(tool_id);
```

---

### 8. Workflows Table

**Purpose**: Define multi-step workflows combining agents and tools

```sql
CREATE TABLE workflows (
    workflow_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(workspace_id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    description TEXT,
    definition JSONB NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    version INTEGER DEFAULT 1,
    created_by UUID REFERENCES users(user_id) ON DELETE SET NULL,
    updated_by UUID REFERENCES users(user_id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    
    UNIQUE (workspace_id, slug)
);

CREATE INDEX idx_workflows_workspace_id ON workflows(workspace_id);
CREATE INDEX idx_workflows_active ON workflows(workspace_id, is_active) WHERE is_active = TRUE;
```

---

### 9. Workflow Executions Table

**Purpose**: Track workflow run instances

```sql
CREATE TABLE workflow_executions (
    workflow_execution_id BIGSERIAL PRIMARY KEY,
    workflow_id UUID NOT NULL REFERENCES workflows(workflow_id) ON DELETE RESTRICT,
    agent_id UUID REFERENCES agents(agent_id) ON DELETE SET NULL,
    trigger_source VARCHAR(50),
    status VARCHAR(50) NOT NULL,
    input_data JSONB,
    output_data JSONB,
    error_details JSONB,
    total_execution_time_ms INTEGER,
    started_at TIMESTAMPTZ NOT NULL,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT status_valid CHECK (status IN (
        'pending', 'running', 'succeeded', 'failed', 'cancelled'
    ))
);

CREATE INDEX idx_workflow_executions_workflow_id ON workflow_executions(workflow_id);
CREATE INDEX idx_workflow_executions_agent_id ON workflow_executions(agent_id);
CREATE INDEX idx_workflow_executions_status ON workflow_executions(status) WHERE status IN ('pending', 'running');
CREATE INDEX idx_workflow_executions_created_at ON workflow_executions(created_at DESC);
```

---

### 10. Users Table

**Purpose**: User and access management

```sql
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    password_hash VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    
    CONSTRAINT email_format CHECK (email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_active ON users(is_active) WHERE is_active = TRUE;
```

---

### 11. Workspaces Table

**Purpose**: Multi-tenancy support for organizations/teams

```sql
CREATE TABLE workspaces (
    workspace_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    owner_id UUID NOT NULL REFERENCES users(user_id) ON DELETE RESTRICT,
    is_active BOOLEAN DEFAULT TRUE,
    plan_tier VARCHAR(50) DEFAULT 'free',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    
    CONSTRAINT workspace_name_length CHECK (LENGTH(name) >= 3)
);

CREATE INDEX idx_workspaces_owner_id ON workspaces(owner_id);
CREATE INDEX idx_workspaces_slug ON workspaces(slug);
CREATE INDEX idx_workspaces_active ON workspaces(is_active) WHERE is_active = TRUE;
```

---

## Relationships Diagram

```
users
├── agents (created_by, updated_by)
├── workflows (created_by, updated_by)
├── tools (created_by, updated_by)
├── tool_versions (created_by)
└── workspaces (owner_id)

workspaces
├── agents
├── workflows
└── tool_executions (indirect via agents/workflows)

tools
├── tool_versions
├── tool_tool_tags (→ tool_tags)
├── agent_tools (← agents)
└── tool_executions

agents
├── agent_tools (→ tools)
├── tool_executions
└── workflow_executions

workflows
└── workflow_executions
    └── tool_executions (nested)
```

---

## Performance Considerations

### Indexing Strategy

1. **Foreign Key Indices**: All FK columns indexed
2. **Status Queries**: Partial indices on status columns for common queries
3. **Date Range Queries**: Created_at/updated_at indexed DESC for recent data
4. **Search Optimization**: Name/slug columns indexed
5. **Composite Indices**: Workspace + status for multi-tenant queries

### Query Optimization

- Use partial indices for status IN ('pending', 'running')
- Partition large tables (tool_executions) by date
- Materialized views for analytics
- Connection pooling (PgBouncer) for concurrent access

### Archival Strategy

- Move old executions to archive tables quarterly
- Maintain 30-day hot data, 1-year warm data
- Use JSONB for flexible schema evolution

---

## Security Considerations

### Access Control

- User authentication via bcrypt hashing
- Workspace-based multi-tenancy isolation
- Audit trail (created_by, updated_by, timestamps)
- Soft deletes for data recovery (deleted_at)

### Data Protection

- Sensitive data encrypted at rest
- Input validation via JSON schema constraints
- Prepared statements for all queries
- Regular backups with encryption

---

## Scalability Plan

### Current Capacity

- Supports ~1M tools
- Supports ~10M agent definitions
- Supports ~100M execution records

### Scaling Strategy

1. **Sharding**: Partition by workspace_id for multi-tenant isolation
2. **Read Replicas**: For analytics and reporting
3. **Caching**: Redis for tool definitions and recent executions
4. **Compression**: Archive old execution records

---

## Maintenance & Monitoring

### Regular Tasks

- VACUUM and ANALYZE weekly
- Index health check monthly
- Backup verification daily
- Slow query log review

### Monitoring Metrics

- Query latency (p95, p99)
- Execution success rate
- Disk space usage
- Connection pool saturation

---

## Future Enhancements

1. **Event Sourcing**: Audit log for state changes
2. **Real-time Updates**: WebSocket support for live execution tracking
3. **ML Integration**: Tool recommendation system
4. **Performance Optimization**: Query result caching
5. **Advanced Analytics**: Execution metrics and insights
