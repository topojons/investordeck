import { ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  iconPrefix?: ReactNode
  iconSuffix?: ReactNode
}

export default function Input({
  label,
  error,
  iconPrefix,
  iconSuffix,
  className,
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-200 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {iconPrefix && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {iconPrefix}
          </div>
        )}
        <input
          className={cn(
            'w-full px-4 py-2 bg-primary-800 border rounded-lg transition-colors',
            'text-gray-100 placeholder-gray-500',
            'border-primary-700 focus:border-accent-500 focus:outline-none',
            'hover:border-primary-600',
            error && 'border-red-500 focus:border-red-500',
            iconPrefix && 'pl-10',
            iconSuffix && 'pr-10',
            className
          )}
          {...props}
        />
        {iconSuffix && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {iconSuffix}
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
    </div>
  )
}
