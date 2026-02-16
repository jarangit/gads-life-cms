import { Plus, Trash2 } from 'lucide-react'
import {
  Button,
  Input,
  Textarea,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui'

// ─── Reusable string-list editor ────────────────────────

interface StringListEditorProps {
  title: string
  items: string[]
  placeholder?: string
  onChange: (index: number, value: string) => void
  onAdd: () => void
  onRemove: (index: number) => void
  titleColor?: string
}

function StringListEditor({
  title,
  items,
  placeholder,
  onChange,
  onAdd,
  onRemove,
  titleColor,
}: StringListEditorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className={titleColor}>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={item}
              onChange={(e) => onChange(index, e.target.value)}
              placeholder={placeholder || `Add item...`}
              className="flex-1"
            />
            {items.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onRemove(index)}
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
          onClick={onAdd}
          leftIcon={<Plus className="h-4 w-4" />}
        >
          Add
        </Button>
      </CardContent>
    </Card>
  )
}

// ─── Ratings Editor ─────────────────────────────────────

interface RatingsEditorProps {
  ratings: { subCategory: string; score: number }[]
  onChange: (index: number, field: 'subCategory' | 'score', value: string | number) => void
  onAdd: () => void
  onRemove: (index: number) => void
}

function RatingsEditor({ ratings, onChange, onAdd, onRemove }: RatingsEditorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ratings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {ratings.length === 0 ? (
          <p className="text-sm text-slate-500">No ratings added yet.</p>
        ) : (
          ratings.map((r, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={r.subCategory}
                onChange={(e) => onChange(index, 'subCategory', e.target.value)}
                placeholder="e.g. คุณภาพเสียง"
                className="flex-1"
              />
              <Input
                type="number"
                min={1}
                max={5}
                value={r.score}
                onChange={(e) => onChange(index, 'score', Number(e.target.value))}
                placeholder="1-5"
                className="w-20"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onRemove(index)}
                className="text-red-500 hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAdd}
          leftIcon={<Plus className="h-4 w-4" />}
        >
          Add Rating
        </Button>
      </CardContent>
    </Card>
  )
}

// ─── Main Tab Props ─────────────────────────────────────

interface ListHandlers {
  handleChange: (index: number, value: string) => void
  add: () => void
  remove: (index: number) => void
}

interface ProductDetailsTabProps {
  formData: {
    keyHighlights: string[]
    weaknesses: string[]
    beforePurchasePoints: string[]
    afterUsagePoints: string[]
    quickVerdictQuote: string
    quickVerdictDescription: string
    quickVerdictTags: string[]
    pricingPrice?: number
    pricingCurrency: string
    pricingLabel: string
    ratings: { subCategory: string; score: number }[]
  }
  keyHighlightsHandlers: ListHandlers
  weaknessesHandlers: ListHandlers
  beforePurchaseHandlers: ListHandlers
  afterUsageHandlers: ListHandlers
  verdictTagsHandlers: ListHandlers
  handleRatingItemChange: (index: number, field: 'subCategory' | 'score', value: string | number) => void
  addRating: () => void
  removeRating: (index: number) => void
  updateField: (field: string, value: unknown) => void
}

export function ProductDetailsTab({
  formData,
  keyHighlightsHandlers,
  weaknessesHandlers,
  beforePurchaseHandlers,
  afterUsageHandlers,
  verdictTagsHandlers,
  handleRatingItemChange,
  addRating,
  removeRating,
  updateField,
}: ProductDetailsTabProps) {
  return (
    <div className="space-y-6">
      {/* Ratings */}
      <RatingsEditor
        ratings={formData.ratings}
        onChange={handleRatingItemChange}
        onAdd={addRating}
        onRemove={removeRating}
      />

      {/* Key Highlights & Weaknesses */}
      <div className="grid gap-6 md:grid-cols-2">
        <StringListEditor
          title="Key Highlights"
          titleColor="text-emerald-600"
          items={formData.keyHighlights}
          placeholder="e.g. ตัดเสียงรบกวนดีที่สุด"
          onChange={keyHighlightsHandlers.handleChange}
          onAdd={keyHighlightsHandlers.add}
          onRemove={keyHighlightsHandlers.remove}
        />
        <StringListEditor
          title="Weaknesses"
          titleColor="text-amber-600"
          items={formData.weaknesses}
          placeholder="e.g. ราคาสูง"
          onChange={weaknessesHandlers.handleChange}
          onAdd={weaknessesHandlers.add}
          onRemove={weaknessesHandlers.remove}
        />
      </div>

      {/* Before Purchase & After Usage */}
      <div className="grid gap-6 md:grid-cols-2">
        <StringListEditor
          title="Before Purchase Points"
          titleColor="text-blue-600"
          items={formData.beforePurchasePoints}
          placeholder="e.g. เช็กว่ารองรับ LDAC หรือไม่"
          onChange={beforePurchaseHandlers.handleChange}
          onAdd={beforePurchaseHandlers.add}
          onRemove={beforePurchaseHandlers.remove}
        />
        <StringListEditor
          title="After Usage Points"
          titleColor="text-indigo-600"
          items={formData.afterUsagePoints}
          placeholder="e.g. อัปเดต firmware ทันที"
          onChange={afterUsageHandlers.handleChange}
          onAdd={afterUsageHandlers.add}
          onRemove={afterUsageHandlers.remove}
        />
      </div>

      {/* Quick Verdict */}
      <Card>
        <CardHeader>
          <CardTitle className="text-purple-600">Quick Verdict</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Quote"
            value={formData.quickVerdictQuote}
            onChange={(e) => updateField('quickVerdictQuote', e.target.value)}
            placeholder="e.g. หูฟัง ANC ที่ดีที่สุด ณ ปี 2025"
          />
          <Textarea
            label="Description"
            value={formData.quickVerdictDescription}
            onChange={(e) => updateField('quickVerdictDescription', e.target.value)}
            placeholder="สรุปรีวิวผลิตภัณฑ์..."
            rows={3}
          />
          <div className="pt-2">
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Tags
            </label>
            <div className="space-y-2">
              {formData.quickVerdictTags.map((tag, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={tag}
                    onChange={(e) => verdictTagsHandlers.handleChange(index, e.target.value)}
                    placeholder="e.g. หูฟังไร้สาย"
                    className="flex-1"
                  />
                  {formData.quickVerdictTags.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => verdictTagsHandlers.remove(index)}
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
                onClick={verdictTagsHandlers.add}
                leftIcon={<Plus className="h-4 w-4" />}
              >
                Add Tag
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pricing */}
      <Card>
        <CardHeader>
          <CardTitle>Pricing Info</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <Input
              label="Price"
              type="number"
              value={formData.pricingPrice ?? ''}
              onChange={(e) =>
                updateField('pricingPrice', e.target.value ? Number(e.target.value) : undefined)
              }
              placeholder="e.g. 12990"
            />
            <Input
              label="Currency"
              value={formData.pricingCurrency}
              onChange={(e) => updateField('pricingCurrency', e.target.value)}
              placeholder="THB"
            />
            <Input
              label="Price Label"
              value={formData.pricingLabel}
              onChange={(e) => updateField('pricingLabel', e.target.value)}
              placeholder="e.g. ฿12,990"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
