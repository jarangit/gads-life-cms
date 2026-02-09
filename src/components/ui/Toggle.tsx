import { forwardRef, type InputHTMLAttributes } from 'react'
import { clsx } from 'clsx'

interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
}

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  ({ className, label, id, ...props }, ref) => {
    const toggleId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex items-center">
        <label htmlFor={toggleId} className="relative inline-flex cursor-pointer items-center">
          <input
            ref={ref}
            type="checkbox"
            id={toggleId}
            className="peer sr-only"
            {...props}
          />
          <div
            className={clsx(
              'h-6 w-11 rounded-full bg-slate-200 transition-colors after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-all peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 peer-focus:ring-offset-2 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
              className
            )}
          />
        </label>
        {label && (
          <span className="ml-3 text-sm text-slate-700">{label}</span>
        )}
      </div>
    )
  }
)

Toggle.displayName = 'Toggle'
