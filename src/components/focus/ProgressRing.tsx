import React from 'react';
import { motion } from 'framer-motion';

interface Props {
  elapsed: number; // in seconds
  target?: number; // in seconds
}

export default function ProgressRing({ elapsed, target = 3600 }: Props) {
  const radius = 130;
  const circumference = 2 * Math.PI * radius;
  // If no target, just show a looping or full ring. For now assume target exists.
  const percentage = Math.min(100, Math.max(0, (elapsed / target) * 100));
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0) return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative flex h-[300px] w-[300px] items-center justify-center">
      <svg className="absolute inset-0 h-full w-full -rotate-90 transform">
        {/* Outer decorative ring */}
        <circle
          cx="150"
          cy="150"
          r={radius + 15}
          stroke="rgba(168, 85, 247, 0.1)"
          strokeWidth="1"
          fill="transparent"
          strokeDasharray="4 4"
        />
        {/* Background ring */}
        <circle
          cx="150"
          cy="150"
          r={radius}
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="8"
          fill="transparent"
        />
        <defs>
          <linearGradient id="focusGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
        {/* Progress ring */}
        <motion.circle
          cx="150"
          cy="150"
          r={radius}
          stroke="url(#focusGradient)"
          strokeWidth="8"
          fill="transparent"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.5, ease: "linear" }}
          style={{ strokeDasharray: circumference }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="font-mono text-5xl font-bold tracking-tight text-white drop-shadow-lg">
          {formatTime(elapsed)}
        </span>
        <span className="mt-2 text-sm font-medium text-purple-400/80 uppercase tracking-widest">
          of target time
        </span>
      </div>
    </div>
  );
}
