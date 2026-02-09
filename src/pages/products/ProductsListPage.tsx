import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, Package, Eye, Archive, Send, FileText, CheckCircle, Star } from 'lucide-react'
import {
  Button,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  SearchInput,
  Pagination,
  EmptyState,
  Card,
  Select,
  Dropdown,
  DropdownItem,
  DropdownDivider,
} from '@/components/ui'
import { PageHeader, StatusBadge, DeleteConfirmModal, useDeleteModal, StatsSummary } from '@/components/common'
import type { Product, ContentStatus } from '@/types'

// Mock data for demo
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'MacBook Air M3',
    slug: 'macbook-air-m3',
    brandId: '1',
    brand: { id: '1', name: 'Apple', slug: 'apple', createdAt: '', updatedAt: '' },
    categoryIds: ['1'],
    shortDescription: 'The most portable MacBook ever with the powerful M3 chip',
    sections: [],
    pros: ['Great performance', 'All-day battery'],
    cons: ['Limited ports'],
    specs: [],
    rating: 4.8,
    price: 1099,
    heroImage: 'https://placehold.co/400x300',
    galleryImages: [],
    affiliateLinks: [],
    status: 'published',
    publishedAt: '2024-01-20T10:00:00Z',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z',
  },
  {
    id: '2',
    name: 'Samsung Galaxy S24 Ultra',
    slug: 'samsung-galaxy-s24-ultra',
    brandId: '2',
    brand: { id: '2', name: 'Samsung', slug: 'samsung', createdAt: '', updatedAt: '' },
    categoryIds: ['3'],
    shortDescription: 'The ultimate smartphone with AI features',
    sections: [],
    pros: ['Amazing camera'],
    cons: ['Expensive'],
    specs: [],
    rating: 4.7,
    price: 1299,
    heroImage: 'https://placehold.co/400x300',
    galleryImages: [],
    affiliateLinks: [],
    status: 'draft',
    createdAt: '2024-01-16T10:00:00Z',
    updatedAt: '2024-01-16T10:00:00Z',
  },
  {
    id: '3',
    name: 'Sony WH-1000XM5',
    slug: 'sony-wh-1000xm5',
    brandId: '3',
    brand: { id: '3', name: 'Sony', slug: 'sony', createdAt: '', updatedAt: '' },
    categoryIds: ['4'],
    shortDescription: 'Industry-leading noise cancellation headphones',
    sections: [],
    pros: ['Best ANC', 'Great sound'],
    cons: ['No aptX'],
    specs: [],
    rating: 4.9,
    price: 349,
    heroImage: 'https://placehold.co/400x300',
    galleryImages: [],
    affiliateLinks: [],
    status: 'published',
    publishedAt: '2024-01-18T10:00:00Z',
    createdAt: '2024-01-17T10:00:00Z',
    updatedAt: '2024-01-18T10:00:00Z',
  },
  {
    id: '4',
    name: 'Dell XPS 15',
    slug: 'dell-xps-15',
    brandId: '4',
    brand: { id: '4', name: 'Dell', slug: 'dell', createdAt: '', updatedAt: '' },
    categoryIds: ['1'],
    shortDescription: 'Premium Windows laptop for creators',
    sections: [],
    pros: ['Beautiful display'],
    cons: ['Runs hot'],
    specs: [],
    rating: 4.5,
    heroImage: 'https://placehold.co/400x300',
    galleryImages: [],
    affiliateLinks: [],
    status: 'archived',
    createdAt: '2024-01-18T10:00:00Z',
    updatedAt: '2024-01-18T10:00:00Z',
  },
]

