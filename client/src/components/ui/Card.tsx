import { ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface CardProps {
  children: ReactNode
  className?: string
  header?: ReactNode
  footer?: ReactNode
  hoverable?: boolean
}

export default function Card({
  children,
  className,
  header,
  footer,
  hoverable = false,
}: CardProps) {
  return (
    <div
      className={cn(
        'bg-primary-900 rounded-lg border border-primary-800 overflow-hidden',
        hoverable && 'hover:border-primary-700 hover:bg-primary-800 transition-colors',
        className
      )}
    >
      {header && (
        <div className="px-6 py-4 border-b border-primary-800 bg-primary-950">
          {header}
        </div>
      )}
      <div className="px-6 py-4">{children}</div>
      {footer && (
        <div className="px-6 py-4 border-t border-primary-800 bg-primary-950">
          {footer}
        </div>
      )}
    </div>
  )
}
