import type { HTMLAttributes, ReactNode } from 'react'
import { clsx } from 'clsx'
import { AlertCircle, CheckCircle, Info, XCircle, X } from 'lucide-react'

type AlertVariant = 'info' | 'success' | 'warning' | 'error'

interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant
  title?: string
  children: ReactNode
  onClose?: () => void
}

const variantStyles: Record<AlertVariant, { container: string; icon: ReactNode }> = {
  info: {
    container: 'bg-blue-50 text-blue-800 border-blue-200',
    icon: <Info className="h-5 w-5 text-blue-500" />,
  },
  success: {
    container: 'bg-green-50 text-green-800 border-green-200',
    icon: <CheckCircle className="h-5 w-5 text-green-500" />,
  },
  warning: {
    container: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    icon: <AlertCircle className="h-5 w-5 text-yellow-500" />,
  },
  error: {
    container: 'bg-red-50 text-red-800 border-red-200',
    icon: <XCircle className="h-5 w-5 text-red-500" />,
  },
}

export function Alert({
  variant = 'info',
  title,
  children,
  onClose,
  className,
  ...props
}: AlertProps) {
  const styles = variantStyles[variant]

  return (
    <div
      className={clsx(
        'flex gap-3 rounded-lg border p-4',
        styles.container,
        className
      )}
      role="alert"
      {...props}
    >
      <div className="shrink-0">{styles.icon}</div>
      <div className="flex-1">
        {title && <h4 className="mb-1 font-medium">{title}</h4>}
        <div className="text-sm">{children}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="shrink-0 rounded p-0.5 opacity-70 hover:opacity-100"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
