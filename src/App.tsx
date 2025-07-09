import { Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { AuthGuard } from '@/components/common/AuthGuard'
import { ToastContainer } from '@/components/ui/Toast'
import { HomePage } from '@/domains/tasks/components/HomePage'
import { TasksPage } from '@/domains/tasks/components/TasksPage'
import { SharedPage } from '@/domains/shared/components/SharedPage'
import { SettingsPage } from '@/domains/settings/components/SettingsPage'
import { LoginPage } from '@/domains/auth/components/LoginPage'
import { RegisterPage } from '@/domains/auth/components/RegisterPage'
import { useToastStore } from '@/stores'
import { useAuthStore } from '@/stores/authStore'
import { useEffect } from 'react'
import { applyDarkMode } from '@/utils/darkMode'
import { changeLanguage } from '@/i18n'

function App() {
  const { toasts, removeToast } = useToastStore()
  const { initializeAuth, currentUser } = useAuthStore()

  // 앱 시작 시 초기화
  useEffect(() => {
    const initializeApp = async () => {
      // 인증 상태 초기화
      await initializeAuth()
    }

    initializeApp()
  }, [initializeAuth])

  // 사용자 설정 동기화 (currentUser가 변경될 때마다)
  useEffect(() => {
    if (currentUser?.userSettings) {
      const { language, darkMode } = currentUser.userSettings
      
      // 언어 설정 적용
      if (language) {
        changeLanguage(language)
      }
      
      // 다크모드 설정 적용
      if (darkMode !== undefined) {
        applyDarkMode(darkMode)
      }
    }
  }, [currentUser])

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 transition-colors duration-200">
      <Routes>
        {/* 인증 페이지들 */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* 메인 레이아웃이 적용되는 페이지들 (인증 필요) */}
        <Route
          path="/"
          element={
            <AuthGuard>
              <Layout />
            </AuthGuard>
          }
        >
          <Route index element={<HomePage />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="shared" element={<SharedPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>

      {/* Toast 컨테이너 */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  )
}

export default App 