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
          
          // 임시 사용자 데이터 (실제로는 API 응답에서 받아옴)
          const mockUser = {
            id: '1',
            email: credentials.email,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
          
          set({
            user: mockUser,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
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
          
          // 임시 사용자 데이터 (실제로는 API 응답에서 받아옴)
          const mockUser = {
            id: '1',
            email: credentials.email,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
          
          set({
            user: mockUser,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : '회원가입에 실패했습니다.',
          })
        }
      },

      logout: () => {
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