import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { ArrowLeft } from 'lucide-react'
import {
  Button,
  Input,
  Textarea,
  Select,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  ImageUpload,
} from '@/components/ui'
import { PageHeader } from '@/components/common'
import { useCollection } from '@/api/queries/collection/detail'
import { useCreateCollection, useUpdateCollection } from '@/api/queries/collection/mutation'
import { useCategories } from '@/api/queries/category/list'
import type { ICreateCollectionPayload, IUpdateCollectionPayload, CollectionType, CollectionStatus } from '@/api/types/collection'

interface CollectionFormValues {
  type: CollectionType
  slug: string
  titleTh: string
  titleEn: string
  excerpt: string
  coverImage: string
  categoryId: string
  status: CollectionStatus
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function CollectionFormPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = Boolean(id)

  const { data: collection, isLoading } = useCollection(id)
  const createCollection = useCreateCollection()
  const updateCollection = useUpdateCollection(id ?? '')
  const { data: categoriesData } = useCategories()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CollectionFormValues>({
    defaultValues: {
      type: 'TOP_LIST',
      slug: '',
      titleTh: '',
      titleEn: '',
      excerpt: '',
      coverImage: '',
      categoryId: '',
      status: 'DRAFT',
    },
  })

  const titleThValue = watch('titleTh')

  // Auto-generate slug from titleTh (create mode only)
  useEffect(() => {
    if (!isEditing && titleThValue !== undefined) {
      setValue('slug', generateSlug(titleThValue))
    }
  }, [titleThValue, isEditing, setValue])

  // Populate form when collection data loads (edit mode)
  useEffect(() => {
    if (collection) {
      reset({
        type: collection.type,
        slug: collection.slug,
        titleTh: collection.titleTh,
        titleEn: collection.titleEn ?? '',
        excerpt: collection.excerpt ?? '',
        coverImage: collection.coverImage ?? '',
        categoryId: collection.categoryId ?? '',
        status: collection.status,
      })
    }
  }, [collection, reset])

  const isSaving = createCollection.isPending || updateCollection.isPending

  const onSubmit = async (data: CollectionFormValues) => {
    try {
      if (isEditing) {
        const payload: IUpdateCollectionPayload = {
          type: data.type,
          slug: data.slug,
          titleTh: data.titleTh,
          titleEn: data.titleEn || undefined,
          excerpt: data.excerpt || undefined,
          coverImage: data.coverImage || undefined,
          categoryId: data.categoryId || undefined,
          status: data.status,
        }
        await updateCollection.mutateAsync(payload)
      } else {
        const payload: ICreateCollectionPayload = {
          type: data.type,
          slug: data.slug,
          titleTh: data.titleTh,
          titleEn: data.titleEn || undefined,
          excerpt: data.excerpt || undefined,
          coverImage: data.coverImage || undefined,
          categoryId: data.categoryId || undefined,
        }
        await createCollection.mutateAsync(payload)
      }
      navigate('/collections')
    } catch (error) {
      console.error('Failed to save collection:', error)
    }
  }

  const typeOptions = [
    { value: 'TOP_LIST', label: 'Top List' },
    { value: 'GUIDE', label: 'Guide' },
    { value: 'COMPARISON', label: 'Comparison' },
  ]

  const statusOptions = [
    { value: 'DRAFT', label: 'Draft' },
    { value: 'PUBLISHED', label: 'Published' },
    { value: 'ARCHIVED', label: 'Archived' },
  ]

  const categoryOptions = [
    { value: '', label: 'No category' },
    ...(categoriesData?.items?.map((c) => ({ value: c.id, label: c.nameTh || c.slug })) ?? []),
  ]

  if (isLoading && isEditing) {
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
        description={isEditing ? 'Update collection details' : 'Create a new collection'}
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Collection Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="Title (Thai)"
                  placeholder="e.g., 5 อันดับหุ่นยนต์ดูดฝุ่นที่ดีที่สุด"
                  error={errors.titleTh?.message}
                  {...register('titleTh', { required: 'Title (Thai) is required' })}
                />

                <Input
                  label="Title (English)"
                  placeholder="e.g., Top 5 Best Robot Vacuums"
                  {...register('titleEn')}
                />

                <Input
                  label="Slug"
                  hint="URL-friendly identifier"
                  placeholder="e.g., top-5-robot-vacuums"
                  error={errors.slug?.message}
                  {...register('slug', {
                    required: 'Slug is required',
                    pattern: {
                      value: /^[a-z0-9-]+$/,
                      message: 'Slug can only contain lowercase letters, numbers, and hyphens',
                    },
                  })}
                />

                <Select
                  label="Type"
                  options={typeOptions}
                  {...register('type', { required: 'Type is required' })}
                />

                <Select
                  label="Category"
                  options={categoryOptions}
                  {...register('categoryId')}
                />

                <Textarea
                  label="Excerpt"
                  placeholder="Brief description of this collection"
                  rows={3}
                  {...register('excerpt')}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cover Image</CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  label="Cover Image URL"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  {...register('coverImage')}
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
                  options={statusOptions}
                  {...register('status')}
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
          </div>
        </div>
      </form>
    </div>
  )
}
