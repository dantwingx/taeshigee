import { Bell, Search, Settings } from 'lucide-react'

export function Header() {
  return (
    <header className="border-b bg-white px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="태스크 검색..."
              className="input pl-10 w-80"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="btn-ghost relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-error-500"></span>
          </button>
          <button className="btn-ghost">
            <Settings className="h-5 w-5" />
          </button>
          <div className="h-8 w-8 rounded-full bg-primary-500"></div>
        </div>
      </div>
    </header>
  )
} 