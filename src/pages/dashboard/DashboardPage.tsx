import { Link } from 'react-router-dom'
import { Package, Tag, Building2, ListOrdered, Plus, TrendingUp } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent, Button } from '@/components/ui'
import { PageHeader, StatusBadge } from '@/components/common'

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

// Mock data
const recentProducts = [
  { id: '1', name: 'MacBook Air M3', brand: 'Apple', status: 'published' as const },
  { id: '2', name: 'Samsung Galaxy S24 Ultra', brand: 'Samsung', status: 'draft' as const },
  { id: '3', name: 'Sony WH-1000XM5', brand: 'Sony', status: 'published' as const },
]

const recentCollections = [
  { id: '1', title: 'Top 5 Laptops for Work', products: 5, status: 'published' as const },
  { id: '2', title: 'Best Budget Smartphones', products: 8, status: 'draft' as const },
]

export function DashboardPage() {
  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Welcome back! Here's an overview of your content."
      />

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Products"
          value={24}
          icon={<Package className="h-6 w-6" />}
          href="/products"
          color="blue"
        />
        <StatCard
          title="Categories"
          value={8}
          icon={<Tag className="h-6 w-6" />}
          href="/categories"
          color="green"
        />
        <StatCard
          title="Brands"
          value={12}
          icon={<Building2 className="h-6 w-6" />}
          href="/brands"
          color="purple"
        />
        <StatCard
          title="Collections"
          value={6}
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
              {recentProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}/edit`}
                  className="flex items-center justify-between rounded-lg border border-slate-200 p-3 transition-colors hover:bg-slate-50"
                >
                  <div>
                    <p className="font-medium text-slate-900">{product.name}</p>
                    <p className="text-sm text-slate-500">{product.brand}</p>
                  </div>
                  <StatusBadge status={product.status} />
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

        {/* Recent Collections */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Collections</CardTitle>
            <Button as={Link} to="/collections/new" size="sm" leftIcon={<Plus className="h-4 w-4" />}>
              Add
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCollections.map((collection) => (
                <Link
                  key={collection.id}
                  to={`/collections/${collection.id}/edit`}
                  className="flex items-center justify-between rounded-lg border border-slate-200 p-3 transition-colors hover:bg-slate-50"
                >
                  <div>
                    <p className="font-medium text-slate-900">{collection.title}</p>
                    <p className="text-sm text-slate-500">{collection.products} products</p>
                  </div>
                  <StatusBadge status={collection.status} />
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
