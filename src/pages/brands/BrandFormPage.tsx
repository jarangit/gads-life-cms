import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
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
import { useBrand } from '@/api/queries/brands/detail'
import { useCreateBrand, useUpdateBrand } from '@/api/queries/brands/multation'
import type { ICreateBrandPayload } from '@/api/types/brand'

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

  const { data: brand, isLoading } = useBrand(id)
  const createBrand = useCreateBrand()
  const updateBrand = useUpdateBrand(id ?? '')

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ICreateBrandPayload>({
    defaultValues: {
      name: '',
      slug: '',
      logoUrl: null,
      canonicalUrl: null,
    },
  })

  // Watch name to auto-generate slug
  const nameValue = watch('name')

  useEffect(() => {
    if (!isEditing && nameValue !== undefined) {
      setValue('slug', generateSlug(nameValue))
    }
  }, [nameValue, isEditing, setValue])

  // Populate form when brand data loads (edit mode)
  useEffect(() => {
    if (brand) {
      reset({
        name: brand.name,
        slug: brand.slug,
        logoUrl: brand.logoUrl,
        canonicalUrl: brand.canonicalUrl,
      })
    }
  }, [brand, reset])

  const isSaving = createBrand.isPending || updateBrand.isPending

  const onSubmit = async (data: ICreateBrandPayload) => {
    try {
      if (isEditing) {
        await updateBrand.mutateAsync(data)
      } else {
        await createBrand.mutateAsync(data)
      }
      navigate('/brands')
    } catch (error) {
      console.error('Failed to save brand:', error)
    }
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                  placeholder="e.g., Apple"
                  error={errors.name?.message}
                  {...register('name', { required: 'Name is required' })}
                />

                <Input
                  label="Slug"
                  hint="URL-friendly identifier"
                  placeholder="e.g., apple"
                  error={errors.slug?.message}
                  {...register('slug', {
                    required: 'Slug is required',
                    pattern: {
                      value: /^[a-z0-9-]+$/,
                      message: 'Slug can only contain lowercase letters, numbers, and hyphens',
                    },
                  })}
                />

                <Input
                  label="Website URL"
                  type="url"
                  placeholder="https://example.com"
                  error={errors.canonicalUrl?.message}
                  {...register('canonicalUrl', {
                    validate: (value) => {
                      if (!value) return true
                      try {
                        new URL(value)
                        return true
                      } catch {
                        return 'Please enter a valid URL'
                      }
                    },
                  })}
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
                <Controller
                  name="logoUrl"
                  control={control}
                  render={({ field }) => (
                    <ImageUpload
                      value={field.value ?? undefined}
                      onChange={(url) => field.onChange(url || null)}
                      hint="Recommended: 200x200px, PNG with transparency"
                    />
                  )}
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
