import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, Search, Settings, LogOut, User } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'

export function Header() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

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
          
          {/* 사용자 메뉴 */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-medium text-neutral-700">
                {user?.email}
              </span>
            </button>
            
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-1 z-50">
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>로그아웃</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* 사용자 메뉴 외부 클릭 시 닫기 */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </header>
  )
} 