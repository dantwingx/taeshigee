import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthState, AuthActions, LoginCredentials, RegisterCredentials } from '@/types/auth'

interface AuthStore extends AuthState, AuthActions {}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null })
        
        try {
          // TODO: 실제 API 호출로 대체
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          // 이메일 기반으로 고유한 사용자 ID 생성
          const userId = btoa(credentials.email).replace(/[^a-zA-Z0-9]/g, '').substring(0, 8)
          
          // 임시 사용자 데이터 (실제로는 API 응답에서 받아옴)
          const mockUser = {
            id: userId,
            email: credentials.email,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
          
          console.log(`[AuthStore] 로그인 성공: ${credentials.email} (ID: ${userId})`)
          
          set({
            user: mockUser,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })

          // 태스크 스토어에 현재 사용자 설정
          // 동적 import로 순환 참조 방지
          const { useTaskStore } = await import('./taskStore')
          const taskStore = useTaskStore.getState()
          taskStore.setCurrentUser(mockUser.id)
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : '로그인에 실패했습니다.',
          })
        }
      },

      register: async (credentials: RegisterCredentials) => {
        set({ isLoading: true, error: null })
        
        try {
          // 비밀번호 확인 검증
          if (credentials.password !== credentials.confirmPassword) {
            throw new Error('비밀번호가 일치하지 않습니다.')
          }
          
          // TODO: 실제 API 호출로 대체
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          // 이메일 기반으로 고유한 사용자 ID 생성
          const userId = btoa(credentials.email).replace(/[^a-zA-Z0-9]/g, '').substring(0, 8)
          
          // 임시 사용자 데이터 (실제로는 API 응답에서 받아옴)
          const mockUser = {
            id: userId,
            email: credentials.email,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
          
          console.log(`[AuthStore] 회원가입 성공: ${credentials.email} (ID: ${userId})`)
          
          set({
            user: mockUser,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })

          // 태스크 스토어에 현재 사용자 설정
          const { useTaskStore } = await import('./taskStore')
          const taskStore = useTaskStore.getState()
          taskStore.setCurrentUser(mockUser.id)
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : '회원가입에 실패했습니다.',
          })
        }
      },

      logout: () => {
        // 태스크 스토어에서 현재 사용자 정리
        import('./taskStore').then(({ useTaskStore }) => {
          const taskStore = useTaskStore.getState()
          taskStore.clearCurrentUser()
        })

        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        })
      },

      clearError: () => {
        set({ error: null })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
) 