import { Home, List, BarChart3, User } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const navigationItems = [
  {
    path: '/',
    icon: Home,
    label: '홈',
  },
  {
    path: '/tasks',
    icon: List,
    label: '태스크',
  },
  {
    path: '/analytics',
    icon: BarChart3,
    label: '공개',
  },
  {
    path: '/settings',
    icon: User,
    label: '마이',
  },
]

export function BottomNavigation() {
  const location = useLocation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 px-4 py-2 z-40">
      <div className="max-w-md mx-auto">
        <div className="flex justify-around">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${
                  isActive
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-neutral-500 hover:text-neutral-700'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
} 