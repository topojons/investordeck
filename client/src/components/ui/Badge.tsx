import { ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'primary' | 'success' | 'error' | 'warning' | 'info'
  size?: 'sm' | 'md'
}

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
}: BadgeProps) {
  const variants = {
    default: 'bg-primary-800 text-gray-200',
    primary: 'bg-accent-500/20 text-accent-400 border border-accent-500/30',
    success: 'bg-profit-500/20 text-profit-400 border border-profit-500/30',
    error: 'bg-loss-500/20 text-loss-400 border border-loss-500/30',
    warning: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    info: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        variants[variant],
        sizes[size]
      )}
    >
      {children}
    </span>
  )
}
