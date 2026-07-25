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
      <GlassCard className="p-5 flex flex-col items-center justify-center text-center h-full min-h-[160px]">
        <p className="text-sm text-gray-400 mb-4">Add a goal to track progress</p>
        <Link to="/goals">
          <Button variant="secondary" size="sm">Set Goal</Button>
        </Link>
      </GlassCard>
    );
  }

  const primaryGoal = activeGoals[0];
  const percentage = Math.min(100, Math.round((primaryGoal.current_hours / primaryGoal.target_hours) * 100));

  return (
    <GlassCard className="p-5 h-full flex flex-col justify-center">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-400">Goal Progress</h3>
        <span className="text-xs font-bold text-purple-400">{percentage}%</span>
      </div>
      
      <div className="mb-2">
        <h4 className="font-semibold text-white truncate">{primaryGoal.title}</h4>
        <div className="text-xs text-gray-500 mt-1">
          {primaryGoal.current_hours.toFixed(1)} / {primaryGoal.target_hours.toFixed(1)} hours
        </div>
      </div>

      <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden mt-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"
        />
      </div>
    </GlassCard>
  );
}
