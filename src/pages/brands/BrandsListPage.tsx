import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, Building2, ExternalLink, Image, Globe } from 'lucide-react'
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
} from '@/components/ui'
import { PageHeader, DeleteConfirmModal, useDeleteModal, StatsSummary } from '@/components/common'
import type { Brand } from '@/types'

// Mock data for demo
const mockBrands: Brand[] = [
  {
    id: '1',
    name: 'Apple',
    slug: 'apple',
    logo: 'https://placehold.co/100x100',
    websiteUrl: 'https://apple.com',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'Samsung',
    slug: 'samsung',
    logo: 'https://placehold.co/100x100',
    websiteUrl: 'https://samsung.com',
    createdAt: '2024-01-16T10:00:00Z',
    updatedAt: '2024-01-16T10:00:00Z',
  },
  {
    id: '3',
    name: 'Sony',
    slug: 'sony',
    websiteUrl: 'https://sony.com',
    createdAt: '2024-01-17T10:00:00Z',
    updatedAt: '2024-01-17T10:00:00Z',
  },
  {
    id: '4',
    name: 'Dell',
    slug: 'dell',
    logo: 'https://placehold.co/100x100',
    websiteUrl: 'https://dell.com',
    createdAt: '2024-01-18T10:00:00Z',
    updatedAt: '2024-01-18T10:00:00Z',
  },
]

export function BrandsListPage() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const deleteModal = useDeleteModal()

  const itemsPerPage = 10

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setBrands(mockBrands)
      setIsLoading(false)
    }, 500)
  }, [])

  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(search.toLowerCase())
  )

  // Calculate stats
  const stats = useMemo(() => {
    const withLogo = brands.filter((b) => b.logo).length
    const withWebsite = brands.filter((b) => b.websiteUrl).length

    return [
      {
        label: 'Total Brands',
        value: brands.length,
        icon: <Building2 className="h-5 w-5" />,
        color: 'blue' as const,
      },
      {
        label: 'With Logo',
        value: withLogo,
        icon: <Image className="h-5 w-5" />,
        color: 'green' as const,
      },
      {
        label: 'With Website',
        value: withWebsite,
        icon: <Globe className="h-5 w-5" />,
        color: 'purple' as const,
      },
    ]
  }, [brands])

  const totalPages = Math.ceil(filteredBrands.length / itemsPerPage)
  const paginatedBrands = filteredBrands.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleDelete = () => {
    if (deleteModal.itemId) {
      setBrands((prev) => prev.filter((b) => b.id !== deleteModal.itemId))
      deleteModal.closeModal()
    }
  }

  return (
    <div>
      <PageHeader
        title="Brands"
        description="Manage product brands"
        actions={
          <Button as={Link} to="/brands/new" leftIcon={<Plus className="h-4 w-4" />}>
            Add Brand
          </Button>
        }
      />

      {/* Stats Summary */}
      <StatsSummary stats={stats} className="mb-6 grid-cols-3" />

      <Card>
        <div className="border-b border-slate-200 p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <SearchInput
              placeholder="Search brands..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClear={() => setSearch('')}
              className="w-full sm:w-72"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
          </div>
        ) : paginatedBrands.length === 0 ? (
          <EmptyState
            icon={<Building2 className="h-6 w-6" />}
            title="No brands found"
            description={
              search
                ? 'Try adjusting your search'
                : 'Get started by adding your first brand'
            }
            action={
              !search && (
                <Button as={Link} to="/brands/new" leftIcon={<Plus className="h-4 w-4" />}>
                  Add Brand
                </Button>
              )
            }
          />
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Brand</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Website</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedBrands.map((brand) => (
                  <TableRow key={brand.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {brand.logo ? (
                          <img
                            src={brand.logo}
                            alt={brand.name}
                            className="h-10 w-10 rounded-lg border border-slate-200 object-contain p-1"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-slate-50">
                            <Building2 className="h-5 w-5 text-slate-400" />
                          </div>
                        )}
                        <span className="font-medium text-slate-900">{brand.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm text-slate-600">
                        {brand.slug}
                      </code>
                    </TableCell>
                    <TableCell>
                      {brand.websiteUrl ? (
                        <a
                          href={brand.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
                        >
                          {new URL(brand.websiteUrl).hostname}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Link
                          to={`/brands/${brand.id}/edit`}
                          className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => deleteModal.openModal(brand.id)}
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
        title="Delete Brand"
        message="Are you sure you want to delete this brand? Products from this brand will need to be reassigned."
      />
    </div>
  )
}
