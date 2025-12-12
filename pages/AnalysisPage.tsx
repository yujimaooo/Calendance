import React, { useState, useMemo } from 'react';
import { useDance } from '../context/DanceContext';
import { TimeRange } from '../types';
import { Clock, Award, MapPin, Zap, Moon, Sun, TrendingUp } from 'lucide-react';
import { isAfter, format, getDay, getWeek, getMonth, isSameDay, isSameWeek, isSameMonth, addDays, startOfDay, endOfDay, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval, endOfWeek, endOfYear, endOfMonth } from 'date-fns';

// Helper for startOfWeek (Monday start)
const getStartOfWeek = (d: Date) => {
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  const day = date.getDay();
  // If day is 0 (Sunday), diff is -6 (last Monday). 
  // If day is 1 (Monday), diff is 0.
  // If day is 2 (Tuesday), diff is -1 (yesterday).
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  date.setDate(diff);
  return date;
};

// Lightweight SVG Donut Chart Component
const SimpleDonutChart = ({ data, colors }: { data: { name: string; value: number }[], colors: string[] }) => {
  const size = 100;
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const total = data.reduce((acc, cur) => acc + cur.value, 0);
  
  let currentAngle = 0;

  if (total === 0) return <div className="w-full h-full rounded-full border-4 border-gray-100 dark:border-gray-700 opacity-20" />;

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full transform -rotate-90">
      {data.map((item, index) => {
        const angle = (item.value / total) * 360;
        const dashArray = (angle / 360) * (2 * Math.PI * radius);
        const circumference = 2 * Math.PI * radius;
        
        // Simple circle segment for single item
        if (data.length === 1) {
            return (
                 <circle
                    key={item.name}
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="transparent"
                    stroke={colors[index % colors.length]}
                    strokeWidth={strokeWidth}
                 />
            )
        }

        const circle = (
          <circle
            key={item.name}
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke={colors[index % colors.length]}
            strokeWidth={strokeWidth}
            strokeDasharray={`${dashArray} ${circumference}`}
            strokeDashoffset={-1 * (currentAngle / 360) * circumference} // Negative for clockwise
          />
        );
        currentAngle += angle;
        return circle;
      })}
    </svg>
  );
};

