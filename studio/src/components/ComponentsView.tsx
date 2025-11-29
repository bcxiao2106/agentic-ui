'use client';

import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Plus } from 'lucide-react';
import clsx from 'clsx';
import ComponentEditCreate from './ToolEditCreate';

interface Component {
  name: string;
  description: string;
  category: string;
}

// Widget Manager Components
const WIDGET_MANAGER_COMPONENTS: Component[] = [
  // Controls
  { name: 'Button', description: 'Trigger actions with configurable style, size, and icons.', category: 'Controls' },
  { name: 'DataPicker', description: 'Select dates from a calendar interface.', category: 'Controls' },
  { name: 'Select', description: 'Choose from a dropdown list of options.', category: 'Controls' },
  { name: 'Checkbox', description: 'Toggle between checked and unchecked states.', category: 'Controls' },
  { name: 'RadioGroup', description: 'Select one option from a group of mutually exclusive options.', category: 'Controls' },
  { name: 'Input', description: 'Text input field for user data entry.', category: 'Controls' },
  { name: 'Textarea', description: 'Multi-line text input for longer content.', category: 'Controls' },
  { name: 'Form', description: 'Container for form elements and validation.', category: 'Controls' },

  // Layout
  { name: 'Box', description: 'Basic container component for layout.', category: 'Layout' },
  { name: 'Row', description: 'Horizontal layout container.', category: 'Layout' },
  { name: 'Col', description: 'Vertical layout container.', category: 'Layout' },
  { name: 'Spacer', description: 'Add space between elements.', category: 'Layout' },
  { name: 'Divider', description: 'Visual separator between sections.', category: 'Layout' },

  // Typography
  { name: 'Text', description: 'Display body text content.', category: 'Typography' },
  { name: 'Title', description: 'Large heading for page titles.', category: 'Typography' },
  { name: 'Caption', description: 'Small text for captions and labels.', category: 'Typography' },
  { name: 'Label', description: 'Label text for form fields.', category: 'Typography' },
  { name: 'Markdown', description: 'Render markdown formatted content.', category: 'Typography' },

  // Content
  { name: 'Image', description: 'Display images with various sizing options.', category: 'Content' },
  { name: 'Icon', description: 'Display SVG icons in various sizes and colors.', category: 'Content' },
  { name: 'Chart', description: 'Visualize data with charts and graphs.', category: 'Content' },
  { name: 'Badge', description: 'Display small badges and tags.', category: 'Content' },

  // Other
  { name: 'Transition', description: 'Animate component transitions and visibility.', category: 'Other' },
];

// Layout UI Components
const LAYOUT_UI_COMPONENTS: Component[] = [
  // Layout Containers
  { name: 'Container', description: 'Main container for page content.', category: 'Layout Containers' },
  { name: 'Grid', description: 'Responsive grid layout system.', category: 'Layout Containers' },
  { name: 'FlexBox', description: 'Flexible box layout container.', category: 'Layout Containers' },
  { name: 'Stack', description: 'Stack elements vertically or horizontally.', category: 'Layout Containers' },
  { name: 'Sidebar', description: 'Sidebar layout container.', category: 'Layout Containers' },

  // Navigation
  { name: 'Navbar', description: 'Top navigation bar component.', category: 'Navigation' },
  { name: 'Menu', description: 'Dropdown menu component.', category: 'Navigation' },
  { name: 'Breadcrumb', description: 'Breadcrumb navigation trail.', category: 'Navigation' },
  { name: 'Tabs', description: 'Tabbed content interface.', category: 'Navigation' },
  { name: 'Pagination', description: 'Pagination controls for lists.', category: 'Navigation' },

  // Sections
  { name: 'Header', description: 'Page header section.', category: 'Sections' },
  { name: 'Footer', description: 'Page footer section.', category: 'Sections' },
  { name: 'Hero', description: 'Hero banner section.', category: 'Sections' },
  { name: 'Card', description: 'Card component for grouping content.', category: 'Sections' },
  { name: 'Modal', description: 'Modal dialog component.', category: 'Sections' },
];

