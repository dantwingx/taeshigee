import { useAuthStore } from '@/stores/authStore'

// 다크모드 초기화 (앱 시작 시 호출)
export function initializeDarkMode(): void {
  // 1. localStorage에서 저장된 설정 확인 (사용자 설정 우선)
  const savedDarkMode = localStorage.getItem('darkMode')
  
  if (savedDarkMode !== null) {
    // localStorage에 저장된 설정이 있으면 그것을 사용
    applyDarkMode(savedDarkMode === 'true')
    return
  }
  
  // 2. localStorage에 없으면 시스템 설정을 확인
  const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  applyDarkMode(isSystemDark)
}

// 인증 후 사용자 설정과 동기화
export function syncDarkModeWithUserSettings(): void {
  try {
    const { getUserSettings } = useAuthStore.getState()
    const userSettings = getUserSettings()
    
    if (userSettings?.darkMode !== undefined) {
      applyDarkMode(userSettings.darkMode)
    }
  } catch (error) {
    console.warn('Failed to sync dark mode with user settings:', error)
  }
}

// 다크모드 적용 (사용자 설정 우선)
export function applyDarkMode(isDark: boolean): void {
  const root = document.documentElement
  
  if (isDark) {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
  
  // localStorage에 저장 (사용자 설정이 우선)
  localStorage.setItem('darkMode', isDark.toString())
}

// 현재 다크모드 상태 확인
export function isDarkModeEnabled(): boolean {
  return document.documentElement.classList.contains('dark')
}

// 시스템 다크모드 변경 감지
export function watchSystemDarkMode(): () => void {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  
  const handleChange = (e: MediaQueryListEvent) => {
    // 사용자가 명시적으로 설정하지 않은 경우에만 시스템 설정을 따름
    const savedDarkMode = localStorage.getItem('darkMode')
    if (savedDarkMode === null) {
      applyDarkMode(e.matches)
    }
  }
  
  mediaQuery.addEventListener('change', handleChange)
  
  // 클린업 함수 반환
  return () => mediaQuery.removeEventListener('change', handleChange)
}

 