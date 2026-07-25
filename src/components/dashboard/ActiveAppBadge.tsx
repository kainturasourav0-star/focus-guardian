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
      case 'PRODUCTIVE': return 'bg-green-500';
      case 'DISTRACTION': return 'bg-red-500';
      default: return 'bg-yellow-500';
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
      >
        <GlassCard className="p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-400">Currently Active App</h3>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${getColor()}`}></span>
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${getColor()}`}></span>
              </span>
              <Badge variant={getBadgeVariant()}>{classification}</Badge>
            </div>
          </div>
          
          <div>
            <div className="text-lg font-bold text-white mb-1 truncate">{appName || 'System'}</div>
            <div className="text-xs text-gray-500 truncate" title={windowTitle}>
              {windowTitle.length > 50 ? windowTitle.substring(0, 50) + '...' : windowTitle || 'Background'}
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </AnimatePresence>
  );
}
