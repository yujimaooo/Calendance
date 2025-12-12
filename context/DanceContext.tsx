import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DanceRecord, View, Mood, Difficulty } from '../types';
import { MOCK_STUDIOS, MOCK_STYLES, DIFFICULTIES } from '../constants';

interface DanceContextType {
  records: DanceRecord[];
  addRecord: (record: DanceRecord) => void;
  currentView: View;
  setCurrentView: (view: View) => void;
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const DanceContext = createContext<DanceContextType | undefined>(undefined);

// Mock data generator
const generateMockData = (): DanceRecord[] => {
  const records: DanceRecord[] = [];
  const moods = [Mood.HAPPY, Mood.TIRED, Mood.ENERGIZED, Mood.RELAXED, Mood.FRUSTRATED];
  const instructors = ['Alex', 'Sarah', 'Mike', 'Jasmine', 'Self', 'Emily'];
  const notesList = [
    "Really felt the music today!",
    "Hard choreography, need to practice the bridge.",
    "Tired but pushed through.",
    "Amazing energy in class.",
    "Worked on basics and foundation.",
    "Freestyle session was great."
  ];

  // Generate 20 records over the last 60 days
  for (let i = 0; i < 20; i++) {
    const daysAgo = Math.floor(Math.random() * 60);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    
    // Randomize time of day
    date.setHours(10 + Math.floor(Math.random() * 10), Math.floor(Math.random() * 4) * 15);

    // Randomly assign media to some records
    const hasMedia = Math.random() > 0.6;

    records.push({
      id: crypto.randomUUID(),
      date: date.toISOString(),
      timestamp: date.getTime(),
      style: MOCK_STYLES[Math.floor(Math.random() * MOCK_STYLES.length)],
      durationMinutes: 60 + (Math.floor(Math.random() * 3) * 15), // 60, 75, 90
      studio: MOCK_STUDIOS[Math.floor(Math.random() * MOCK_STUDIOS.length)],
      instructor: instructors[Math.floor(Math.random() * instructors.length)],
      difficulty: DIFFICULTIES[Math.floor(Math.random() * DIFFICULTIES.length)],
      mood: moods[Math.floor(Math.random() * moods.length)],
      notes: notesList[Math.floor(Math.random() * notesList.length)],
      musicTitle: "Test Track " + (i + 1),
      mediaUrl: hasMedia ? `https://picsum.photos/seed/${i}/400/300` : undefined,
      mediaType: hasMedia ? 'image' : undefined,
    });
  }
  return records.sort((a, b) => b.timestamp - a.timestamp);
};

export const DanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [records, setRecords] = useState<DanceRecord[]>([]);
  const [currentView, setCurrentView] = useState<View>('CALENDAR');
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load from local storage on mount or generate mock data
  useEffect(() => {
    const saved = localStorage.getItem('dance_records');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0) {
          setRecords(parsed);
        } else {
           const mock = generateMockData();
           setRecords(mock);
           localStorage.setItem('dance_records', JSON.stringify(mock));
        }
      } catch (e) {
        console.error("Failed to parse records", e);
        const mock = generateMockData();
        setRecords(mock);
      }
    } else {
      const mock = generateMockData();
      setRecords(mock);
      localStorage.setItem('dance_records', JSON.stringify(mock));
    }
  }, []);

  // Save to local storage whenever records change
  useEffect(() => {
    if (records.length > 0) {
      localStorage.setItem('dance_records', JSON.stringify(records));
    }
  }, [records]);

  // Dark mode handler
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(prev => !prev);

  const addRecord = (record: DanceRecord) => {
    setRecords((prev) => [...prev, record]);
  };

  return (
    <DanceContext.Provider value={{
      records,
      addRecord,
      currentView,
      setCurrentView,
      selectedDate,
      setSelectedDate,
      isDarkMode,
      toggleTheme
    }}>
      {children}
    </DanceContext.Provider>
  );
};

export const useDance = () => {
  const context = useContext(DanceContext);
  if (!context) {
    throw new Error('useDance must be used within a DanceProvider');
  }
  return context;
};