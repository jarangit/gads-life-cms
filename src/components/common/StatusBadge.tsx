import type { ContentStatus } from '@/types'
import { Badge, type BadgeVariant } from '@/components/ui'

interface StatusBadgeProps {
  status: ContentStatus
}

const statusConfig: Record<
  ContentStatus,
  { label: string; variant: BadgeVariant }
> = {
  draft: { label: 'Draft', variant: 'default' },
  published: { label: 'Published', variant: 'success' },
  archived: { label: 'Archived', variant: 'warning' },
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status]
  return <Badge variant={config.variant}>{config.label}</Badge>
}
