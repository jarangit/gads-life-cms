import { useState } from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { clsx } from 'clsx'
import {
  LayoutGrid,
  Package,
  Tag,
  Building2,
  ListOrdered,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Settings,
  User,
} from 'lucide-react'
import { Dropdown, DropdownItem, DropdownDivider } from '@/components/ui'

interface NavItem {
  label: string
  path: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/', icon: <LayoutGrid className="h-5 w-5" /> },
  { label: 'Categories', path: '/categories', icon: <Tag className="h-5 w-5" /> },
  { label: 'Brands', path: '/brands', icon: <Building2 className="h-5 w-5" /> },
  { label: 'Products', path: '/products', icon: <Package className="h-5 w-5" /> },
  { label: 'Collections', path: '/collections', icon: <ListOrdered className="h-5 w-5" /> },
]

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  const currentPage = navItems.find((item) => {
    if (item.path === '/') return location.pathname === '/'
    return location.pathname.startsWith(item.path)
  })

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-lg transition-transform duration-200 ease-in-out lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-6">
          <h1 className="text-xl font-bold text-slate-900">Review CMS</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    clsx(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    )
                  }
                  onClick={() => setSidebarOpen(false)}
                >
                  {item.icon}
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 border-t border-slate-200 p-3">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              )
            }
          >
            <Settings className="h-5 w-5" />
            Settings
          </NavLink>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-semibold text-slate-900">
              {currentPage?.label || 'Dashboard'}
            </h2>
          </div>

          <Dropdown
            trigger={
              <button className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">
                  <User className="h-4 w-4" />
                </div>
                <span className="hidden md:inline">Admin</span>
                <ChevronDown className="h-4 w-4" />
              </button>
            }
          >
            <DropdownItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownItem>
            <DropdownItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownItem>
            <DropdownDivider />
            <DropdownItem danger>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownItem>
          </Dropdown>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
