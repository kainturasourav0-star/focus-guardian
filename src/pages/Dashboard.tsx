import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ProductivityScore from '../components/dashboard/ProductivityScore';
import StatsGrid from '../components/dashboard/StatsGrid';
import ActiveAppBadge from '../components/dashboard/ActiveAppBadge';
import GoalProgress from '../components/dashboard/GoalProgress';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { useSessionStore } from '../store/useSessionStore';
import { useMonitorStore } from '../store/useMonitorStore';
import { useProductivityScore } from '../hooks/useProductivityScore';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function Dashboard() {
  const { currentSession } = useSessionStore();
  const { currentApp, currentTitle, currentClassification } = useMonitorStore();
  const { productivityScore, label } = useProductivityScore();

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="max-w-6xl mx-auto space-y-6"
    >
      <motion.header variants={itemVariants} className="mb-8">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 mt-1">Your productivity overview for today.</p>
      </motion.header>

      {/* Row 1: Score + Session Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <GlassCard className="h-full p-6 flex flex-col items-center justify-center" gradient="purple">
            <ProductivityScore
              score={productivityScore}
              label={label}
            />
          </GlassCard>
        </motion.div>

        <motion.div variants={itemVariants} className="lg:col-span-2">
          <GlassCard
            className="h-full p-8 flex flex-col items-center justify-center"
            gradient={currentSession ? 'productive' : 'purple'}
            glow
          >
            {currentSession ? (
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-sm font-medium mb-4">
                  <span className="pulse-dot productive" />
                  Session Active
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {currentSession.task_name || 'Focus Session'}
                </h2>
                <p className="text-slate-400 mb-6">Stay on track. You're doing great!</p>
                <Link to="/focus">
                  <Button variant="primary" size="lg">Open Focus Mode</Button>
                </Link>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-5xl mb-4">🎯</div>
                <h2 className="text-2xl font-bold text-white mb-2">Ready to focus?</h2>
                <p className="text-slate-400 mb-6">
                  Start a session to eliminate distractions and track your productivity.
                </p>
                <Link to="/focus">
                  <Button variant="primary" size="lg">Start Focus Session</Button>
                </Link>
              </div>
            )}
          </GlassCard>
        </motion.div>
      </div>

      {/* Row 2: Stats Grid */}
      <motion.div variants={itemVariants}>
        <StatsGrid />
      </motion.div>

      {/* Row 3: Active App + Goal Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div variants={itemVariants}>
          <ActiveAppBadge
            appName={currentApp}
            classification={currentClassification}
            windowTitle={currentTitle}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <GoalProgress />
        </motion.div>
      </div>
    </motion.div>
  );
}
