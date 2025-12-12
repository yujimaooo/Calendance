export type View = 'CALENDAR' | 'UPLOAD' | 'ANALYSIS';

export enum Mood {
  HAPPY = '😊',
  TIRED = '😤',
  ENERGIZED = '🤩',
  RELAXED = '😌',
  FRUSTRATED = '😕',
}

export enum Difficulty {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced',
  OPEN = 'Open',
}

export interface DanceRecord {
  id: string;
  date: string; // ISO string YYYY-MM-DD
  timestamp: number;
  style: string;
  durationMinutes: number;
  studio: string;
  instructor: string;
  difficulty: Difficulty;
  mood: Mood;
  notes: string;
  musicTitle: string;
  mediaUrl?: string;
  mediaType?: 'video' | 'image';
}

export type TimeRange = 'WEEK' | 'MONTH' | 'LAST_MONTH' | 'YEAR';
