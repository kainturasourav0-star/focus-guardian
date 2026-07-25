import React from 'react';
import { motion } from 'framer-motion';
import { Clock, AlertTriangle, Zap, Flame, TrendingUp, TrendingDown } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { useMonitorStore } from '../../store/useMonitorStore';

export default function StatsGrid() {
  const { timeFocusedToday, timeDistractedToday, focusSessionCount } = useMonitorStore();

  const formatTime = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = Math.floor(minutes % 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  const stats = [
    {
      label: 'Focus Time',
      value: formatTime(timeFocusedToday),
      icon: Clock,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/10',
      trend: '+12% vs yest',
      isPositive: true,
      glow: 'shadow-[0_0_20px_rgba(16,185,129,0.05)]',
    },
    {
      label: 'Distracted Time',
      value: formatTime(timeDistractedToday),
      icon: AlertTriangle,
      color: 'text-red-400',
      bg: 'bg-red-500/10 border-red-500/10',
      trend: '-5% vs yest',
      isPositive: true, // less distraction is positive
      glow: 'shadow-[0_0_20px_rgba(239,68,68,0.05)]',
    },
    {
      label: 'Today\'s Sessions',
      value: focusSessionCount.toString(),
      icon: Zap,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10 border-purple-500/10',
      trend: '+2 sessions',
      isPositive: true,
      glow: 'shadow-[0_0_20px_rgba(124,58,237,0.05)]',
    },
    {
      label: 'Focus Streak',
      value: '3 Days',
      icon: Flame,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10 border-cyan-500/10',
      trend: 'Personal Best',
      isPositive: true,
      hideArrow: true,
      glow: 'shadow-[0_0_20px_rgba(6,182,212,0.05)]',
    },
  ];

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
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
    >
      {stats.map((stat, i) => (
        <motion.div key={i} variants={itemVariants}>
          <GlassCard 
            className={`p-6 border border-white/5 relative overflow-hidden group hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 ${stat.glow}`}
            style={{ background: '#18181B' }}
          >
            {/* Soft decorative background gradient on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

            <div className="flex items-center justify-between mb-4">
              <div className={`p-2.5 rounded-xl border ${stat.bg}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              {!stat.hideArrow && (
                <div className={`flex items-center text-[10px] font-semibold uppercase tracking-wider ${stat.isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                  {stat.isPositive ? <TrendingUp className="h-3.5 w-3.5 mr-1" /> : <TrendingDown className="h-3.5 w-3.5 mr-1" />}
                  {stat.trend}
                </div>
              )}
              {stat.hideArrow && (
                <div className="text-[10px] font-semibold uppercase tracking-wider text-cyan-400">{stat.trend}</div>
              )}
            </div>
            <div>
              <div className="text-3xl font-extrabold text-white mb-1 tracking-tight">{stat.value}</div>
              <div className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">{stat.label}</div>
            </div>
          </GlassCard>
        </motion.div>
      ))}
    </motion.div>
  );
}
