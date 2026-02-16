import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import type { ProductFormData, AffiliateLink } from '@/types'
import { generateSlug, generateId } from '@/utils'
import { useProductDetail } from '@/api/queries/product/detail'
import {
  useCreateProduct,
  useUpdateProduct,
  type CreateProductPayload,
} from '@/api/queries/product/mutation'

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
  // New product detail fields
  keyHighlights: [''],
  weaknesses: [''],
  beforePurchasePoints: [''],
  afterUsagePoints: [''],
  quickVerdictQuote: '',
  quickVerdictDescription: '',
  quickVerdictTags: [''],
  pricingPrice: undefined,
  pricingCurrency: 'THB',
  pricingLabel: '',
  ratings: [],
}

export function useProductForm(id?: string) {
  const navigate = useNavigate()
  const isEditing = Boolean(id)

  const { data: productDetail, isLoading } = useProductDetail(id ?? '')
  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct(id ?? '')

  const [formData, setFormData] = useState<ProductFormData>(initialFormData)
  const [errors, setErrors] = useState<Partial<Record<keyof ProductFormData, string>>>({})

  const isSaving = createProduct.isPending || updateProduct.isPending

  // Load existing product data from API
  useEffect(() => {
    if (isEditing && productDetail) {
      setFormData({
        name: productDetail.name || '',
        slug: '',
        brandId: productDetail.brandId || '',
        categoryIds: productDetail.categoryId ? [productDetail.categoryId] : [],
        shortDescription: productDetail.subtitle || '',
        sections: [],
        pros: productDetail.pros?.length
          ? productDetail.pros.map((p) => p.content)
          : [''],
        cons: productDetail.cons?.length
          ? productDetail.cons.map((c) => c.content)
          : [''],
        specs: [{ key: '', value: '' }],
        rating: productDetail.overallScore ? Number(productDetail.overallScore) : undefined,
        price: productDetail.price,
        heroImage: productDetail.image || '',
        galleryImages: [],
        affiliateLinks: productDetail.affiliateLink
          ? [{ id: generateId(), merchant: '', url: productDetail.affiliateLink, price: undefined, note: '' }]
          : [],
        status: (productDetail.status as 'draft' | 'published') || 'draft',
        // New detail fields
        keyHighlights: productDetail.keyHighlights?.length
          ? productDetail.keyHighlights.map((h) => h.content)
          : [''],
        weaknesses: productDetail.weaknesses?.length
          ? productDetail.weaknesses.map((w) => w.content)
          : [''],
        beforePurchasePoints: productDetail.beforePurchasePoints?.length
          ? productDetail.beforePurchasePoints.map((p) => p.content)
          : [''],
        afterUsagePoints: productDetail.afterUsagePoints?.length
          ? productDetail.afterUsagePoints.map((p) => p.content)
          : [''],
        quickVerdictQuote: productDetail.quickVerdict?.quote || '',
        quickVerdictDescription: productDetail.quickVerdict?.description || '',
        quickVerdictTags: productDetail.quickVerdictTags?.length
          ? productDetail.quickVerdictTags.map((t) => t.tag)
          : [''],
        pricingPrice: productDetail.pricing?.price ?? productDetail.price,
        pricingCurrency: productDetail.pricing?.currency || 'THB',
        pricingLabel: productDetail.pricing?.priceLabel || productDetail.priceLabel || '',
        ratings: productDetail.ratings?.map((r) => ({
          subCategory: r.subCategory,
          score: r.score,
        })) ?? [],
      })
    }
  }, [productDetail, isEditing])

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

  // ─── Generic string-list handlers (highlights, weaknesses, points, tags) ───
  const makeListHandlers = (field: keyof ProductFormData) => ({
    handleChange: (index: number, value: string) => {
      setFormData((prev) => {
        const list = [...(prev[field] as string[])]
        list[index] = value
        return { ...prev, [field]: list }
      })
    },
    add: () => {
      setFormData((prev) => ({
        ...prev,
        [field]: [...(prev[field] as string[]), ''],
      }))
    },
    remove: (index: number) => {
      setFormData((prev) => ({
        ...prev,
        [field]: (prev[field] as string[]).filter((_, i) => i !== index),
      }))
    },
  })

  const keyHighlightsHandlers = makeListHandlers('keyHighlights')
  const weaknessesHandlers = makeListHandlers('weaknesses')
  const beforePurchaseHandlers = makeListHandlers('beforePurchasePoints')
  const afterUsageHandlers = makeListHandlers('afterUsagePoints')
  const verdictTagsHandlers = makeListHandlers('quickVerdictTags')

  // Ratings handlers
  const handleRatingItemChange = (index: number, field: 'subCategory' | 'score', value: string | number) => {
    setFormData((prev) => {
      const newRatings = [...prev.ratings]
      newRatings[index] = { ...newRatings[index], [field]: value }
      return { ...prev, ratings: newRatings }
    })
  }

  const addRating = () => {
    setFormData((prev) => ({
      ...prev,
      ratings: [...prev.ratings, { subCategory: '', score: 3 }],
    }))
  }

  const removeRating = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      ratings: prev.ratings.filter((_, i) => i !== index),
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

  // Build payload for API
  const buildPayload = (statusOverride?: 'draft' | 'published'): CreateProductPayload => {
    const filterNonEmpty = (arr: string[]) => arr.filter((s) => s.trim())

    return {
      name: formData.name,
      subtitle: formData.shortDescription || formData.name,
      categoryId: formData.categoryIds.length > 0 ? formData.categoryIds[0] : null,
      brandId: formData.brandId || null,
      image: formData.heroImage || null,
      overallScore: formData.rating ?? 0,
      isRecommended: false,
      price: formData.price ?? 0,
      currency: 'THB',
      priceLabel: formData.price ? `฿${formData.price.toLocaleString()}` : '฿0',
      affiliateLink: formData.affiliateLinks.length > 0 ? formData.affiliateLinks[0].url : null,
      lastUpdated: new Date().toISOString().split('T')[0],
      ratings: formData.ratings.filter((r) => r.subCategory.trim()),
      status: statusOverride || (formData.status as 'draft' | 'published'),
      keyHighlights: filterNonEmpty(formData.keyHighlights).map((c, i) => ({ content: c, sortOrder: i + 1 })),
      weaknesses: filterNonEmpty(formData.weaknesses).map((c, i) => ({ content: c, sortOrder: i + 1 })),
      beforePurchasePoints: filterNonEmpty(formData.beforePurchasePoints).map((c, i) => ({ content: c, sortOrder: i + 1 })),
      afterUsagePoints: filterNonEmpty(formData.afterUsagePoints).map((c, i) => ({ content: c, sortOrder: i + 1 })),
      pros: filterNonEmpty(formData.pros).map((c, i) => ({ content: c, sortOrder: i + 1 })),
      cons: filterNonEmpty(formData.cons).map((c, i) => ({ content: c, sortOrder: i + 1 })),
      quickVerdict: formData.quickVerdictQuote.trim()
        ? { quote: formData.quickVerdictQuote, description: formData.quickVerdictDescription }
        : null,
      quickVerdictTags: filterNonEmpty(formData.quickVerdictTags).map((t, i) => ({ tag: t, sortOrder: i + 1 })),
      pricing: formData.pricingPrice != null
        ? { price: formData.pricingPrice, currency: formData.pricingCurrency || 'THB', priceLabel: formData.pricingLabel }
        : null,
    }
  }

  // Submit handlers
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    try {
      const payload = buildPayload()
      if (isEditing) {
        await updateProduct.mutateAsync(payload)
      } else {
        await createProduct.mutateAsync(payload)
      }
      navigate('/products')
    } catch (error) {
      console.error('Failed to save product:', error)
    }
  }

  const handleSaveAndPublish = async () => {
    if (!validate()) return

    try {
      const payload = buildPayload('published')
      if (isEditing) {
        await updateProduct.mutateAsync(payload)
      } else {
        await createProduct.mutateAsync(payload)
      }
      navigate('/products')
    } catch (error) {
      console.error('Failed to save & publish product:', error)
    }
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

    // Product Details — list handlers
    keyHighlightsHandlers,
    weaknessesHandlers,
    beforePurchaseHandlers,
    afterUsageHandlers,
    verdictTagsHandlers,

    // Ratings
    handleRatingItemChange,
    addRating,
    removeRating,

    // JSON Import
    importFromJson,

    // Navigation
    navigate,
  }
}
