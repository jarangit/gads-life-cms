import { Plus, Trash2 } from 'lucide-react'
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '@/components/ui'

interface Spec {
  key: string
  value: string
}

interface SpecsTabProps {
  specs: Spec[]
  onSpecChange: (index: number, field: 'key' | 'value', value: string) => void
  onAddSpec: () => void
  onRemoveSpec: (index: number) => void
}

export function SpecsTab({ specs, onSpecChange, onAddSpec, onRemoveSpec }: SpecsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Specifications</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {specs.map((spec, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={spec.key}
              onChange={(e) => onSpecChange(index, 'key', e.target.value)}
              placeholder="Spec name (e.g., Processor)"
              className="w-1/3"
            />
            <Input
              value={spec.value}
              onChange={(e) => onSpecChange(index, 'value', e.target.value)}
              placeholder="Spec value (e.g., Apple M3)"
              className="flex-1"
            />
            {specs.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onRemoveSpec(index)}
                className="text-red-500 hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAddSpec}
          leftIcon={<Plus className="h-4 w-4" />}
        >
          Add Specification
        </Button>
      </CardContent>
    </Card>
  )
}
