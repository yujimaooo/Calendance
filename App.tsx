import React from 'react';
import { DanceProvider, useDance } from './context/DanceContext';
import { CalendarPage } from './pages/CalendarPage';
import { UploadPage } from './pages/UploadPage';
import { AnalysisPage } from './pages/AnalysisPage';
import { BottomNav } from './components/BottomNav';

const MainLayout: React.FC = () => {
  const { currentView } = useDance();

  return (
    <div className="h-full w-full md:max-w-md md:h-[850px] bg-white dark:bg-gray-900 md:rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col md:border-8 md:border-gray-900 transition-colors duration-300">
      <main className="flex-1 overflow-hidden relative bg-white dark:bg-gray-900">
        {currentView === 'CALENDAR' && <CalendarPage />}
        {currentView === 'UPLOAD' && <UploadPage />}
        {currentView === 'ANALYSIS' && <AnalysisPage />}
      </main>
      
      {currentView !== 'UPLOAD' && <BottomNav />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <DanceProvider>
      <div className="h-screen w-screen bg-gray-100 dark:bg-gray-950 flex items-center justify-center overflow-hidden transition-colors duration-300">
        <MainLayout />
      </div>
    </DanceProvider>
  );
};

export default App;