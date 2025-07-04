import { useAuthStore } from '@/stores/authStore'
import { useTaskStore } from '@/stores/taskStore'

export function Header() {
  const { user, logout } = useAuthStore()
  const { tasks, currentUserId } = useTaskStore()

  const handleLogout = () => {
    logout()
  }

  return (
    <header className="bg-white border-b border-neutral-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-neutral-900">Taeshigee</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {user && (
            <div className="flex items-center space-x-3 text-sm text-neutral-600">
              <span>사용자: {user.email}</span>
              <span>|</span>
              <span>ID: {currentUserId}</span>
              <span>|</span>
              <span>태스크: {tasks.length}개</span>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            로그아웃
          </button>
        </div>
      </div>
    </header>
  )
} 