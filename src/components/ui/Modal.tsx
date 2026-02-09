import { type HTMLAttributes, type ReactNode, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { clsx } from 'clsx'
import { X } from 'lucide-react'

interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

interface ModalHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  onClose?: () => void
}

interface ModalBodyProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

interface ModalFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

const sizeStyles = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-full mx-4',
}

export function Modal({
  isOpen,
  onClose,
  children,
  size = 'md',
  className,
  ...props
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose()
  }

  if (!isOpen) return null

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleOverlayClick}
    >
      <div
        className={clsx(
          'w-full rounded-xl bg-white shadow-xl',
          sizeStyles[size],
          className
        )}
        role="dialog"
        aria-modal="true"
        {...props}
      >
        {children}
      </div>
    </div>,
    document.body
  )
}

export function ModalHeader({
  className,
  children,
  onClose,
  ...props
}: ModalHeaderProps) {
  return (
    <div
      className={clsx(
        'flex items-center justify-between border-b border-slate-200 px-6 py-4',
        className
      )}
      {...props}
    >
      <h2 className="text-lg font-semibold text-slate-900">{children}</h2>
      {onClose && (
        <button
          onClick={onClose}
          className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  )
}

export function ModalBody({ className, children, ...props }: ModalBodyProps) {
  return (
    <div className={clsx('px-6 py-4', className)} {...props}>
      {children}
    </div>
  )
}

export function ModalFooter({ className, children, ...props }: ModalFooterProps) {
  return (
    <div
      className={clsx(
        'flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-4',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
