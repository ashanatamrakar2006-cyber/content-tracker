"use client";

import React, { useState } from 'react';

export default function CalendarView({ projects, onCardClick }: { projects: any[], onCardClick: (p: any) => void }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Month information calculator
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptySlots = Array.from({ length: firstDayIndex }, (_, i) => i);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      {/* CALENDAR HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{monthNames[month]} {year}</h1>
          <p className="text-xs text-gray-400 mt-0.5">Click any scheduled card to open workspace</p>
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
      <div className="grid grid-cols-7 gap-2 min-h-[450px]">
        {/* Empty slots for spacing */}
        {emptySlots.map(slot => (
          <div key={`empty-${slot}`} className="bg-gray-50/50 rounded-lg border border-gray-100/50"></div>
        ))}

        {/* Real calendar days */}
        {daysArray.map(day => {
          // Format current checking date string to compare (YYYY-MM-DD)
          const formattedDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          
          // Get content tasks matching this day
          const tasksThisDay = projects.filter(p => p.publish_date === formattedDateStr);

          return (
            <div key={day} className="bg-gray-50 rounded-lg p-2 border border-gray-200 flex flex-col justify-between min-h-[90px] hover:bg-slate-50 transition">
              <span className="text-xs font-bold text-gray-400">{day}</span>
              
              {/* Task Items inside grid box */}
              <div className="mt-1 space-y-1 flex-1 overflow-y-auto max-h-[70px]">
                {tasksThisDay.map(task => (
                  <div 
                    key={task.id}
                    onClick={() => onCardClick(task)}
                    className={`text-[10px] p-1 rounded font-semibold border truncate cursor-pointer shadow-2xs ${
                      task.description === 'YouTube' 
                        ? 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100' 
                        : 'bg-pink-50 border-pink-200 text-pink-700 hover:bg-pink-100'
                    }`}
                  >
                    {task.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}