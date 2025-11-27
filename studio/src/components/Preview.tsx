'use client';

import React from 'react';
import { Moon } from 'lucide-react';

interface PreviewProps {
  code: string;
}

export default function Preview({ code }: PreviewProps) {
  const [sampleData] = React.useState({
    date: {
      name: 'Friday',
      number: 28,
    },
    events: [
      {
        id: '1',
        title: 'Lunch',
        time: '12:00 - 12:45 PM',
        color: 'red',
      },
      {
        id: '2',
        title: 'Q1 roadmap review',
        time: '1:00 - 2:00 PM',
        color: 'blue',
      },
      {
        id: '3',
        title: 'Team standup',
        time: '3:30 - 4:00 PM',
        color: 'red',
      },
    ],
  });

  return (
    <div className="w-1/3 bg-gradient-to-br from-gray-50 to-gray-100 overflow-auto flex items-center justify-center p-8">
      {/* Preview Card */}
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-sm w-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-gray-600 text-sm font-medium">{sampleData.date.name}</p>
            <h1 className="text-6xl font-bold text-gray-900 mt-2">
              {sampleData.date.number}
            </h1>
          </div>
          <div className="text-gray-400">
            <Moon size={40} />
          </div>
        </div>

        {/* Events */}
        <div className="space-y-3 mb-8">
          {sampleData.events.map((event) => (
            <div
              key={event.id}
              className={`p-3 rounded-lg ${
                event.color === 'red'
                  ? 'bg-red-50 border-l-4 border-l-red-500'
                  : 'bg-blue-50 border-l-4 border-l-blue-500'
              }`}
            >
              <p
                className={`text-sm font-semibold ${
                  event.color === 'red' ? 'text-red-500' : 'text-blue-500'
                }`}
              >
                {event.time}
              </p>
              <p className="text-sm text-gray-700 mt-1">{event.title}</p>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button className="flex-1 bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition">
            Add to calendar
          </button>
          <button className="flex-1 bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-400 transition">
            Discard
          </button>
        </div>
      </div>
    </div>
  );
}
