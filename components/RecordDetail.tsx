import React from 'react';
import { format, isSameDay } from 'date-fns';
import { Music, Clock, MapPin, User, Tag } from 'lucide-react';
import { useDance } from '../context/DanceContext';

export const RecordDetail: React.FC = () => {
  const { selectedDate, records } = useDance();

  if (!selectedDate) return null;

  // Filter records for the day and sort by timestamp ascending (earliest first)
  const daysRecords = records
    .filter(r => isSameDay(new Date(r.date), selectedDate))
    .sort((a, b) => a.timestamp - b.timestamp);

  if (daysRecords.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 p-8 min-h-[300px]">
        <p>No practice recorded for {format(selectedDate, 'MMM d')}.</p>
        <p className="text-sm mt-2">Tap the + button to add one!</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-gray-900 rounded-t-3xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] border-t border-gray-100 dark:border-gray-800 p-4 pb-24">
      <div className="flex justify-center mb-4">
        <div className="w-12 h-1 bg-gray-200 dark:bg-gray-700 rounded-full" />
      </div>

      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 px-2">
        {format(selectedDate, 'EEEE, MMMM do')}
      </h3>

      <div className="space-y-8">
        {daysRecords.map((record) => (
          <div key={record.id} className="flex gap-4">
            {/* Timeline */}
            <div className="flex flex-col items-center w-12 pt-2">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                {format(new Date(record.timestamp), 'HH:mm')}
              </span>
              <div className="w-0.5 h-full bg-gray-200 dark:bg-gray-700 mt-2 relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-indigo-500" />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 space-y-4 pb-4">
              {/* Media Card */}
              <div className="relative rounded-2xl overflow-hidden bg-black aspect-video shadow-md group">
                {record.mediaUrl ? (
                  record.mediaType === 'video' ? (
                    <video 
                      src={record.mediaUrl} 
                      controls 
                      className="w-full h-full object-contain" 
                    />
                  ) : (
                    <img src={record.mediaUrl} alt="Practice" className="w-full h-full object-cover" />
                  )
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-400">
                    No Media
                  </div>
                )}
                <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full text-lg shadow-sm">
                  {record.mood}
                </div>
              </div>

              {/* Details Tags */}
              <div className="flex flex-wrap gap-2">
                <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-medium border border-indigo-100 dark:border-indigo-800">
                  <Tag size={12} className="mr-1" /> {record.style}
                </div>
                 <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs font-medium border border-orange-100 dark:border-orange-800">
                  <Clock size={12} className="mr-1" /> {record.durationMinutes} min
                </div>
                 <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium border border-green-100 dark:border-green-800">
                  {record.difficulty}
                </div>
              </div>

              {/* Info Block */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-3">
                 <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <MapPin size={16} className="mr-2 text-gray-400" />
                  {record.studio}
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <User size={16} className="mr-2 text-gray-400" />
                  {record.instructor}
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <Music size={16} className="mr-2 text-gray-400" />
                  <span className="truncate">{record.musicTitle || 'No music listed'}</span>
                </div>
              </div>

              {/* Notes */}
              <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-4 rounded-xl shadow-sm">
                <span className="font-semibold block mb-1 text-gray-900 dark:text-white">Notes</span>
                {record.notes}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};