import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trophy } from 'lucide-react';
import GoalCard from '../components/goals/GoalCard';
import GoalForm from '../components/goals/GoalForm';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { useGoalStore } from '../store/useGoalStore';

export default function Goals() {
  const { goals, createGoal } = useGoalStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const activeGoals = goals.filter((g) => !g.completed);
  const completedGoals = goals.filter((g) => g.completed);

  const handleAddGoal = (goalData: any) => {
    createGoal(goalData);
    setIsModalOpen(false);
  };

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
    <div className="max-w-6xl mx-auto space-y-8">
      <header className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Goals</h1>
          <p className="text-zinc-500 text-sm mt-1 font-medium">Set focus hour targets and track your long-term study milestones.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2" variant="primary">
          <Plus className="h-4 w-4" /> Add Goal
        </Button>
      </header>

      {goals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-zinc-900/30 rounded-2xl border border-white/5 max-w-xl mx-auto">
          <div className="h-16 w-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 border border-purple-500/15">
            <Trophy className="h-8 w-8 text-purple-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">No goals set yet</h2>
          <p className="text-zinc-500 text-sm mb-6 max-w-sm leading-relaxed">
            Set focus hour milestones to monitor progress, keep your study sessions targeted, and stay motivated.
          </p>
          <Button onClick={() => setIsModalOpen(true)} variant="primary">Set your first goal</Button>
        </div>
      ) : (
        <>
          <section>
            <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Active Goals</h2>
            {activeGoals.length === 0 ? (
              <p className="text-zinc-650 text-sm italic py-4">No active focus goals found.</p>
            ) : (
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                <AnimatePresence>
                  {activeGoals.map((goal) => (
                    <motion.div key={goal.id} variants={itemVariants}>
                      <GoalCard goal={goal} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </section>

          {completedGoals.length > 0 && (
            <section className="mt-12">
              <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                Completed Goals 
                <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/15 rounded-full">
                  {completedGoals.length}
                </span>
              </h2>
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                <AnimatePresence>
                  {completedGoals.map((goal) => (
                    <motion.div key={goal.id} variants={itemVariants}>
                      <GoalCard goal={goal} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </section>
          )}
        </>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Goal">
        <GoalForm onSubmit={handleAddGoal} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
}
