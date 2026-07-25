import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Clock, ArrowRight, X } from 'lucide-react'
import { useMonitorStore } from '../../store/useMonitorStore'
import { useSessionStore } from '../../store/useSessionStore'
import { interventionsApi } from '../../services/api'
import { Button } from './Button'

/**
 * Smart intervention notification — slides in when the user has been
 * distracted for longer than their configured threshold.
 * Tracks which action the user chooses for analytics.
 */
export function DistractionNotification() {
  const { distractionAlertVisible, distractionAlertData, dismissDistractionAlert } =
    useMonitorStore()
  const { currentSession } = useSessionStore()

  const handleAction = async (action: 'return_to_work' | 'snooze' | 'ignore') => {
    try {
      await interventionsApi.log({
        session_id: currentSession?.id,
        action,
        app_name: distractionAlertData?.app_name ?? 'unknown',
      })
    } catch (err) {
      console.warn('Could not log intervention:', err)
    }
    dismissDistractionAlert()
  }

  return (
    <AnimatePresence>
      {distractionAlertVisible && distractionAlertData && (
        <motion.div
          id="distraction-notification"
          className="fixed bottom-6 right-6 z-50 max-w-sm w-full"
          initial={{ opacity: 0, x: 80, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 80, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        >
          <div className="glass-card overflow-hidden">
            {/* Distraction accent bar */}
            <div className="h-1 bg-gradient-to-r from-red-500 to-orange-400" />

            <div className="p-5">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-red-500/15">
                    <AlertTriangle size={16} className="text-red-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-100">
                      Focus Check
                    </p>
                    <p className="text-xs text-slate-400">Distraction Detected</p>
                  </div>
                </div>
                <button
                  onClick={() => handleAction('ignore')}
                  className="p-1 rounded hover:bg-white/10 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Message */}
              <p className="text-sm text-slate-300 mb-4 leading-relaxed">
                You've spent{' '}
                <span className="text-red-400 font-semibold">
                  {distractionAlertData.minutes_on_distraction} min
                </span>{' '}
                on{' '}
                <span className="text-slate-100 font-semibold">
                  {distractionAlertData.app_name}
                </span>
                . Ready to get back to your goal?
              </p>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <Button
                  id="btn-return-to-work"
                  variant="primary"
                  size="sm"
                  icon={<ArrowRight size={14} />}
                  onClick={() => handleAction('return_to_work')}
                  className="w-full justify-center"
                >
                  Return to Work
                </Button>
                <div className="flex gap-2">
                  <Button
                    id="btn-snooze"
                    variant="secondary"
                    size="sm"
                    icon={<Clock size={14} />}
                    onClick={() => handleAction('snooze')}
                    className="flex-1 justify-center"
                  >
                    Snooze 5 min
                  </Button>
                  <Button
                    id="btn-ignore"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAction('ignore')}
                    className="flex-1 justify-center"
                  >
                    Ignore
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
