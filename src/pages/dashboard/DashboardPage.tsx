import { Link } from 'react-router-dom'
import {
  Package,
  Tag,
  Building2,
  ListOrdered,
  Plus,
  TrendingUp,
  BarChart3,
  Users,
  Eye,
  MousePointerClick,
} from 'lucide-react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  LoadingSpinner,
  EmptyState,
} from '@/components/ui'
import { PageHeader, StatusBadge, StatsSummary } from '@/components/common'
import { useProducts } from '@/api/queries/product/product'
import { useCategories } from '@/api/queries/category/list'
import { useBrands } from '@/api/queries/brands/list'
import { useCollections } from '@/api/queries/collection/list'
import { useReportsOverview } from '@/api/queries/reports/overview'
import { useReportsTopProducts } from '@/api/queries/reports/top-products'
import { useReportsTopPages } from '@/api/queries/reports/top-pages'

interface StatCardProps {
  title: string
  value: number
  icon: React.ReactNode
  href: string
  color: 'blue' | 'green' | 'purple' | 'orange'
}

const colorClasses = {
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-green-50 text-green-600',
  purple: 'bg-purple-50 text-purple-600',
  orange: 'bg-orange-50 text-orange-600',
}

function StatCard({ title, value, icon, href, color }: StatCardProps) {
  return (
    <Link to={href}>
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">{title}</p>
              <p className="mt-1 text-3xl font-bold text-slate-900">{value}</p>
            </div>
            <div className={`rounded-full p-3 ${colorClasses[color]}`}>
              {icon}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

const toDateString = (date: Date) => date.toISOString().split('T')[0]

const defaultRange = () => {
  const to = new Date()
  const from = new Date(to)
  from.setDate(to.getDate() - 29)
  return { from: toDateString(from), to: toDateString(to) }
}

export function DashboardPage() {
  const range = defaultRange()

  const { data: productsData } = useProducts({ page: 1, limit: 5 })
  const { data: categoriesData } = useCategories()
  const { data: brandsData } = useBrands()
  const { data: collectionsData } = useCollections()

  const {
    data: overviewData,
    isLoading: overviewLoading,
    isError: overviewError,
  } = useReportsOverview(range)

  const {
    data: topProductsData,
    isLoading: topProductsLoading,
  } = useReportsTopProducts({ ...range, limit: 5 })

  const { data: topPagesData, isLoading: topPagesLoading } = useReportsTopPages({
    ...range,
    limit: 5,
  })

  const totalProducts = productsData?.total ?? 0
  const totalCategories = categoriesData?.total ?? 0
  const totalBrands = brandsData?.length ?? 0
  const totalCollections = collectionsData?.length ?? 0

  const recentProducts = productsData?.items ?? []
  const recentCollections = collectionsData?.slice(0, 5) ?? []
  const topProducts = topProductsData?.items ?? []
  const topPages = topPagesData?.items ?? []

  const overviewSummary = overviewData?.summary

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Welcome back! Here's an overview of your content."
      />

      <div className="mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Analytics Overview (last 30 days)</CardTitle>
            {overviewLoading && <LoadingSpinner size="sm" />}
          </CardHeader>
          <CardContent>
            {overviewError && (
              <EmptyState
                title="Unable to load analytics"
                description="Please check the reports API or try again later."
              />
            )}
            {!overviewError && overviewSummary && (
              <StatsSummary
                className="sm:grid-cols-2 lg:grid-cols-4"
                stats={[
                  {
                    label: 'Unique Visitors',
                    value: overviewSummary.uniqueVisitors,
                    icon: <Users className="h-5 w-5" />,
                    color: 'blue',
                  },
                  {
                    label: 'Page Views',
                    value: overviewSummary.pageViews,
                    icon: <Eye className="h-5 w-5" />,
                    color: 'green',
                  },
                  {
                    label: 'Product Views',
                    value: overviewSummary.productViews,
                    icon: <BarChart3 className="h-5 w-5" />,
                    color: 'purple',
                  },
                  {
                    label: 'Total Events',
                    value: overviewSummary.totalEvents,
                    icon: <MousePointerClick className="h-5 w-5" />,
                    color: 'yellow',
                  },
                ]}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Products"
          value={totalProducts}
          icon={<Package className="h-6 w-6" />}
          href="/products"
          color="blue"
        />
        <StatCard
          title="Categories"
          value={totalCategories}
          icon={<Tag className="h-6 w-6" />}
          href="/categories"
          color="green"
        />
        <StatCard
          title="Brands"
          value={totalBrands}
          icon={<Building2 className="h-6 w-6" />}
          href="/brands"
          color="purple"
        />
        <StatCard
          title="Collections"
          value={totalCollections}
          icon={<ListOrdered className="h-6 w-6" />}
          href="/collections"
          color="orange"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Products */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Products</CardTitle>
            <Button as={Link} to="/products/new" size="sm" leftIcon={<Plus className="h-4 w-4" />}>
              Add
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProducts.length === 0 && (
                <EmptyState title="No products yet" description="Create your first product to see it here." />
              )}
              {recentProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}/edit`}
                  className="flex items-center justify-between rounded-lg border border-slate-200 p-3 transition-colors hover:bg-slate-50"
                >
                  <div>
                    <p className="font-medium text-slate-900">{product.name}</p>
                    <p className="text-sm text-slate-500">
                      {product.brand?.name || 'Unknown brand'}
                    </p>
                  </div>
                  <StatusBadge status={product.status as 'draft' | 'published'} />
                </Link>
              ))}
            </div>
            <Link
              to="/products"
              className="mt-4 flex items-center justify-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              View all products
              <TrendingUp className="h-4 w-4" />
            </Link>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Top Products (by views)</CardTitle>
            {topProductsLoading && <LoadingSpinner size="sm" />}
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.length === 0 && !topProductsLoading && (
                <EmptyState title="No data" description="Product views will appear once events are tracked." />
              )}
              {topProducts.map((item) => (
                <Link
                  key={`${item.productId}-${item.productSlug}`}
                  to={item.productId ? `/products/${item.productId}/edit` : '/products'}
                  className="flex items-center justify-between rounded-lg border border-slate-200 p-3 transition-colors hover:bg-slate-50"
                >
                  <div>
                    <p className="font-medium text-slate-900">
                      {item.productSlug || item.productId || 'Unknown product'}
                    </p>
                    <p className="text-sm text-slate-500">Product ID: {item.productId || '-'}</p>
                  </div>
                  <span className="text-sm font-semibold text-slate-700">{item.views} views</span>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Pages */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Top Pages (by views)</CardTitle>
            {topPagesLoading && <LoadingSpinner size="sm" />}
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPages.length === 0 && !topPagesLoading && (
                <EmptyState title="No data" description="Page views will appear once events are tracked." />
              )}
              {topPages.map((item) => (
                <div
                  key={item.path ?? 'unknown'}
                  className="flex items-center justify-between rounded-lg border border-slate-200 p-3"
                >
                  <div>
                    <p className="font-medium text-slate-900">{item.path || 'Unknown page'}</p>
                  </div>
                  <span className="text-sm font-semibold text-slate-700">{item.views} views</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <QuickActionCard
                icon={<Package className="h-5 w-5" />}
                title="New Product"
                description="Add a product review"
                href="/products/new"
              />
              <QuickActionCard
                icon={<ListOrdered className="h-5 w-5" />}
                title="New Collection"
                description="Create a ranking list"
                href="/collections/new"
              />
              <QuickActionCard
                icon={<Tag className="h-5 w-5" />}
                title="New Category"
                description="Organize products"
                href="/categories/new"
              />
              <QuickActionCard
                icon={<Building2 className="h-5 w-5" />}
                title="New Brand"
                description="Add a brand"
                href="/brands/new"
              />
            </div>
          </CardContent>
        </Card>

        {/* Recent Collections */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Collections</CardTitle>
            <Button as={Link} to="/collections/new" size="sm" leftIcon={<Plus className="h-4 w-4" />}>
              Add
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCollections.length === 0 && (
                <EmptyState title="No collections yet" description="Create a collection to see it here." />
              )}
              {recentCollections.map((collection) => (
                <Link
                  key={collection.id}
                  to={`/collections/${collection.id}/edit`}
                  className="flex items-center justify-between rounded-lg border border-slate-200 p-3 transition-colors hover:bg-slate-50"
                >
                  <div>
                    <p className="font-medium text-slate-900">{collection.titleTh}</p>
                    <p className="text-sm text-slate-500">{collection.type}</p>
                  </div>
                  <StatusBadge status={collection.status.toLowerCase() as 'draft' | 'published'} />
                </Link>
              ))}
            </div>
            <Link
              to="/collections"
              className="mt-4 flex items-center justify-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              View all collections
              <TrendingUp className="h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

interface QuickActionCardProps {
  icon: React.ReactNode
  title: string
  description: string
  href: string
}

function QuickActionCard({ icon, title, description, href }: QuickActionCardProps) {
  return (
    <Link
      to={href}
      className="flex items-center gap-3 rounded-lg border border-slate-200 p-4 transition-all hover:border-blue-300 hover:bg-blue-50"
    >
      <div className="rounded-lg bg-blue-100 p-2 text-blue-600">{icon}</div>
      <div>
        <p className="font-medium text-slate-900">{title}</p>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
    </Link>
  )
}
