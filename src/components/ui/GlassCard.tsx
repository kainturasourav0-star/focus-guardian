import React from 'react'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  gradient?: 'purple' | 'cyan' | 'productive' | 'distraction' | 'none'
  hover?: boolean
  glow?: boolean
  onClick?: () => void
  id?: string
  style?: React.CSSProperties
}

/**
 * Reusable glassmorphism card — background #18181B, border-radius 16px.
 * Supports gradient tints, hover scaling, and glow shadows.
 */
export function GlassCard({
  children,
  className,
  gradient = 'none',
  hover = false,
  glow = false,
  onClick,
  id,
  style,
}: GlassCardProps) {
  const gradientStyles = {
    purple: 'bg-gradient-to-br from-purple-500/5 to-cyan-500/5 border-purple-500/10 shadow-[0_0_30px_rgba(124,58,237,0.05)]',
    cyan: 'bg-gradient-to-br from-cyan-500/5 to-purple-500/5 border-cyan-500/10 shadow-[0_0_30px_rgba(6,182,212,0.05)]',
    productive: 'bg-gradient-to-br from-emerald-500/5 to-cyan-500/5 border-emerald-500/10 shadow-[0_0_30px_rgba(16,185,129,0.05)]',
    distraction: 'bg-gradient-to-br from-red-500/5 to-orange-500/5 border-red-500/10 shadow-[0_0_30px_rgba(239,68,68,0.05)]',
    none: 'border-white/5',
  }

  return (
    <motion.div
      id={id}
      className={clsx(
        'rounded-2xl border backdrop-blur-md transition-all duration-300 shadow-md relative overflow-hidden',
        gradientStyles[gradient],
        hover && 'hover:scale-[1.01] hover:-translate-y-1 hover:border-white/10 hover:shadow-lg cursor-pointer',
        onClick && 'cursor-pointer active:scale-[0.99]',
        className
      )}
      style={{ background: '#18181B', ...style }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}
