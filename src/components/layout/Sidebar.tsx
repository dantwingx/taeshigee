import { NavLink } from 'react-router-dom'
import { BarChart3, Calendar, Home, Settings, Square } from 'lucide-react'

const navigation = [
  { name: '홈', href: '/', icon: Home },
  { name: '태스크', href: '/tasks', icon: Square },
  { name: '분석', href: '/analytics', icon: BarChart3 },
  { name: '설정', href: '/settings', icon: Settings },
]

export function Sidebar() {
  return (
    <div className="w-64 bg-white border-r">
      <div className="flex h-16 items-center px-6 border-b">
        <h1 className="text-xl font-bold text-primary-600">태식이</h1>
      </div>
      
      <nav className="p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                }`
              }
            >
              <Icon className="h-5 w-5" />
              <span>{item.name}</span>
            </NavLink>
          )
        })}
      </nav>
    </div>
  )
} 