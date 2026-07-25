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
    return `${h}h ${m}m`;
  };

  const stats = [
    {
      label: 'Time Focused',
      value: formatTime(timeFocusedToday),
      icon: Clock,
      color: 'text-green-400',
      bg: 'bg-green-500/10',
      trend: '+12%',
      isPositive: true,
    },
    {
      label: 'Distracted Time',
      value: formatTime(timeDistractedToday),
      icon: AlertTriangle,
      color: 'text-red-400',
      bg: 'bg-red-500/10',
      trend: '-5%',
      isPositive: true, // less distraction is positive
    },
    {
      label: 'Focus Sessions',
      value: focusSessionCount.toString(),
      icon: Zap,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
      trend: '+2',
      isPositive: true,
    },
    {
      label: 'Focus Streak',
      value: '3 days', // mock
      icon: Flame,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
      trend: 'Personal best!',
      isPositive: true,
      hideArrow: true,
    },
  ];

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
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {stats.map((stat, i) => (
        <motion.div key={i} variants={item}>
          <GlassCard className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              {!stat.hideArrow && (
                <div className={`flex items-center text-xs font-medium ${stat.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                  {stat.isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                  {stat.trend}
                </div>
              )}
              {stat.hideArrow && (
                <div className="text-xs font-medium text-orange-400">{stat.trend}</div>
              )}
            </div>
            <div>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm font-medium text-gray-400">{stat.label}</div>
            </div>
          </GlassCard>
        </motion.div>
      ))}
    </motion.div>
  );
}
