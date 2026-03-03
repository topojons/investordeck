import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import {
  Bell,
  Moon,
  Sun,
  ChevronDown,
  User,
  Settings,
  LogOut,
} from 'lucide-react'
import { useThemeStore } from '@/store/themeStore'
import { useAuthStore } from '@/store/authStore'

const pageNames: Record<string, string> = {
  '/': 'Dashboard',
  '/search': 'Property Search',
  '/deals': 'Deal Finder',
  '/comps': 'Comps Engine',
  '/calculators': 'Calculators',
  '/market': 'Market Analysis',
  '/pipeline': 'My Pipeline',
  '/settings': 'Settings',
}

export default function Header() {
  const location = useLocation()
  const { theme, toggleTheme } = useThemeStore()
  const { user, logout } = useAuthStore()
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const pageTitle =
    pageNames[location.pathname] ||
    pageNames['/'] ||
    'Dashboard'

  return (
    <header className="h-16 bg-primary-900 border-b border-primary-800 px-6 flex items-center justify-between">
      {/* Page Title */}
      <h1 className="text-xl font-semibold text-white">{pageTitle}</h1>

      {/* Right Section */}
      <div className="flex items-center gap-6">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-primary-800 text-gray-400 hover:text-gray-200 hover:bg-primary-700 transition-colors"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg bg-primary-800 text-gray-400 hover:text-gray-200 hover:bg-primary-700 transition-colors">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary-800 hover:bg-primary-700 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-accent-500 flex items-center justify-center">
              <User size={16} className="text-primary-950" />
            </div>
            <span className="text-sm font-medium text-gray-200 hidden sm:block">
              {user?.name?.split(' ')[0] || 'User'}
            </span>
            <ChevronDown size={16} className="text-gray-400" />
          </button>

          {/* Dropdown Menu */}
          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-primary-800 rounded-lg shadow-lg border border-primary-700 z-50">
              <div className="px-4 py-3 border-b border-primary-700">
                <p className="text-sm font-medium text-white">{user?.name}</p>
                <p className="text-xs text-gray-400">{user?.email}</p>
              </div>
              <div className="py-2">
                <a
                  href="/settings"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-200 hover:bg-primary-700 transition-colors"
                >
                  <Settings size={16} />
                  Settings
                </a>
                <button
                  onClick={() => {
                    logout()
                    setUserMenuOpen(false)
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-red-950/20 transition-colors"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close menu */}
      {userMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setUserMenuOpen(false)}
        />
      )}
    </header>
  )
}
