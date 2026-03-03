import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Search,
  Flame,
  GitCompare,
  Calculator,
  BarChart3,
  Kanban,
  Settings,
  LogOut,
  User,
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

interface SidebarProps {
  onClose?: () => void
}

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/' },
  { label: 'Property Search', icon: Search, href: '/search' },
  { label: 'Deal Finder', icon: Flame, href: '/deals' },
  { label: 'Comps Engine', icon: GitCompare, href: '/comps' },
  { label: 'Calculators', icon: Calculator, href: '/calculators' },
  { label: 'Market Analysis', icon: BarChart3, href: '/market' },
  { label: 'My Pipeline', icon: Kanban, href: '/pipeline' },
  { label: 'Settings', icon: Settings, href: '/settings' },
]

export default function Sidebar({ onClose }: SidebarProps) {
  const location = useLocation()
  const { user, logout, isAuthenticated } = useAuthStore()

  return (
    <aside className="h-full w-full bg-primary-900 border-r border-primary-800 flex flex-col">
      {/* Logo */}
      <div className="px-6 py-8 border-b border-primary-800">
        <h1 className="text-2xl font-bold text-white">
          <span className="text-accent-500">Deal</span>Scope
        </h1>
        <p className="text-xs text-gray-400 mt-1">Real Estate Investor Platform</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-800 text-accent-500 border-l-2 border-accent-500'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-primary-800'
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User Section */}
      <div className="border-t border-primary-800 p-4 space-y-2">
        {isAuthenticated && user ? (
          <>
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary-800">
              <div className="w-10 h-10 rounded-full bg-accent-500 flex items-center justify-center">
                <User size={20} className="text-primary-950" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user.name || user.email}
                </p>
                <p className="text-xs text-gray-400 truncate">{user.email}</p>
              </div>
            </div>
            <button
              onClick={() => {
                logout()
                onClose?.()
              }}
              className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-red-950/20 rounded-lg transition-colors"
            >
              <LogOut size={18} />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </>
        ) : (
          <Link
            to="/login"
            onClick={onClose}
            className="w-full block px-4 py-3 bg-accent-500 text-primary-950 rounded-lg font-medium hover:bg-accent-600 transition-colors text-center"
          >
            Login
          </Link>
        )}
      </div>
    </aside>
  )
}
