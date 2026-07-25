import React from 'react';

export default function HeatmapGrid() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // Mock data: 7 days x 24 hours. Intensity 0-4
  const data = Array.from({ length: 7 }, () => 
    Array.from({ length: 24 }, () => Math.floor(Math.random() * 5))
  );

  const getColor = (intensity: number) => {
    switch (intensity) {
      case 1: return 'bg-purple-900/40';
      case 2: return 'bg-purple-700/60';
      case 3: return 'bg-purple-500/80';
      case 4: return 'bg-purple-400';
      default: return 'bg-white/5';
    }
  };

  return (
    <div className="w-full overflow-x-auto pb-4">
      <div className="min-w-[600px]">
        {/* Header - Hours */}
        <div className="flex ml-12 mb-2 text-xs text-gray-500">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="flex-1 text-center">
              {i % 4 === 0 ? i : ''}
            </div>
          ))}
        </div>
        
        {/* Grid */}
        <div className="flex flex-col gap-1">
          {days.map((day, dayIndex) => (
            <div key={day} className="flex items-center gap-2">
              <div className="w-10 text-xs text-gray-400 text-right">{day}</div>
              <div className="flex flex-1 gap-1">
                {data[dayIndex].map((intensity, hourIndex) => (
                  <div
                    key={hourIndex}
                    className={`flex-1 h-4 rounded-sm ${getColor(intensity)} transition-colors hover:ring-1 ring-white/50 cursor-pointer`}
                    title={`${day} ${hourIndex}:00 - Intensity ${intensity}`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
