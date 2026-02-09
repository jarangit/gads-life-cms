import { type ReactNode } from 'react'
import { clsx } from 'clsx'

export interface StatItem {
  label: string
  value: string | number
  icon?: ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  color?: 'default' | 'blue' | 'green' | 'yellow' | 'red' | 'purple'
}

interface StatsSummaryProps {
  stats: StatItem[]
  className?: string
}

const colorStyles: Record<NonNullable<StatItem['color']>, { bg: string; icon: string; text: string }> = {
  default: {
    bg: 'bg-slate-50',
    icon: 'text-slate-500',
    text: 'text-slate-900',
  },
  blue: {
    bg: 'bg-blue-50',
    icon: 'text-blue-500',
    text: 'text-blue-900',
  },
  green: {
    bg: 'bg-green-50',
    icon: 'text-green-500',
    text: 'text-green-900',
  },
  yellow: {
    bg: 'bg-amber-50',
    icon: 'text-amber-500',
    text: 'text-amber-900',
  },
  red: {
    bg: 'bg-red-50',
    icon: 'text-red-500',
    text: 'text-red-900',
  },
  purple: {
    bg: 'bg-purple-50',
    icon: 'text-purple-500',
    text: 'text-purple-900',
  },
}

export function StatsSummary({ stats, className }: StatsSummaryProps) {
  return (
    <div className={clsx('grid gap-4', className)}>
      {stats.map((stat, index) => {
        const color = stat.color || 'default'
        const styles = colorStyles[color]

        return (
          <div
            key={index}
            className={clsx(
              'rounded-xl border border-slate-200 bg-white p-4 transition-shadow hover:shadow-sm'
            )}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                <p className={clsx('text-2xl font-bold', styles.text)}>{stat.value}</p>
              </div>
              {stat.icon && (
                <div className={clsx('rounded-lg p-2', styles.bg)}>
                  <span className={styles.icon}>{stat.icon}</span>
                </div>
              )}
            </div>
            {stat.trend && (
              <div className="mt-2 flex items-center gap-1">
                <span
                  className={clsx(
                    'text-xs font-medium',
                    stat.trend.isPositive ? 'text-green-600' : 'text-red-600'
                  )}
                >
                  {stat.trend.isPositive ? '↑' : '↓'} {Math.abs(stat.trend.value)}%
                </span>
                <span className="text-xs text-slate-400">vs last month</span>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
