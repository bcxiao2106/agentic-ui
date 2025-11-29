-- Database schema for Agentic UI Studio Server
-- Based on DB_DESIGN.md

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE IF NOT EXISTS users (
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

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active) WHERE is_active = TRUE;

-- Workspaces Table
CREATE TABLE IF NOT EXISTS workspaces (
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

CREATE INDEX IF NOT EXISTS idx_workspaces_owner_id ON workspaces(owner_id);
CREATE INDEX IF NOT EXISTS idx_workspaces_slug ON workspaces(slug);
CREATE INDEX IF NOT EXISTS idx_workspaces_active ON workspaces(is_active) WHERE is_active = TRUE;

-- Tools Table
CREATE TABLE IF NOT EXISTS tools (
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

CREATE INDEX IF NOT EXISTS idx_tools_name ON tools(name);
CREATE INDEX IF NOT EXISTS idx_tools_slug ON tools(slug);
CREATE INDEX IF NOT EXISTS idx_tools_category ON tools(category) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_tools_created_at ON tools(created_at DESC);

-- Tool Tags Table
CREATE TABLE IF NOT EXISTS tool_tags (
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

CREATE INDEX IF NOT EXISTS idx_tool_tags_name ON tool_tags(name);
CREATE INDEX IF NOT EXISTS idx_tool_tags_slug ON tool_tags(slug);

-- Tool-Tags Junction Table
CREATE TABLE IF NOT EXISTS tool_tool_tags (
    tool_id BIGINT NOT NULL REFERENCES tools(tool_id) ON DELETE CASCADE,
    tag_id BIGINT NOT NULL REFERENCES tool_tags(tag_id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    
    PRIMARY KEY (tool_id, tag_id)
);

CREATE INDEX IF NOT EXISTS idx_tool_tool_tags_tool_id ON tool_tool_tags(tool_id);
CREATE INDEX IF NOT EXISTS idx_tool_tool_tags_tag_id ON tool_tool_tags(tag_id);

-- Tool Versions Table
CREATE TABLE IF NOT EXISTS tool_versions (
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
    CONSTRAINT only_one_active CHECK (NOT (is_active AND is_deprecated))
);

CREATE INDEX IF NOT EXISTS idx_tool_versions_tool_id ON tool_versions(tool_id);
CREATE INDEX IF NOT EXISTS idx_tool_versions_active ON tool_versions(tool_id, is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_tool_versions_created_at ON tool_versions(created_at DESC);

-- Tool Executions Table
CREATE TABLE IF NOT EXISTS tool_executions (
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
    
    CONSTRAINT status_valid CHECK (status IN ('pending', 'running', 'succeeded', 'failed', 'timeout', 'cancelled')),
    CONSTRAINT execution_completed CHECK ((status = 'pending' AND completed_at IS NULL) OR (status != 'pending' AND completed_at IS NOT NULL))
);

CREATE INDEX IF NOT EXISTS idx_executions_tool_id ON tool_executions(tool_id);
CREATE INDEX IF NOT EXISTS idx_executions_status ON tool_executions(status) WHERE status IN ('pending', 'running');
CREATE INDEX IF NOT EXISTS idx_executions_agent_id ON tool_executions(agent_id);
CREATE INDEX IF NOT EXISTS idx_executions_workflow_id ON tool_executions(workflow_id);
CREATE INDEX IF NOT EXISTS idx_executions_created_at ON tool_executions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_executions_user_id ON tool_executions(user_id);
CREATE INDEX IF NOT EXISTS idx_executions_request_id ON tool_executions(execution_request_id);

-- Agents Table
CREATE TABLE IF NOT EXISTS agents (
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

CREATE INDEX IF NOT EXISTS idx_agents_workspace_id ON agents(workspace_id);
CREATE INDEX IF NOT EXISTS idx_agents_name ON agents(name);
CREATE INDEX IF NOT EXISTS idx_agents_active ON agents(workspace_id, is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_agents_created_at ON agents(created_at DESC);

-- Agent Tools Junction Table
CREATE TABLE IF NOT EXISTS agent_tools (
    agent_id UUID NOT NULL REFERENCES agents(agent_id) ON DELETE CASCADE,
    tool_id BIGINT NOT NULL REFERENCES tools(tool_id) ON DELETE CASCADE,
    priority INTEGER DEFAULT 100,
    enabled BOOLEAN DEFAULT TRUE,
    added_at TIMESTAMPTZ DEFAULT NOW(),
    
    PRIMARY KEY (agent_id, tool_id)
);

CREATE INDEX IF NOT EXISTS idx_agent_tools_agent_id ON agent_tools(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_tools_tool_id ON agent_tools(tool_id);

-- Workflows Table
CREATE TABLE IF NOT EXISTS workflows (
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

CREATE INDEX IF NOT EXISTS idx_workflows_workspace_id ON workflows(workspace_id);
CREATE INDEX IF NOT EXISTS idx_workflows_active ON workflows(workspace_id, is_active) WHERE is_active = TRUE;

-- Workflow Executions Table
CREATE TABLE IF NOT EXISTS workflow_executions (
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
    
    CONSTRAINT status_valid CHECK (status IN ('pending', 'running', 'succeeded', 'failed', 'cancelled'))
);

CREATE INDEX IF NOT EXISTS idx_workflow_executions_workflow_id ON workflow_executions(workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflow_executions_agent_id ON workflow_executions(agent_id);
CREATE INDEX IF NOT EXISTS idx_workflow_executions_status ON workflow_executions(status) WHERE status IN ('pending', 'running');
CREATE INDEX IF NOT EXISTS idx_workflow_executions_created_at ON workflow_executions(created_at DESC);
