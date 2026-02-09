import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, ListOrdered } from 'lucide-react'
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
  Badge,
  Select,
} from '@/components/ui'
import { PageHeader, StatusBadge, DeleteConfirmModal, useDeleteModal } from '@/components/common'
import type { Collection, ContentStatus, CollectionType } from '@/types'

// Mock data for demo
const mockCollections: Collection[] = [
  {
    id: '1',
    title: 'Top 5 Laptops for Work in 2024',
    slug: 'top-5-laptops-work-2024',
    type: 'top-list',
    description: 'The best laptops for productivity and remote work',
    items: [
      { productId: '1', rank: 1, note: 'Best overall performance' },
      { productId: '4', rank: 2, note: 'Best Windows option' },
    ],
    status: 'published',
    publishedAt: '2024-01-20T10:00:00Z',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z',
  },
  {
    id: '2',
    title: 'Best Budget Smartphones Under $500',
    slug: 'best-budget-smartphones-under-500',
    type: 'budget',
    description: 'Great smartphones that wont break the bank',
    items: [
      { productId: '2', rank: 1, note: 'Best value' },
    ],
    status: 'draft',
    createdAt: '2024-01-16T10:00:00Z',
    updatedAt: '2024-01-16T10:00:00Z',
  },
  {
    id: '3',
    title: 'Best Headphones for Music Lovers',
    slug: 'best-headphones-music-lovers',
    type: 'best-for',
    description: 'Top picks for audiophiles',
    items: [
      { productId: '3', rank: 1, note: 'Best ANC' },
    ],
    status: 'published',
    publishedAt: '2024-01-18T10:00:00Z',
    createdAt: '2024-01-17T10:00:00Z',
    updatedAt: '2024-01-18T10:00:00Z',
  },
]

const collectionTypeLabels: Record<CollectionType, string> = {
  'top-list': 'Top List',
  'best-for': 'Best For',
  'budget': 'Budget',
  'custom': 'Custom',
}

const collectionTypeBadgeColors: Record<CollectionType, 'default' | 'info' | 'success' | 'warning'> = {
  'top-list': 'info',
  'best-for': 'success',
  'budget': 'warning',
  'custom': 'default',
}

export function CollectionsListPage() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<ContentStatus | ''>('')
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const deleteModal = useDeleteModal()

  const itemsPerPage = 10

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCollections(mockCollections)
      setIsLoading(false)
    }, 500)
  }, [])

  const filteredCollections = collections.filter((collection) => {
    const matchesSearch = collection.title.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = !statusFilter || collection.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalPages = Math.ceil(filteredCollections.length / itemsPerPage)
  const paginatedCollections = filteredCollections.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleDelete = () => {
    if (deleteModal.itemId) {
      setCollections((prev) => prev.filter((c) => c.id !== deleteModal.itemId))
      deleteModal.closeModal()
    }
  }

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'draft', label: 'Draft' },
    { value: 'published', label: 'Published' },
  ]

  return (
    <div>
      <PageHeader
        title="Collections"
        description="Manage product rankings and collections"
        actions={
          <Button as={Link} to="/collections/new" leftIcon={<Plus className="h-4 w-4" />}>
            Add Collection
          </Button>
        }
      />

      <Card>
        <div className="border-b border-slate-200 p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <SearchInput
              placeholder="Search collections..."
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
        ) : paginatedCollections.length === 0 ? (
          <EmptyState
            icon={<ListOrdered className="h-6 w-6" />}
            title="No collections found"
            description={
              search || statusFilter
                ? 'Try adjusting your filters'
                : 'Get started by creating your first collection'
            }
            action={
              !search &&
              !statusFilter && (
                <Button as={Link} to="/collections/new" leftIcon={<Plus className="h-4 w-4" />}>
                  Add Collection
                </Button>
              )
            }
          />
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCollections.map((collection) => (
                  <TableRow key={collection.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-slate-900">{collection.title}</p>
                        {collection.description && (
                          <p className="text-sm text-slate-500 line-clamp-1">
                            {collection.description}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={collectionTypeBadgeColors[collection.type]}>
                        {collectionTypeLabels[collection.type]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {collection.items.length} products
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={collection.status} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Link
                          to={`/collections/${collection.id}/edit`}
                          className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => deleteModal.openModal(collection.id)}
                          className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
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
        title="Delete Collection"
        message="Are you sure you want to delete this collection? Products in this collection will not be affected."
      />
    </div>
  )
}
