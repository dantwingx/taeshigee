import { useState } from 'react'
import { User, Moon, Sun, Globe } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useDarkModeStore, useToastStore } from '@/stores'
import { applyDarkMode } from '@/utils/darkMode'
import { useTranslation } from 'react-i18next'
import i18n from 'i18next'

const LANGUAGES = [
  { code: 'ko', name: '한국어', icon: '🇰🇷' },
  { code: 'en', name: 'English', icon: '🇺🇸' },
  { code: 'zh', name: '中文', icon: '🇨🇳' },
  { code: 'ja', name: '日本語', icon: '🇯🇵' },
  { code: 'es', name: 'Español', icon: '🇪🇸' },
  { code: 'fr', name: 'Français', icon: '🇫🇷' },
  { code: 'de', name: 'Deutsch', icon: '🇩🇪' },
  { code: 'ru', name: 'Русский', icon: '🇷🇺' },
  { code: 'pt', name: 'Português', icon: '🇵🇹' },
  { code: 'it', name: 'Italiano', icon: '🇮🇹' },
  { code: 'tr', name: 'Türkçe', icon: '🇹🇷' },
  { code: 'vi', name: 'Tiếng Việt', icon: '🇻🇳' },
  { code: 'id', name: 'Bahasa Indonesia', icon: '🇮🇩' },
  { code: 'th', name: 'ไทย', icon: '🇹🇭' },
  { code: 'ar', name: 'العربية', icon: '🇸🇦' },
  { code: 'hi', name: 'हिन्दी', icon: '🇮🇳' },
  { code: 'bn', name: 'বাংলা', icon: '🇧🇩' },
  { code: 'ms', name: 'Bahasa Melayu', icon: '🇲🇾' },
  { code: 'fa', name: 'فارسی', icon: '🇮🇷' },
  { code: 'pl', name: 'Polski', icon: '🇵🇱' },
]

export function SettingsPage() {
  const { user } = useAuthStore()
  const { isDarkMode, toggleDarkMode } = useDarkModeStore()
  const { showToast } = useToastStore()
  const { t } = useTranslation()
  const [selectedLang, setSelectedLang] = useState(i18n.language || 'ko')

  const handleToggleDarkMode = () => {
    toggleDarkMode()
    applyDarkMode(!isDarkMode)
  }

  const handleLangSelect = (code: string) => {
    setSelectedLang(code)
    i18n.changeLanguage(code)
    showToast('info', `${t('Language Settings')} : ${LANGUAGES.find(l => l.code === code)?.name}`)
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div>
        <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">{t('My')}</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">{t('Manage your info and settings')}</p>
      </div>

      {/* 사용자 정보 */}
      <div className="card p-4">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
            <User className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h2 className="font-semibold text-neutral-900 dark:text-neutral-100">{user?.email}</h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">{t('User ID')}: {user?.id}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-neutral-600 dark:text-neutral-400">{t('Sign Up Date')}:</span>
            <span className="ml-2 text-neutral-900 dark:text-neutral-100">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString(selectedLang === 'ko' ? 'ko-KR' : 'en-US') : '-'}
            </span>
          </div>
          <div>
            <span className="text-neutral-600 dark:text-neutral-400">{t('Last Update')}:</span>
            <span className="ml-2 text-neutral-900 dark:text-neutral-100">
              {user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString(selectedLang === 'ko' ? 'ko-KR' : 'en-US') : '-'}
            </span>
          </div>
        </div>
      </div>

      {/* 다크모드 설정 */}
      <div className="card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {isDarkMode ? <Moon className="h-5 w-5 text-neutral-600 dark:text-neutral-400" /> : <Sun className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />}
            <div>
              <h3 className="font-medium text-neutral-900 dark:text-neutral-100">{t('Dark Mode')}</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">{t('Switch to dark theme')}</p>
            </div>
          </div>
          <button
            onClick={handleToggleDarkMode}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isDarkMode ? 'bg-primary-600' : 'bg-neutral-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isDarkMode ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* 언어 설정 */}
      <div className="card p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Globe className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
          <h3 className="font-medium text-neutral-900 dark:text-neutral-100">{t('Language Settings')}</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              type="button"
              onClick={() => handleLangSelect(lang.code)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg border-2 transition-colors text-sm font-medium ${
                selectedLang === lang.code
                  ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300'
                  : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:border-neutral-500'
              }`}
            >
              <span className="text-lg">{lang.icon}</span>
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
} 