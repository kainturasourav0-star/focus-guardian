import React, { useState } from 'react';
import { MessageCircle, Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMonitorStore } from '../../store/useMonitorStore';

export default function AICoachFloat() {
  const [expanded, setExpanded] = useState(false);
  const coachMessage = useMonitorStore((state) => state.coachMessage);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="flex h-[320px] w-[360px] flex-col overflow-hidden rounded-2xl border border-white/8 bg-gradient-to-br from-slate-900/90 to-purple-950/40 shadow-2xl backdrop-blur-2xl glow-purple"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 bg-white/3 p-4">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded bg-purple-500/15">
                  <Sparkles className="h-4 w-4 text-purple-400" />
                </div>
                <h3 className="font-semibold text-slate-100 text-sm">Focus Coach</h3>
              </div>
              <button
                onClick={() => setExpanded(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4">
              {coachMessage ? (
                <div className="flex flex-col gap-2 items-start">
                  <div className="rounded-2xl rounded-tl-none bg-gradient-to-br from-purple-500/10 to-indigo-500/5 p-4 text-sm text-slate-200 border border-purple-500/20 shadow-md leading-relaxed">
                    {coachMessage}
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest ml-1 mt-1">
                    Live Feedback
                  </span>
                </div>
              ) : (
                <div className="flex h-full items-center justify-center text-center text-sm text-slate-500">
                  <div className="flex flex-col items-center gap-3">
                    <div className="p-3 rounded-full bg-purple-500/5 border border-purple-500/10 animate-pulse">
                      <Sparkles className="h-7 w-7 text-purple-500/50" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-300">Coaching Active</p>
                      <p className="text-xs text-slate-500 mt-1 max-w-[220px]">
                        Analyzing your application switches and focus periods to provide real-time tips.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setExpanded(!expanded)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 ring-1 ring-white/10 transition-shadow animate-float"
      >
        {expanded ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <MessageCircle className="h-6 w-6 text-white" />
        )}
      </motion.button>
    </div>
  );
}
