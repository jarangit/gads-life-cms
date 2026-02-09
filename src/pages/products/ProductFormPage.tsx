import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import {
  Button,
  Input,
  Textarea,
  Select,
  ImageUpload,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui'
import { PageHeader } from '@/components/common'
import type { Product, ProductFormData, AffiliateLink } from '@/types'

// Mock data
const mockBrands = [
  { id: '1', name: 'Apple' },
  { id: '2', name: 'Samsung' },
  { id: '3', name: 'Sony' },
  { id: '4', name: 'Dell' },
]

const mockCategories = [
  { id: '1', name: 'Laptops' },
  { id: '2', name: 'Gaming Laptops' },
  { id: '3', name: 'Smartphones' },
  { id: '4', name: 'Audio' },
]

const mockProduct: Product = {
  id: '1',
  name: 'MacBook Air M3',
  slug: 'macbook-air-m3',
  brandId: '1',
  categoryIds: ['1'],
  shortDescription: 'The most portable MacBook ever with the powerful M3 chip',
  sections: [],
  pros: ['Great performance', 'All-day battery', 'Stunning Retina display'],
  cons: ['Limited ports', 'Base model has 8GB RAM'],
  specs: [
    { key: 'Processor', value: 'Apple M3 chip' },
    { key: 'RAM', value: '8GB / 16GB / 24GB' },
    { key: 'Display', value: '13.6-inch Liquid Retina' },
  ],
  rating: 4.8,
  price: 1099,
  heroImage: 'https://placehold.co/400x300',
  galleryImages: [],
  affiliateLinks: [
    { id: '1', merchant: 'Amazon', url: 'https://amazon.com', price: 1099, note: 'Best price' },
  ],
  status: 'draft',
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-15T10:00:00Z',
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}

export function ProductFormPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = Boolean(id)

  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'basic' | 'content' | 'specs' | 'links'>('basic')

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    slug: '',
    brandId: '',
    categoryIds: [],
    shortDescription: '',
    sections: [],
    pros: [''],
    cons: [''],
    specs: [{ key: '', value: '' }],
    rating: undefined,
    price: undefined,
    heroImage: '',
    galleryImages: [],
    affiliateLinks: [],
    status: 'draft',
  })

  const [errors, setErrors] = useState<Partial<Record<keyof ProductFormData, string>>>({})

  useEffect(() => {
    if (isEditing) {
      setIsLoading(true)
      setTimeout(() => {
        setFormData({
          name: mockProduct.name,
          slug: mockProduct.slug,
          brandId: mockProduct.brandId,
          categoryIds: mockProduct.categoryIds,
          shortDescription: mockProduct.shortDescription || '',
          sections: mockProduct.sections,
          pros: mockProduct.pros.length ? mockProduct.pros : [''],
          cons: mockProduct.cons.length ? mockProduct.cons : [''],
          specs: mockProduct.specs.length ? mockProduct.specs : [{ key: '', value: '' }],
          rating: mockProduct.rating,
          price: mockProduct.price,
          heroImage: mockProduct.heroImage || '',
          galleryImages: mockProduct.galleryImages,
          affiliateLinks: mockProduct.affiliateLinks,
          status: mockProduct.status,
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
      if (name === 'name' && !isEditing) {
        newData.slug = generateSlug(value)
      }
      return newData
    })
    if (errors[name as keyof ProductFormData]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  // Pros & Cons handlers
  const handleProChange = (index: number, value: string) => {
    const newPros = [...formData.pros]
    newPros[index] = value
    setFormData((prev) => ({ ...prev, pros: newPros }))
  }

  const addPro = () => {
    setFormData((prev) => ({ ...prev, pros: [...prev.pros, ''] }))
  }

  const removePro = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      pros: prev.pros.filter((_, i) => i !== index),
    }))
  }

  const handleConChange = (index: number, value: string) => {
    const newCons = [...formData.cons]
    newCons[index] = value
    setFormData((prev) => ({ ...prev, cons: newCons }))
  }

  const addCon = () => {
    setFormData((prev) => ({ ...prev, cons: [...prev.cons, ''] }))
  }

  const removeCon = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      cons: prev.cons.filter((_, i) => i !== index),
    }))
  }

  // Specs handlers
  const handleSpecChange = (index: number, field: 'key' | 'value', value: string) => {
    const newSpecs = [...formData.specs]
    newSpecs[index] = { ...newSpecs[index], [field]: value }
    setFormData((prev) => ({ ...prev, specs: newSpecs }))
  }

  const addSpec = () => {
    setFormData((prev) => ({ ...prev, specs: [...prev.specs, { key: '', value: '' }] }))
  }

  const removeSpec = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      specs: prev.specs.filter((_, i) => i !== index),
    }))
  }

  // Affiliate link handlers
  const handleLinkChange = (
    index: number,
    field: keyof AffiliateLink,
    value: string | number
  ) => {
    const newLinks = [...formData.affiliateLinks]
    newLinks[index] = { ...newLinks[index], [field]: value }
    setFormData((prev) => ({ ...prev, affiliateLinks: newLinks }))
  }

  const addLink = () => {
    setFormData((prev) => ({
      ...prev,
      affiliateLinks: [
        ...prev.affiliateLinks,
        { id: generateId(), merchant: '', url: '', price: undefined, note: '' },
      ],
    }))
  }

  const removeLink = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      affiliateLinks: prev.affiliateLinks.filter((_, i) => i !== index),
    }))
  }

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ProductFormData, string>> = {}

    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.slug.trim()) newErrors.slug = 'Slug is required'
    if (!formData.brandId) newErrors.brandId = 'Brand is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      navigate('/products')
    }, 500)
  }

  const handleSaveAndPublish = () => {
    if (!validate()) return
    setFormData((prev) => ({ ...prev, status: 'published' }))
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      navigate('/products')
    }, 500)
  }

  const brandOptions = [
    { value: '', label: 'Select a brand' },
    ...mockBrands.map((b) => ({ value: b.id, label: b.name })),
  ]

  const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'published', label: 'Published' },
    { value: 'archived', label: 'Archived' },
  ]

  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'content', label: 'Pros & Cons' },
    { id: 'specs', label: 'Specifications' },
    { id: 'links', label: 'Affiliate Links' },
  ] as const

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
        title={isEditing ? 'Edit Product' : 'New Product'}
        description={isEditing ? 'Update product review' : 'Create a new product review'}
        actions={
          <Button
            variant="ghost"
            onClick={() => navigate('/products')}
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
            {/* Tabs */}
            <div className="border-b border-slate-200">
              <nav className="-mb-px flex gap-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`border-b-2 pb-3 text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Basic Info Tab */}
            {activeTab === 'basic' && (
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    label="Product Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    error={errors.name}
                    placeholder="e.g., MacBook Air M3"
                  />

                  <Input
                    label="Slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    error={errors.slug}
                    hint="URL-friendly identifier"
                    placeholder="e.g., macbook-air-m3"
                  />

                  <Select
                    label="Brand"
                    name="brandId"
                    value={formData.brandId}
                    onChange={handleChange}
                    options={brandOptions}
                    error={errors.brandId}
                  />

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Categories
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {mockCategories.map((cat) => (
                        <label
                          key={cat.id}
                          className={`inline-flex cursor-pointer items-center rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                            formData.categoryIds.includes(cat.id)
                              ? 'border-blue-600 bg-blue-50 text-blue-600'
                              : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={formData.categoryIds.includes(cat.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData((prev) => ({
                                  ...prev,
                                  categoryIds: [...prev.categoryIds, cat.id],
                                }))
                              } else {
                                setFormData((prev) => ({
                                  ...prev,
                                  categoryIds: prev.categoryIds.filter((c) => c !== cat.id),
                                }))
                              }
                            }}
                          />
                          {cat.name}
                        </label>
                      ))}
                    </div>
                  </div>

                  <Textarea
                    label="Short Description"
                    name="shortDescription"
                    value={formData.shortDescription}
                    onChange={handleChange}
                    placeholder="Brief product overview"
                    rows={3}
                  />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      label="Price ($)"
                      name="price"
                      type="number"
                      value={formData.price || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          price: e.target.value ? Number(e.target.value) : undefined,
                        }))
                      }
                      placeholder="e.g., 999"
                    />

                    <Input
                      label="Rating (0-5)"
                      name="rating"
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={formData.rating || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          rating: e.target.value ? Number(e.target.value) : undefined,
                        }))
                      }
                      placeholder="e.g., 4.5"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Pros & Cons Tab */}
            {activeTab === 'content' && (
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-green-600">Pros</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {formData.pros.map((pro, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={pro}
                          onChange={(e) => handleProChange(index, e.target.value)}
                          placeholder="Add a pro..."
                          className="flex-1"
                        />
                        {formData.pros.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removePro(index)}
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
                      onClick={addPro}
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
                    {formData.cons.map((con, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={con}
                          onChange={(e) => handleConChange(index, e.target.value)}
                          placeholder="Add a con..."
                          className="flex-1"
                        />
                        {formData.cons.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeCon(index)}
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
                      onClick={addCon}
                      leftIcon={<Plus className="h-4 w-4" />}
                    >
                      Add Con
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Specifications Tab */}
            {activeTab === 'specs' && (
              <Card>
                <CardHeader>
                  <CardTitle>Specifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {formData.specs.map((spec, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={spec.key}
                        onChange={(e) => handleSpecChange(index, 'key', e.target.value)}
                        placeholder="Spec name (e.g., Processor)"
                        className="w-1/3"
                      />
                      <Input
                        value={spec.value}
                        onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                        placeholder="Spec value (e.g., Apple M3)"
                        className="flex-1"
                      />
                      {formData.specs.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSpec(index)}
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
                    onClick={addSpec}
                    leftIcon={<Plus className="h-4 w-4" />}
                  >
                    Add Specification
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Affiliate Links Tab */}
            {activeTab === 'links' && (
              <Card>
                <CardHeader>
                  <CardTitle>Affiliate Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {formData.affiliateLinks.length === 0 ? (
                    <p className="text-sm text-slate-500">No affiliate links added yet.</p>
                  ) : (
                    formData.affiliateLinks.map((link, index) => (
                      <div key={link.id} className="rounded-lg border border-slate-200 p-4">
                        <div className="mb-3 flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-700">
                            Link {index + 1}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeLink(index)}
                            className="text-red-500 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <Input
                            label="Merchant"
                            value={link.merchant}
                            onChange={(e) => handleLinkChange(index, 'merchant', e.target.value)}
                            placeholder="e.g., Amazon"
                          />
                          <Input
                            label="Price ($)"
                            type="number"
                            value={link.price || ''}
                            onChange={(e) =>
                              handleLinkChange(
                                index,
                                'price',
                                e.target.value ? Number(e.target.value) : 0
                              )
                            }
                            placeholder="e.g., 999"
                          />
                          <div className="sm:col-span-2">
                            <Input
                              label="URL"
                              type="url"
                              value={link.url}
                              onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                              placeholder="https://..."
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <Input
                              label="Note (optional)"
                              value={link.note || ''}
                              onChange={(e) => handleLinkChange(index, 'note', e.target.value)}
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
                    onClick={addLink}
                    leftIcon={<Plus className="h-4 w-4" />}
                  >
                    Add Affiliate Link
                  </Button>
                </CardContent>
              </Card>
            )}
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
              <CardHeader>
                <CardTitle>Hero Image</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUpload
                  value={formData.heroImage}
                  onChange={(url) => setFormData((prev) => ({ ...prev, heroImage: url || '' }))}
                  hint="Recommended: 1200x800px"
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col gap-3">
                  <Button type="submit" isLoading={isSaving} className="w-full">
                    {isEditing ? 'Update Product' : 'Save as Draft'}
                  </Button>
                  {formData.status === 'draft' && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleSaveAndPublish}
                      isLoading={isSaving}
                      className="w-full"
                    >
                      Save & Publish
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => navigate('/products')}
                    className="w-full"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
