import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface HourBlock {
  hour: number;
  focusMinutes: number;
  distractMinutes: number;
}

// Generate mock hourly data seeded from current time
function generateTimelineData(): HourBlock[] {
  const now = new Date();
  const currentHour = now.getHours();
  const blocks: HourBlock[] = [];

  for (let h = 6; h <= currentHour; h++) {
    const rand = Math.random();
    blocks.push({
      hour: h,
      focusMinutes: h < currentHour ? Math.floor(rand * 55 + 5) : Math.floor(rand * 30),
      distractMinutes: h < currentHour ? Math.floor((1 - rand) * 20) : Math.floor(Math.random() * 10),
    });
  }
  return blocks;
}

const HOUR_LABELS = ['6AM','7AM','8AM','9AM','10AM','11AM','12PM','1PM','2PM','3PM','4PM','5PM','6PM','7PM','8PM','9PM','10PM'];

export default function ProductivityTimeline() {
  const [blocks, setBlocks] = useState<HourBlock[]>(generateTimelineData());

  // Refresh every 60s to simulate live update
  useEffect(() => {
    const id = setInterval(() => setBlocks(generateTimelineData()), 60000);
    return () => clearInterval(id);
  }, []);

  const maxMinutes = 60;

  return (
    <div className="w-full">
      <div className="flex items-end gap-1.5" style={{ height: 80 }}>
        {blocks.map((b, i) => {
          const focusH = (b.focusMinutes / maxMinutes) * 80;
          const distractH = (b.distractMinutes / maxMinutes) * 80;
          const label = HOUR_LABELS[b.hour - 6] ?? `${b.hour}h`;

          return (
            <div key={b.hour} className="flex-1 flex flex-col items-center gap-0.5 group relative">
              {/* Tooltip */}
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-zinc-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-[10px] text-zinc-300 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 shadow-xl">
                <span className="text-cyan-400 font-bold">{b.focusMinutes}m focus</span>
                {b.distractMinutes > 0 && <span className="text-rose-400 font-bold"> · {b.distractMinutes}m distracted</span>}
              </div>

              {/* Stacked bar */}
              <div className="w-full flex flex-col justify-end gap-px" style={{ height: 72 }}>
                {b.distractMinutes > 0 && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: distractH }}
                    transition={{ delay: i * 0.04, duration: 0.5, ease: 'easeOut' }}
                    className="w-full rounded-t-sm bg-rose-500/60"
                    style={{ minHeight: 2 }}
                  />
                )}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: focusH }}
                  transition={{ delay: i * 0.04, duration: 0.5, ease: 'easeOut' }}
                  className="w-full rounded-t-sm bg-cyan-500/70 group-hover:bg-cyan-400/80 transition-colors"
                  style={{ minHeight: b.focusMinutes > 0 ? 4 : 0 }}
                />
              </div>

              <span className="text-[8px] text-zinc-600 font-bold">{label}</span>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-cyan-500/70" />
          <span className="text-[10px] text-zinc-500 font-semibold">Focus</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-rose-500/60" />
          <span className="text-[10px] text-zinc-500 font-semibold">Distraction</span>
        </div>
      </div>
    </div>
  );
}
