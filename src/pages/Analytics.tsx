import React from 'react';
import { motion } from 'framer-motion';
import DailyFocusChart from '../components/analytics/DailyFocusChart';
import WeeklyScoreChart from '../components/analytics/WeeklyScoreChart';
import DistractionPie from '../components/analytics/DistractionPie';
import AppUsageBar from '../components/analytics/AppUsageBar';
import HeatmapGrid from '../components/analytics/HeatmapGrid';
import { GlassCard } from '../components/ui/GlassCard';

export default function Analytics() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-6xl mx-auto space-y-6">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white">Analytics</h1>
          <p className="text-gray-400 mt-1">Deep dive into your productivity patterns.</p>
        </div>
        <select className="bg-gray-900 border border-white/10 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500">
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
          <option>This Year</option>
        </select>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={item}>
          <GlassCard className="p-6 h-full">
            <h3 className="text-lg font-semibold text-white mb-6">Focus vs Distraction</h3>
            <DailyFocusChart />
          </GlassCard>
        </motion.div>
        
        <motion.div variants={item}>
          <GlassCard className="p-6 h-full">
            <h3 className="text-lg font-semibold text-white mb-6">Productivity Score Trend</h3>
            <WeeklyScoreChart />
          </GlassCard>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={item} className="lg:col-span-1">
          <GlassCard className="p-6 h-full flex flex-col">
            <h3 className="text-lg font-semibold text-white mb-4">Distraction Sources</h3>
            <div className="flex-1">
              <DistractionPie />
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={item} className="lg:col-span-2">
          <GlassCard className="p-6 h-full">
            <h3 className="text-lg font-semibold text-white mb-4">Top Applications Used</h3>
            <AppUsageBar />
          </GlassCard>
        </motion.div>
      </div>

      <motion.div variants={item}>
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Activity Heatmap</h3>
          <HeatmapGrid />
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}
