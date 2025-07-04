import { Link, useLocation } from 'react-router-dom'
import { Home, List, BarChart3, User } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function BottomNavigation() {
  const location = useLocation()
  const { t } = useTranslation()

  const navigation = [
    { name: t('navigation.home'), href: '/', icon: Home },
    { name: t('navigation.tasks'), href: '/tasks', icon: List },
    { name: t('analytics.title'), href: '/analytics', icon: BarChart3 },
    { name: t('navigation.my'), href: '/settings', icon: User },
  ]

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