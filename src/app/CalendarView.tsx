"use client";

import React, { useState } from 'react';

interface CalendarEvent {
  id?: string;
  date: string;
  title: string;
  reminder: string;
  time: string;
}

export default function CalendarView({ projects, onCardClick }: { 
  projects: any[], 
  onCardClick: (p: any) => void 
}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [showEventModal, setShowEventModal] = useState(false);

  // Form state for new event
  const [eventTitle, setEventTitle] = useState('');
  const [eventReminder, setEventReminder] = useState('');
  const [eventTime, setEventTime] = useState('');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptySlots = Array.from({ length: firstDayIndex }, (_, i) => i);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  // When a date cell is clicked (not a task card)
  const handleDateClick = (dateStr: string) => {
    setSelectedDate(dateStr);
    setEventTitle('');
    setEventReminder('');
    setEventTime('');
    setShowEventModal(true);
  };

  // Save new event/reminder
  const handleSaveEvent = () => {
    if (!eventTitle.trim()) return alert('Please enter a title!');
    const newEvent: CalendarEvent = {
      id: Date.now().toString(),
      date: selectedDate!,
      title: eventTitle,
      reminder: eventReminder,
      time: eventTime,
    };
    setEvents([...events, newEvent]);
    setShowEventModal(false);
  };

  // Get events for a specific date
  const getEventsForDate = (dateStr: string) => 
    events.filter(e => e.date === dateStr);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">

      {/* CALENDAR HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{monthNames[month]} {year}</h1>
          <p className="text-xs text-gray-400 mt-0.5">Click a date to add reminder • Click a card to open workspace</p>
        </div>
        <div className="flex space-x-2">
          <button onClick={prevMonth} className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-bold text-gray-600 transition">◀ Prev</button>
          <button onClick={nextMonth} className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-bold text-gray-600 transition">Next ▶</button>
        </div>
      </div>

      {/* WEEK DAYS HEADER */}
      <div className="grid grid-cols-7 gap-2 text-center font-bold text-xs uppercase tracking-wider text-gray-400 mb-2">
        <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
      </div>

      {/* DAYS GRID */}
      <div className="grid grid-cols-7 gap-2">
        {/* Empty slots */}
        {emptySlots.map(slot => (
          <div key={`empty-${slot}`} className="bg-gray-50/50 rounded-lg border border-gray-100/50 min-h-20"></div>
        ))}

        {/* Real calendar days */}
        {daysArray.map(day => {
          const formattedDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const tasksThisDay = projects.filter(p => p.publish_date === formattedDateStr);
          const eventsThisDay = getEventsForDate(formattedDateStr);
          const isToday = formattedDateStr === new Date().toISOString().split('T')[0];

          return (
            <div
              key={day}
              onClick={() => handleDateClick(formattedDateStr)}
              className={`rounded-lg p-2 border flex flex-col min-h-20 cursor-pointer transition
                ${isToday 
                  ? 'bg-blue-50 border-blue-300' 
                  : 'bg-gray-50 border-gray-200 hover:bg-slate-100'
                }`}
            >
              {/* Day number */}
              <span className={`text-xs font-bold ${isToday ? 'text-blue-600' : 'text-gray-400'}`}>
                {day}
              </span>

              {/* Project tasks */}
              <div className="mt-1 space-y-1 overflow-y-auto max-h-16">
                {tasksThisDay.map(task => (
                  <div
                    key={task.id}
                    onClick={(e) => { e.stopPropagation(); onCardClick(task); }}
                    className={`text-[10px] p-1 rounded font-semibold border truncate cursor-pointer ${
                      task.description === 'YouTube'
                        ? 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'
                        : 'bg-pink-50 border-pink-200 text-pink-700 hover:bg-pink-100'
                    }`}
                  >
                    📹 {task.title}
                  </div>
                ))}

                {/* Custom events/reminders */}
                {eventsThisDay.map(event => (
                  <div
                    key={event.id}
                    className="text-[10px] p-1 rounded font-semibold border truncate bg-yellow-50 border-yellow-200 text-yellow-700"
                  >
                    🔔 {event.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* EVENT / REMINDER MODAL */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md border border-gray-100">
            
            <h2 className="text-lg font-bold text-gray-800 mb-1">📅 Add Event / Reminder</h2>
            <p className="text-xs text-gray-400 mb-4">{selectedDate}</p>

            <div className="space-y-4">
              {/* Event Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Event Title</label>
                <input
                  type="text"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="e.g., Upload Reel, Shoot Day, Collab Meeting"
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Time */}
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Time (optional)</label>
                <input
                  type="time"
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Reminder Note */}
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Reminder Note</label>
                <textarea
                  value={eventReminder}
                  onChange={(e) => setEventReminder(e.target.value)}
                  placeholder="e.g., Don't forget to add captions, Check thumbnail before upload..."
                  rows={3}
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100 mt-4">
              <button
                onClick={() => setShowEventModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEvent}
                className="px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow transition"
              >
                Save Reminder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}