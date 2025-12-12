import React, { useState, useRef } from 'react';
import { ChevronLeft, Upload, Music, X } from 'lucide-react';
import { useDance } from '../context/DanceContext';
import { DanceRecord, Difficulty, Mood } from '../types';
import { MOODS, DIFFICULTIES, MOCK_STYLES, MOCK_STUDIOS } from '../constants';

export const UploadPage: React.FC = () => {
  const { setCurrentView, addRecord } = useDance();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [style, setStyle] = useState('');
  const [duration, setDuration] = useState('60');
  const [studio, setStudio] = useState('');
  const [instructor, setInstructor] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.INTERMEDIATE);
  const [mood, setMood] = useState<Mood | null>(null);
  const [notes, setNotes] = useState('');
  const [musicTitle, setMusicTitle] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMediaFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSave = () => {
    // Validation: Allow if media is present OR if Mood & Style are present.
    const hasMedia = !!previewUrl;
    const hasDetails = !!mood && !!style;

    if (!hasMedia && !hasDetails) {
      alert("Please upload a video/photo OR select a mood and style.");
      return;
    }

    const newRecord: DanceRecord = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      timestamp: Date.now(),
      style: style || 'Freestyle', // Default if missing
      durationMinutes: parseInt(duration) || 0,
      studio: studio || 'Unknown Studio',
      instructor: instructor || 'Self',
      difficulty,
      mood: mood || Mood.HAPPY, // Default if missing
      notes,
      musicTitle,
      mediaUrl: previewUrl || undefined, // Note: In a real app, upload this to cloud storage.
      mediaType: mediaFile?.type.startsWith('video') ? 'video' : 'image'
    };

    addRecord(newRecord);
    setCurrentView('CALENDAR');
  };

  return (
    <div className="h-full bg-gray-50 dark:bg-gray-900 flex flex-col relative">
      {/* Fixed Header */}
      <div className="bg-white dark:bg-gray-800 px-4 py-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 z-30 flex-shrink-0">
        <button 
          onClick={() => setCurrentView('CALENDAR')}
          className="p-2 -ml-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-bold text-gray-900 dark:text-white">Add Session</h1>
        <div className="w-8"></div> {/* Spacer for alignment */}
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-32">
        
        {/* Mood Section */}
        <section>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">How did it feel?</label>
          <div className="flex justify-between px-2">
            {MOODS.map((m) => (
              <button
                key={m.value}
                onClick={() => setMood(m.value)}
                className={`flex flex-col items-center gap-1 transition-all ${
                  mood === m.value ? 'scale-110' : 'opacity-60 grayscale hover:grayscale-0 hover:opacity-100'
                }`}
              >
                <span className="text-4xl filter drop-shadow-sm">{m.value}</span>
                <span className={`text-[10px] font-medium ${mood === m.value ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'}`}>
                  {m.label}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Media Upload */}
        <section>
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 aspect-video flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750 hover:border-indigo-300 dark:hover:border-indigo-500 transition-colors relative overflow-hidden"
          >
            {previewUrl ? (
              mediaFile?.type.startsWith('video') ? (
                <video src={previewUrl} className="w-full h-full object-cover" />
              ) : (
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              )
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 dark:text-indigo-400 flex items-center justify-center mb-2">
                  <Upload size={20} />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Add Video or Photo</p>
              </>
            )}
            
            {previewUrl && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setMediaFile(null);
                  setPreviewUrl(null);
                }}
                className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <input 
            type="file" 
            accept="video/*,image/*" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleFileChange}
          />
        </section>

        {/* Basic Info */}
        <section className="space-y-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
           {/* Style */}
           <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Style</label>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {MOCK_STYLES.map(s => (
                <button
                  key={s}
                  onClick={() => setStyle(s)}
                  className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap border transition-colors ${
                    style === s 
                      ? 'bg-indigo-600 text-white border-indigo-600 dark:bg-indigo-500 dark:border-indigo-500' 
                      : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Duration (min)</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              />
            </div>
             <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Studio</label>
             <input 
                list="studios" 
                value={studio}
                onChange={(e) => setStudio(e.target.value)}
                placeholder="Select or type new studio name"
                className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
             />
             <datalist id="studios">
                {MOCK_STUDIOS.map(s => <option key={s} value={s} />)}
             </datalist>
          </div>

          <div>
             <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Instructor</label>
             <input 
                value={instructor}
                onChange={(e) => setInstructor(e.target.value)}
                placeholder="Who taught the class?"
                className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
             />
          </div>
        </section>

        {/* Music */}
        <section className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-3">
          <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full text-green-600 dark:text-green-400">
            <Music size={20} />
          </div>
          <div className="flex-1">
             <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Song</label>
             <input
              value={musicTitle}
              onChange={(e) => setMusicTitle(e.target.value)}
              placeholder="Track Title - Artist"
              className="w-full text-sm outline-none placeholder:text-gray-300 dark:placeholder:text-gray-600 bg-transparent text-gray-900 dark:text-white"
             />
          </div>
        </section>

        {/* Notes */}
        <section className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            placeholder="Focus points, choreography details, feelings..."
            className="w-full text-sm outline-none resize-none placeholder:text-gray-300 dark:placeholder:text-gray-600 bg-transparent text-gray-900 dark:text-white"
          />
        </section>
      </div>

      {/* Fixed Bottom Save Button */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 z-30 pb-8">
        <button 
          onClick={handleSave}
          className="w-full py-4 bg-indigo-600 dark:bg-indigo-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-indigo-200 dark:shadow-indigo-900/50 hover:bg-indigo-700 dark:hover:bg-indigo-400 active:scale-[0.98] transition-all"
        >
          Save Session
        </button>
      </div>
    </div>
  );
};