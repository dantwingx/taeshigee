import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/stores/authStore'
import { useTaskStore } from '@/stores/taskStore'
import { languages, getLanguageByCode } from '@/i18n/languages'
import { 
  User, 
  Settings, 
  Moon, 
  Sun, 
  Globe, 
  LogOut, 
  Trash2,
  AlertTriangle,
  Edit,
  Check,
  X,
  ChevronDown,
  Database
} from 'lucide-react'
import { useState } from 'react'
import { useToastStore } from '@/stores'

export function SettingsPage() {
  const { t, i18n } = useTranslation()
  const { user, logout, changeUserId, isUserIdAvailable, changeUserName } = useAuthStore()
  const { clearAllData } = useTaskStore()
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [showDevSection, setShowDevSection] = useState(false)
  
  // 사용자 ID 변경 관련 상태
  const [isEditingUserId, setIsEditingUserId] = useState(false)
  const [newUserId, setNewUserId] = useState('')
  const [userIdError, setUserIdError] = useState('')
  const [isChangingUserId, setIsChangingUserId] = useState(false)

  // 사용자 이름 변경 관련 상태
  const [isEditingUserName, setIsEditingUserName] = useState(false)
  const [newUserName, setNewUserName] = useState('')
  const [userNameError, setUserNameError] = useState('')
  const [isChangingUserName, setIsChangingUserName] = useState(false)

  // 언어 설정 관련 상태
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)

  const currentLanguage = getLanguageByCode(i18n.language) || languages[0]

  const { showToast } = useToastStore()

  const handleLogout = () => {
    // Show a toast instead of confirm
    showToast('info', t('settings.confirmLogout'))
    // For now, auto-logout for demo (replace with modal for real confirm)
    logout()
  }

  const handleClearAllData = () => {
    // Show a warning toast instead of confirm
    showToast('warning', '⚠️ 모든 태스크 데이터가 영구적으로 삭제됩니다. 계속하시겠습니까?')
    clearAllData()
    showToast('success', '모든 데이터가 초기화되었습니다.')
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    // TODO: 실제 다크모드 구현
  }

  const changeLanguage = (languageCode: string) => {
    i18n.changeLanguage(languageCode)
    setShowLanguageDropdown(false)
    showToast('success', t('settings.languageChanged'))
  }

  // 사용자 ID 변경 시작
  const startEditingUserId = () => {
    setIsEditingUserId(true)
    setNewUserId('')
    setUserIdError('')
  }

  // 사용자 ID 변경 취소
  const cancelEditingUserId = () => {
    setIsEditingUserId(false)
    setNewUserId('')
    setUserIdError('')
  }

  // 사용자 ID 입력 검증
  const handleUserIdInput = (value: string) => {
    setNewUserId(value)
    setUserIdError('')
    
    if (value && !/^[a-zA-Z0-9]{0,29}$/.test(value)) {
      setUserIdError('사용자 ID는 영문+숫자만 사용할 수 있습니다.')
    }
  }

  // 사용자 ID 변경 확인
  const confirmChangeUserId = async () => {
    if (!newUserId.trim()) {
      setUserIdError('사용자 ID를 입력해주세요.')
      return
    }

    // ID 형식 검사 (영문+숫자 8~29자)
    if (!/^[a-zA-Z0-9]{8,29}$/.test(newUserId)) {
      setUserIdError('사용자 ID는 영문+숫자 8자리 이상 30자리 미만이어야 합니다.')
      return
    }

    // 사용 가능 여부 검사
    if (!isUserIdAvailable(newUserId)) {
      setUserIdError('이미 사용 중인 사용자 ID입니다.')
      return
    }

    setIsChangingUserId(true)
    setUserIdError('')

    try {
      const success = await changeUserId(newUserId)
      if (success) {
        setIsEditingUserId(false)
        setNewUserId('')
        showToast('success', t('settings.userIdChanged'))
      } else {
        setUserIdError(t('settings.userIdChangeFailed'))
      }
    } catch (error) {
      setUserIdError(t('settings.userIdChangeFailed'))
    } finally {
      setIsChangingUserId(false)
    }
  }

  // 사용자 이름 변경 시작
  const startEditingUserName = () => {
    setIsEditingUserName(true)
    setNewUserName(user?.name || '')
    setUserNameError('')
  }
  // 사용자 이름 변경 취소
  const cancelEditingUserName = () => {
    setIsEditingUserName(false)
    setNewUserName('')
    setUserNameError('')
  }
  // 사용자 이름 변경 확인
  const confirmChangeUserName = async () => {
    if (!newUserName.trim()) {
      setUserNameError('이름을 입력해주세요.')
      return
    }
    setIsChangingUserName(true)
    setUserNameError('')
    try {
      const success = await changeUserName(newUserName.trim())
      if (success) {
        setIsEditingUserName(false)
        setNewUserName('')
      } else {
        setUserNameError('이름 변경에 실패했습니다.')
      }
    } catch {
      setUserNameError('이름 변경 중 오류가 발생했습니다.')
    } finally {
      setIsChangingUserName(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Settings className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('settings.title')}
          </h1>
        </div>

        {/* 사용자 정보 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('settings.my')} {t('settings.accountSettings')}
            </h2>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">{t('auth.email')}</span>
              <span className="font-medium text-gray-900 dark:text-white">{user?.email}</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">{t('settings.name') || '이름'}</span>
              <div className="flex items-center gap-2">
                {isEditingUserName ? (
                  <>
                    <input
                      type="text"
                      value={newUserName}
                      onChange={e => setNewUserName(e.target.value)}
                      placeholder="이름을 입력하세요"
                      className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      disabled={isChangingUserName}
                    />
                    <button
                      onClick={confirmChangeUserName}
                      disabled={isChangingUserName || !!userNameError}
                      className="p-1 text-green-600 hover:text-green-700 disabled:opacity-50"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={cancelEditingUserName}
                      disabled={isChangingUserName}
                      className="p-1 text-red-600 hover:text-red-700 disabled:opacity-50"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <span className="font-medium text-gray-900 dark:text-white">{user?.name || '이름없음'}</span>
                    <button
                      onClick={startEditingUserName}
                      className="p-1 text-blue-600 hover:text-blue-700"
                      title="이름 변경"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
            
            {userNameError && (
              <div className="text-red-600 dark:text-red-400 text-sm py-1">
                {userNameError}
              </div>
            )}
            
            <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">{t('settings.userId')}</span>
              <div className="flex items-center gap-2">
                {isEditingUserId ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newUserId}
                      onChange={(e) => handleUserIdInput(e.target.value)}
                      placeholder="영문+숫자 8자리 이상 30자리 미만"
                      className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      disabled={isChangingUserId}
                      maxLength={29}
                    />
                    <button
                      onClick={confirmChangeUserId}
                      disabled={isChangingUserId || !!userIdError}
                      className="p-1 text-green-600 hover:text-green-700 disabled:opacity-50"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={cancelEditingUserId}
                      disabled={isChangingUserId}
                      className="p-1 text-red-600 hover:text-red-700 disabled:opacity-50"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="font-mono text-sm text-gray-900 dark:text-white">{user?.id}</span>
                    <button
                      onClick={startEditingUserId}
                      className="p-1 text-blue-600 hover:text-blue-700"
                      title="사용자 ID 변경"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
            
            {userIdError && (
              <div className="text-red-600 dark:text-red-400 text-sm py-1">
                {userIdError}
              </div>
            )}
            
            <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">사용자 번호</span>
              <span className="font-mono text-sm text-gray-900 dark:text-white">
                {user?.userNumber || 'N/A'}
              </span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">{t('settings.signUpDate')}</span>
              <span className="text-gray-900 dark:text-white">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
              </span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">{t('settings.lastUpdate')}</span>
              <span className="text-gray-900 dark:text-white">
                {user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : '-'}
              </span>
            </div>
          </div>
        </div>

        {/* 앱 설정 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('settings.title')}
            </h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                {isDarkMode ? <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" /> : <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />}
                <span className="text-gray-900 dark:text-white">{t('settings.darkMode')}</span>
              </div>
              <button
                onClick={toggleDarkMode}
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-700 transition-colors"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isDarkMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className="text-gray-900 dark:text-white">{t('settings.languageSettings')}</span>
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                  className="flex items-center gap-2 px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  <span className="text-lg">{currentLanguage.flag}</span>
                  <span>{currentLanguage.nativeName}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showLanguageDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {showLanguageDropdown && (
                  <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10 max-h-60 overflow-y-auto">
                    {languages.map((language) => (
                      <button
                        key={language.code}
                        onClick={() => changeLanguage(language.code)}
                        className={`flex items-center gap-3 w-full px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                          language.code === currentLanguage.code
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                            : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <span className="text-lg">{language.flag}</span>
                        <span className="flex-1 text-left">{language.nativeName}</span>
                        {language.code === currentLanguage.code && (
                          <Check className="w-4 h-4" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 개발자 섹션 (숨겨진 기능) */}
        <div className="mb-8">
          <button
            onClick={() => setShowDevSection(!showDevSection)}
            className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            {showDevSection ? '개발자 섹션 숨기기' : '개발자 섹션 보기'}
          </button>
          
          {showDevSection && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <h3 className="text-sm font-semibold text-red-800 dark:text-red-200">
                  개발자 도구
                </h3>
              </div>
              
              <div className="space-y-2">
                <button
                  onClick={handleClearAllData}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm flex items-center justify-center"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  모든 태스크 데이터 삭제
                </button>
                
                <button
                  onClick={() => {
                    const { migrateToUserNumber } = useTaskStore.getState()
                    migrateToUserNumber()
                    showToast('success', '데이터 마이그레이션이 완료되었습니다.')
                  }}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center justify-center"
                >
                  <Database className="w-4 h-4 mr-2" />
                  userId → userNumber 마이그레이션
                </button>
                
                <p className="text-xs text-red-600 dark:text-red-400">
                  ⚠️ 이 작업은 되돌릴 수 없습니다. 테스트 목적으로만 사용하세요.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 로그아웃 */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center"
          >
            <LogOut className="w-4 h-4 mr-2" />
            {t('settings.logout')}
          </button>
        </div>
      </div>
    </div>
  )
} 