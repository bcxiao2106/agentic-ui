"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import TabComponent from "./TabComponent";
import Tagging from "./Tagging";

const Editor = dynamic(
  () => import("@monaco-editor/react").then((mod) => mod.Editor),
  {
    ssr: false,
  }
);

interface ComponentVersion {
  version_number: string;
  semantic_version: string;
  input_schema: Record<string, any>;
  output_schema: Record<string, any>;
  handler_language: string;
  handler_source_code: string;
  changelog: string;
}

interface ComponentFormData {
  name: string;
  slug: string;
  description: string;
  category: "widgetManager" | "layoutUI";
  is_active: boolean;
  version: ComponentVersion;
  tags: number[]; // tag IDs
}

interface ComponentEditCreateProps {
  initialData?: ComponentFormData;
  isEdit?: boolean;
  selectedCategory: "widgetManager" | "layoutUI";
  onSave: (data: ComponentFormData) => void;
  onCancel: () => void;
}

const defaultFormData: ComponentFormData = {
  name: "",
  slug: "",
  description: "",
  category: "widgetManager",
  is_active: true,
  version: {
    version_number: "1.0.0",
    semantic_version: "1.0.0",
    input_schema: {},
    output_schema: {},
    handler_language: "javascript",
    handler_source_code: "async () => {\n  \n}",
    changelog: "",
  },
  tags: [],
};

export default function ComponentEditCreate({
  initialData,
  isEdit = false,
  selectedCategory,
  onSave,
  onCancel,
}: ComponentEditCreateProps) {
  const [formData, setFormData] = useState<ComponentFormData>(
    initialData
      ? { ...initialData, category: selectedCategory }
      : { ...defaultFormData, category: selectedCategory }
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    if (!formData.slug.trim()) {
      newErrors.slug = "Slug is required";
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug =
        "Slug must contain only lowercase letters, numbers, and hyphens";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.version.version_number.trim()) {
      newErrors["version.version_number"] = "Version number is required";
    } else if (!/^\d+\.\d+\.\d+$/.test(formData.version.version_number)) {
      newErrors["version.version_number"] =
        "Version must follow semantic versioning (X.Y.Z)";
    }

    if (Object.keys(formData.version.input_schema).length === 0) {
      newErrors["version.input_schema"] = "Input schema is required";
    }

    if (Object.keys(formData.version.output_schema).length === 0) {
      newErrors["version.output_schema"] = "Output schema is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    try {
      await onSave(formData);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputSchemaChange = (value: string) => {
    try {
      const schema = JSON.parse(value);
      setFormData((prev) => ({
        ...prev,
        version: { ...prev.version, input_schema: schema },
      }));
      setErrors((prev) => ({ ...prev, "version.input_schema": "" }));
    } catch (e) {
      setErrors((prev) => ({
        ...prev,
        "version.input_schema": "Invalid JSON",
      }));
    }
  };

  const handleOutputSchemaChange = (value: string) => {
    try {
      const schema = JSON.parse(value);
      setFormData((prev) => ({
        ...prev,
        version: { ...prev.version, output_schema: schema },
      }));
      setErrors((prev) => ({ ...prev, "version.output_schema": "" }));
    } catch (e) {
      setErrors((prev) => ({
        ...prev,
        "version.output_schema": "Invalid JSON",
      }));
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto py-8 px-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEdit ? "Edit Component" : "Create New Component"}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Category and Active Status - Read Only */}
        <div className="space-y-4">
          <div className="border-l-4 border-gray-500 pl-4">
            <h2 className="text-lg font-semibold text-gray-900">Settings</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <div className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 font-medium capitalize">
                {formData.category}
              </div>
            </div>

            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-default">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  disabled
                  className="w-4 h-4 rounded border-gray-300 bg-gray-50"
                />
                Active
              </label>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="space-y-4">
          <div className="border-l-4 border-blue-500 pl-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Basic Information
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="e.g., Weather API"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            {/* Slug - Hidden */}
            {/* Removed the slug input field from the form UI */}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Describe what this tool does..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Version Number
              </label>
              <div className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 font-mono text-sm">
                {formData.version.version_number}
              </div>
            </div>
          </div>
        </div>

        {/* Tagging Section */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          <Tagging
            tags={formData.tags}
            onAddTag={(tag) =>
              setFormData((prev) => ({ ...prev, tags: [...prev.tags, tag] }))
            }
            onRemoveTag={(tag) =>
              setFormData((prev) => ({
                ...prev,
                tags: prev.tags.filter((t) => t !== tag),
              }))
            }
          />
        </div>

        {/* Tabs Section */}
        <div className="space-y-4">
          <div className="border-l-4 border-purple-500 pl-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Handler & Schemas
            </h2>
          </div>
          {/* Handler Language Dropdown */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Handler Language
            </label>
            <select
              value={formData.version.handler_language}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  version: { ...prev.version, handler_language: e.target.value },
                }))
              }
              className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="typescript">TypeScript</option>
              <option value="go">Go</option>
              <option value="rust">Rust</option>
            </select>
          </div>

          <TabComponent
            handlerSourceCode={formData.version.handler_source_code}
            inputSchema={JSON.stringify(formData.version.input_schema, null, 2)}
            outputSchema={JSON.stringify(
              formData.version.output_schema,
              null,
              2
            )}
            onHandlerChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                version: { ...prev.version, handler_source_code: value },
              }))
            }
            onInputSchemaChange={(value) => handleInputSchemaChange(value)}
            onOutputSchemaChange={(value) => handleOutputSchemaChange(value)}
          />
        </div>

        {/* Form Actions */}
        <div className="flex gap-3 justify-end border-t border-gray-200 pt-8 mt-8">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving
              ? "Saving..."
              : isEdit
              ? "Update Component"
              : "Create Component"}
          </button>
        </div>
      </form>
    </div>
  );
}
