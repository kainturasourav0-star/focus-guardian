import React from 'react';
import { motion } from 'framer-motion';
import DailyFocusChart from '../components/analytics/DailyFocusChart';
import WeeklyScoreChart from '../components/analytics/WeeklyScoreChart';
import DistractionPie from '../components/analytics/DistractionPie';
import AppUsageBar from '../components/analytics/AppUsageBar';
import HeatmapGrid from '../components/analytics/HeatmapGrid';
import DailyReportCard from '../components/analytics/DailyReportCard';
import ExportButtons from '../components/analytics/ExportButtons';
import { GlassCard } from '../components/ui/GlassCard';
import { BarChart3, TrendingUp, Brain } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } },
};

export default function Analytics() {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="max-w-6xl mx-auto space-y-6">
      
      {/* Header */}
      <motion.header variants={item} className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <BarChart3 className="h-7 w-7 text-cyan-400" /> Analytics
          </h1>
          <p className="text-zinc-500 text-sm mt-1 font-medium">Deep dive into your focus blocks and distraction metrics.</p>
        </div>
        <div className="flex items-center gap-3">
          <ExportButtons />
          <select className="bg-zinc-900 border border-white/5 text-zinc-300 text-xs font-semibold rounded-xl px-4 py-2.5 focus:outline-none focus:border-purple-500 transition-colors cursor-pointer shadow-sm">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>This Year</option>
          </select>
        </div>
      </motion.header>

      {/* Summary Stats Row */}
      <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Avg Focus Score', value: '87%', sub: '+14% this week', color: 'text-cyan-400' },
          { label: 'Deep Work Total', value: '26.2h', sub: 'This week', color: 'text-purple-400' },
          { label: 'Total Distractions', value: '73', sub: '−22% vs last week', color: 'text-rose-400' },
          { label: 'Sessions Complete', value: '24/28', sub: '85% completion', color: 'text-emerald-400' },
        ].map((s) => (
          <GlassCard key={s.label} className="p-4 border border-white/5" style={{ background: '#18181B' }}>
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">{s.label}</p>
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-[11px] text-zinc-600 mt-0.5">{s.sub}</p>
          </GlassCard>
        ))}
      </motion.div>

      {/* Row 1: Focus vs Distraction & Score Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={item}>
          <GlassCard className="p-6 h-full border border-white/5" style={{ background: '#18181B' }}>
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-6">Focus vs Distraction</h3>
            <DailyFocusChart />
          </GlassCard>
        </motion.div>
        <motion.div variants={item}>
          <GlassCard className="p-6 h-full border border-white/5" style={{ background: '#18181B' }}>
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-400" /> Productivity Score Trend
            </h3>
            <WeeklyScoreChart />
          </GlassCard>
        </motion.div>
      </div>

      {/* Row 2: Distraction Sources & Top Apps */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={item} className="lg:col-span-1">
          <GlassCard className="p-6 h-full flex flex-col border border-white/5" style={{ background: '#18181B' }}>
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">Distraction Sources</h3>
            <div className="flex-1 min-h-[220px]">
              <DistractionPie />
            </div>
          </GlassCard>
        </motion.div>
        <motion.div variants={item} className="lg:col-span-2">
          <GlassCard className="p-6 h-full border border-white/5" style={{ background: '#18181B' }}>
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">Top Applications Used</h3>
            <AppUsageBar />
          </GlassCard>
        </motion.div>
      </div>

      {/* Row 3: Heatmap */}
      <motion.div variants={item}>
        <GlassCard className="p-6 border border-white/5" style={{ background: '#18181B' }}>
          <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-6">Activity Heatmap</h3>
          <HeatmapGrid />
        </GlassCard>
      </motion.div>

      {/* Row 4: AI Daily Report */}
      <motion.div variants={item}>
        <GlassCard className="p-6 border border-white/5" style={{ background: '#18181B' }}>
          <div className="flex items-center gap-2 mb-2">
            <Brain className="h-4 w-4 text-purple-400" />
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">AI Daily Report</h3>
          </div>
          <p className="text-xs text-zinc-600 mb-5">Gemini-powered personalized analysis of today's productivity patterns</p>
          <DailyReportCard />
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}
