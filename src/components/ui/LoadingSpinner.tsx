import { motion } from 'framer-motion'
import { clsx } from 'clsx'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  message?: string
  className?: string
}

const sizePx = { sm: 24, md: 40, lg: 64 }

export function LoadingSpinner({ size = 'md', message, className }: LoadingSpinnerProps) {
  const px = sizePx[size]

  return (
    <div className={clsx('flex flex-col items-center justify-center gap-4', className)}>
      <div className="relative" style={{ width: px, height: px }}>
        {/* Outer ring */}
        <svg
          width={px}
          height={px}
          viewBox={`0 0 ${px} ${px}`}
          className="animate-spin"
        >
          <circle
            cx={px / 2}
            cy={px / 2}
            r={px / 2 - 3}
            fill="none"
            stroke="rgba(124,58,237,0.2)"
            strokeWidth="3"
          />
          <circle
            cx={px / 2}
            cy={px / 2}
            r={px / 2 - 3}
            fill="none"
            stroke="url(#spinner-gradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={`${(px - 6) * Math.PI * 0.7} ${(px - 6) * Math.PI * 0.3}`}
          />
          <defs>
            <linearGradient id="spinner-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {message && (
        <motion.p
          className="text-sm text-slate-400 text-center"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {message}
        </motion.p>
      )}
    </div>
  )
}
