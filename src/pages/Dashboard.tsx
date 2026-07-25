import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Flame, Clock, BarChart3 } from 'lucide-react';

// Existing components
import StatsGrid from '../components/dashboard/StatsGrid';
import ActiveAppBadge from '../components/dashboard/ActiveAppBadge';
import GoalProgress from '../components/dashboard/GoalProgress';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';

// New premium components
import FocusScoreRing from '../components/dashboard/FocusScoreRing';
import ProductivityTimeline from '../components/dashboard/ProductivityTimeline';
import AIQuoteBanner from '../components/dashboard/AIQuoteBanner';
import AchievementsBanner from '../components/dashboard/AchievementsBanner';
import QuickActions from '../components/dashboard/QuickActions';

import { useSessionStore } from '../store/useSessionStore';
import { useMonitorStore } from '../store/useMonitorStore';
import { useProductivityScore } from '../hooks/useProductivityScore';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 24 } },
};

export default function Dashboard() {
  const { currentSession } = useSessionStore();
  const { currentApp, currentTitle, currentClassification, timeFocusedToday, timeDistractedToday, focusSessionCount } = useMonitorStore();
  const { productivityScore } = useProductivityScore();

  // Derive score metrics
  const deepWorkMinutes = timeFocusedToday || 222;  // fallback to demo value
  const distractCount = Math.floor((timeDistractedToday || 18) / 3);
  const recoveredCount = Math.max(0, distractCount - 3);
  const trend = 14; // mock +14% vs yesterday

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  })();

  const weekStreak = 7; // mock streak

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="max-w-6xl mx-auto space-y-5">

      {/* ── Header ─────────────────────────────────────── */}
      <motion.header variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">{greeting} 👋</h1>
          <p className="text-zinc-500 text-sm mt-1 font-medium">Here's your productivity overview for today.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20">
          <Flame className="h-4 w-4 text-orange-400" />
          <span className="text-sm font-bold text-orange-300">{weekStreak} day streak</span>
        </div>
      </motion.header>

      {/* ── Quick Actions ──────────────────────────────── */}
      <motion.div variants={item}>
        <QuickActions />
      </motion.div>

      {/* ── Row 1: Focus Score + Session Card ─────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <motion.div variants={item} className="lg:col-span-1">
          <GlassCard className="h-full p-6 flex flex-col items-center justify-center border border-white/5 shadow-xl" style={{ background: '#18181B' }}>
            <FocusScoreRing
              score={productivityScore || 87}
              deepWorkMinutes={deepWorkMinutes}
              distractionCount={distractCount}
              recoveredCount={recoveredCount}
              trend={trend}
            />
          </GlassCard>
        </motion.div>

        <motion.div variants={item} className="lg:col-span-2">
          <GlassCard className="h-full p-7 flex flex-col border border-white/5 shadow-xl relative overflow-hidden group" style={{ background: '#18181B' }}>
            <div className="absolute top-[-50%] right-[-20%] h-[280px] w-[280px] rounded-full bg-purple-500/5 blur-3xl pointer-events-none group-hover:bg-purple-500/8 transition-colors" />
            <div className="absolute bottom-[-30%] left-[-20%] h-[200px] w-[200px] rounded-full bg-cyan-500/4 blur-3xl pointer-events-none" />

            <div className="relative z-10 flex-1 flex flex-col">
              {currentSession ? (
                <>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold uppercase tracking-wider">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Focus Active
                    </span>
                    <span className="text-xs text-zinc-500 font-medium">
                      <Clock className="inline h-3 w-3 mr-1" />Session running
                    </span>
                  </div>
                  <h2 className="text-2xl font-extrabold text-white mb-1">{currentSession.task_name || 'Focus Session'}</h2>
                  <p className="text-zinc-500 text-sm mb-5 max-w-sm leading-relaxed">Focus Guardian is monitoring your apps in real time. Stay in the zone.</p>
                  <Link to="/focus" className="mt-auto">
                    <Button variant="primary">Open Focus Mode →</Button>
                  </Link>
                </>
              ) : (
                <>
                  <div className="text-4xl mb-3">🎯</div>
                  <h2 className="text-2xl font-extrabold text-white mb-1">Ready to focus?</h2>
                  <p className="text-zinc-500 text-sm mb-5 max-w-sm leading-relaxed">Start a focus block to activate real-time distraction guards, AI coaching, and live app monitoring.</p>
                  <div className="flex gap-3 mt-auto">
                    <Link to="/focus">
                      <Button variant="primary" size="lg">Start Focus Session</Button>
                    </Link>
                    <Link to="/goals">
                      <Button variant="secondary" size="lg" className="border-white/10 bg-white/3">View Goals</Button>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* ── Row 2: Stats Grid ──────────────────────────── */}
      <motion.div variants={item}>
        <StatsGrid />
      </motion.div>

      {/* ── Row 3: Active App + Goal Progress ─────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <motion.div variants={item}>
          <ActiveAppBadge appName={currentApp} classification={currentClassification} windowTitle={currentTitle} />
        </motion.div>
        <motion.div variants={item}>
          <GoalProgress />
        </motion.div>
      </div>

      {/* ── Row 4: Productivity Timeline ──────────────── */}
      <motion.div variants={item}>
        <GlassCard className="p-6 border border-white/5 shadow-xl" style={{ background: '#18181B' }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-cyan-400" /> Today's Timeline
              </h3>
              <p className="text-zinc-600 text-xs mt-0.5">Hour-by-hour focus vs distraction</p>
            </div>
            <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Live</span>
          </div>
          <ProductivityTimeline />
        </GlassCard>
      </motion.div>

      {/* ── Row 5: Achievements + Quote ───────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <motion.div variants={item}>
          <GlassCard className="p-5 border border-white/5 shadow-xl h-full" style={{ background: '#18181B' }}>
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <Flame className="h-3.5 w-3.5 text-orange-400" /> Achievements
            </h3>
            <AchievementsBanner />
          </GlassCard>
        </motion.div>

        <motion.div variants={item}>
          <GlassCard className="p-5 border border-white/5 shadow-xl h-full flex items-center" style={{ background: '#18181B' }}>
            <AIQuoteBanner />
          </GlassCard>
        </motion.div>
      </div>

    </motion.div>
  );
}