export function ProductsListPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<ContentStatus | ''>('')
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const deleteModal = useDeleteModal()

  const itemsPerPage = 10

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProducts(mockProducts)
      setIsLoading(false)
    }, 500)
  }, [])

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.brand?.name.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = !statusFilter || product.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Calculate stats
  const stats = useMemo(() => {
    const published = products.filter((p) => p.status === 'published').length
    const draft = products.filter((p) => p.status === 'draft').length
    const avgRating =
      products.length > 0
        ? products.reduce((sum, p) => sum + (p.rating || 0), 0) / products.filter((p) => p.rating).length
        : 0

    return [
      {
        label: 'Total Products',
        value: products.length,
        icon: <Package className="h-5 w-5" />,
        color: 'blue' as const,
      },
      {
        label: 'Published',
        value: published,
        icon: <CheckCircle className="h-5 w-5" />,
        color: 'green' as const,
      },
      {
        label: 'Draft',
        value: draft,
        icon: <FileText className="h-5 w-5" />,
        color: 'yellow' as const,
      },
      {
        label: 'Avg. Rating',
        value: avgRating ? avgRating.toFixed(1) : '—',
        icon: <Star className="h-5 w-5" />,
        color: 'purple' as const,
      },
    ]
  }, [products])

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleDelete = () => {
    if (deleteModal.itemId) {
      setProducts((prev) => prev.filter((p) => p.id !== deleteModal.itemId))
      deleteModal.closeModal()
    }
  }

  const handleStatusChange = (productId: string, newStatus: ContentStatus) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? {
              ...p,
              status: newStatus,
              publishedAt: newStatus === 'published' ? new Date().toISOString() : p.publishedAt,
            }
          : p
      )
    )
  }

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'draft', label: 'Draft' },
    { value: 'published', label: 'Published' },
    { value: 'archived', label: 'Archived' },
  ]

  const formatPrice = (price?: number) => {
    if (!price) return '—'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price)
  }

  return (
    <div>
      <PageHeader
        title="Products"
        description="Manage product reviews"
        actions={
          <Button as={Link} to="/products/new" leftIcon={<Plus className="h-4 w-4" />}>
            Add Product
          </Button>
        }
      />

      {/* Stats Summary */}
      <StatsSummary stats={stats} className="mb-6 grid-cols-2 lg:grid-cols-4" />

      <Card>
        <div className="border-b border-slate-200 p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <SearchInput
              placeholder="Search products or brands..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClear={() => setSearch('')}
              className="w-full sm:w-72"
            />
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ContentStatus | '')}
              className="w-full sm:w-40"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
          </div>
        ) : paginatedProducts.length === 0 ? (
          <EmptyState
            icon={<Package className="h-6 w-6" />}
            title="No products found"
            description={
              search || statusFilter
                ? 'Try adjusting your filters'
                : 'Get started by adding your first product'
            }
            action={
              !search &&
              !statusFilter && (
                <Button as={Link} to="/products/new" leftIcon={<Plus className="h-4 w-4" />}>
                  Add Product
                </Button>
              )
            }
          />
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {product.heroImage ? (
                          <img
                            src={product.heroImage}
                            alt={product.name}
                            className="h-12 w-12 rounded-lg border border-slate-200 object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-slate-200 bg-slate-50">
                            <Package className="h-5 w-5 text-slate-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-slate-900">{product.name}</p>
                          <p className="text-sm text-slate-500 line-clamp-1">
                            {product.shortDescription}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-600">{product.brand?.name}</TableCell>
                    <TableCell className="text-slate-600">{formatPrice(product.price)}</TableCell>
                    <TableCell>
                      {product.rating ? (
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-500">★</span>
                          <span className="text-sm text-slate-600">{product.rating.toFixed(1)}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={product.status} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Link
                          to={`/products/${product.id}/edit`}
                          className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <Dropdown
                          trigger={
                            <button className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                              <Eye className="h-4 w-4" />
                            </button>
                          }
                        >
                          {product.status !== 'published' && (
                            <DropdownItem
                              onClick={() => handleStatusChange(product.id, 'published')}
                            >
                              <Send className="mr-2 h-4 w-4" />
                              Publish
                            </DropdownItem>
                          )}
                          {product.status !== 'draft' && (
                            <DropdownItem
                              onClick={() => handleStatusChange(product.id, 'draft')}
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Move to Draft
                            </DropdownItem>
                          )}
                          {product.status !== 'archived' && (
                            <DropdownItem
                              onClick={() => handleStatusChange(product.id, 'archived')}
                            >
                              <Archive className="mr-2 h-4 w-4" />
                              Archive
                            </DropdownItem>
                          )}
                          <DropdownDivider />
                          <DropdownItem danger onClick={() => deleteModal.openModal(product.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownItem>
                        </Dropdown>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {totalPages > 1 && (
              <div className="border-t border-slate-200 px-4 py-3">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        )}
      </Card>

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.closeModal}
        onConfirm={handleDelete}
        title="Delete Product"
        message="Are you sure you want to delete this product? This will also remove it from any collections."
      />
    </div>
  )
}
