import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.tsx'
import './styles/globals.css'
import { initializeDarkMode } from './utils/darkMode'

// i18n 초기화
import './i18n'

// 다크모드 즉시 초기화 (HTML 로드 시점에 실행)
const savedDarkMode = localStorage.getItem('darkMode')
if (savedDarkMode !== null) {
  const isDark = savedDarkMode === 'true'
  if (isDark) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
} else {
  // 시스템 설정 확인
  const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  if (isSystemDark) {
    document.documentElement.classList.add('dark')
  }
}

// 다크모드 초기화 (앱 시작 시 즉시 실행)
initializeDarkMode()

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5분
      retry: 1,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
) 