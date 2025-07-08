import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.tsx'
import './styles/globals.css'

// i18n 초기화
import './i18n'

// 앱 시작 전 초기 설정 (인증 전)
const initializeAppSettings = () => {
  // 다크모드 초기화
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
      localStorage.setItem('darkMode', 'true')
    } else {
      localStorage.setItem('darkMode', 'false')
    }
  }

  // 언어 설정 초기화 (i18n이 이미 초기화되었으므로 현재 언어 확인)
  const savedLanguage = localStorage.getItem('i18nextLng')
  if (!savedLanguage) {
    // 브라우저 언어 감지
    const browserLang = navigator.language.split('-')[0]
    const supportedLanguages = ['ko', 'en', 'ja', 'zh', 'fr', 'es', 'de', 'it', 'pt', 'ru', 'ar', 'hi', 'th', 'vi', 'id', 'ms', 'tr', 'pl', 'nl', 'sv']
    const defaultLang = supportedLanguages.includes(browserLang) ? browserLang : 'ko'
    localStorage.setItem('i18nextLng', defaultLang)
  }
}

// 앱 시작 전 초기 설정 실행
initializeAppSettings()

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