import { useAuthStore } from '@/stores/authStore'
import { useTaskStore } from '@/stores/taskStore'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Moon, Sun, Globe, LogOut, ChevronDown } from 'lucide-react'
import { languages, getLanguageByCode } from '@/i18n/languages'
import { useToastStore } from '@/stores'
import { applyDarkMode, syncDarkModeWithUserSettings } from '@/utils/darkMode'

export function Header() {
  const { currentUser, logout, updateUserSettings, getUserSettings } = useAuthStore()
  const { currentUserId, getTaskStats } = useTaskStore()
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { showToast } = useToastStore()
  
  // 언어 및 다크모드 상태
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState('ko')
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false)

  // 사용자별 통계 계산 - 현재 사용자의 태스크만 계산
  const stats = currentUser ? getTaskStats(currentUser.userNumber) : {
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0,
    completionRate: 0,
  }

  // 컴포넌트 마운트 시 사용자 설정 로드
  useEffect(() => {
    if (currentUser) {
      const settings = getUserSettings()
      if (settings) {
        setIsDarkMode(settings.darkMode)
        setSelectedLanguage(settings.language)
        // 다크모드 동기화
        syncDarkModeWithUserSettings()
      }
    }
  }, [currentUser, getUserSettings])

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.language-dropdown')) {
        setIsLanguageDropdownOpen(false)
      }
    }

    if (isLanguageDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isLanguageDropdownOpen])

  // 언어 변경 처리
  const handleLanguageChange = async (languageCode: string) => {
    setSelectedLanguage(languageCode)
    setIsLanguageDropdownOpen(false)
    
    // i18n 언어 변경
    await i18n.changeLanguage(languageCode)
    
    // 사용자 설정 업데이트
    const result = await updateUserSettings({ language: languageCode })
    if (result.success) {
      showToast('success', t('settings.languageChanged'))
    } else {
      showToast('error', t('settings.languageChangeFailed'))
    }
  }

  // 다크모드 토글 처리
  const toggleDarkMode = async () => {
    const newDarkMode = !isDarkMode
    setIsDarkMode(newDarkMode)
    
    // 다크모드 적용
    applyDarkMode(newDarkMode)
    
    // 사용자 설정 업데이트
    const result = await updateUserSettings({ darkMode: newDarkMode })
    if (result.success) {
      showToast('success', newDarkMode ? t('settings.darkModeEnabled') : t('settings.darkModeDisabled'))
    } else {
      showToast('error', t('settings.darkModeChangeFailed'))
    }
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
          {/* 태스크 갯수 표시 제거됨 */}
          
          {/* 언어 변경 드롭다운 */}
          <div className="relative language-dropdown">
            <button
              onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
              className="p-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors rounded"
              title={t('settings.language')}
            >
              <Globe className="h-4 w-4" />
            </button>

            {isLanguageDropdownOpen && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-neutral-700 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-600 z-10">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-neutral-100 dark:hover:bg-neutral-600 text-neutral-900 dark:text-neutral-100"
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 다크모드 토글 */}
          <button
            onClick={toggleDarkMode}
            className="p-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors rounded"
            title={isDarkMode ? t('settings.darkMode') : t('settings.lightMode')}
          >
            {isDarkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>

          {/* 로그아웃 버튼 */}
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