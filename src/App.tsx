import { Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { AuthGuard } from '@/components/common/AuthGuard'
import { HomePage } from '@/domains/tasks/components/HomePage'
import { TasksPage } from '@/domains/tasks/components/TasksPage'
import { AnalyticsPage } from '@/domains/analytics/components/AnalyticsPage'
import { SettingsPage } from '@/domains/settings/components/SettingsPage'
import { LoginPage } from '@/domains/auth/components/LoginPage'
import { RegisterPage } from '@/domains/auth/components/RegisterPage'

function App() {
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
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App 