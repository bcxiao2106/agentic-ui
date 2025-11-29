'use client';

import React from 'react';
import { SquarePlus, LayoutDashboard, Puzzle, Zap } from 'lucide-react';
import clsx from 'clsx';

interface SidebarProps {
  onSelectComponent?: (component: string) => void;
}

export default function Sidebar({ onSelectComponent }: SidebarProps) {
  const [activeSection, setActiveSection] = React.useState('editor');

  const sections = [
    { id: 'newWidget', label: 'New Widget', icon: SquarePlus },
    { id: 'gallery', label: 'Gallery', icon: LayoutDashboard },
    { id: 'components', label: 'Components', icon: Puzzle },
  ];

  return (
    <aside className="w-full bg-white border-r border-gray-200 flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Zap size={18} className="text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-sm font-bold text-gray-900">Agentic UI Studio</h1>
            <p className="text-xs text-gray-500">Build with AI</p>
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 space-y-2 p-4">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <button
              key={section.id}
              onClick={() => {
                setActiveSection(section.id);
                onSelectComponent?.(section.id);
              }}
              className={clsx(
                'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                activeSection === section.id
                  ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                  : 'text-gray-600 hover:bg-gray-50'
              )}
            >
              <Icon size={20} />
              <span>{section.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <button className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
          Save
        </button>
        <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
          Export
        </button>
      </div>
    </aside>
  );
}
