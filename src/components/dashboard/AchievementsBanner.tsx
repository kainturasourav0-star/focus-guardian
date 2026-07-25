import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Flame, Zap, Star, Target, Moon, Sun, Cpu } from 'lucide-react';

interface Achievement {
  id: string;
  icon: React.ReactNode;
  label: string;
  color: string;
  unlocked: boolean;
}

const ACHIEVEMENTS: Achievement[] = [
  { id: '7day', icon: <Flame size={14} />, label: '7-Day Streak', color: 'text-orange-400 bg-orange-500/10 border-orange-500/20', unlocked: true },
  { id: 'deepwork', icon: <Zap size={14} />, label: 'Deep Work Master', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20', unlocked: true },
  { id: 'nodistract', icon: <Target size={14} />, label: 'Zero Distraction Day', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', unlocked: false },
  { id: '5hours', icon: <Star size={14} />, label: '5h Focus', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20', unlocked: true },
  { id: 'coding', icon: <Cpu size={14} />, label: 'Coding Beast', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20', unlocked: false },
  { id: 'morning', icon: <Sun size={14} />, label: 'Morning Warrior', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', unlocked: true },
];

export default function AchievementsBanner() {
  return (
    <div className="flex flex-wrap gap-2">
      {ACHIEVEMENTS.map((a, i) => (
        <motion.div
          key={a.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.06, type: 'spring', stiffness: 300 }}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-xs font-bold transition-all ${
            a.unlocked
              ? `${a.color} hover:scale-105`
              : 'text-zinc-600 bg-zinc-900/50 border-zinc-800 opacity-50 grayscale'
          }`}
          title={a.unlocked ? `Unlocked: ${a.label}` : `Locked: ${a.label}`}
        >
          {a.icon}
          {a.label}
          {!a.unlocked && <span className="ml-0.5 opacity-60">🔒</span>}
        </motion.div>
      ))}
    </div>
  );
}
