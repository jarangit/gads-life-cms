import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import {
  Button,
  Input,
  ImageUpload,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui'
import { PageHeader } from '@/components/common'
import type { Brand, BrandFormData } from '@/types'

// Mock data for demo
const mockBrands: Brand[] = [
  {
    id: '1',
    name: 'Apple',
    slug: 'apple',
    logo: 'https://placehold.co/100x100',
    websiteUrl: 'https://apple.com',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'Samsung',
    slug: 'samsung',
    logo: 'https://placehold.co/100x100',
    websiteUrl: 'https://samsung.com',
    createdAt: '2024-01-16T10:00:00Z',
    updatedAt: '2024-01-16T10:00:00Z',
  },
]

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function BrandFormPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = Boolean(id)

  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const [formData, setFormData] = useState<BrandFormData>({
    name: '',
    slug: '',
    logo: '',
    websiteUrl: '',
  })

  const [errors, setErrors] = useState<Partial<Record<keyof BrandFormData, string>>>({})

  useEffect(() => {
    if (isEditing) {
      setIsLoading(true)
      // Simulate API call to get brand
      setTimeout(() => {
        const brand = mockBrands.find((b) => b.id === id)
        if (brand) {
          setFormData({
            name: brand.name,
            slug: brand.slug,
            logo: brand.logo || '',
            websiteUrl: brand.websiteUrl || '',
          })
        }
        setIsLoading(false)
      }, 300)
    }
  }, [id, isEditing])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    if (errors[name as keyof BrandFormData]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof BrandFormData, string>> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug is required'
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens'
    }

    if (formData.websiteUrl && !isValidUrl(formData.websiteUrl)) {
      newErrors.websiteUrl = 'Please enter a valid URL'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    setIsSaving(true)
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      navigate('/brands')
    }, 500)
  }

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
        title={isEditing ? 'Edit Brand' : 'New Brand'}
        description={isEditing ? 'Update brand details' : 'Add a new product brand'}
        actions={
          <Button
            variant="ghost"
            onClick={() => navigate('/brands')}
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
                <CardTitle>Brand Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                  placeholder="e.g., Apple"
                />

                <Input
                  label="Slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  error={errors.slug}
                  hint="URL-friendly identifier"
                  placeholder="e.g., apple"
                />

                <Input
                  label="Website URL"
                  name="websiteUrl"
                  type="url"
                  value={formData.websiteUrl}
                  onChange={handleChange}
                  error={errors.websiteUrl}
                  placeholder="https://example.com"
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Logo</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUpload
                  value={formData.logo}
                  onChange={(url) =>
                    setFormData((prev) => ({ ...prev, logo: url || '' }))
                  }
                  hint="Recommended: 200x200px, PNG with transparency"
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col gap-3">
                  <Button type="submit" isLoading={isSaving} className="w-full">
                    {isEditing ? 'Update Brand' : 'Create Brand'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/brands')}
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
