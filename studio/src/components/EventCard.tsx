'use client';

import React from 'react';
import { CalendarEvent } from '@/types/calendar';
import clsx from 'clsx';

interface EventCardProps {
  event: CalendarEvent;
  onDelete?: (eventId: string) => void;
}

export default function EventCard({ event, onDelete }: EventCardProps) {
  const colorClasses = {
    red: 'border-l-4 border-l-red-500 bg-red-50',
    blue: 'border-l-4 border-l-blue-500 bg-blue-50',
  };

  const timeColorClasses = {
    red: 'text-red-500',
    blue: 'text-blue-500',
  };

  return (
    <div
      className={clsx(
        'p-3 rounded-lg mb-3 flex justify-between items-start',
        colorClasses[event.color]
      )}
    >
      <div className="flex-1">
        <p className={clsx('text-sm font-semibold', timeColorClasses[event.color])}>
          {event.time}
        </p>
        <p className="text-sm text-gray-700 mt-1">{event.title}</p>
      </div>
      {event.isNew && (
        <span className="ml-2 text-xs bg-gray-300 text-gray-700 px-2 py-1 rounded">
          New
        </span>
      )}
    </div>
  );
}
