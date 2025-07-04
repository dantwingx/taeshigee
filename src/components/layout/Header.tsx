import { useAuthStore } from '@/stores/authStore'
import { useTaskStore } from '@/stores/taskStore'

export function Header() {
  const { user, logout } = useAuthStore()
  const { tasks, currentUserId } = useTaskStore()

  const handleLogout = () => {
    logout()
  }

  return (
    <header className="bg-white border-b border-neutral-200 px-4 py-3 sticky top-0 z-40">
      <div className="max-w-md mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* 로고 */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-neutral-900">Taeshigee</h1>
              <p className="text-xs text-neutral-500">태스크 관리의 새로운 경험</p>
            </div>
          </div>
          
          {user && (
            <div className="flex items-center space-x-2 text-xs text-neutral-500">
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">{user.email}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          {user && (
            <div className="text-xs text-neutral-500">
              <span className="hidden sm:inline">태스크 </span>
              <span className="font-medium">{tasks.length}개</span>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="text-xs text-neutral-600 hover:text-neutral-900 transition-colors px-2 py-1 rounded"
          >
            로그아웃
          </button>
        </div>
      </div>
    </header>
  )
} 