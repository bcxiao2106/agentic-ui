'use client';

import React from 'react';
import { Plus, Palette, LayoutTemplate, Sparkles } from 'lucide-react';
import clsx from 'clsx';

interface SidebarProps {
  onSelectComponent?: (component: string | null) => void;
}

export default function Sidebar({ onSelectComponent }: SidebarProps) {
  const [activeSection, setActiveSection] = React.useState('widgets');

  const sections = [
    { id: 'add', label: 'New widget', icon: Plus },
    { id: 'gallery', label: 'Gallery', icon: Palette },
    { id: 'components', label: 'Components', icon: LayoutTemplate },
    { id: 'icons', label: 'Icons', icon: Sparkles },
  ];

  const widgets = [
    { id: 'calendar', name: 'Calendar Event' },
    { id: 'card', name: 'Card' },
    { id: 'button', name: 'Button' },
    { id: 'input', name: 'Input' },
    { id: 'modal', name: 'Modal' },
  ];

  return (
    <aside className="w-60 bg-white border-r border-gray-200 flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center">
            <span className="text-white font-bold text-sm">UI</span>
          </div>
          <span className="font-semibold text-gray-900">Widget Builder</span>
        </div>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
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
                'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                activeSection === section.id
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50'
              )}
            >
              <Icon size={18} />
              {section.label}
            </button>
          );
        })}

        {/* Widgets Section */}
        {activeSection === 'add' && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h3 className="text-xs font-semibold text-gray-500 uppercase px-3 mb-2">
              Widgets
            </h3>
            <div className="space-y-1">
              {widgets.map((widget) => (
                <button
                  key={widget.id}
                  onClick={() => onSelectComponent?.(widget.id)}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  + {widget.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <button className="w-full px-3 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
          Publish
        </button>
      </div>
    </aside>
  );
}
