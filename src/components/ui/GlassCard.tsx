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
}

/**
 * Reusable glassmorphism card — the primary container component used throughout
 * the app. Supports gradient tints, hover effects, and glow variants.
 */
export function GlassCard({
  children,
  className,
  gradient = 'none',
  hover = false,
  glow = false,
  onClick,
  id,
}: GlassCardProps) {
  const gradientStyles = {
    purple: 'bg-gradient-to-br from-purple-900/20 to-cyan-900/10',
    cyan: 'bg-gradient-to-br from-cyan-900/20 to-purple-900/10',
    productive: 'bg-gradient-to-br from-emerald-900/20 to-cyan-900/10',
    distraction: 'bg-gradient-to-br from-red-900/20 to-orange-900/10',
    none: '',
  }

  const glowStyles = {
    purple: 'glow-purple',
    cyan: 'glow-cyan',
    productive: 'glow-productive',
    distraction: 'glow-distraction',
    none: '',
  }

  return (
    <motion.div
      id={id}
      className={clsx(
        'glass-card relative overflow-hidden',
        gradientStyles[gradient],
        glow && gradient !== 'none' && glowStyles[gradient],
        hover && 'glass-hover cursor-pointer',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      whileHover={hover ? { y: -2 } : undefined}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  )
}
