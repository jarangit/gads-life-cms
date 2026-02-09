import { useState, useRef, useEffect, type ReactNode } from 'react'
import { clsx } from 'clsx'
import { ChevronDown } from 'lucide-react'

interface DropdownProps {
  trigger: ReactNode
  children: ReactNode
  align?: 'left' | 'right'
}

interface DropdownItemProps {
  children: ReactNode
  onClick?: () => void
  danger?: boolean
  disabled?: boolean
}

export function Dropdown({ trigger, children, align = 'right' }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && (
        <div
          className={clsx(
            'absolute z-50 mt-2 min-w-[160px] rounded-lg border border-slate-200 bg-white py-1 shadow-lg',
            align === 'right' ? 'right-0' : 'left-0'
          )}
        >
          <div onClick={() => setIsOpen(false)}>{children}</div>
        </div>
      )}
    </div>
  )
}

export function DropdownItem({
  children,
  onClick,
  danger = false,
  disabled = false,
}: DropdownItemProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'flex w-full items-center px-4 py-2 text-left text-sm transition-colors',
        danger
          ? 'text-red-600 hover:bg-red-50'
          : 'text-slate-700 hover:bg-slate-50',
        disabled && 'cursor-not-allowed opacity-50'
      )}
    >
      {children}
    </button>
  )
}

interface DropdownButtonProps {
  children: ReactNode
  className?: string
}

export function DropdownButton({ children, className }: DropdownButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50',
        className
      )}
    >
      {children}
      <ChevronDown className="h-4 w-4" />
    </button>
  )
}

export function DropdownDivider() {
  return <div className="my-1 border-t border-slate-200" />
}
