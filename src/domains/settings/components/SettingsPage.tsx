import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/stores/authStore'
import { languages, getLanguageByCode } from '@/i18n/languages'
import { getCurrentLanguage } from '@/i18n'
import { 
  User, 
  Settings, 
  Moon, 
  Sun, 
  Globe, 
  LogOut, 
  Edit,
  Check,
  X,
  ChevronDown
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useToastStore } from '@/stores'
import { applyDarkMode, syncDarkModeWithUserSettings } from '@/utils/darkMode'
import { formatLocalDateTime } from '@/utils/dateUtils'

export function SettingsPage() {
  const { t, i18n } = useTranslation()
  const { 
    currentUser, 
    currentUserId,
    setCurrentUser,
    logout, 
    changeUserName, 
    updateUserSettings,
    getUserSettings
  } = useAuthStore()
  const { showToast } = useToastStore()
  
  // 사용자 설정 상태
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState('ko')
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false)
  
  // 편집 모드 상태
  const [isEditingName, setIsEditingName] = useState(false)
  const [editingName, setEditingName] = useState('')
  const [nameError, setNameError] = useState('')


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

  // currentUser가 없고 currentUserId가 있으면 users에서 찾아서 세팅
  useEffect(() => {
    if (!currentUser && currentUserId && setCurrentUser) {
      const found = currentUser // Assuming currentUser is the user object
      if (found) setCurrentUser(found)
    }
  }, [currentUser, currentUserId, setCurrentUser])

  // 언어 변경 처리
  const handleLanguageChange = async (languageCode: string) => {
    try {
      setSelectedLanguage(languageCode)
      setIsLanguageDropdownOpen(false)
      
      // i18n 언어 변경
      await i18n.changeLanguage(languageCode)
      
      // localStorage에 즉시 저장
      localStorage.setItem('i18nextLng', languageCode)
      
      // 사용자 설정 업데이트
      const result = await updateUserSettings({ language: languageCode })
      if (result.success) {
        showToast('success', t('settings.languageChanged'))
      } else {
        showToast('error', t('settings.languageChangeFailed'))
        // 실패 시 이전 언어로 되돌리기
        const previousLanguage = getCurrentLanguage()
        await i18n.changeLanguage(previousLanguage)
        setSelectedLanguage(previousLanguage)
      }
    } catch (error) {
      console.error('Language change error:', error)
      showToast('error', t('settings.languageChangeFailed'))
    }
  }

  // 다크모드 토글 처리
  const toggleDarkMode = async () => {
    const newDarkMode = !isDarkMode
    setIsDarkMode(newDarkMode)
    
    // 다크모드 적용 및 localStorage에 즉시 저장
    applyDarkMode(newDarkMode)
    
    // 사용자 설정 업데이트
    const result = await updateUserSettings({ darkMode: newDarkMode })
    if (result.success) {
      showToast('success', newDarkMode ? t('settings.darkModeEnabled') : t('settings.darkModeDisabled'))
    } else {
      showToast('error', t('settings.darkModeChangeFailed'))
    }
  }

  // 사용자 이름 변경 처리
  const handleNameChange = async () => {
    if (!editingName.trim()) {
      setNameError(t('settings.enterName'))
      return
    }

    const result = await changeUserName(editingName)
    if (result.success) {
      setIsEditingName(false)
      setEditingName('')
      setNameError('')
      showToast('success', t('settings.nameChanged'))
    } else {
      setNameError(result.error || t('settings.nameChangeFailed'))
    }
  }



  // 로그아웃 처리
  const handleLogout = () => {
    logout()
    showToast('success', t('settings.loggedOut'))
  }

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Settings className="w-12 h-12 mx-auto mb-4 text-neutral-400" />
          <p className="text-neutral-600 dark:text-neutral-400">{t('settings.pleaseLogin')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center gap-3">
        <Settings className="w-6 h-6 text-primary-600" />
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
          {t('settings.title')}
        </h1>
      </div>

      {/* 내 계정 섹션 */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
          <User className="w-5 h-5" />
          {t('settings.myAccount')}
        </h2>

        {/* 사용자 정보 */}
        <div className="space-y-4">
          {/* 이메일 */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              {t('settings.email')}
            </label>
            <div className="text-neutral-900 dark:text-neutral-100 bg-neutral-50 dark:bg-neutral-700 px-3 py-2 rounded-lg">
              {currentUser.email}
            </div>
          </div>

          {/* 사용자 이름 */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              {t('settings.name')}
            </label>
            {isEditingName ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="input"
                  placeholder={t('settings.enterName')}
                />
                {nameError && <p className="text-red-500 text-sm">{nameError}</p>}
                <div className="flex gap-2">
                  <button
                    onClick={handleNameChange}
                    className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                  >
                    <Check className="w-4 h-4" />
                    {t('common.save')}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingName(false)
                      setEditingName('')
                      setNameError('')
                    }}
                    className="flex items-center gap-1 px-3 py-1 bg-neutral-500 text-white rounded text-sm hover:bg-neutral-600"
                  >
                    <X className="w-4 h-4" />
                    {t('common.cancel')}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="text-neutral-900 dark:text-neutral-100 bg-neutral-50 dark:bg-neutral-700 px-3 py-2 rounded-lg flex-1">
                  {currentUser.name}
                </div>
                <button
                  onClick={() => {
                    setIsEditingName(true)
                    setEditingName(currentUser.name)
                  }}
                  className="ml-2 p-2 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* 사용자 ID */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              {t('settings.userId')}
            </label>
            <div className="text-neutral-900 dark:text-neutral-100 bg-neutral-50 dark:bg-neutral-700 px-3 py-2 rounded-lg">
              {currentUser.id}
            </div>
          </div>

          {/* 가입일시 */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              {t('settings.joinDate')}
            </label>
            <div className="text-neutral-900 dark:text-neutral-100 bg-neutral-50 dark:bg-neutral-700 px-3 py-2 rounded-lg">
              {formatLocalDateTime(currentUser.createdAt, i18n.language)}
            </div>
          </div>

          {/* 마지막 업데이트 */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              {t('settings.lastUpdated')}
            </label>
            <div className="text-neutral-900 dark:text-neutral-100 bg-neutral-50 dark:bg-neutral-700 px-3 py-2 rounded-lg">
              {formatLocalDateTime(currentUser.lastUpdated, i18n.language)}
            </div>
          </div>
        </div>
      </div>

      {/* 앱 설정 섹션 */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
          {t('settings.appSettings')}
        </h2>

        <div className="space-y-4">
          {/* 다크모드 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isDarkMode ? (
                <Moon className="w-5 h-5 text-primary-600" />
              ) : (
                <Sun className="w-5 h-5 text-primary-600" />
              )}
              <span className="text-neutral-900 dark:text-neutral-100">
                {t('settings.darkMode')}
              </span>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isDarkMode ? 'bg-primary-600' : 'bg-neutral-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isDarkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* 언어 설정 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-primary-600" />
              <span className="text-neutral-900 dark:text-neutral-100">
                {t('settings.language')}
              </span>
            </div>
            <div className="relative">
              <button
                onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 bg-neutral-100 dark:bg-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 hover:bg-neutral-200 dark:hover:bg-neutral-600"
              >
                <span className="text-lg">
                  {getLanguageByCode(selectedLanguage)?.flag}
                </span>
                <span>{getLanguageByCode(selectedLanguage)?.name}</span>
                <ChevronDown className="w-4 h-4" />
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
          </div>
        </div>
      </div>

      {/* 계정 관리 섹션 */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
          {t('settings.accountManagement')}
        </h2>

        <div className="space-y-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            {t('settings.logout')}
          </button>
        </div>
      </div>
    </div>
  )
} 