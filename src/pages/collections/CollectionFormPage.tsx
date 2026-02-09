import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Plus, Trash2, GripVertical, Package } from 'lucide-react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  Button,
  Input,
  Textarea,
  Select,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui'
import { PageHeader } from '@/components/common'
import type { Collection, CollectionFormData, CollectionItem, Product } from '@/types'

// Mock data
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'MacBook Air M3',
    slug: 'macbook-air-m3',
    brandId: '1',
    brand: { id: '1', name: 'Apple', slug: 'apple', createdAt: '', updatedAt: '' },
    categoryIds: ['1'],
    shortDescription: 'The most portable MacBook ever',
    sections: [],
    pros: [],
    cons: [],
    specs: [],
    rating: 4.8,
    price: 1099,
    heroImage: 'https://placehold.co/100x100',
    galleryImages: [],
    affiliateLinks: [],
    status: 'published',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: '2',
    name: 'Samsung Galaxy S24 Ultra',
    slug: 'samsung-galaxy-s24-ultra',
    brandId: '2',
    brand: { id: '2', name: 'Samsung', slug: 'samsung', createdAt: '', updatedAt: '' },
    categoryIds: ['3'],
    shortDescription: 'The ultimate smartphone with AI features',
    sections: [],
    pros: [],
    cons: [],
    specs: [],
    rating: 4.7,
    price: 1299,
    heroImage: 'https://placehold.co/100x100',
    galleryImages: [],
    affiliateLinks: [],
    status: 'published',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: '3',
    name: 'Sony WH-1000XM5',
    slug: 'sony-wh-1000xm5',
    brandId: '3',
    brand: { id: '3', name: 'Sony', slug: 'sony', createdAt: '', updatedAt: '' },
    categoryIds: ['4'],
    shortDescription: 'Industry-leading noise cancellation',
    sections: [],
    pros: [],
    cons: [],
    specs: [],
    rating: 4.9,
    price: 349,
    heroImage: 'https://placehold.co/100x100',
    galleryImages: [],
    affiliateLinks: [],
    status: 'published',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: '4',
    name: 'Dell XPS 15',
    slug: 'dell-xps-15',
    brandId: '4',
    brand: { id: '4', name: 'Dell', slug: 'dell', createdAt: '', updatedAt: '' },
    categoryIds: ['1'],
    shortDescription: 'Premium Windows laptop for creators',
    sections: [],
    pros: [],
    cons: [],
    specs: [],
    rating: 4.5,
    heroImage: 'https://placehold.co/100x100',
    galleryImages: [],
    affiliateLinks: [],
    status: 'published',
    createdAt: '',
    updatedAt: '',
  },
]

