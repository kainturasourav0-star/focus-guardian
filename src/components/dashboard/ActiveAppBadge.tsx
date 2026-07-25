import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '../ui/GlassCard';
import { Badge } from '../ui/Badge';

interface Props {
  appName: string;
  classification: 'PRODUCTIVE' | 'DISTRACTION' | 'NEUTRAL';
  windowTitle: string;
}

export default function ActiveAppBadge({ appName, classification, windowTitle }: Props) {
  const getColor = () => {
    switch (classification) {
      case 'PRODUCTIVE': return 'bg-emerald-500 shadow-[0_0_8px_#10b981]';
      case 'DISTRACTION': return 'bg-red-500 shadow-[0_0_8px_#ef4444]';
      default: return 'bg-amber-500 shadow-[0_0_8px_#f59e0b]';
    }
  };

  const getBadgeVariant = () => {
    return classification;
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={appName + windowTitle}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
      >
        <GlassCard 
          className="p-6 flex flex-col gap-4 border border-white/5 shadow-lg relative overflow-hidden group hover:scale-[1.01] transition-all"
          style={{ background: '#18181B' }}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Active Application</h3>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${getColor()}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${getColor()}`}></span>
              </span>
              <Badge variant={getBadgeVariant()}>{classification}</Badge>
            </div>
          </div>
          
          <div>
            <div className="text-xl font-bold text-white mb-1.5 truncate tracking-tight">{appName || 'System idle'}</div>
            <div className="text-xs text-zinc-500 truncate leading-relaxed" title={windowTitle}>
              {windowTitle.length > 50 ? windowTitle.substring(0, 50) + '...' : windowTitle || 'Monitoring background active windows'}
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </AnimatePresence>
  );
}
