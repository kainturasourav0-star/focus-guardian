import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import { useGoalStore } from '../../store/useGoalStore';

export default function GoalProgress() {
  const goals = useGoalStore((state) => state.goals);
  const activeGoals = goals.filter((g) => !g.completed);

  if (activeGoals.length === 0) {
    return (
      <GlassCard 
        className="p-6 flex flex-col items-center justify-center text-center h-full min-h-[160px] border border-white/5 shadow-lg"
        style={{ background: '#18181B' }}
      >
        <p className="text-sm font-medium text-zinc-400 mb-4">Set a goal to track your progress</p>
        <Link to="/goals">
          <Button variant="secondary" size="sm">Set Goal</Button>
        </Link>
      </GlassCard>
    );
  }

  const primaryGoal = activeGoals[0];
  const percentage = Math.min(100, Math.round((primaryGoal.current_hours / primaryGoal.target_hours) * 100));

  return (
    <GlassCard 
      className="p-6 h-full flex flex-col justify-center border border-white/5 shadow-lg relative overflow-hidden group hover:scale-[1.01] transition-all"
      style={{ background: '#18181B' }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Goal Progress</h3>
        <span className="text-xs font-extrabold text-purple-400">{percentage}%</span>
      </div>
      
      <div className="mb-2">
        <h4 className="font-bold text-white tracking-tight truncate">{primaryGoal.title}</h4>
        <div className="text-xs text-zinc-500 mt-1.5 font-semibold">
          {primaryGoal.current_hours.toFixed(1)} / {primaryGoal.target_hours.toFixed(1)} focus hours
        </div>
      </div>

      <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden mt-3">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"
        />
      </div>
    </GlassCard>
  );
}
