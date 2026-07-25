import React from 'react';
import { motion } from 'framer-motion';
import DailyFocusChart from '../components/analytics/DailyFocusChart';
import WeeklyScoreChart from '../components/analytics/WeeklyScoreChart';
import DistractionPie from '../components/analytics/DistractionPie';
import AppUsageBar from '../components/analytics/AppUsageBar';
import HeatmapGrid from '../components/analytics/HeatmapGrid';
import { GlassCard } from '../components/ui/GlassCard';

export default function Analytics() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } }
  };

  return (
    <motion.div 
      variants={containerVariants} 
      initial="hidden" 
      animate="show" 
      className="max-w-6xl mx-auto space-y-6"
    >
      <header className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Analytics</h1>
          <p className="text-zinc-500 text-sm mt-1 font-medium">Deep dive into your focus blocks and distraction metrics.</p>
        </div>
        <select className="bg-zinc-900 border border-white/5 text-zinc-300 text-xs font-semibold rounded-xl px-4 py-2.5 focus:outline-none focus:border-purple-500 transition-colors cursor-pointer shadow-sm">
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
          <option>This Year</option>
        </select>
      </header>

      {/* Row 1: Focus vs Distraction & Productivity Score Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants}>
          <GlassCard className="p-6 h-full border border-white/5" style={{ background: '#18181B' }}>
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-6">Focus vs Distraction</h3>
            <DailyFocusChart />
          </GlassCard>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <GlassCard className="p-6 h-full border border-white/5" style={{ background: '#18181B' }}>
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-6">Productivity Score Trend</h3>
            <WeeklyScoreChart />
          </GlassCard>
        </motion.div>
      </div>

      {/* Row 2: Distraction Sources & Top Applications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <GlassCard className="p-6 h-full flex flex-col border border-white/5" style={{ background: '#18181B' }}>
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">Distraction Sources</h3>
            <div className="flex-1 min-h-[220px]">
              <DistractionPie />
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={itemVariants} className="lg:col-span-2">
          <GlassCard className="p-6 h-full border border-white/5" style={{ background: '#18181B' }}>
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">Top Applications Used</h3>
            <AppUsageBar />
          </GlassCard>
        </motion.div>
      </div>

      {/* Row 3: Activity Heatmap */}
      <motion.div variants={itemVariants}>
        <GlassCard className="p-6 border border-white/5" style={{ background: '#18181B' }}>
          <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-6">Activity Heatmap</h3>
          <HeatmapGrid />
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}
