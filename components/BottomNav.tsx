import React from 'react';
import { Calendar, PlusCircle, BarChart2 } from 'lucide-react';
import { useDance } from '../context/DanceContext';
import { View } from '../types';

export const BottomNav: React.FC = () => {
  const { currentView, setCurrentView } = useDance();

  const getButtonClass = (view: View) => {
    const isActive = currentView === view;
    return `flex flex-col items-center justify-center w-full h-full space-y-1 ${
      isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
    } transition-colors`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg z-50 pb-4">
      <div className="flex justify-around items-center h-full max-w-md mx-auto">
        <button
          onClick={() => setCurrentView('CALENDAR')}
          className={getButtonClass('CALENDAR')}
        >
          <Calendar size={24} strokeWidth={currentView === 'CALENDAR' ? 2.5 : 2} />
          <span className="text-xs font-medium">Calendar</span>
        </button>

        <button
          onClick={() => setCurrentView('UPLOAD')}
          className={`${getButtonClass('UPLOAD')} -mt-6`}
        >
          <div className="bg-indigo-600 dark:bg-indigo-500 rounded-full p-3 shadow-md shadow-indigo-200 dark:shadow-indigo-900/30 text-white hover:bg-indigo-700 dark:hover:bg-indigo-400 transition-transform active:scale-95">
             <PlusCircle size={32} strokeWidth={1.5} />
          </div>
          <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mt-1">Add</span>
        </button>

        <button
          onClick={() => setCurrentView('ANALYSIS')}
          className={getButtonClass('ANALYSIS')}
        >
          <BarChart2 size={24} strokeWidth={currentView === 'ANALYSIS' ? 2.5 : 2} />
          <span className="text-xs font-medium">Analysis</span>
        </button>
      </div>
    </div>
  );
};