import { Link, useLocation } from 'react-router-dom'
import { Home, List, BarChart3, User } from 'lucide-react'

const navigation = [
  { name: '홈', href: '/', icon: Home },
  { name: '태스크', href: '/tasks', icon: List },
  { name: '공개', href: '/analytics', icon: BarChart3 },
  { name: '마이', href: '/settings', icon: User },
]

export function BottomNavigation() {
  const location = useLocation()

  return (
    <nav className="bg-white dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700 fixed bottom-0 left-0 right-0 z-40 transition-colors duration-200">
      <div className="max-w-md mx-auto px-4">
        <div className="flex justify-around">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                  isActive
                    ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                    : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
                }`}
              >
                <item.icon className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium">{item.name}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
} 