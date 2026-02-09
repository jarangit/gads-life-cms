import type { Product } from '@/types'

export const mockBrands = [
  { id: '1', name: 'Apple' },
  { id: '2', name: 'Samsung' },
  { id: '3', name: 'Sony' },
  { id: '4', name: 'Dell' },
]

export const mockCategories = [
  { id: '1', name: 'Laptops' },
  { id: '2', name: 'Gaming Laptops' },
  { id: '3', name: 'Smartphones' },
  { id: '4', name: 'Audio' },
]

export const mockProduct: Product = {
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
    {
      id: '1',
      merchant: 'Amazon',
      url: 'https://amazon.com',
      price: 1099,
      note: 'Best price',
    },
  ],
  status: 'draft',
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-15T10:00:00Z',
}

export const brandOptions = [
  { value: '', label: 'Select a brand' },
  ...mockBrands.map((b) => ({ value: b.id, label: b.name })),
]

export const statusOptions = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
]
