import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Clock, ShieldAlert } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { FocusSession } from '../../types';

interface Props {
  sessions: FocusSession[];
}

export default function SessionTimeline({ sessions }: Props) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const formatDuration = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  const getTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getDurationSeconds = (session: FocusSession) => {
    const start = new Date(session.start_time).getTime();
    const end = session.end_time ? new Date(session.end_time).getTime() : Date.now();
    return Math.max(0, Math.floor((end - start) / 1000));
  };

  return (
    <div className="relative pl-6 border-l border-white/10 space-y-8">
      {sessions.map((session, index) => {
        const durationSecs = getDurationSeconds(session);
        const topApps = (session as any).top_apps as { name: string; duration: number }[] | undefined;

        return (
          <motion.div
            key={session.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative"
          >
            {/* Timeline Dot */}
            <div
              className={`absolute -left-[31px] top-1.5 h-4 w-4 rounded-full border-4 border-slate-950 ${
                session.productivity_score >= 80
                  ? 'bg-emerald-500'
                  : session.productivity_score >= 50
                    ? 'bg-amber-500'
                    : 'bg-red-500'
              }`}
            />

            <div
              className="bg-slate-900/50 hover:bg-slate-800/50 border border-white/5 rounded-xl p-5 cursor-pointer transition-colors"
              onClick={() => setExpandedId(expandedId === session.id ? null : session.id)}
            >
              <div className="flex flex-wrap md:flex-nowrap justify-between items-start gap-4">
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {session.task_name || 'Focus Session'}
                  </h3>
                  <div className="flex items-center gap-3 text-sm text-slate-400 mt-1">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" /> {getTime(session.start_time)} -{' '}
                      {session.end_time ? getTime(session.end_time) : 'Active'}
                    </div>
                    <div className="w-1 h-1 rounded-full bg-slate-650" />
                    <div>{formatDuration(durationSecs)}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-sm text-red-400 bg-red-500/10 px-2 py-1 rounded-md">
                    <ShieldAlert className="h-4 w-4" /> {session.distraction_count}
                  </div>
                  <Badge
                    variant={
                      session.productivity_score >= 80
                        ? 'PRODUCTIVE'
                        : session.productivity_score >= 50
                          ? 'NEUTRAL'
                          : 'DISTRACTION'
                    }
                  >
                    Score: {session.productivity_score}
                  </Badge>
                  <ChevronDown
                    className={`h-5 w-5 text-slate-500 transition-transform ${
                      expandedId === session.id ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </div>

              <AnimatePresence>
                {expandedId === session.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 mt-4 border-t border-white/5">
                      <h4 className="text-sm font-medium text-slate-400 mb-3">Top Applications</h4>
                      <div className="space-y-2">
                        {topApps && topApps.length ? (
                          topApps.map((app, i) => (
                            <div key={i} className="flex justify-between items-center text-sm">
                              <span className="text-slate-300">{app.name}</span>
                              <span className="text-slate-500">{formatDuration(app.duration)}</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-slate-500">No application data recorded.</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
