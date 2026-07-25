import React from 'react';
import { motion } from 'framer-motion';

interface Props {
  score: number;
  label: string;
}

export default function ProductivityScore({ score, label }: Props) {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center py-4">
      <div className="relative flex h-[200px] w-[200px] items-center justify-center">
        {/* Outer tick ring (static) */}
        <svg className="absolute inset-0 h-full w-full -rotate-90 transform">
          <circle
            cx="100"
            cy="100"
            r={radius + 15}
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="2"
            fill="transparent"
            strokeDasharray="4 8"
          />
        </svg>

        {/* Background ring */}
        <svg className="absolute inset-0 h-full w-full -rotate-90 transform">
          <circle
            cx="100"
            cy="100"
            r={radius}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="12"
            fill="transparent"
          />
          
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>

          {/* Progress ring */}
          <motion.circle
            cx="100"
            cy="100"
            r={radius}
            stroke="url(#scoreGradient)"
            strokeWidth="12"
            fill="transparent"
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{ strokeDasharray: circumference }}
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center text-center">
          <motion.span 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-white to-gray-400 bg-clip-text text-5xl font-bold text-transparent"
          >
            {Math.round(score)}
          </motion.span>
          <span className="text-xs font-medium text-gray-500 uppercase tracking-widest mt-1">Score</span>
        </div>
      </div>
      <p className="mt-6 text-sm font-medium text-gray-400">{label}</p>
    </div>
  );
}
