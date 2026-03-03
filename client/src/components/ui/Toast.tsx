import { ReactNode } from 'react'
import { X, AlertCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react'
import { cn } from '@/utils/cn'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastProps {
  id: string
  type: ToastType
  message: string
  onClose: (id: string) => void
  autoClose?: boolean
}

export default function Toast({
  id,
  type,
  message,
  onClose,
  autoClose = true,
}: ToastProps) {
  // Auto-dismiss after 5 seconds
  if (autoClose) {
    setTimeout(() => onClose(id), 5000)
  }

  const icons = {
    success: <CheckCircle size={20} />,
    error: <AlertCircle size={20} />,
    warning: <AlertTriangle size={20} />,
    info: <Info size={20} />,
  }

  const styles = {
    success: 'bg-profit-500/20 border-profit-500/30 text-profit-400',
    error: 'bg-loss-500/20 border-loss-500/30 text-loss-400',
    warning: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400',
    info: 'bg-blue-500/20 border-blue-500/30 text-blue-400',
  }

  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur-sm',
        styles[type]
      )}
    >
      {icons[type]}
      <span className="flex-1 text-sm font-medium">{message}</span>
      <button
        onClick={() => onClose(id)}
        className="p-1 hover:bg-white/10 rounded transition-colors"
      >
        <X size={18} />
      </button>
    </div>
  )
}
