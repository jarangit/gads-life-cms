import { Plus, Trash2 } from 'lucide-react'
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '@/components/ui'

interface ProsConsTabProps {
  pros: string[]
  cons: string[]
  onProChange: (index: number, value: string) => void
  onAddPro: () => void
  onRemovePro: (index: number) => void
  onConChange: (index: number, value: string) => void
  onAddCon: () => void
  onRemoveCon: (index: number) => void
}

export function ProsConsTab({
  pros,
  cons,
  onProChange,
  onAddPro,
  onRemovePro,
  onConChange,
  onAddCon,
  onRemoveCon,
}: ProsConsTabProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-green-600">Pros</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {pros.map((pro, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={pro}
                onChange={(e) => onProChange(index, e.target.value)}
                placeholder="Add a pro..."
                className="flex-1"
              />
              {pros.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemovePro(index)}
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
            onClick={onAddPro}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Add Pro
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-red-600">Cons</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {cons.map((con, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={con}
                onChange={(e) => onConChange(index, e.target.value)}
                placeholder="Add a con..."
                className="flex-1"
              />
              {cons.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveCon(index)}
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
            onClick={onAddCon}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Add Con
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
