import { Plus, Trash2 } from 'lucide-react'
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import type { AffiliateLink } from '@/types'

interface AffiliateLinksTabProps {
  links: AffiliateLink[]
  onLinkChange: (index: number, field: keyof AffiliateLink, value: string | number) => void
  onAddLink: () => void
  onRemoveLink: (index: number) => void
}

export function AffiliateLinksTab({
  links,
  onLinkChange,
  onAddLink,
  onRemoveLink,
}: AffiliateLinksTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Affiliate Links</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {links.length === 0 ? (
          <p className="text-sm text-slate-500">No affiliate links added yet.</p>
        ) : (
          links.map((link, index) => (
            <div key={link.id} className="rounded-lg border border-slate-200 p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">Link {index + 1}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveLink(index)}
                  className="text-red-500 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  label="Merchant"
                  value={link.merchant}
                  onChange={(e) => onLinkChange(index, 'merchant', e.target.value)}
                  placeholder="e.g., Amazon"
                />
                <Input
                  label="Price ($)"
                  type="number"
                  value={link.price || ''}
                  onChange={(e) =>
                    onLinkChange(index, 'price', e.target.value ? Number(e.target.value) : 0)
                  }
                  placeholder="e.g., 999"
                />
                <div className="sm:col-span-2">
                  <Input
                    label="URL"
                    type="url"
                    value={link.url}
                    onChange={(e) => onLinkChange(index, 'url', e.target.value)}
                    placeholder="https://..."
                  />
                </div>
                <div className="sm:col-span-2">
                  <Input
                    label="Note (optional)"
                    value={link.note || ''}
                    onChange={(e) => onLinkChange(index, 'note', e.target.value)}
                    placeholder="e.g., Best price, Free shipping"
                  />
                </div>
              </div>
            </div>
          ))
        )}
        <Button
          type="button"
          variant="outline"
          onClick={onAddLink}
          leftIcon={<Plus className="h-4 w-4" />}
        >
          Add Affiliate Link
        </Button>
      </CardContent>
    </Card>
  )
}
