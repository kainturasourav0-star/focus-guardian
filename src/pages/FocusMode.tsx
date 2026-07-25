import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Square, Pause, RotateCcw, Target, ShieldAlert, Clock, Flame, Volume2, Cpu, BookOpen, Pencil, Globe } from 'lucide-react';
import ProgressRing from '../components/focus/ProgressRing';
import MotivationalQuote from '../components/focus/MotivationalQuote';
import SmartBreakOverlay from '../components/focus/SmartBreakOverlay';
import { Button } from '../components/ui/Button';
import { GlassCard } from '../components/ui/GlassCard';
import { useSessionStore } from '../store/useSessionStore';
import { useMonitorStore } from '../store/useMonitorStore';

export default function FocusMode() {
  const { 
    currentSession, 
    startSession, 
    endSession, 
    elapsedSeconds, 
    timerInterval,
    tickTimer,
    resetTimer
  } = useSessionStore();
  
  const { timeDistractedToday, currentApp, currentClassification } = useMonitorStore();
  const [taskName, setTaskName] = useState('');
  const [isPaused, setIsPaused] = useState(false);
  const [activeSound, setActiveSound] = useState('None');
  const [showBreakOverlay, setShowBreakOverlay] = useState(false);
  const [breakShownAt, setBreakShownAt] = useState<number | null>(null);

  // Smart Session Type Detection from active app
  const sessionType = (() => {
    const app = currentApp?.toLowerCase() || '';
    if (['vs code', 'cursor', 'intellij', 'android studio', 'terminal'].some(a => app.includes(a))) return { label: 'Coding', icon: <Cpu size={12} />, color: 'text-cyan-400' };
    if (['notion', 'obsidian', 'word', 'docs'].some(a => app.includes(a))) return { label: 'Writing', icon: <Pencil size={12} />, color: 'text-purple-400' };
    if (['figma', 'photoshop', 'illustrator'].some(a => app.includes(a))) return { label: 'Designing', icon: <Target size={12} />, color: 'text-pink-400' };
    if (['chrome', 'firefox', 'edge', 'brave'].some(a => app.includes(a))) return { label: 'Researching', icon: <Globe size={12} />, color: 'text-amber-400' };
    return { label: 'Studying', icon: <BookOpen size={12} />, color: 'text-emerald-400' };
  })();

  const handleToggleSound = (sound: string) => {
    const player = document.getElementById('ambient-audio-player') as HTMLAudioElement;
    if (!player) return;

    if (sound === 'None') {
      player.pause();
      setActiveSound('None');
    } else {
      let src = '';
      if (sound === 'Rain') src = 'https://www.soundjay.com/nature/sounds/rain-07.mp3';
      if (sound === 'Lofi') src = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3';
      if (sound === 'Forest') src = 'https://www.soundjay.com/nature/sounds/forest-wind-1.mp3';
      
      player.src = src;
      player.play().catch(err => console.error("Audio playback blocked", err));
      setActiveSound(sound);
    }
  };

  useEffect(() => {
    return () => {
      const player = document.getElementById('ambient-audio-player') as HTMLAudioElement;
      if (player) player.pause();
    };
  }, [currentSession]);

  // Default pomodoro duration: 25 minutes
  const targetSeconds = 25 * 60;

  // Custom Pause/Resume local timer control
  useEffect(() => {
    let localInterval: ReturnType<typeof setInterval> | null = null;
    
    // If a session is active and NOT paused, we tick the timer every second
    if (currentSession && !isPaused) {
      localInterval = setInterval(() => {
        tickTimer();
      }, 1000);
    }
    
    return () => {
      if (localInterval) clearInterval(localInterval);
    };
  }, [currentSession, isPaused, tickTimer]);

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    await startSession(taskName || 'Deep Focus Session');
    setTaskName('');
    setIsPaused(false);
  };

  const handleEnd = async () => {
    if (confirm('End this focus session? This will save your productivity score.')) {
      await endSession();
      setIsPaused(false);
      setShowBreakOverlay(false);
    }
  };

  // Smart Break Detection: suggest break after 90 minutes
  useEffect(() => {
    if (!currentSession || isPaused) return;
    const ninetyMin = 90 * 60;
    if (elapsedSeconds >= ninetyMin && breakShownAt === null) {
      setShowBreakOverlay(true);
      setBreakShownAt(elapsedSeconds);
    }
  }, [elapsedSeconds, currentSession, isPaused, breakShownAt]);

  const handleReset = () => {
    if (confirm('Reset the focus timer? Your progress will restart.')) {
      resetTimer();
      setIsPaused(true);
    }
  };

  if (!currentSession) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="max-w-md mx-auto mt-12"
      >
        <GlassCard 
          className="p-8 border border-white/5 shadow-2xl relative overflow-hidden group"
          style={{ background: '#18181B' }}
        >
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-purple-500 to-cyan-500" />
          
          <div className="text-center mb-8">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 text-2xl mb-4 font-bold">
              🎯
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Focus Block</h2>
            <p className="text-zinc-500 text-sm mt-1 font-semibold">Declare a task to initiate intelligent distraction guards.</p>
          </div>

          <form onSubmit={handleStart} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">
                Active Goal / Task Name
              </label>
              <input
                required
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="e.g., Implementing Tailwind Fixes"
                className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-zinc-650"
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full justify-center py-3.5 shadow-lg shadow-purple-500/25"
            >
              Start Focus Session
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
      className="max-w-3xl mx-auto flex flex-col items-center justify-center p-6 min-h-[80vh] relative"
    >
      {/* Smart Break Overlay */}
      <SmartBreakOverlay
        isVisible={showBreakOverlay}
        sessionMinutes={Math.floor(elapsedSeconds / 60)}
        onTakeBreak={() => { setShowBreakOverlay(false); setIsPaused(true); }}
        onExtend={() => { setShowBreakOverlay(false); setBreakShownAt((breakShownAt ?? 0) + 20 * 60); }}
        onDismiss={() => setShowBreakOverlay(false)}
      />

      {/* Session Title Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-pulse" />
          Focusing
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          {currentSession.task_name || 'Deep Focus Block'}
        </h2>
        {/* Auto-detected session type */}
        <div className={`inline-flex items-center gap-1.5 mt-2 text-xs font-bold ${sessionType.color}`}>
          {sessionType.icon} {sessionType.label} Mode (auto-detected)
        </div>
      </div>

      {/* Progress Ring and Quotes */}
      <div className="flex flex-col items-center justify-center w-full">
        <div className="relative">
          <ProgressRing elapsed={elapsedSeconds} target={targetSeconds} />
          {/* Subtle glow behind progress circle */}
          <div className="absolute inset-0 rounded-full bg-purple-500/5 blur-3xl pointer-events-none" />
        </div>

        <div className="mt-10 w-full max-w-lg">
          <MotivationalQuote />
        </div>

        {/* Ambient Sound Controller */}
        <GlassCard 
          className="mt-8 p-4 border border-white/5 flex flex-col md:flex-row items-center gap-4 w-full max-w-lg shadow-xl"
          style={{ background: '#121215' }}
        >
          <div className="flex items-center gap-2">
            <Volume2 className="h-4 w-4 text-purple-400" />
            <span className="text-xs font-bold text-zinc-350 uppercase tracking-widest">Ambient Audio</span>
          </div>
          <div className="flex flex-wrap gap-1.5 flex-1 justify-center md:justify-end">
            {['None', 'Rain', 'Lofi', 'Forest'].map((sound) => (
              <button
                key={sound}
                onClick={() => handleToggleSound(sound)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                  activeSound === sound
                    ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/25'
                    : 'bg-zinc-950 border-white/5 text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {sound === 'None' && '🔇 None'}
                {sound === 'Rain' && '🌧️ Rain'}
                {sound === 'Lofi' && '🎵 Lofi Beats'}
                {sound === 'Forest' && '🌲 Forest'}
              </button>
            ))}
          </div>
          <audio id="ambient-audio-player" loop />
        </GlassCard>

        {/* Unified premium controls grid */}
        <div className="mt-12 flex items-center gap-4">
          {/* Pause / Resume Button */}
          {isPaused ? (
            <Button
              onClick={() => setIsPaused(false)}
              variant="success"
              size="lg"
              icon={<Play size={16} />}
              className="px-6 rounded-full"
            >
              Resume
            </Button>
          ) : (
            <Button
              onClick={() => setIsPaused(true)}
              variant="secondary"
              size="lg"
              icon={<Pause size={16} />}
              className="px-6 rounded-full"
            >
              Pause
            </Button>
          )}

          {/* Reset Timer Button */}
          <Button
            onClick={handleReset}
            variant="secondary"
            size="lg"
            icon={<RotateCcw size={16} />}
            className="px-6 rounded-full border-white/5 bg-white/3 hover:bg-white/10"
          >
            Reset
          </Button>

          {/* Stop / End Session Button */}
          <Button
            onClick={handleEnd}
            variant="danger"
            size="lg"
            icon={<Square size={14} className="fill-current" />}
            className="px-6 rounded-full shadow-lg shadow-red-500/10"
          >
            Stop
          </Button>
        </div>
      </div>

      {/* Bottom stats layout */}
      <div className="mt-16 grid grid-cols-3 gap-8 w-full max-w-lg border-t border-white/5 pt-8">
        <div className="text-center">
          <div className="text-3xl font-extrabold text-zinc-100">{currentSession.distraction_count ?? 0}</div>
          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">
            Distractions
          </div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-extrabold text-purple-400">
            {Math.floor(elapsedSeconds / 60)}
          </div>
          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">
            Min Focused
          </div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-extrabold text-cyan-400">
            {Math.floor(timeDistractedToday)}
          </div>
          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">
            Distracted Today
          </div>
        </div>
      </div>
    </motion.div>
  );
}
