'use client';

import React from 'react';
import { Code2, Share2, Download } from 'lucide-react';

export default function Toolbar() {
  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {/* Left side - Title */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Create Event</h1>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-3">
        {/* JSON Button */}
        <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <Code2 size={18} />
          JSON
        </button>

        {/* Share Button */}
        <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <Share2 size={18} />
          Share
        </button>

        {/* Download Button */}
        <button className="flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
          <Download size={18} />
          Download
        </button>
      </div>
    </div>
  );
}
