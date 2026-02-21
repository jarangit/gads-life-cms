// Base types
export interface BaseEntity {
  id: string
  createdAt: string
  updatedAt: string
}

// SEO fields
export interface SeoFields {
  metaTitle?: string
  metaDescription?: string
  ogImage?: string
}

// Status
export type ContentStatus = 'draft' | 'published' 

// Category
export interface Category extends BaseEntity {
  name: string
  slug: string
  parentId?: string | null
  description?: string
  coverImage?: string
  seo?: SeoFields
}

export interface CategoryFormData {
  name: string
  slug: string
  parentId?: string | null
  description?: string
  coverImage?: string
  seo?: SeoFields
}

// Brand
export interface Brand extends BaseEntity {
  name: string
  slug: string
  logo?: string
  websiteUrl?: string
}

export interface BrandFormData {
  name: string
  slug: string
  logo?: string
  websiteUrl?: string
}

// Product
export interface ProductSpec {
  key: string
  value: string
}

export interface ProductSection {
  id: string
  type: 'text' | 'image' | 'table' | 'quote'
  data: Record<string, unknown>
}

export interface AffiliateLink {
  id: string
  merchant: string
  url: string
  price?: number
  note?: string
}

export interface Product extends BaseEntity {
  name: string
  slug: string
  brandId: string
  brand?: Brand
  categoryIds: string[]
  categories?: Category[]
  shortDescription?: string
  sections: ProductSection[]
  pros: string[]
  cons: string[]
  specs: ProductSpec[]
  rating?: number
  price?: number
  heroImage?: string
  galleryImages: string[]
  affiliateLinks: AffiliateLink[]
  status: ContentStatus
  publishedAt?: string
}

export interface ProductFormData {
  name: string
  slug: string
  brandId: string
  categoryIds: string[]
  shortDescription?: string
  sections: ProductSection[]
  pros: string[]
  cons: string[]
  specs: ProductSpec[]
  rating?: number
  price?: number
  heroImage?: string
  galleryImages: string[]
  affiliateLinks: AffiliateLink[]
  status: ContentStatus
  // ─── New product detail fields ───
  keyHighlights: string[]
  weaknesses: string[]
  beforePurchasePoints: string[]
  afterUsagePoints: string[]
  quickVerdictQuote: string
  quickVerdictDescription: string
  quickVerdictTags: string[]
  pricingPrice?: number
  pricingCurrency: string
  pricingLabel: string
  ratings: { subCategory: string; score: number }[]
}

// Collection
export type CollectionType = 'top-list' | 'best-for' | 'budget' | 'custom'

export interface CollectionItem {
  productId: string
  product?: Product
  rank: number
  note?: string
}

export interface Collection extends BaseEntity {
  title: string
  slug: string
  type: CollectionType
  description?: string
  items: CollectionItem[]
  status: ContentStatus
  seo?: SeoFields
  publishedAt?: string
}

export interface CollectionFormData {
  title: string
  slug: string
  type: CollectionType
  description?: string
  items: CollectionItem[]
  status: ContentStatus
  seo?: SeoFields
}

// Pagination
export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Filters
export interface ListFilters {
  page?: number
  limit?: number
  search?: string
  status?: ContentStatus
  categoryId?: string
  brandId?: string
}
