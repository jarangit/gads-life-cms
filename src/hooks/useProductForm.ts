import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import type { ProductFormData, AffiliateLink } from '@/types'
import { generateSlug, generateId } from '@/utils'
import { mockProduct } from '@/mocks/products'

const initialFormData: ProductFormData = {
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
}

export function useProductForm(id?: string) {
  const navigate = useNavigate()
  const isEditing = Boolean(id)

  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState<ProductFormData>(initialFormData)
  const [errors, setErrors] = useState<Partial<Record<keyof ProductFormData, string>>>({})

  // Load existing product data
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

  // Generic field change handler
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

  // Direct field update
  const updateField = <K extends keyof ProductFormData>(field: K, value: ProductFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Pros handlers
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

  // Cons handlers
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
    setFormData((prev) => ({
      ...prev,
      specs: [...prev.specs, { key: '', value: '' }],
    }))
  }

  const removeSpec = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      specs: prev.specs.filter((_, i) => i !== index),
    }))
  }

  // Affiliate link handlers
  const handleLinkChange = (index: number, field: keyof AffiliateLink, value: string | number) => {
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

  // Category toggle
  const toggleCategory = (categoryId: string) => {
    setFormData((prev) => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter((c) => c !== categoryId)
        : [...prev.categoryIds, categoryId],
    }))
  }

  // JSON Import
  const importFromJson = (jsonString: string): string | null => {
    if (!jsonString.trim()) {
      return 'Please enter JSON data'
    }

    try {
      const parsed = JSON.parse(jsonString)

      if (!parsed.name || typeof parsed.name !== 'string') {
        return 'JSON must include a valid "name" field'
      }

      const importedData: ProductFormData = {
        name: parsed.name || '',
        slug: parsed.slug || generateSlug(parsed.name || ''),
        brandId: parsed.brandId || '',
        categoryIds: Array.isArray(parsed.categoryIds) ? parsed.categoryIds : [],
        shortDescription: parsed.shortDescription || '',
        sections: Array.isArray(parsed.sections) ? parsed.sections : [],
        pros: Array.isArray(parsed.pros) && parsed.pros.length > 0 ? parsed.pros : [''],
        cons: Array.isArray(parsed.cons) && parsed.cons.length > 0 ? parsed.cons : [''],
        specs:
          Array.isArray(parsed.specs) && parsed.specs.length > 0
            ? parsed.specs
            : [{ key: '', value: '' }],
        rating: typeof parsed.rating === 'number' ? parsed.rating : undefined,
        price: typeof parsed.price === 'number' ? parsed.price : undefined,
        heroImage: parsed.heroImage || '',
        galleryImages: Array.isArray(parsed.galleryImages) ? parsed.galleryImages : [],
        affiliateLinks: Array.isArray(parsed.affiliateLinks)
          ? parsed.affiliateLinks.map((link: any) => ({
              id: link.id || generateId(),
              merchant: link.merchant || '',
              url: link.url || '',
              price: link.price,
              note: link.note || '',
            }))
          : [],
        status: 'draft', // Always set to draft when importing
      }

      setFormData(importedData)
      return null // No error
    } catch (e) {
      return `Invalid JSON format: ${e instanceof Error ? e.message : 'Unknown error'}`
    }
  }

  // Validation
  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ProductFormData, string>> = {}

    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.slug.trim()) newErrors.slug = 'Slug is required'
    if (!formData.brandId) newErrors.brandId = 'Brand is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Submit handlers
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

  return {
    // State
    formData,
    errors,
    isLoading,
    isSaving,
    isEditing,

    // Actions
    handleChange,
    updateField,
    handleSubmit,
    handleSaveAndPublish,

    // Pros & Cons
    handleProChange,
    addPro,
    removePro,
    handleConChange,
    addCon,
    removeCon,

    // Specs
    handleSpecChange,
    addSpec,
    removeSpec,

    // Affiliate Links
    handleLinkChange,
    addLink,
    removeLink,

    // Categories
    toggleCategory,

    // JSON Import
    importFromJson,

    // Navigation
    navigate,
  }
}
