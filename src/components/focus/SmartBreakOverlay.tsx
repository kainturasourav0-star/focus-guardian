import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, Timer, X, Footprints, Eye, Wind } from 'lucide-react';
import { Button } from '../ui/Button';

interface Props {
  isVisible: boolean;
  sessionMinutes: number;
  onTakeBreak: () => void;
  onExtend: () => void;
  onDismiss: () => void;
}

const BREAK_TIPS = [
  { icon: <Footprints size={18} />, text: 'Take a short walk', color: 'text-emerald-400' },
  { icon: <Eye size={18} />, text: '20-20-20 eye rule: Look 20ft away for 20s', color: 'text-cyan-400' },
  { icon: <Wind size={18} />, text: 'Deep breathing: 4s in, hold 4s, out 4s', color: 'text-purple-400' },
  { icon: <Coffee size={18} />, text: 'Drink a glass of water', color: 'text-blue-400' },
];

export default function SmartBreakOverlay({ isVisible, sessionMinutes, onTakeBreak, onExtend, onDismiss }: Props) {
  const hours = Math.floor(sessionMinutes / 60);
  const mins = sessionMinutes % 60;
  const timeStr = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md"
          style={{ background: 'rgba(0,0,0,0.7)' }}
        >
          <motion.div
            initial={{ scale: 0.85, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 22 }}
            className="relative bg-zinc-950 border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl"
            style={{ boxShadow: '0 0 60px rgba(34,211,238,0.15)' }}
          >
            {/* Dismiss */}
            <button
              onClick={onDismiss}
              className="absolute top-4 right-4 text-zinc-600 hover:text-zinc-300 transition-colors"
            >
              <X size={18} />
            </button>

            {/* Icon */}
            <div className="flex justify-center mb-4">
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400"
              >
                <Timer size={26} />
              </motion.div>
            </div>

            <h2 className="text-xl font-extrabold text-white text-center mb-1">Great work! 🎉</h2>
            <p className="text-zinc-400 text-sm text-center mb-6">
              You've been focused for <span className="text-cyan-400 font-bold">{timeStr}</span>.
              {' '}Your AI coach suggests a short break to maintain peak performance.
            </p>

            {/* Break Tips */}
            <div className="bg-zinc-900/80 rounded-2xl border border-white/5 p-4 mb-6 space-y-2.5">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Break suggestions</p>
              {BREAK_TIPS.map((tip, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className={tip.color}>{tip.icon}</span>
                  <span className="text-zinc-300 text-sm">{tip.text}</span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button onClick={onTakeBreak} variant="primary" className="flex-1 justify-center py-3">
                Take a Break
              </Button>
              <Button onClick={onExtend} variant="secondary" className="flex-1 justify-center py-3 border-white/10 bg-white/3">
                Extend 20 min
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
