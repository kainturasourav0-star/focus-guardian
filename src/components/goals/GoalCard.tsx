import React from 'react';
import { motion } from 'framer-motion';
import { Check, Trash2, Clock } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { Badge } from '../ui/Badge';
import { Goal } from '../../types';
import { useGoalStore } from '../../store/useGoalStore';

interface Props {
  goal: Goal;
}

export default function GoalCard({ goal }: Props) {
  const { updateGoal, deleteGoal } = useGoalStore();
  const percentage = Math.min(100, Math.round((goal.current_hours / goal.target_hours) * 100));
  const isExpired = goal.deadline
    ? new Date(goal.deadline) < new Date() && !goal.completed
    : false;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      <GlassCard
        className={`p-5 flex flex-col h-full ${goal.completed ? 'opacity-60' : ''} ${
          isExpired ? 'border-red-500/30' : ''
        }`}
      >
        <div className="flex items-start justify-between mb-4">
          <Badge variant={goal.completed ? 'productive' : 'info'} className="uppercase">
            {goal.type.replace('_', ' ')}
          </Badge>
          <div className="flex gap-2">
            {!goal.completed && (
              <button
                onClick={() => updateGoal(goal.id, { completed: true })}
                className="p-1.5 rounded-md hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-400 transition-colors"
                title="Mark completed"
              >
                <Check className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={() => {
                if (confirm('Delete this goal?')) deleteGoal(goal.id);
              }}
              className="p-1.5 rounded-md hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
              title="Delete goal"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <h3
          className={`text-lg font-bold mb-1 ${
            goal.completed ? 'text-slate-400 line-through' : 'text-white'
          }`}
        >
          {goal.title}
        </h3>

        <div className="flex items-center gap-1 text-xs text-slate-500 mb-6">
          <Clock className="h-3 w-3" />
          {goal.deadline ? new Date(goal.deadline).toLocaleDateString() : 'No deadline'}
          {isExpired && <span className="text-red-400 ml-1">(Expired)</span>}
        </div>

        <div className="mt-auto">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-400">
              {goal.current_hours.toFixed(1)} / {goal.target_hours.toFixed(1)} hrs
            </span>
            <span className={goal.completed ? 'text-emerald-400 font-bold' : 'text-purple-400 font-bold'}>
              {percentage}%
            </span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                goal.completed ? 'bg-emerald-500' : 'bg-gradient-to-r from-purple-500 to-cyan-500'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
