import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
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

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CategoryFormData>({
    defaultValues: {
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
    },
  })

  // Watch name field to auto-generate slug
  const nameValue = watch('name')

  useEffect(() => {
    if (!isEditing && nameValue !== undefined) {
      setValue('slug', generateSlug(nameValue))
    }
  }, [nameValue, isEditing, setValue])

  useEffect(() => {
    // Load parent categories
    setCategories(mockCategories)

    if (isEditing) {
      setIsLoading(true)
      // Simulate API call to get category
      setTimeout(() => {
        const category = mockCategories.find((c) => c.id === id)
        if (category) {
          reset({
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
  }, [id, isEditing, reset])

  const onSubmit = async (_data: CategoryFormData) => {
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                  placeholder="e.g., Gaming Laptops"
                  error={errors.name?.message}
                  {...register('name', { required: 'Name is required' })}
                />

                <Input
                  label="Slug"
                  hint="URL-friendly identifier"
                  placeholder="e.g., gaming-laptops"
                  error={errors.slug?.message}
                  {...register('slug', {
                    required: 'Slug is required',
                    pattern: {
                      value: /^[a-z0-9-]+$/,
                      message:
                        'Slug can only contain lowercase letters, numbers, and hyphens',
                    },
                  })}
                />

                <Select
                  label="Parent Category"
                  options={parentOptions}
                  {...register('parentId')}
                />

                <Textarea
                  label="Description"
                  placeholder="Brief description of this category"
                  rows={3}
                  {...register('description')}
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
                  placeholder="SEO title for search engines"
                  {...register('seo.metaTitle')}
                />

                <Textarea
                  label="Meta Description"
                  placeholder="SEO description for search engines"
                  rows={2}
                  {...register('seo.metaDescription')}
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
                <Controller
                  name="coverImage"
                  control={control}
                  render={({ field }) => (
                    <ImageUpload
                      value={field.value}
                      onChange={(url) => field.onChange(url || '')}
                      hint="Recommended: 1200x630px"
                    />
                  )}
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
