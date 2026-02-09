import { FileJson, AlertCircle } from 'lucide-react'
import { Button, Alert, Card, CardHeader, CardTitle, CardContent } from '@/components/ui'

interface JsonImportTabProps {
  jsonInput: string
  jsonError: string | null
  onJsonChange: (value: string) => void
  onImport: () => void
  onLoadTemplate: () => void
  onClear: () => void
}

const JSON_TEMPLATE = JSON.stringify(
  {
    name: 'Product Name',
    slug: 'product-slug',
    brandId: 'brand-id',
    categoryIds: ['category-id-1'],
    shortDescription: 'Brief product description',
    pros: ['Pro 1', 'Pro 2'],
    cons: ['Con 1', 'Con 2'],
    specs: [
      { key: 'Processor', value: 'M3 chip' },
      { key: 'RAM', value: '8GB' },
    ],
    rating: 4.5,
    price: 999,
    heroImage: 'https://example.com/image.jpg',
    galleryImages: [],
    affiliateLinks: [
      {
        merchant: 'Amazon',
        url: 'https://amazon.com/...',
        price: 999,
        note: 'Best price',
      },
    ],
  },
  null,
  2
)

export function JsonImportTab({
  jsonInput,
  jsonError,
  onJsonChange,
  onImport,
  onLoadTemplate,
  onClear,
}: JsonImportTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileJson className="h-5 w-5" />
          Import Product from JSON
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert variant="info">
          <AlertCircle className="h-4 w-4" />
          <span>
            Products imported via JSON will automatically be set to <strong>Draft</strong> status
            for review.
          </span>
        </Alert>

        {jsonError && (
          <Alert variant="error">
            <AlertCircle className="h-4 w-4" />
            <span>{jsonError}</span>
          </Alert>
        )}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Paste JSON Data</label>
          <textarea
            className="h-80 w-full rounded-lg border border-slate-300 p-3 font-mono text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            value={jsonInput}
            onChange={(e) => onJsonChange(e.target.value)}
            placeholder={JSON_TEMPLATE}
          />
        </div>

        <div className="flex gap-3">
          <Button type="button" onClick={onImport} leftIcon={<FileJson className="h-4 w-4" />}>
            Import & Review
          </Button>
          <Button type="button" variant="outline" onClick={onLoadTemplate}>
            Load Template
          </Button>
          <Button type="button" variant="ghost" onClick={onClear}>
            Clear
          </Button>
        </div>

        <div className="rounded-lg bg-slate-50 p-4">
          <h4 className="mb-2 text-sm font-medium text-slate-700">JSON Structure</h4>
          <ul className="space-y-1 text-sm text-slate-600">
            <li>
              <code className="rounded bg-slate-200 px-1">name</code> - Required. Product name
            </li>
            <li>
              <code className="rounded bg-slate-200 px-1">slug</code> - URL slug (auto-generated if
              empty)
            </li>
            <li>
              <code className="rounded bg-slate-200 px-1">brandId</code> - Brand ID
            </li>
            <li>
              <code className="rounded bg-slate-200 px-1">categoryIds</code> - Array of category IDs
            </li>
            <li>
              <code className="rounded bg-slate-200 px-1">shortDescription</code> - Brief
              description
            </li>
            <li>
              <code className="rounded bg-slate-200 px-1">pros</code> - Array of strings
            </li>
            <li>
              <code className="rounded bg-slate-200 px-1">cons</code> - Array of strings
            </li>
            <li>
              <code className="rounded bg-slate-200 px-1">specs</code> - Array of {'{key, value}'}{' '}
              objects
            </li>
            <li>
              <code className="rounded bg-slate-200 px-1">rating</code> - Number (0-5)
            </li>
            <li>
              <code className="rounded bg-slate-200 px-1">price</code> - Number
            </li>
            <li>
              <code className="rounded bg-slate-200 px-1">heroImage</code> - Image URL
            </li>
            <li>
              <code className="rounded bg-slate-200 px-1">galleryImages</code> - Array of image URLs
            </li>
            <li>
              <code className="rounded bg-slate-200 px-1">affiliateLinks</code> - Array of{' '}
              {'{merchant, url, price, note}'}
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

export const getJsonTemplate = () => JSON_TEMPLATE
