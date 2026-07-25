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
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } },
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
      <motion.header variants={itemVariants} className="mb-6">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Overview</h1>
        <p className="text-zinc-500 text-sm mt-1 font-medium">Real-time productivity coaching and activity analytics.</p>
      </motion.header>

      {/* Row 1: Score + Session Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <GlassCard 
            className="h-full p-6 flex flex-col items-center justify-center border border-white/5 shadow-xl hover:scale-[1.01] transition-transform" 
            style={{ background: '#18181B' }}
          >
            <ProductivityScore
              score={productivityScore}
              label={label}
            />
          </GlassCard>
        </motion.div>

        <motion.div variants={itemVariants} className="lg:col-span-2">
          <GlassCard
            className="h-full p-8 flex flex-col items-center justify-center border border-white/5 shadow-xl relative overflow-hidden group hover:scale-[1.01] transition-transform"
            style={{ background: '#18181B' }}
          >
            {/* Background glowing gradient decoration */}
            <div className="absolute top-[-50%] right-[-50%] h-[300px] w-[300px] rounded-full bg-purple-500/5 blur-3xl group-hover:bg-purple-500/8 transition-colors pointer-events-none" />
            <div className="absolute bottom-[-50%] left-[-50%] h-[300px] w-[300px] rounded-full bg-cyan-500/3 blur-3xl pointer-events-none" />

            {currentSession ? (
              <div className="text-center relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Focus Session Active
                </div>
                <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight">
                  {currentSession.task_name || 'Focus Session'}
                </h2>
                <p className="text-zinc-500 text-sm mb-6 max-w-sm mx-auto font-medium leading-relaxed">
                  Focus Guardian is monitoring your apps. Stay focused on your task to optimize your score.
                </p>
                <Link to="/focus">
                  <Button variant="primary" size="lg">Open Focus Mode</Button>
                </Link>
              </div>
            ) : (
              <div className="text-center relative z-10">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 text-2xl mb-4 font-bold">
                  🎯
                </div>
                <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Ready to focus?</h2>
                <p className="text-zinc-500 text-sm mb-6 max-w-sm mx-auto font-medium leading-relaxed">
                  Start a focus block to trigger real-time distraction guards and track your active apps.
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