// Lightweight SVG Bar Chart Component
const SimpleBarChart = ({ data }: { data: { label: string; value: number; fullLabel?: string }[] }) => {
  const height = 120;
  const width = 300; // flexible via viewBox
  const maxVal = Math.max(...data.map(d => d.value), 1); // Avoid div by 0
  
  return (
    <div className="w-full h-40">
      <svg viewBox={`0 0 ${width} ${height + 20}`} className="w-full h-full">
        {data.map((d, i) => {
          const barHeight = (d.value / maxVal) * (height * 0.8);
          const barWidth = (width / data.length) * 0.6;
          const x = (width / data.length) * i + ((width / data.length) - barWidth) / 2;
          const y = height - barHeight;
          
          return (
            <g key={i}>
              {/* Bar */}
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                rx={4}
                className="fill-indigo-500 dark:fill-indigo-400"
              />
              {/* Value Label (only if value > 0) */}
              {d.value > 0 && (
                <text x={x + barWidth/2} y={y - 5} textAnchor="middle" fontSize="8" className="fill-gray-500 dark:fill-gray-400">
                  {Math.round(d.value)}h
                </text>
              )}
              {/* Axis Label */}
              <text x={x + barWidth/2} y={height + 15} textAnchor="middle" fontSize="8" className="fill-gray-500 dark:fill-gray-400 font-medium">
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export const AnalysisPage: React.FC = () => {
  const { records, isDarkMode, toggleTheme } = useDance();
  const [range, setRange] = useState<TimeRange>('MONTH');

  // Filter records based on range
  const { filteredRecords, startDate, endDate } = useMemo(() => {
    const now = new Date();
    let start: Date;
    let end: Date = endOfDay(now);

    switch (range) {
      case 'WEEK': 
        start = getStartOfWeek(now); 
        end = endOfWeek(now, { weekStartsOn: 1 });
        break;
      case 'MONTH': 
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = endOfMonth(start);
        break;
      case 'LAST_MONTH': 
        // Logic for subMonths(now, 1) and startOfMonth
        start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        end = endOfMonth(start);
        break;
      case 'YEAR': 
        start = new Date(now.getFullYear(), 0, 1);
        end = endOfYear(now);
        break;
      default: 
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = endOfMonth(now);
    }

    const filtered = records.filter(r => {
      const d = new Date(r.date);
      return d >= start && d <= end;
    });

    return { filteredRecords: filtered, startDate: start, endDate: end };
  }, [records, range]);

  // Aggregation Logic
  const stats = useMemo(() => {
    const totalMinutes = filteredRecords.reduce((acc, r) => acc + r.durationMinutes, 0);
    const totalHours = (totalMinutes / 60).toFixed(1);
    
    // Style distribution
    const styleCount: Record<string, number> = {};
    filteredRecords.forEach(r => {
      styleCount[r.style] = (styleCount[r.style] || 0) + 1;
    });
    const styleData = Object.entries(styleCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a,b) => b.value - a.value);

    // Top Instructor
    const instructorCount: Record<string, number> = {};
    filteredRecords.forEach(r => {
      instructorCount[r.instructor] = (instructorCount[r.instructor] || 0) + 1;
    });
    const topInstructorEntry = Object.entries(instructorCount).sort((a, b) => b[1] - a[1])[0];
    const topInstructor = topInstructorEntry ? topInstructorEntry[0] : '-';
    const topInstructorCount = topInstructorEntry ? topInstructorEntry[1] : 0;

    // Top Studio
    const studioCount: Record<string, number> = {};
    filteredRecords.forEach(r => {
      studioCount[r.studio] = (studioCount[r.studio] || 0) + 1;
    });
    const topStudioEntry = Object.entries(studioCount).sort((a, b) => b[1] - a[1])[0];
    const topStudio = topStudioEntry ? topStudioEntry[0] : '-';
    const topStudioCount = topStudioEntry ? topStudioEntry[1] : 0;

    return { totalHours, count: filteredRecords.length, styleData, topInstructor, topInstructorCount, topStudio, topStudioCount };
  }, [filteredRecords]);

  // Trend Data Logic
  const trendData = useMemo(() => {
    let data: { label: string; value: number }[] = [];

    if (range === 'WEEK') {
      // Mon - Sun
      const days = eachDayOfInterval({ start: startDate, end: endDate });
      data = days.map(day => {
        const dayTotal = filteredRecords
          .filter(r => isSameDay(new Date(r.date), day))
          .reduce((acc, r) => acc + r.durationMinutes, 0);
        return {
          label: format(day, 'EEE'),
          value: dayTotal / 60 // hours
        };
      });
    } else if (range === 'MONTH' || range === 'LAST_MONTH') {
      // Custom 7-day buckets starting from 1st of month (1-7, 8-14, etc.)
      let current = new Date(startDate);
      const buckets = [];
      
      while (current <= endDate) {
         buckets.push(new Date(current));
         current = addDays(current, 7);
      }

      data = buckets.map(bucketStart => {
        let bucketEnd = addDays(bucketStart, 6);
        if (bucketEnd > endDate) bucketEnd = new Date(endDate);
        
        const bucketTotal = filteredRecords
          .filter(r => {
            const d = new Date(r.date);
            return d >= startOfDay(bucketStart) && d <= endOfDay(bucketEnd);
          })
          .reduce((acc, r) => acc + r.durationMinutes, 0);

        return {
          label: `${format(bucketStart, 'M/d')}-${format(bucketEnd, 'M/d')}`,
          value: bucketTotal / 60
        };
      });

    } else if (range === 'YEAR') {
       const months = eachMonthOfInterval({ start: startDate, end: endDate });
       data = months.map(monthStart => {
         const monthTotal = filteredRecords
          .filter(r => isSameMonth(new Date(r.date), monthStart))
          .reduce((acc, r) => acc + r.durationMinutes, 0);
         return {
           label: format(monthStart, 'MMM'),
           value: monthTotal / 60
         };
       });
    }

    return data;
  }, [filteredRecords, range, startDate, endDate]);

  const COLORS = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6'];

  return (
    <div className="h-full bg-gray-50 dark:bg-gray-900 flex flex-col p-4 pb-24 overflow-y-auto no-scrollbar">
      <div className="flex justify-between items-center mb-6 mt-2">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Your Progress</h1>
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full bg-white dark:bg-gray-800 text-gray-600 dark:text-yellow-400 shadow-sm border border-gray-100 dark:border-gray-700"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      {/* Range Selector */}
      <div className="flex bg-gray-200 dark:bg-gray-800 p-1 rounded-lg mb-6 text-xs font-semibold">
        {['WEEK', 'MONTH', 'LAST_MONTH', 'YEAR'].map((r) => (
          <button
            key={r}
            onClick={() => setRange(r as TimeRange)}
            className={`flex-1 py-2 rounded-md transition-all ${
              range === r 
              ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm' 
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            {r.replace('_', ' ')}
          </button>
        ))}
      </div>

      {filteredRecords.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 dark:text-gray-600">
           <TrendingUp size={48} className="mb-4 opacity-50" />
           <p>No records found for this period.</p>
        </div>
      ) : (
        <div className="space-y-4">
          
          {/* Row 1: Total Time & Classes (Horizontal Layout) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-row items-center gap-3">
              <div className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 p-3 rounded-full flex-shrink-0">
                <Clock size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-xl font-bold text-gray-900 dark:text-white truncate">{stats.totalHours}h</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wide">Danced</p>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-row items-center gap-3">
               <div className="bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 p-3 rounded-full flex-shrink-0">
                <Zap size={20} />
              </div>
               <div className="min-w-0">
                <p className="text-xl font-bold text-gray-900 dark:text-white truncate">{stats.count}</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wide">Classes</p>
              </div>
            </div>
          </div>

          {/* Row 2: Top Instructor & Studio */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-2 text-orange-500 dark:text-orange-400">
                   <Award size={18} />
                   <span className="text-xs font-semibold uppercase text-gray-400">Top Instructor</span>
                </div>
                <div className="mt-2">
                  <p className="font-bold text-gray-900 dark:text-white truncate">{stats.topInstructor}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stats.topInstructorCount} sessions</p>
                </div>
            </div>
             <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-2 text-blue-500 dark:text-blue-400">
                   <MapPin size={18} />
                   <span className="text-xs font-semibold uppercase text-gray-400">Top Studio</span>
                </div>
                <div className="mt-2">
                   <p className="font-bold text-gray-900 dark:text-white truncate">{stats.topStudio}</p>
                   <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stats.topStudioCount} sessions</p>
                </div>
             </div>
          </div>

          {/* Row 3: Style Breakdown */}
          <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-6">Style Breakdown</h3>
            <div className="flex items-center justify-between px-6">
              {/* Left: Custom SVG Donut */}
              <div className="h-32 w-32 relative flex-shrink-0">
                <SimpleDonutChart data={stats.styleData} colors={COLORS} />
              </div>
              
              {/* Right: Legend */}
              <div className="flex-1 ml-8 space-y-3 overflow-y-auto max-h-40 no-scrollbar">
                 {stats.styleData.map((entry, index) => (
                    <div key={entry.name} className="flex items-center justify-between text-xs">
                       <div className="flex items-center">
                          <div className="w-2.5 h-2.5 rounded-full mr-2.5" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                          <span className="text-gray-700 dark:text-gray-300 font-medium">{entry.name}</span>
                       </div>
                       <span className="text-gray-500 dark:text-gray-500 font-bold">{entry.value}</span>
                    </div>
                 ))}
              </div>
            </div>
          </div>

          {/* New Section: Practice Trend */}
          <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={16} className="text-indigo-500" />
              <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Practice Trend</h3>
            </div>
            <SimpleBarChart data={trendData} />
          </div>


        </div>
      )}
    </div>
  );
};