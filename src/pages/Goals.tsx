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

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <header className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Goals</h1>
          <p className="text-gray-400 mt-1">Set targets and track your long-term focus progress.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add Goal
        </Button>
      </header>

      {goals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-20 w-20 bg-purple-500/10 rounded-full flex items-center justify-center mb-6">
            <Trophy className="h-10 w-10 text-purple-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">No goals set yet</h2>
          <p className="text-gray-400 mb-6 max-w-md">Goals help you stay motivated and focused. Set a target for studying, coding, or general focus hours.</p>
          <Button onClick={() => setIsModalOpen(true)}>Set your first goal</Button>
        </div>
      ) : (
        <>
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">Active Goals</h2>
            {activeGoals.length === 0 ? (
              <p className="text-gray-500 italic">No active goals.</p>
            ) : (
              <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {activeGoals.map((goal) => (
                    <GoalCard key={goal.id} goal={goal} />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </section>

          {completedGoals.length > 0 && (
            <section className="mt-12">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                Completed Goals <span className="text-sm px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full">{completedGoals.length}</span>
              </h2>
              <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {completedGoals.map((goal) => (
                    <GoalCard key={goal.id} goal={goal} />
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
