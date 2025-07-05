import { useAuthStore } from '@/stores/authStore'
import { useTaskStore } from '@/stores/taskStore'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

export function Header() {
  const { user, logout } = useAuthStore()
  const { currentUserId, getTaskStats } = useTaskStore()
  const { t } = useTranslation()
  const navigate = useNavigate()

  // 사용자별 통계 계산 - 현재 사용자의 태스크만 계산
  const stats = user ? getTaskStats(user.id) : {
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0,
    completionRate: 0,
  }

  const handleLogout = () => {
    logout()
  }

  const handleLogoClick = () => {
    navigate('/')
  }

  return (
    <header className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 px-4 py-3 sticky top-0 z-40 transition-colors duration-200">
      <div className="max-w-md mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* 로고 */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={handleLogoClick}>
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">{t('common.appName')}</h1>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">{t('common.appDescription')}</p>
            </div>
          </div>
          
          {/* 사용자 이메일 영역 제거 */}
        </div>
        
        <div className="flex items-center space-x-3">
          {user && (
            <div className="text-xs text-neutral-500 dark:text-neutral-400">
              <span className="hidden sm:inline">{t('navigation.tasks')} </span>
              <span className="font-medium text-neutral-900 dark:text-neutral-100">{stats.total}{t('common.count')}</span>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors px-2 py-1 rounded"
          >
            {t('auth.logout')}
          </button>
        </div>
      </div>
    </header>
  )
} 