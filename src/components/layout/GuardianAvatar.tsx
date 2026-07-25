import React from 'react';
import { motion } from 'framer-motion';
import { useMonitorStore } from '../../store/useMonitorStore';

interface Props {
  isCollapsed: boolean;
}

export default function GuardianAvatar({ isCollapsed }: Props) {
  const { currentClassification, isConnected } = useMonitorStore();

  // Determine state based on connection and classification
  let avatarState: 'happy' | 'neutral' | 'angry' | 'sleeping' = 'sleeping';
  
  if (isConnected) {
    if (currentClassification === 'PRODUCTIVE') {
      avatarState = 'happy';
    } else if (currentClassification === 'DISTRACTION') {
      avatarState = 'angry';
    } else if (currentClassification === 'NEUTRAL') {
      avatarState = 'neutral';
    }
  }

  // Avatar themes / animations
  const faceColors = {
    happy: 'from-cyan-500/20 to-purple-500/20 border-cyan-500/30 text-cyan-400',
    neutral: 'from-zinc-800 to-zinc-900 border-zinc-700/50 text-zinc-400',
    angry: 'from-red-950/30 to-rose-950/20 border-red-500/30 text-red-400',
    sleeping: 'from-indigo-950/20 to-zinc-900/20 border-indigo-500/20 text-indigo-400',
  };

  const eyeColors = {
    happy: 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]',
    neutral: 'bg-zinc-400',
    angry: 'bg-red-400 shadow-[0_0_8px_#ef4444]',
    sleeping: 'bg-indigo-400/50',
  };

  return (
    <div className={`px-4 py-3 flex flex-col items-center justify-center border-t border-white/5 bg-white/2 ${isCollapsed ? 'py-4' : ''}`}>
      <motion.div
        animate={{
          y: avatarState === 'sleeping' ? [0, -4, 0] : [0, -2, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: avatarState === 'sleeping' ? 3.5 : 2,
          ease: 'easeInOut',
        }}
        className={`relative flex h-12 w-12 items-center justify-center rounded-2xl border bg-gradient-to-b shadow-lg transition-colors duration-500 ${faceColors[avatarState]}`}
      >
        {/* Antennas/Ears */}
        <div className="absolute top-[-4px] left-3 w-1.5 h-2.5 bg-current rounded-t-full opacity-60" />
        <div className="absolute top-[-4px] right-3 w-1.5 h-2.5 bg-current rounded-t-full opacity-60" />

        {/* Eyes Row */}
        <div className="flex justify-between w-6 mb-2 mt-1">
          {avatarState === 'sleeping' ? (
            <>
              {/* Closed Sleeping Eyes */}
              <div className="w-2 h-[2px] bg-indigo-400/50 rounded" />
              <div className="w-2 h-[2px] bg-indigo-400/50 rounded" />
            </>
          ) : avatarState === 'angry' ? (
            <>
              {/* Angry slanted eyes */}
              <div className="relative w-2 h-2">
                <div className="absolute top-0 left-0 w-2.5 h-[2px] bg-red-400 rotate-[20deg] origin-left" />
                <div className={`w-2 h-2 rounded-full mt-[3px] ${eyeColors.angry}`} />
              </div>
              <div className="relative w-2 h-2">
                <div className="absolute top-0 right-0 w-2.5 h-[2px] bg-red-400 -rotate-[20deg] origin-right" />
                <div className={`w-2 h-2 rounded-full mt-[3px] ${eyeColors.angry}`} />
              </div>
            </>
          ) : (
            <>
              {/* Standard eyes */}
              <motion.div 
                animate={avatarState === 'happy' ? { scaleY: [1, 0.1, 1] } : {}}
                transition={{ repeat: Infinity, duration: 4, repeatDelay: 1 }}
                className={`w-2 h-2 rounded-full ${eyeColors[avatarState]}`} 
              />
              <motion.div 
                animate={avatarState === 'happy' ? { scaleY: [1, 0.1, 1] } : {}}
                transition={{ repeat: Infinity, duration: 4, repeatDelay: 1 }}
                className={`w-2 h-2 rounded-full ${eyeColors[avatarState]}`} 
              />
            </>
          )}
        </div>

        {/* Mouth */}
        <div className="absolute bottom-3 flex items-center justify-center">
          {avatarState === 'happy' && (
            <svg className="w-3 h-2 text-cyan-400" viewBox="0 0 12 6" fill="none">
              <path d="M1 1C3 4.5 9 4.5 11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          )}
          {avatarState === 'neutral' && (
            <div className="w-3 h-[2px] bg-zinc-400 rounded" />
          )}
          {avatarState === 'angry' && (
            <svg className="w-3 h-1.5 text-red-400" viewBox="0 0 12 4" fill="none">
              <path d="M1 3C3 1 9 1 11 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          )}
          {avatarState === 'sleeping' && (
            <div className="text-[7px] font-bold text-indigo-400/60 leading-none translate-y-[-1px] select-none">zZZ</div>
          )}
        </div>
      </motion.div>
      
      {!isCollapsed && (
        <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mt-2">
          {avatarState === 'happy' && '😊 Focus Active'}
          {avatarState === 'neutral' && '😐 Idle / Browsing'}
          {avatarState === 'angry' && '😡 Distraction!'}
          {avatarState === 'sleeping' && '💤 Sleep Mode'}
        </span>
      )}
    </div>
  );
}
