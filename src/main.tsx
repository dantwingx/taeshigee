import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.tsx'
import './styles/globals.css'
import { initializeDarkMode } from './utils/darkMode'

// i18n 추가
import i18n from 'i18next'
import { I18nextProvider, initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ko: {
        translation: {
          'My': '마이',
          'Manage your info and settings': '내 정보와 설정을 관리하세요',
          'Dark Mode': '다크모드',
          'Switch to dark theme': '어두운 테마로 변경',
          'Language Settings': '언어 설정',
          'Sign Up Date': '가입일',
          'Last Update': '마지막 업데이트',
          'User ID': '사용자 ID',
          'Task Search...': '태스크 검색...'
        }
      },
      en: {
        translation: {
          'My': 'My',
          'Manage your info and settings': 'Manage your info and settings',
          'Dark Mode': 'Dark Mode',
          'Switch to dark theme': 'Switch to dark theme',
          'Language Settings': 'Language Settings',
          'Sign Up Date': 'Sign Up Date',
          'Last Update': 'Last Update',
          'User ID': 'User ID',
          'Task Search...': 'Task Search...'
        }
      }
    },
    fallbackLng: 'ko',
    interpolation: { escapeValue: false },
    detection: { order: ['localStorage', 'navigator'] }
  })

// 다크모드 초기화
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
      <I18nextProvider i18n={i18n}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </I18nextProvider>
    </QueryClientProvider>
  </React.StrictMode>,
) 