const mockCollection: Collection = {
  id: '1',
  title: 'Top 5 Laptops for Work in 2024',
  slug: 'top-5-laptops-work-2024',
  type: 'top-list',
  description: 'The best laptops for productivity and remote work',
  items: [
    { productId: '1', rank: 1, note: 'Best overall performance' },
    { productId: '4', rank: 2, note: 'Best Windows option' },
  ],
  status: 'draft',
  seo: {
    metaTitle: 'Top 5 Laptops for Work in 2024 - Best Picks',
    metaDescription: 'Discover the best laptops for productivity and remote work in 2024.',
  },
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-15T10:00:00Z',
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

interface SortableItemProps {
  item: CollectionItem
  product?: Product
  onNoteChange: (note: string) => void
  onRemove: () => void
}

function SortableItem({ item, product, onNoteChange, onRemove }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.productId })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 rounded-lg border bg-white p-3 ${
        isDragging ? 'border-blue-300 shadow-lg' : 'border-slate-200'
      }`}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="cursor-grab touch-none text-slate-400 hover:text-slate-600 active:cursor-grabbing"
      >
        <GripVertical className="h-5 w-5" />
      </button>

      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600">
        {item.rank}
      </div>

      {product?.heroImage ? (
        <img
          src={product.heroImage}
          alt={product.name}
          className="h-12 w-12 shrink-0 rounded-lg border border-slate-200 object-cover"
        />
      ) : (
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50">
          <Package className="h-5 w-5 text-slate-400" />
        </div>
      )}

      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-slate-900">{product?.name || 'Unknown Product'}</p>
        <p className="truncate text-sm text-slate-500">{product?.brand?.name}</p>
      </div>

      <Input
        value={item.note || ''}
        onChange={(e) => onNoteChange(e.target.value)}
        placeholder="Add note..."
        className="w-48"
      />

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onRemove}
        className="text-red-500 hover:bg-red-50 hover:text-red-600"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}

export function CollectionFormPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = Boolean(id)

  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProductId, setSelectedProductId] = useState('')

  const [formData, setFormData] = useState<CollectionFormData>({
    title: '',
    slug: '',
    type: 'top-list',
    description: '',
    items: [],
    status: 'draft',
    seo: {
      metaTitle: '',
      metaDescription: '',
    },
  })

  const [errors, setErrors] = useState<Partial<Record<keyof CollectionFormData, string>>>({})

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    setProducts(mockProducts)

    if (isEditing) {
      setIsLoading(true)
      setTimeout(() => {
        setFormData({
          title: mockCollection.title,
          slug: mockCollection.slug,
          type: mockCollection.type,
          description: mockCollection.description || '',
          items: mockCollection.items,
          status: mockCollection.status,
          seo: mockCollection.seo || { metaTitle: '', metaDescription: '' },
        })
        setIsLoading(false)
      }, 300)
    }
  }, [id, isEditing])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => {
      const newData = { ...prev, [name]: value }
      if (name === 'title' && !isEditing) {
        newData.slug = generateSlug(value)
      }
      return newData
    })
    if (errors[name as keyof CollectionFormData]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleSeoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      seo: { ...prev.seo, [name]: value },
    }))
  }

  const handleAddProduct = () => {
    if (!selectedProductId) return
    if (formData.items.some((item) => item.productId === selectedProductId)) return

    const newItem: CollectionItem = {
      productId: selectedProductId,
      rank: formData.items.length + 1,
      note: '',
    }

    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }))
    setSelectedProductId('')
  }

  const handleRemoveProduct = (productId: string) => {
    setFormData((prev) => {
      const newItems = prev.items
        .filter((item) => item.productId !== productId)
        .map((item, index) => ({ ...item, rank: index + 1 }))
      return { ...prev, items: newItems }
    })
  }

  const handleNoteChange = (productId: string, note: string) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.productId === productId ? { ...item, note } : item
      ),
    }))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setFormData((prev) => {
        const oldIndex = prev.items.findIndex((item) => item.productId === active.id)
        const newIndex = prev.items.findIndex((item) => item.productId === over.id)

        const newItems = arrayMove(prev.items, oldIndex, newIndex).map((item, index) => ({
          ...item,
          rank: index + 1,
        }))

        return { ...prev, items: newItems }
      })
    }
  }

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CollectionFormData, string>> = {}

    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.slug.trim()) newErrors.slug = 'Slug is required'
    if (formData.items.length === 0) newErrors.items = 'Add at least one product'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      navigate('/collections')
    }, 500)
  }

  const typeOptions = [
    { value: 'top-list', label: 'Top List' },
    { value: 'best-for', label: 'Best For' },
    { value: 'budget', label: 'Budget' },
    { value: 'custom', label: 'Custom' },
  ]

  const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'published', label: 'Published' },
  ]

  const availableProducts = products.filter(
    (p) => !formData.items.some((item) => item.productId === p.id)
  )

  const productOptions = [
    { value: '', label: 'Select a product' },
    ...availableProducts.map((p) => ({ value: p.id, label: `${p.name} (${p.brand?.name})` })),
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title={isEditing ? 'Edit Collection' : 'New Collection'}
        description={isEditing ? 'Update collection and rankings' : 'Create a new product collection'}
        actions={
          <Button
            variant="ghost"
            onClick={() => navigate('/collections')}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
          >
            Back
          </Button>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Collection Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  error={errors.title}
                  placeholder="e.g., Top 5 Laptops for Work in 2024"
                />

                <Input
                  label="Slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  error={errors.slug}
                  hint="URL-friendly identifier"
                  placeholder="e.g., top-5-laptops-work-2024"
                />

                <Select
                  label="Type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  options={typeOptions}
                />

                <Textarea
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Brief description of this collection"
                  rows={3}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Products</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Select
                    options={productOptions}
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="flex-1"
                    placeholder="Select a product to add"
                  />
                  <Button
                    type="button"
                    onClick={handleAddProduct}
                    disabled={!selectedProductId}
                    leftIcon={<Plus className="h-4 w-4" />}
                  >
                    Add
                  </Button>
                </div>

                {errors.items && (
                  <p className="text-sm text-red-600">{errors.items}</p>
                )}

                {formData.items.length === 0 ? (
                  <div className="rounded-lg border-2 border-dashed border-slate-200 py-8 text-center">
                    <Package className="mx-auto h-8 w-8 text-slate-400" />
                    <p className="mt-2 text-sm text-slate-500">
                      No products added yet. Select a product above to get started.
                    </p>
                  </div>
                ) : (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={formData.items.map((item) => item.productId)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-2">
                        {formData.items.map((item) => (
                          <SortableItem
                            key={item.productId}
                            item={item}
                            product={products.find((p) => p.id === item.productId)}
                            onNoteChange={(note) => handleNoteChange(item.productId, note)}
                            onRemove={() => handleRemoveProduct(item.productId)}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                )}

                <p className="text-sm text-slate-500">
                  Drag and drop to reorder products. Rank is automatically updated.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SEO</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="Meta Title"
                  name="metaTitle"
                  value={formData.seo?.metaTitle || ''}
                  onChange={handleSeoChange}
                  placeholder="SEO title for search engines"
                />

                <Textarea
                  label="Meta Description"
                  name="metaDescription"
                  value={formData.seo?.metaDescription || ''}
                  onChange={handleSeoChange}
                  placeholder="SEO description for search engines"
                  rows={2}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  options={statusOptions}
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col gap-3">
                  <Button type="submit" isLoading={isSaving} className="w-full">
                    {isEditing ? 'Update Collection' : 'Create Collection'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/collections')}
                    className="w-full"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Products</dt>
                    <dd className="font-medium text-slate-900">{formData.items.length}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Type</dt>
                    <dd className="font-medium text-slate-900">
                      {typeOptions.find((t) => t.value === formData.type)?.label}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
