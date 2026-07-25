import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Flame, Zap, Star, Target, Moon, Sun, Cpu, BookOpen, Coffee, Award } from 'lucide-react';

interface Achievement {
  id: string;
  icon: React.ReactNode;
  label: string;
  description: string;
  xp: number;
  unlocked: boolean;
  unlockedAt?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: '7day', icon: <Flame size={22} />, label: '7-Day Streak', rarity: 'rare',
    description: 'Maintain a daily focus session for 7 consecutive days.', xp: 150, unlocked: true, unlockedAt: 'Jul 24'
  },
  {
    id: '30day', icon: <Award size={22} />, label: '30-Day Streak', rarity: 'legendary',
    description: 'Maintain a daily focus session for 30 consecutive days.', xp: 500, unlocked: false
  },
  {
    id: 'deepwork', icon: <Zap size={22} />, label: 'Deep Work Master', rarity: 'epic',
    description: 'Complete a 4+ hour uninterrupted focus session.', xp: 300, unlocked: true, unlockedAt: 'Jul 21'
  },
  {
    id: 'nodistract', icon: <Target size={22} />, label: 'Zero Distraction Day', rarity: 'epic',
    description: 'Complete a full day with zero distraction events.', xp: 250, unlocked: false
  },
  {
    id: '5hours', icon: <Star size={22} />, label: '5h Focus Champion', rarity: 'rare',
    description: 'Accumulate 5 hours of focused work in a single day.', xp: 200, unlocked: true, unlockedAt: 'Jul 23'
  },
  {
    id: 'coding', icon: <Cpu size={22} />, label: 'Coding Beast', rarity: 'rare',
    description: 'Spend 3+ hours in VS Code or similar IDE in one day.', xp: 180, unlocked: false
  },
  {
    id: 'morning', icon: <Sun size={22} />, label: 'Morning Warrior', rarity: 'common',
    description: 'Start a focus session before 8 AM.', xp: 75, unlocked: true, unlockedAt: 'Jul 20'
  },
  {
    id: 'night', icon: <Moon size={22} />, label: 'Night Owl', rarity: 'common',
    description: 'Complete a focus session after 10 PM.', xp: 75, unlocked: false
  },
  {
    id: 'study', icon: <BookOpen size={22} />, label: 'Study Legend', rarity: 'epic',
    description: 'Log 40+ hours of study time in a single week.', xp: 400, unlocked: false
  },
  {
    id: 'breaks', icon: <Coffee size={22} />, label: 'Balance Master', rarity: 'common',
    description: 'Take at least 5 smart breaks in a single day.', xp: 100, unlocked: true, unlockedAt: 'Jul 22'
  },
  {
    id: 'trophy', icon: <Trophy size={22} />, label: 'Productivity Legend', rarity: 'legendary',
    description: 'Achieve a 100% focus score for a full day.', xp: 1000, unlocked: false
  },
];

const RARITY_STYLES = {
  common: { border: 'border-zinc-700', bg: 'bg-zinc-800/50', badge: 'bg-zinc-700 text-zinc-300', glow: '' },
  rare: { border: 'border-blue-500/40', bg: 'bg-blue-500/5', badge: 'bg-blue-500/20 text-blue-300', glow: 'shadow-[0_0_20px_rgba(59,130,246,0.15)]' },
  epic: { border: 'border-purple-500/40', bg: 'bg-purple-500/5', badge: 'bg-purple-500/20 text-purple-300', glow: 'shadow-[0_0_20px_rgba(168,85,247,0.15)]' },
  legendary: { border: 'border-amber-500/40', bg: 'bg-amber-500/5', badge: 'bg-amber-500/20 text-amber-300', glow: 'shadow-[0_0_24px_rgba(245,158,11,0.2)]' },
};

interface Props {
  achievement: Achievement;
  index: number;
}

export default function AchievementCard({ achievement: a, index }: Props) {
  const styles = RARITY_STYLES[a.rarity];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.05, type: 'spring', stiffness: 280 }}
      whileHover={a.unlocked ? { scale: 1.02, y: -2 } : {}}
      className={`relative flex flex-col p-5 rounded-2xl border transition-all duration-300 ${
        a.unlocked
          ? `${styles.border} ${styles.bg} ${styles.glow}`
          : 'border-white/5 bg-zinc-900/40 opacity-50 grayscale'
      }`}
    >
      {/* Rarity badge */}
      <div className="absolute top-3 right-3">
        <span className={`text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full ${styles.badge}`}>
          {a.rarity}
        </span>
      </div>

      {/* Locked overlay */}
      {!a.unlocked && (
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-zinc-950/20 z-10">
          <span className="text-2xl">🔒</span>
        </div>
      )}

      {/* Icon */}
      <div className={`flex h-11 w-11 items-center justify-center rounded-xl mb-3 ${
        a.unlocked ? 'bg-white/10 text-white' : 'bg-zinc-800 text-zinc-600'
      }`}>
        {a.icon}
      </div>

      <h3 className="text-sm font-bold text-white mb-1">{a.label}</h3>
      <p className="text-xs text-zinc-500 leading-relaxed flex-1">{a.description}</p>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
        <span className={`text-xs font-bold ${a.unlocked ? 'text-emerald-400' : 'text-zinc-600'}`}>
          +{a.xp} XP
        </span>
        {a.unlocked && a.unlockedAt && (
          <span className="text-[10px] text-zinc-600">Unlocked {a.unlockedAt}</span>
        )}
      </div>
    </motion.div>
  );
}

export { ACHIEVEMENTS };
