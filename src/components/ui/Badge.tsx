import { clsx } from 'clsx'
import { Classification } from '../../types'

type BadgeVariant = 'productive' | 'distraction' | 'neutral' | 'info' | 'warning' | Classification

interface BadgeProps {
  variant: BadgeVariant
  children: React.ReactNode
  className?: string
  dot?: boolean
}

const variantStyles: Record<string, string> = {
  PRODUCTIVE: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  DISTRACTION: 'bg-red-500/15 text-red-400 border-red-500/25',
  NEUTRAL: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
  productive: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  distraction: 'bg-red-500/15 text-red-400 border-red-500/25',
  neutral: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
  info: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/25',
  warning: 'bg-orange-500/15 text-orange-400 border-orange-500/25',
}

const dotColors: Record<string, string> = {
  PRODUCTIVE: 'bg-emerald-400',
  DISTRACTION: 'bg-red-400',
  NEUTRAL: 'bg-amber-400',
  productive: 'bg-emerald-400',
  distraction: 'bg-red-400',
  neutral: 'bg-amber-400',
  info: 'bg-cyan-400',
  warning: 'bg-orange-400',
}

export function Badge({ variant, children, className, dot = false }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border',
        variantStyles[variant] || 'bg-slate-500/15 text-slate-400 border-slate-500/25',
        className
      )}
    >
      {dot && (
        <span
          className={clsx(
            'w-1.5 h-1.5 rounded-full',
            dotColors[variant] || 'bg-slate-400'
          )}
        />
      )}
      {children}
    </span>
  )
}
