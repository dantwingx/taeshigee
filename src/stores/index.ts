import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface DarkModeState {
  isDarkMode: boolean
  toggleDarkMode: () => void
  setDarkMode: (isDark: boolean) => void
}

export const useDarkModeStore = create<DarkModeState>()(
  persist(
    (set) => ({
      isDarkMode: false,
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      setDarkMode: (isDark) => set({ isDarkMode: isDark }),
    }),
    {
      name: 'dark-mode-storage',
    }
  )
)

export { useAuthStore } from './authStore'
export { useTaskStore } from './taskStore'
export { useTagStore } from './tagStore'
export { useToastStore } from './toastStore' 