import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface Props {
  score: number;
  deepWorkMinutes: number;
  distractionCount: number;
  recoveredCount: number;
  trend?: number;
}

export default function FocusScoreRing({ score, deepWorkMinutes, distractionCount, recoveredCount, trend = 0 }: Props) {
  const radius = 68;
  const stroke = 8;
  const normalizedRadius = radius - stroke;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const deepWorkHours = Math.floor(deepWorkMinutes / 60);
  const deepWorkMins = deepWorkMinutes % 60;

  const scoreColor = score >= 80 ? '#22d3ee' : score >= 60 ? '#a855f7' : score >= 40 ? '#f59e0b' : '#ef4444';
  const glowColor = score >= 80 ? 'rgba(34,211,238,0.3)' : score >= 60 ? 'rgba(168,85,247,0.3)' : 'rgba(245,158,11,0.3)';

  return (
    <div className="flex flex-col items-center w-full">
      {/* SVG Ring */}
      <div className="relative flex items-center justify-center mb-4" style={{ filter: `drop-shadow(0 0 18px ${glowColor})` }}>
        <svg height={radius * 2} width={radius * 2}>
          {/* Background track */}
          <circle
            stroke="rgba(255,255,255,0.04)"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Animated progress */}
          <motion.circle
            stroke={scoreColor}
            fill="transparent"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            style={{ transformOrigin: '50% 50%', transform: 'rotate(-90deg)' }}
          />
        </svg>
        {/* Center label */}
        <div className="absolute flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, type: 'spring' }}
            className="text-4xl font-black text-white leading-none"
          >
            {score}%
          </motion.span>
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Focus Score</span>
        </div>
      </div>

      {/* Trend */}
      {trend !== 0 && (
        <div className={`flex items-center gap-1.5 text-xs font-bold mb-5 px-3 py-1 rounded-full border ${
          trend > 0 
            ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' 
            : 'text-red-400 bg-red-500/10 border-red-500/20'
        }`}>
          {trend > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {trend > 0 ? '+' : ''}{trend}% vs yesterday
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3 w-full">
        {[
          { label: 'Deep Work', value: `${deepWorkHours}h ${deepWorkMins}m`, color: 'text-cyan-400' },
          { label: 'Distractions', value: String(distractionCount), color: 'text-rose-400' },
          { label: 'Recovered', value: String(recoveredCount), color: 'text-emerald-400' },
        ].map((stat) => (
          <div key={stat.label} className="flex flex-col items-center p-2.5 rounded-xl bg-white/3 border border-white/5">
            <span className={`text-lg font-black ${stat.color}`}>{stat.value}</span>
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5 text-center leading-tight">{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
