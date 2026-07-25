import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Users } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import AchievementCard, { ACHIEVEMENTS } from '../components/achievements/AchievementCard';
import LeaderboardPanel from '../components/achievements/LeaderboardPanel';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 280 } },
};

const FILTERS = ['All', 'Unlocked', 'Locked', 'Legendary'];

export default function Achievements() {
  const [filter, setFilter] = useState('All');

  const filtered = ACHIEVEMENTS.filter((a) => {
    if (filter === 'Unlocked') return a.unlocked;
    if (filter === 'Locked') return !a.unlocked;
    if (filter === 'Legendary') return a.rarity === 'legendary';
    return true;
  });

  const totalXP = ACHIEVEMENTS.filter((a) => a.unlocked).reduce((sum, a) => sum + a.xp, 0);
  const unlockedCount = ACHIEVEMENTS.filter((a) => a.unlocked).length;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="max-w-6xl mx-auto space-y-6">

      {/* Header */}
      <motion.header variants={item} className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Trophy className="h-7 w-7 text-amber-400" /> Achievements
          </h1>
          <p className="text-zinc-500 text-sm mt-1 font-medium">Unlock badges by building great productivity habits.</p>
        </div>
        <div className="flex gap-3">
          <div className="text-right">
            <p className="text-2xl font-black text-amber-400">{totalXP} XP</p>
            <p className="text-xs text-zinc-500">{unlockedCount}/{ACHIEVEMENTS.length} unlocked</p>
          </div>
        </div>
      </motion.header>

      {/* XP Progress Bar */}
      <motion.div variants={item}>
        <GlassCard className="p-5 border border-white/5" style={{ background: '#18181B' }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-amber-400" />
              <span className="text-sm font-bold text-white">Level 4 — Focus Expert</span>
            </div>
            <span className="text-xs text-zinc-500">{totalXP} / 1500 XP to Level 5</span>
          </div>
          <div className="h-2.5 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, (totalXP / 1500) * 100)}%` }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #f59e0b, #f97316)' }}
            />
          </div>
        </GlassCard>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Achievements Grid */}
        <div className="lg:col-span-2 space-y-5">
          {/* Filter Pills */}
          <motion.div variants={item} className="flex gap-2 flex-wrap">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                  filter === f
                    ? 'bg-purple-500/15 border-purple-500/30 text-purple-300'
                    : 'bg-white/3 border-white/5 text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {f}
              </button>
            ))}
          </motion.div>

          <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((a, i) => (
              <AchievementCard key={a.id} achievement={a} index={i} />
            ))}
          </motion.div>
        </div>

        {/* Leaderboard Panel */}
        <motion.div variants={item} className="lg:col-span-1">
          <GlassCard className="p-5 border border-white/5 sticky top-4" style={{ background: '#18181B' }}>
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Users className="h-4 w-4 text-purple-400" /> Leaderboard
            </h3>
            <LeaderboardPanel />
          </GlassCard>
        </motion.div>
      </div>
    </motion.div>
  );
}
