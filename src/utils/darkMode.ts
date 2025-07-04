export function applyDarkMode(isDark: boolean) {
  const root = document.documentElement
  
  if (isDark) {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

export function initializeDarkMode() {
  // 시스템 다크모드 감지
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  
  // 저장된 설정이 있으면 사용, 없으면 시스템 설정 사용
  const savedDarkMode = localStorage.getItem('dark-mode-storage')
  if (savedDarkMode) {
    try {
      const parsed = JSON.parse(savedDarkMode)
      applyDarkMode(parsed.state?.isDarkMode || false)
    } catch {
      applyDarkMode(mediaQuery.matches)
    }
  } else {
    applyDarkMode(mediaQuery.matches)
  }
  
  // 시스템 설정 변경 감지
  mediaQuery.addEventListener('change', (e) => {
    const savedDarkMode = localStorage.getItem('dark-mode-storage')
    if (!savedDarkMode) {
      applyDarkMode(e.matches)
    }
  })
} 