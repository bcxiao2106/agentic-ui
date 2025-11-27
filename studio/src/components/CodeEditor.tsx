'use client';

import React from 'react';

interface CodeEditorProps {
  code: string;
  onCodeChange: (code: string) => void;
}

export default function CodeEditor({ code, onCodeChange }: CodeEditorProps) {
  const lines = code.split('\n');

  return (
    <div className="flex-1 flex flex-col bg-gray-900 border-r border-gray-800">
      {/* Editor Header */}
      <div className="h-10 bg-gray-800 border-b border-gray-700 flex items-center px-4">
        <span className="text-xs font-medium text-gray-400">Schema</span>
        <span className="ml-4 text-xs text-gray-500">Default</span>
        <button className="ml-auto text-gray-400 hover:text-gray-300 font-bold text-lg">
          +
        </button>
      </div>

      {/* Code Content */}
      <div className="flex-1 overflow-auto">
        <pre className="p-4 text-sm font-mono text-gray-300">
          {lines.map((line, i) => (
            <div key={i} className="flex">
              <span className="w-8 text-gray-600 text-right mr-4 select-none">
                {i + 1}
              </span>
              <span className="flex-1">
                <CodeHighlight line={line} />
              </span>
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
}

function CodeHighlight({ line }: { line: string }) {
  // Simple syntax highlighting
  let highlighted = line;

  // Keywords
  const keywords = ['const', 'function', 'return', 'if', 'else', 'map', 'import', 'export'];
  keywords.forEach((keyword) => {
    highlighted = highlighted.replace(
      new RegExp(`\\b${keyword}\\b`, 'g'),
      `<span style="color: #f92672">${keyword}</span>`
    );
  });

  // Strings
  highlighted = highlighted.replace(
    /"([^"]*)"/g,
    '<span style="color: #a1eff5">$&</span>'
  );

  // Numbers
  highlighted = highlighted.replace(
    /\b\d+\b/g,
    '<span style="color: #bd93f9">$&</span>'
  );

  return <>{line}</>;
}
