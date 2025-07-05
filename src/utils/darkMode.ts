import { useAuthStore } from '@/stores/authStore'

// 다크모드 초기화 (앱 시작 시 호출)
export function initializeDarkMode(): void {
  const { getUserSettings } = useAuthStore.getState()
  const userSettings = getUserSettings()
  
  if (userSettings?.darkMode !== undefined) {
    // 사용자 설정이 있으면 그것을 사용
    applyDarkMode(userSettings.darkMode)
  } else {
    // 사용자 설정이 없으면 시스템 설정을 확인
    const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    applyDarkMode(isSystemDark)
  }
}

// 다크모드 적용
export function applyDarkMode(isDark: boolean): void {
  const root = document.documentElement
  
  if (isDark) {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
  
  // localStorage에 저장 (시스템 설정용)
  localStorage.setItem('darkMode', isDark.toString())
}

// 현재 다크모드 상태 확인
export function isDarkModeEnabled(): boolean {
  return document.documentElement.classList.contains('dark')
}

// 사용자 설정과 동기화
export function syncDarkModeWithUserSettings(): void {
  const { getUserSettings } = useAuthStore.getState()
  const userSettings = getUserSettings()
  
  if (userSettings?.darkMode !== undefined) {
    applyDarkMode(userSettings.darkMode)
  }
} 