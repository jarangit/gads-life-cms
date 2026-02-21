import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, ListOrdered, CheckCircle, FileText } from 'lucide-react'
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
import { PageHeader, DeleteConfirmModal, useDeleteModal, StatsSummary } from '@/components/common'
import { useCollections } from '@/api/queries/collection/list'
import { useDeleteCollection } from '@/api/queries/collection/mutation'
import type { CollectionType, CollectionStatus } from '@/api/types/collection'

const collectionTypeLabels: Record<CollectionType, string> = {
  TOP_LIST: 'Top List',
  GUIDE: 'Guide',
  COMPARISON: 'Comparison',
}

const collectionTypeBadgeColors: Record<CollectionType, 'default' | 'info' | 'success' | 'warning'> = {
  TOP_LIST: 'info',
  GUIDE: 'success',
  COMPARISON: 'warning',
}

const statusLabels: Record<CollectionStatus, string> = {
  DRAFT: 'Draft',
  PUBLISHED: 'Published',
}

const statusBadgeColors: Record<CollectionStatus, 'default' | 'success' | 'warning'> = {
  DRAFT: 'default',
  PUBLISHED: 'success',
}

export function CollectionsListPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<CollectionStatus | ''>('')
  const [currentPage, setCurrentPage] = useState(1)
  const deleteModal = useDeleteModal()

  const { data: collections = [], isLoading } = useCollections()
  const deleteCollection = useDeleteCollection()

  const itemsPerPage = 10

  const filteredCollections = collections.filter((collection) => {
    const matchesSearch = collection.titleTh.toLowerCase().includes(search.toLowerCase()) ||
      collection.slug.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = !statusFilter || collection.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Calculate stats
  const stats = useMemo(() => {
    const published = collections.filter((c) => c.status === 'PUBLISHED').length
    const draft = collections.filter((c) => c.status === 'DRAFT').length

    return [
      {
        label: 'Total Collections',
        value: collections.length,
        icon: <ListOrdered className="h-5 w-5" />,
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
    ]
  }, [collections])

  const totalPages = Math.ceil(filteredCollections.length / itemsPerPage)
  const paginatedCollections = filteredCollections.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleDelete = () => {
    if (deleteModal.itemId) {
      deleteCollection.mutate(deleteModal.itemId, {
        onSuccess: () => {
          deleteModal.closeModal()
        },
      })
    }
  }

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'DRAFT', label: 'Draft' },
    { value: 'PUBLISHED', label: 'Published' },
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

      {/* Stats Summary */}
      <StatsSummary stats={stats} className="mb-6 grid-cols-3" />

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
              onChange={(e) => setStatusFilter(e.target.value as CollectionStatus | '')}
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
                  <TableHead>Slug</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCollections.map((collection) => (
                  <TableRow key={collection.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-slate-900">{collection.titleTh}</p>
                        {collection.titleEn && (
                          <p className="text-sm text-slate-500 line-clamp-1">
                            {collection.titleEn}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm text-slate-600">
                        {collection.slug}
                      </code>
                    </TableCell>
                    <TableCell>
                      <Badge variant={collectionTypeBadgeColors[collection.type]}>
                        {collectionTypeLabels[collection.type]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {collection.category?.nameTh || <span className="text-slate-400">—</span>}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusBadgeColors[collection.status]}>
                        {statusLabels[collection.status]}
                      </Badge>
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
