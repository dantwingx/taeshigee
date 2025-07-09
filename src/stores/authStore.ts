import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, UserSettings } from '@/types/auth'
import { useTaskStore } from '@/stores/taskStore'
import { changeLanguage } from '@/i18n'
import { applyDarkMode } from '@/utils/darkMode'
import { authService } from '@/services/authService'
import { userService } from '@/services/userService'

interface AuthState {
  currentUser: User | null
  currentUserId: string | null
  currentUserNumber: number | null
  isLoading: boolean
  error: string | null
  
  // Actions
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  changeUserId: (newUserId: string) => Promise<{ success: boolean; error?: string }>
  changeUserName: (newName: string) => Promise<{ success: boolean; error?: string }>
  createTestAccount: () => void
  
  // User Settings Actions
  updateUserSettings: (settings: Partial<UserSettings>) => Promise<{ success: boolean; error?: string }>
  getUserSettings: () => UserSettings | null
  setCurrentUser: (user: User) => void
  clearError: () => void
  initializeAuth: () => Promise<void>
}

const DEFAULT_USER_SETTINGS: UserSettings = {
  darkMode: false,
  language: 'ko'
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      currentUserId: null,
      currentUserNumber: null,
      isLoading: false,
      error: null,

      setCurrentUser: (user) => set({ currentUser: user }),

      clearError: () => set({ error: null }),

      initializeAuth: async () => {
        const token = authService.getToken()
        if (token && authService.isAuthenticated()) {
          try {
            set({ isLoading: true, error: null })
            const response = await authService.getCurrentUser()
            if (response.success && response.user) {
              const user = response.user
              // userSettings 매핑
              const userSettings = {
                language: user.language ?? 'ko',
                darkMode: user.darkMode ?? false,
              }
              set({ 
                currentUser: { ...user, userSettings }, 
                currentUserId: user.id,
                currentUserNumber: user.userNumber,
                isLoading: false 
              })
              useTaskStore.getState().setCurrentUser(user.id, user.userNumber)
              
              // 사용자 설정 적용 (백엔드에서 가져온 값 우선)
              if (userSettings.language) {
                changeLanguage(userSettings.language)
              }
              if (userSettings.darkMode !== undefined) {
                applyDarkMode(userSettings.darkMode)
              }
            }
          } catch (error) {
            console.error('Failed to initialize auth:', error)
            authService.removeToken()
            set({ 
              currentUser: null, 
              currentUserId: null, 
              currentUserNumber: null, 
              isLoading: false 
            })
          }
        } else {
          // 인증되지 않은 경우 localStorage 기반 초기화
          const savedDarkMode = localStorage.getItem('darkMode')
          const savedLanguage = localStorage.getItem('i18nextLng')
          
          if (savedDarkMode !== null) {
            applyDarkMode(savedDarkMode === 'true')
          } else {
            // 시스템 설정 확인
            const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            applyDarkMode(isSystemDark)
          }
          
          if (savedLanguage) {
            changeLanguage(savedLanguage)
          }
        }
      },

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null })
        try {
          console.log('authStore login called', email, password)
          
          const response = await authService.login({ email, password })
          
          if (response.success && response.token && response.user) {
            // 토큰 저장
            authService.saveToken(response.token)
            
            const user = response.user
            
            // userSettings 매핑
            const userSettings = {
              language: user.language ?? 'ko',
              darkMode: user.darkMode ?? false,
            }
            set({ 
              currentUser: { ...user, userSettings }, 
              currentUserId: user.id,
              currentUserNumber: user.userNumber,
              isLoading: false,
              error: null
            })
            
            // taskStore 동기화
            useTaskStore.getState().setCurrentUser(user.id, user.userNumber)
            
            // 로그인 시 사용자 설정 적용
            if (userSettings.language) {
              changeLanguage(userSettings.language)
            }
            if (userSettings.darkMode !== undefined) {
              applyDarkMode(userSettings.darkMode)
            }
            
            console.log('authStore login success', user)
            return { success: true }
          } else {
            throw new Error('Login failed')
          }
        } catch (error: any) {
          let errorMessage = '로그인에 실패했습니다.';
          // 서버에서 내려온 에러가 객체라면
          if (error && typeof error === 'object') {
            // 서버 표준 에러 객체
            if (error.code === 'INVALID_CREDENTIALS') {
              errorMessage = 'auth.invalidCredentials';
            } else if (typeof error.message === 'string') {
              errorMessage = error.message;
            }
          } else if (typeof error === 'string') {
            errorMessage = error;
          } else if (error instanceof Error) {
            errorMessage = error.message;
          }
          set({ 
            error: errorMessage, 
            isLoading: false 
          })
          console.error('authStore login error:', error)
          return { success: false, error: errorMessage }
        }
      },

      register: async (email: string, password: string, name: string) => {
        set({ isLoading: true, error: null })
        try {
          console.log('authStore register called', email, password, name)
          
          const response = await authService.register({ email, password, confirmPassword: password })
          
          if (response.success && response.token && response.user) {
            // 토큰 저장
            authService.saveToken(response.token)
            
            const user = response.user
            
            // userSettings 매핑
            const userSettings = {
              language: user.language ?? 'ko',
              darkMode: user.darkMode ?? false,
            }
            set({
              currentUser: { ...user, userSettings },
              currentUserId: user.id,
              currentUserNumber: user.userNumber,
              isLoading: false,
              error: null
            })
            
            // taskStore 동기화
            useTaskStore.getState().setCurrentUser(user.id, user.userNumber)
            
            // 회원가입 시 사용자 설정 적용
            if (userSettings.language) {
              changeLanguage(userSettings.language)
            }
            if (userSettings.darkMode !== undefined) {
              applyDarkMode(userSettings.darkMode)
            }

            console.log('authStore register success', user)
            return { success: true }
          } else {
            throw new Error('Registration failed')
          }
        } catch (error: any) {
          let errorMessage = '회원가입에 실패했습니다.';
          // 서버에서 내려온 에러가 객체라면
          if (error && typeof error === 'object') {
            if (error.code === 'EMAIL_ALREADY_EXISTS') {
              errorMessage = 'auth.emailAlreadyExists';
            } else if (typeof error.message === 'string') {
              errorMessage = error.message;
            }
          } else if (typeof error === 'string') {
            errorMessage = error;
          } else if (error instanceof Error) {
            errorMessage = error.message;
          }
          set({ 
            error: errorMessage, 
            isLoading: false 
          })
          console.error('authStore register error:', error)
          return { success: false, error: errorMessage }
        }
      },

      logout: () => {
        authService.removeToken()
        set({ 
          currentUser: null, 
          currentUserId: null, 
          currentUserNumber: null,
          error: null 
        })
        useTaskStore.getState().setCurrentUser(null, null)
      },

      changeUserId: async (newUserId: string) => {
        const { currentUser } = get()
        
        if (!currentUser) {
          return { success: false, error: 'No user logged in' }
        }

        // 실제 API에서는 user ID 변경이 제한적일 수 있으므로 
        // 현재는 로컬 상태만 업데이트
        const updatedUser = { ...currentUser, id: newUserId, lastUpdated: new Date().toISOString() }

        set({
          currentUser: updatedUser,
          currentUserId: updatedUser.id,
        })
        useTaskStore.getState().setCurrentUser(updatedUser.id, updatedUser.userNumber)

        return { success: true }
      },

      changeUserName: async (newName: string) => {
        const { currentUser } = get()
        
        if (!currentUser) {
          return { success: false, error: 'No user logged in' }
        }

        if (!newName.trim()) {
          return { success: false, error: 'Name cannot be empty' }
        }

        try {
          set({ isLoading: true, error: null })
          
          console.log('[AuthStore] Changing user name to:', newName)
          console.log('[AuthStore] Current user ID:', currentUser.id)
          
          // API 호출하여 이름 변경
          const response = await userService.updateUserName(newName.trim())
          
          if (response.success && response.settings) {
            const updatedUser = { 
              ...currentUser, 
              name: response.settings.name || newName.trim(),
              lastUpdated: new Date().toISOString()
            }

            set({
              currentUser: updatedUser,
              isLoading: false,
              error: null
            })

            console.log('[AuthStore] User name changed successfully:', updatedUser.name)
            return { success: true }
          } else {
            throw new Error('Failed to update user name')
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : '이름 변경에 실패했습니다.'
          console.error('[AuthStore] Name change error:', error)
          set({ 
            error: errorMessage, 
            isLoading: false 
          })
          return { success: false, error: errorMessage }
        }
      },

      createTestAccount: () => {
        // 테스트 계정 생성은 개발 환경에서만 사용
        const testUser: User = {
          id: 'test-user-id',
          userNumber: 999,
          email: 'test@example.com',
          password: 'test123',
          name: '테스트 사용자',
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
          userSettings: { ...DEFAULT_USER_SETTINGS }
        }

        set({
          currentUser: testUser,
          currentUserId: testUser.id,
          currentUserNumber: testUser.userNumber
        })
        
        useTaskStore.getState().setCurrentUser(testUser.id, testUser.userNumber)
      },

      updateUserSettings: async (settings: Partial<UserSettings>) => {
        const { currentUser } = get()
        
        if (!currentUser) {
          return { success: false, error: 'No user logged in' }
        }

        try {
          set({ isLoading: true, error: null })
          
          const response = await userService.updateSettings(settings)
          
          if (response.success) {
            const updatedUser = {
              ...currentUser,
              userSettings: { ...currentUser.userSettings, ...response.settings }
            }
            
            set({
              currentUser: updatedUser,
              isLoading: false,
              error: null
            })

            // 설정 즉시 적용
            if (settings.language) {
              changeLanguage(settings.language)
            }
            if (settings.darkMode !== undefined) {
              applyDarkMode(settings.darkMode)
            }

            return { success: true }
          } else {
            throw new Error('Failed to update settings')
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : '설정 업데이트에 실패했습니다.'
          set({ 
            error: errorMessage, 
            isLoading: false 
          })
          return { success: false, error: errorMessage }
        }
      },

      getUserSettings: () => {
        const { currentUser } = get()
        return currentUser?.userSettings || DEFAULT_USER_SETTINGS
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        currentUser: state.currentUser,
        currentUserId: state.currentUserId,
        currentUserNumber: state.currentUserNumber
      }),
    }
  )
) 