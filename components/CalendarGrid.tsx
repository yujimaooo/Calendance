import React, { useState } from 'react';
import { format, endOfMonth, eachDayOfInterval, getDay, isSameDay, isToday, addMonths } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useDance } from '../context/DanceContext';

export const CalendarGrid: React.FC<{ compact?: boolean }> = ({ compact }) => {
  const { records, selectedDate, setSelectedDate } = useDance();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // startOfMonth replacement using native Date (sets to 1st of month at 00:00:00 local time)
  const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Create placeholders for empty days at start of month (Sunday=0, Monday=1...)
  const startDay = getDay(monthStart);
  const placeholders = Array.from({ length: startDay });

  const nextMonth = () => {
    setCurrentMonth(prev => addMonths(prev, 1));
    setSelectedDate(null); // Deselect when moving month
  };
  
  const prevMonth = () => {
    // subMonths replacement using addMonths with negative value
    setCurrentMonth(prev => addMonths(prev, -1));
    setSelectedDate(null); // Deselect when moving month
  };

  const getRecordForDay = (day: Date) => {
    // Get all records for the day
    const dayRecords = records.filter(r => isSameDay(new Date(r.date), day));
    // Prioritize showing a record that has media
    const recordWithMedia = dayRecords.find(r => r.mediaUrl);
    // Return the one with media, otherwise just the first one found (or undefined)
    return recordWithMedia || dayRecords[0];
  };

  return (
    <div className={`w-full max-w-md mx-auto px-4 transition-all duration-300 ${compact ? 'py-2' : 'py-6'}`}>
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={prevMonth}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        
        <h2 className={`font-bold text-gray-900 dark:text-white ${compact ? 'text-lg' : 'text-2xl'}`}>
          {format(currentMonth, 'MMMM yyyy')}
        </h2>

        <button 
          onClick={nextMonth}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
          <div key={i} className="text-center text-xs font-semibold text-gray-400 dark:text-gray-500">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {placeholders.map((_, i) => (
          <div key={`placeholder-${i}`} className="aspect-square" />
        ))}
        
        {daysInMonth.map((day) => {
          const record = getRecordForDay(day);
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const isCurrentDay = isToday(day);

          return (
            <button
              key={day.toISOString()}
              onClick={() => setSelectedDate(isSelected ? null : day)}
              className={`
                relative aspect-square rounded-full flex items-center justify-center transition-all duration-200
                ${isSelected ? 'ring-2 ring-indigo-500 dark:ring-indigo-400 z-10 scale-105' : ''}
                ${isCurrentDay && !isSelected && !record ? 'bg-gray-100 dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 font-bold' : ''}
              `}
            >
              {record ? (
                <div className="w-full h-full rounded-full overflow-hidden relative shadow-sm border border-white dark:border-gray-700">
                  {record.mediaUrl ? (
                    record.mediaType === 'video' ? (
                       <video src={record.mediaUrl} className="w-full h-full object-cover pointer-events-none" />
                    ) : (
                       <img src={record.mediaUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                    )
                  ) : (
                    // Fallback to mood if no media
                    <div className="w-full h-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-sm">
                      {record.mood}
                    </div>
                  )}
                </div>
              ) : (
                <span className={`text-sm ${isSelected ? 'font-bold text-indigo-600 dark:text-indigo-400' : 'text-gray-700 dark:text-gray-300'}`}>
                  {format(day, 'd')}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};