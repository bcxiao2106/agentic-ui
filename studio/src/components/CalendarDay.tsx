'use client';

import React, { useState } from 'react';
import { CalendarDay, CalendarEvent } from '@/types/calendar';
import EventCard from './EventCard';
import EventModal from './EventModal';
import { Moon } from 'lucide-react';

interface CalendarDayProps {
  day: CalendarDay;
}

export default function CalendarDayComponent({ day }: CalendarDayProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [events, setEvents] = useState<CalendarEvent[]>(day.events);

  const handleAddEvent = (newEvent: Omit<CalendarEvent, 'id'>) => {
    const eventWithId: CalendarEvent = {
      ...newEvent,
      id: Math.random().toString(36).substr(2, 9),
    };
    setEvents([...events, eventWithId]);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-gray-600 text-sm font-medium">{day.name}</p>
              <h1 className="text-6xl font-bold text-gray-900 mt-2">
                {day.number}
              </h1>
            </div>
            <div className="text-gray-400">
              <Moon size={40} />
            </div>
          </div>

          {/* Events */}
          <div className="mb-8">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-8">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex-1 bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
            >
              Add to calendar
            </button>
            <button className="flex-1 bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-400 transition">
              Discard
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddEvent}
      />
    </>
  );
}
