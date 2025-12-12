import React from 'react';
import { CalendarGrid } from '../components/CalendarGrid';
import { RecordDetail } from '../components/RecordDetail';
import { useDance } from '../context/DanceContext';

export const CalendarPage: React.FC = () => {
  const { selectedDate } = useDance();

  return (
    <div className="h-full overflow-y-auto overflow-x-hidden bg-white dark:bg-gray-900 scroll-smooth">
      {/* 
        Container setup:
        The CalendarGrid is at the top.
        The RecordDetail follows. 
        Scrolling the page moves the Grid up and reveals more details.
      */}
      <div className="min-h-full flex flex-col">
        <div className="bg-white dark:bg-gray-900 z-10">
             <CalendarGrid compact={false} />
        </div>
        
        <div className="flex-1 bg-gray-50 dark:bg-gray-900 relative flex flex-col min-h-[50vh] rounded-t-3xl mt-2">
           {selectedDate ? (
             <RecordDetail />
           ) : (
             <div className="flex-1 flex flex-col items-center justify-center text-gray-400 dark:text-gray-600 p-8 space-y-4">
               <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <span className="text-3xl grayscale opacity-50">📅</span>
               </div>
               <p className="text-center font-medium">Select a date to view details</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};