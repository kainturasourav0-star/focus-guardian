import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useToastStore, Toast } from '../../store/useToastStore';

const toastStyles = {
  success: {
    bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    icon: CheckCircle,
    bar: 'bg-emerald-500',
  },
  error: {
    bg: 'bg-red-500/10 border-red-500/20 text-red-400',
    icon: XCircle,
    bar: 'bg-red-500',
  },
  warning: {
    bg: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    icon: AlertTriangle,
    bar: 'bg-amber-500',
  },
  info: {
    bg: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    icon: Info,
    bar: 'bg-blue-500',
  },
};

export function ToastContainer() {
  const { toasts, dismissToast } = useToastStore();

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-3 max-w-sm w-full">
      <AnimatePresence>
        {toasts.map((toast) => {
          const style = toastStyles[toast.type];
          const Icon = style.icon;

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: -50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -50, scale: 0.9 }}
              layout
              className={`relative overflow-hidden rounded-xl border p-4 backdrop-blur-md shadow-lg ${style.bg}`}
            >
              {/* Progress bar timer indicator */}
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 4, ease: 'linear' }}
                className={`absolute bottom-0 left-0 h-0.5 ${style.bar}`}
              />

              <div className="flex items-start gap-3">
                <Icon className="h-5 w-5 shrink-0 mt-0.5" />
                <div className="flex-1 text-sm font-medium pr-4 leading-relaxed">
                  {toast.message}
                </div>
                <button
                  onClick={() => dismissToast(toast.id)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
