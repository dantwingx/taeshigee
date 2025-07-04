import { useAuthStore } from '@/stores/authStore'
import { useTaskStore } from '@/stores/taskStore'

export function Header() {
  const { user, logout } = useAuthStore()
  const { tasks, currentUserId } = useTaskStore()

  const handleLogout = () => {
    logout()
  }

  return (
    <header className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 px-4 py-3 sticky top-0 z-40 transition-colors duration-200">
      <div className="max-w-md mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* 로고 */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">Taeshigee</h1>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">태스크 관리의 새로운 경험</p>
            </div>
          </div>
          
          {user && (
            <div className="flex items-center space-x-2 text-xs text-neutral-500 dark:text-neutral-400">
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">{user.email}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          {user && (
            <div className="text-xs text-neutral-500 dark:text-neutral-400">
              <span className="hidden sm:inline">태스크 </span>
              <span className="font-medium text-neutral-900 dark:text-neutral-100">{tasks.length}개</span>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors px-2 py-1 rounded"
          >
            로그아웃
          </button>
        </div>
      </div>
    </header>
  )
} 