import { Difficulty, Mood } from "./types";

export const MOODS = [
  { value: Mood.HAPPY, label: 'Happy' },
  { value: Mood.ENERGIZED, label: 'Energized' },
  { value: Mood.RELAXED, label: 'Relaxed' },
  { value: Mood.TIRED, label: 'Tired' },
  { value: Mood.FRUSTRATED, label: 'Frustrated' },
];

export const DIFFICULTIES = [
  Difficulty.BEGINNER,
  Difficulty.INTERMEDIATE,
  Difficulty.ADVANCED,
  Difficulty.OPEN,
];

export const MOCK_STYLES = [
  'Hip Hop',
  'Contemporary',
  'Ballet',
  'Jazz',
  'House',
  'K-Pop',
  'Heels',
];

export const MOCK_STUDIOS = [
  'Millennium',
  'Playground LA',
  'Broadway Dance Center',
  'Local Gym',
  'Home Studio',
];