export default function ComponentsView() {
  const [selectedComponent, setSelectedComponent] = useState<string | null>('Button');
  const [expandedCategory, setExpandedCategory] = useState<string | null>('Controls');
  const [selectedCategory, setSelectedCategory] = useState<string>('widgetManager');
  const [componentCategory, setComponentCategory] = useState<'widgetManager' | 'layoutUI'>('widgetManager');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showEditCreate, setShowEditCreate] = useState(false);

  // Get current component list based on selected category
  const currentComponents = selectedCategory === 'widgetManager' ? WIDGET_MANAGER_COMPONENTS : LAYOUT_UI_COMPONENTS;

  // Get categories based on selected category
  const categories = selectedCategory === 'widgetManager'
    ? ['Controls', 'Layout', 'Typography', 'Content', 'Other']
    : ['Layout Containers', 'Navigation', 'Sections'];

  const componentsByCategory = categories.reduce((acc, category) => {
    acc[category] = currentComponents.filter(c => c.category === category);
    return acc;
  }, {} as Record<string, Component[]>);

  const selected = currentComponents.find(c => c.name === selectedComponent);

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left Sidebar - Components List */}
      <div className="w-56 border-r border-gray-200 overflow-y-auto bg-gray-50">
        <div className="p-4">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Components</h2>

          {/* Dropdown */}
          <div className="mb-4 relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
            >
              <span className="text-sm text-gray-700">
                {selectedCategory === 'widgetManager' ? 'Widget Manager' : 'Layout UI'}
              </span>
              <ChevronDown
                size={16}
                className={clsx('text-gray-500 transition-transform', dropdownOpen && 'rotate-180')}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                <button
                  onClick={() => {
                    setSelectedCategory('widgetManager');
                    setExpandedCategory('Controls');
                    setSelectedComponent('Button');
                    setDropdownOpen(false);
                  }}
                  className={clsx(
                    'w-full text-left px-3 py-2 text-sm transition-colors hover:bg-gray-100',
                    selectedCategory === 'widgetManager' && 'bg-blue-50 text-blue-700 font-medium'
                  )}
                >
                  Widget Manager
                </button>
                <button
                  onClick={() => {
                    setSelectedCategory('layoutUI');
                    setExpandedCategory('Layout Containers');
                    setSelectedComponent('Container');
                    setDropdownOpen(false);
                  }}
                  className={clsx(
                    'w-full text-left px-3 py-2 text-sm transition-colors hover:bg-gray-100',
                    selectedCategory === 'layoutUI' && 'bg-blue-50 text-blue-700 font-medium'
                  )}
                >
                  Layout UI
                </button>
              </div>
            )}
          </div>

          {/* Add Button */}
          <button
            onClick={() => setShowEditCreate(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm mb-4"
          >
            <Plus size={16} />
            Add new component
          </button>

          {categories.map(category => (
            <div key={category} className="mb-4">
              <button
                onClick={() => setExpandedCategory(expandedCategory === category ? null : category)}
                className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <span className="text-xs font-semibold text-gray-700 uppercase">{category}</span>
                <ChevronRight
                  size={16}
                  className={clsx(
                    'text-gray-500 transition-transform',
                    expandedCategory === category && 'rotate-90'
                  )}
                />
              </button>

              {expandedCategory === category && (
                <div className="mt-1 ml-2 space-y-1">
                  {componentsByCategory[category].map(comp => (
                    <button
                      key={comp.name}
                      onClick={() => setSelectedComponent(comp.name)}
                      className={clsx(
                        'w-full text-left px-3 py-2 text-sm rounded-lg transition-colors',
                        selectedComponent === comp.name
                          ? 'bg-blue-100 text-blue-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-200'
                      )}
                    >
                      {comp.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right Content - Component Details or Edit/Create */}
      <div className="flex-1 overflow-y-auto flex justify-center">
        {showEditCreate ? (
          <div className="w-full">
            <ComponentEditCreate
              selectedCategory={componentCategory}
              onSave={(data) => {
                console.log('Saving component:', data);
                setShowEditCreate(false);
              }}
              onCancel={() => setShowEditCreate(false)}
            />
          </div>
        ) : selected ? (
          <div className="p-8 w-full max-w-4xl">
            {/* Component Title */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{selected.name}</h1>
              <p className="text-lg text-gray-600">{selected.description}</p>
            </div>

            {/* Example Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Example</h2>
              <div className="bg-gray-100 rounded-lg p-6 flex items-center justify-center min-h-32">
                <div className="text-center">
                  <p className="text-gray-600 mb-3">Component preview would render here</p>
                  <p className="text-sm text-gray-500">&lt;{selected.name} /&gt;</p>
                </div>
              </div>
            </div>

            {/* Usage Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Usage</h2>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-gray-300 font-mono">
                  {`<${selected.name} />`}
                </pre>
              </div>
            </div>

            {/* Props Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Props</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-300 bg-gray-50">
                      <th className="text-left px-4 py-3 font-semibold text-gray-900 text-sm">Name</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-900 text-sm">Type</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-900 text-sm">Description</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-900 text-sm">Default</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-mono text-pink-600">variant</td>
                      <td className="px-4 py-3 text-sm font-mono text-gray-600">string</td>
                      <td className="px-4 py-3 text-sm text-gray-600">Component styling variant</td>
                      <td className="px-4 py-3 text-sm text-gray-500">-</td>
                    </tr>
                    <tr className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-mono text-pink-600">size</td>
                      <td className="px-4 py-3 text-sm font-mono text-gray-600">sm | md | lg</td>
                      <td className="px-4 py-3 text-sm text-gray-600">Component size</td>
                      <td className="px-4 py-3 text-sm text-gray-500">md</td>
                    </tr>
                    <tr className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-mono text-pink-600">disabled</td>
                      <td className="px-4 py-3 text-sm font-mono text-gray-600">boolean</td>
                      <td className="px-4 py-3 text-sm text-gray-600">Disable the component</td>
                      <td className="px-4 py-3 text-sm text-gray-500">false</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
