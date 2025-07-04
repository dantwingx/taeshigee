import { NavLink } from 'react-router-dom'
import { Home, List, BarChart3, Settings } from 'lucide-react'

export function BottomNavigation() {
  const navItems = [
    {
      to: '/',
      icon: Home,
      label: '홈',
    },
    {
      to: '/tasks',
      icon: List,
      label: '태스크',
    },
    {
      to: '/analytics',
      icon: BarChart3,
      label: '분석',
    },
    {
      to: '/settings',
      icon: Settings,
      label: '설정',
    },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 z-50">
      <div className="max-w-md mx-auto">
        <div className="flex justify-around">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center py-3 px-4 min-w-0 flex-1 transition-colors ${
                  isActive
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-neutral-500 hover:text-neutral-700'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={`h-5 w-5 mb-1 ${isActive ? 'text-primary-600' : ''}`} />
                  <span className="text-xs font-medium truncate">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  )
} 