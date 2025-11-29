'use client';

import React from 'react';
import { Copy, ExternalLink } from 'lucide-react';

interface ToolVersion {
  version_id: number;
  version_number: string;
  semantic_version: string;
  input_schema: Record<string, any>;
  output_schema: Record<string, any>;
  handler_language: string;
  is_active: boolean;
  is_deprecated: boolean;
  changelog: string;
}

interface Tool {
  tool_id: number;
  name: string;
  slug: string;
  description: string;
  category: 'api' | 'database' | 'computation' | 'integration' | 'utility';
  is_active: boolean;
  created_at: string;
  updated_at: string;
  versions?: ToolVersion[];
  tags?: Array<{ tag_id: number; name: string; color: string }>;
}

interface ToolDisplayProps {
  tool: Tool;
  onEdit?: () => void;
  onDelete?: () => void;
}

const categoryColors: Record<string, string> = {
  api: 'bg-blue-100 text-blue-800',
  database: 'bg-purple-100 text-purple-800',
  computation: 'bg-green-100 text-green-800',
  integration: 'bg-orange-100 text-orange-800',
  utility: 'bg-gray-100 text-gray-800',
};

export default function ToolDisplay({ tool, onEdit, onDelete }: ToolDisplayProps) {
  const activeVersion = tool.versions?.find(v => v.is_active);
  const [copiedField, setCopiedField] = React.useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold text-gray-900">{tool.name}</h1>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${categoryColors[tool.category]}`}>
              {tool.category}
            </span>
          </div>
          <p className="text-gray-600 mb-4">{tool.description}</p>
          <div className="flex items-center gap-2">
            <code className="bg-gray-100 px-3 py-1 rounded text-sm text-gray-700">{tool.slug}</code>
            <button
              onClick={() => copyToClipboard(tool.slug, 'slug')}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
            >
              <Copy size={16} className="text-gray-600" />
            </button>
          </div>
        </div>
        <div className="flex gap-2">
          {onEdit && (
            <button
              onClick={onEdit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      {/* Tags */}
      {tool.tags && tool.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tool.tags.map(tag => (
            <span
              key={tag.tag_id}
              className="px-3 py-1 rounded-full text-sm"
              style={{ backgroundColor: tag.color + '20', color: tag.color }}
            >
              {tag.name}
            </span>
          ))}
        </div>
      )}

      {/* Active Version Information */}
      {activeVersion && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Active Version</h2>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Version Number</p>
              <p className="font-mono text-gray-900">{activeVersion.version_number}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Handler Language</p>
              <p className="font-mono text-gray-900">{activeVersion.handler_language}</p>
            </div>
          </div>

          {/* Input Schema */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Input Schema</h3>
            <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm text-gray-300 font-mono">
                {JSON.stringify(activeVersion.input_schema, null, 2)}
              </pre>
              <button
                onClick={() => copyToClipboard(JSON.stringify(activeVersion.input_schema, null, 2), 'input')}
                className="mt-2 text-xs text-gray-400 hover:text-gray-200 flex items-center gap-1"
              >
                <Copy size={12} />
                {copiedField === 'input' ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Output Schema */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Output Schema</h3>
            <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm text-gray-300 font-mono">
                {JSON.stringify(activeVersion.output_schema, null, 2)}
              </pre>
              <button
                onClick={() => copyToClipboard(JSON.stringify(activeVersion.output_schema, null, 2), 'output')}
                className="mt-2 text-xs text-gray-400 hover:text-gray-200 flex items-center gap-1"
              >
                <Copy size={12} />
                {copiedField === 'output' ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Changelog */}
          {activeVersion.changelog && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Changelog</h3>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{activeVersion.changelog}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* All Versions */}
      {tool.versions && tool.versions.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">All Versions ({tool.versions.length})</h2>
          <div className="space-y-3">
            {tool.versions.map(version => (
              <div key={version.version_id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-700">
                      v{version.version_number}
                    </code>
                    {version.is_active && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                        Active
                      </span>
                    )}
                    {version.is_deprecated && (
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">
                        Deprecated
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">{version.handler_language}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Metadata */}
      <div className="border-t border-gray-200 pt-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Metadata</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Status</p>
            <p className="font-medium text-gray-900">{tool.is_active ? 'Active' : 'Inactive'}</p>
          </div>
          <div>
            <p className="text-gray-600">Created</p>
            <p className="font-medium text-gray-900">{new Date(tool.created_at).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-gray-600">Updated</p>
            <p className="font-medium text-gray-900">{new Date(tool.updated_at).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-gray-600">Tool ID</p>
            <p className="font-medium text-gray-900 font-mono text-xs">{tool.tool_id}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
