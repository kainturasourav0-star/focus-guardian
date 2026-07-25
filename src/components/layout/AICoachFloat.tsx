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
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="flex h-[300px] w-[350px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-gray-900/90 shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-400" />
                <h3 className="font-semibold text-white">AI Coach</h3>
              </div>
              <button
                onClick={() => setExpanded(false)}
                className="rounded-lg p-1 text-gray-400 hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto">
              {coachMessage ? (
                <div className="flex flex-col gap-2">
                  <div className="rounded-xl rounded-tl-none bg-purple-500/20 p-4 text-sm text-purple-100 border border-purple-500/30">
                    {coachMessage}
                  </div>
                  <span className="text-xs text-gray-500 ml-1">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ) : (
                <div className="flex h-full items-center justify-center text-center text-sm text-gray-500">
                  <div className="flex flex-col items-center gap-2">
                    <Sparkles className="h-8 w-8 animate-pulse text-purple-500/50" />
                    <p>Analyzing your productivity patterns...</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setExpanded(!expanded)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-shadow"
      >
        <MessageCircle className="h-6 w-6 text-white" />
      </motion.button>
    </div>
  );
}
