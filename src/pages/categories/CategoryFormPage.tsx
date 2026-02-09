import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
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
import type { Category, CategoryFormData } from '@/types'

// Mock data for demo
const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Laptops',
    slug: 'laptops',
    description: 'All laptop reviews',
    parentId: null,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '3',
    name: 'Smartphones',
    slug: 'smartphones',
    description: 'Smartphone reviews',
    parentId: null,
    createdAt: '2024-01-17T10:00:00Z',
    updatedAt: '2024-01-17T10:00:00Z',
  },
]

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function CategoryFormPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = Boolean(id)

  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])

  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    slug: '',
    parentId: null,
    description: '',
    coverImage: '',
    seo: {
      metaTitle: '',
      metaDescription: '',
      ogImage: '',
    },
  })

  const [errors, setErrors] = useState<Partial<Record<keyof CategoryFormData, string>>>({})

  useEffect(() => {
    // Load parent categories
    setCategories(mockCategories)

    if (isEditing) {
      setIsLoading(true)
      // Simulate API call to get category
      setTimeout(() => {
        const category = mockCategories.find((c) => c.id === id)
        if (category) {
          setFormData({
            name: category.name,
            slug: category.slug,
            parentId: category.parentId,
            description: category.description || '',
            coverImage: category.coverImage || '',
            seo: category.seo || { metaTitle: '', metaDescription: '', ogImage: '' },
          })
        }
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
      // Auto-generate slug from name
      if (name === 'name' && !isEditing) {
        newData.slug = generateSlug(value)
      }
      return newData
    })
    // Clear error when user types
    if (errors[name as keyof CategoryFormData]) {
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

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CategoryFormData, string>> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug is required'
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    setIsSaving(true)
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      navigate('/categories')
    }, 500)
  }

  const parentOptions = [
    { value: '', label: 'None (Top Level)' },
    ...categories
      .filter((c) => c.id !== id) // Exclude self for editing
      .map((c) => ({ value: c.id, label: c.name })),
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
        title={isEditing ? 'Edit Category' : 'New Category'}
        description={isEditing ? 'Update category details' : 'Create a new product category'}
        actions={
          <Button
            variant="ghost"
            onClick={() => navigate('/categories')}
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
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                  placeholder="e.g., Gaming Laptops"
                />

                <Input
                  label="Slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  error={errors.slug}
                  hint="URL-friendly identifier"
                  placeholder="e.g., gaming-laptops"
                />

                <Select
                  label="Parent Category"
                  name="parentId"
                  value={formData.parentId || ''}
                  onChange={handleChange}
                  options={parentOptions}
                />

                <Textarea
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Brief description of this category"
                  rows={3}
                />
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
                <CardTitle>Cover Image</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUpload
                  value={formData.coverImage}
                  onChange={(url) =>
                    setFormData((prev) => ({ ...prev, coverImage: url || '' }))
                  }
                  hint="Recommended: 1200x630px"
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col gap-3">
                  <Button type="submit" isLoading={isSaving} className="w-full">
                    {isEditing ? 'Update Category' : 'Create Category'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/categories')}
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
