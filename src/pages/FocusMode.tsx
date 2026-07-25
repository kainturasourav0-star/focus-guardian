import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Square, Pause, PlayCircle } from 'lucide-react';
import ProgressRing from '../components/focus/ProgressRing';
import MotivationalQuote from '../components/focus/MotivationalQuote';
import { Button } from '../components/ui/Button';
import { GlassCard } from '../components/ui/GlassCard';
import { useSessionStore } from '../store/useSessionStore';
import { useMonitorStore } from '../store/useMonitorStore';

export default function FocusMode() {
  const { currentSession, startSession, endSession, elapsedSeconds, focusModeActive } = useSessionStore();
  const { timeDistractedToday } = useMonitorStore();
  const [taskName, setTaskName] = useState('');
  const [isPaused, setIsPaused] = useState(false);

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    await startSession(taskName || 'Focus Session');
    setTaskName('');
    setIsPaused(false);
  };

  const handleEnd = async () => {
    await endSession();
    setTaskName('');
    setIsPaused(false);
  };

  // 25-minute default target (from settings ideally)
  const targetSeconds = 25 * 60;

  if (!currentSession) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="focus-mode-bg h-full w-full rounded-2xl flex items-center justify-center p-6 border border-white/5"
      >
        <GlassCard className="max-w-md w-full p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-cyan-500" />
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🎯</div>
            <h2 className="text-2xl font-bold text-white mb-2">Start a Focus Session</h2>
            <p className="text-slate-400">Block distractions and track your time.</p>
          </div>

          <form onSubmit={handleStart} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                What are you working on?
              </label>
              <input
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="e.g. Coding the frontend"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-slate-600"
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              icon={<Play className="h-5 w-5" />}
              className="w-full justify-center"
            >
              Start Focus
            </Button>
          </form>
        </GlassCard>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="focus-mode-bg h-full w-full rounded-2xl flex flex-col items-center justify-center p-6 border border-white/5 relative"
    >
      {/* Task name header */}
      <div className="absolute top-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-sm font-medium mb-3">
          <span className="pulse-dot productive" />
          Focus Session Active
        </div>
        <h2 className="text-2xl font-bold text-white">
          {currentSession.task_name || 'Focus Session'}
        </h2>
      </div>

      {/* Progress ring + quote */}
      <div className="flex flex-col items-center justify-center w-full max-w-2xl mt-12">
        <ProgressRing elapsed={elapsedSeconds} target={targetSeconds} />

        <div className="mt-12 w-full">
          <MotivationalQuote />
        </div>

        {/* Controls */}
        <div className="mt-16 flex items-center gap-6">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="flex items-center justify-center w-14 h-14 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white"
            title={isPaused ? 'Resume' : 'Pause'}
          >
            {isPaused ? <PlayCircle className="h-6 w-6" /> : <Pause className="h-6 w-6" />}
          </button>

          <Button
            onClick={handleEnd}
            variant="danger"
            size="lg"
            icon={<Square className="h-4 w-4 fill-current" />}
            className="px-8 rounded-full shadow-lg shadow-red-500/20"
          >
            End Session
          </Button>
        </div>
      </div>

      {/* Bottom stats */}
      <div className="absolute bottom-8 flex gap-12">
        <div className="text-center">
          <div className="text-2xl font-bold text-white">
            {currentSession.distraction_count ?? 0}
          </div>
          <div className="text-xs font-medium text-slate-500 uppercase tracking-widest mt-1">
            Distractions
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-400">
            {Math.floor(elapsedSeconds / 60)}
          </div>
          <div className="text-xs font-medium text-slate-500 uppercase tracking-widest mt-1">
            Minutes Focused
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-400">
            {Math.floor(timeDistractedToday)}
          </div>
          <div className="text-xs font-medium text-slate-500 uppercase tracking-widest mt-1">
            Min Distracted Today
          </div>
        </div>
      </div>
    </motion.div>
  );
}
