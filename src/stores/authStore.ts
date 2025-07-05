import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthState, AuthActions, LoginCredentials, RegisterCredentials } from '@/types/auth'

interface AuthStore extends AuthState, AuthActions {}

// 사용자 ID 생성 규칙: 영문+숫자, 6자 이상 30자 미만
function generateRandomUserId(): string {
  // 8~12자리 랜덤 영문+숫자 (6자 이상 29자 미만 보장)
  const length = Math.floor(Math.random() * 7) + 8 // 8~14자리
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let id = ''
  for (let i = 0; i < length; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return id
}

// 사용자 ID 유효성 검사 함수 (영문+숫자, 6자 이상 30자 미만)
function isValidUserId(userId: string): boolean {
  return /^[a-zA-Z0-9]{6,29}$/.test(userId)
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      nextUserId: 1,
      nextUserNumber: 1, // 사용자 번호 관리
      usedUserIds: new Set<string>(),
      registeredEmails: new Set<string>(), // 등록된 이메일 목록 추가

      // Actions
      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null })
        
        try {
          // TODO: 실제 API 호출로 대체
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          const { nextUserId, nextUserNumber, usedUserIds } = get()
          
          // 일련번호 기반 사용자 ID 생성
          const userId = generateRandomUserId()
          
          // 임시 사용자 데이터 (실제로는 API 응답에서 받아옴)
          const mockUser = {
            id: userId,
            userNumber: nextUserNumber, // 사용자 번호 할당
            email: credentials.email,
            name: 'No Name', // 기본값
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
          
          console.log(`[AuthStore] 로그인 성공: ${credentials.email} (ID: ${userId}, Number: ${nextUserNumber})`)
          
          set({
            user: mockUser,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            nextUserId: nextUserId + 1,
            nextUserNumber: nextUserNumber + 1, // 다음 사용자 번호 증가
            usedUserIds: new Set([...usedUserIds, userId]),
          })

          // 태스크 스토어에 현재 사용자 설정 - 동기적으로 처리
          const { useTaskStore } = await import('./taskStore')
          const taskStore = useTaskStore.getState()
          taskStore.setCurrentUser(mockUser.id, mockUser.userNumber)
          console.log(`[AuthStore] taskStore currentUser 설정 완료: ${mockUser.id}, ${mockUser.userNumber}`)
          
          // 설정 확인
          const verifyCurrentUser = useTaskStore.getState()
          console.log(`[AuthStore] currentUser 설정 확인: ${verifyCurrentUser.currentUserId}, ${verifyCurrentUser.currentUserNumber}`)
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
          
          // 이메일 중복 검증
          const { registeredEmails } = get()
          if (registeredEmails.has(credentials.email)) {
            throw new Error('이미 등록된 이메일입니다.')
          }
          
          // TODO: 실제 API 호출로 대체
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          const { nextUserId, nextUserNumber, usedUserIds } = get()
          
          // 새로운 ID 생성
          const newUserId = generateRandomUserId()
          
          // 임시 사용자 데이터 (실제로는 API 응답에서 받아옴)
          const mockUser = {
            id: newUserId,
            userNumber: nextUserNumber, // 사용자 번호 할당
            email: credentials.email,
            name: 'No Name', // 기본값
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
          
          console.log(`[AuthStore] 회원가입 성공: ${credentials.email} (ID: ${newUserId}, Number: ${nextUserNumber})`)
          
          set({
            user: mockUser,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            nextUserId: nextUserId + 1,
            nextUserNumber: nextUserNumber + 1, // 다음 사용자 번호 증가
            usedUserIds: new Set([...usedUserIds, newUserId]),
            registeredEmails: new Set([...registeredEmails, credentials.email]), // 이메일 등록
          })

          // 태스크 스토어에 현재 사용자 설정
          const { useTaskStore } = await import('./taskStore')
          const taskStore = useTaskStore.getState()
          taskStore.setCurrentUser(newUserId, nextUserNumber)
          console.log(`[AuthStore] taskStore currentUser 설정 완료: ${newUserId}, ${nextUserNumber}`)
          
          // 설정 확인
          const verifyCurrentUser = useTaskStore.getState()
          console.log(`[AuthStore] currentUser 설정 확인: ${verifyCurrentUser.currentUserId}, ${verifyCurrentUser.currentUserNumber}`)
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
          taskStore.setCurrentUser(null, null)
          console.log('[AuthStore] taskStore currentUser 초기화 완료')
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

      // 이메일 사용 가능 여부 확인
      isEmailAvailable: (email: string): boolean => {
        const { registeredEmails } = get()
        return !registeredEmails.has(email)
      },

      // 사용자 ID 변경 기능
      changeUserId: async (newUserId: string): Promise<boolean> => {
        const { user, usedUserIds } = get()
        
        if (!user) {
          console.error('[AuthStore] 사용자 정보가 없습니다.')
          return false
        }

        // ID 형식 검사
        if (!isValidUserId(newUserId)) {
          console.error('[AuthStore] 사용자 ID는 영문+숫자 6자 이상 30자 미만이어야 합니다.')
          return false
        }

        // 이미 사용 중인 ID인지 확인
        if (usedUserIds.has(newUserId)) {
          console.error('[AuthStore] 이미 사용 중인 사용자 ID입니다.')
          return false
        }

        try {
          // TODO: 실제 API 호출로 대체
          await new Promise(resolve => setTimeout(resolve, 500))
          
          const oldUserId = user.id
          
          // 사용자 정보 업데이트 (userNumber는 변경하지 않음)
          const updatedUser = {
            ...user,
            id: newUserId,
            updatedAt: new Date().toISOString(),
          }
          
          // 사용된 ID 목록 업데이트
          const newUsedUserIds = new Set(usedUserIds)
          newUsedUserIds.delete(oldUserId) // 기존 ID 제거
          newUsedUserIds.add(newUserId)    // 새 ID 추가
          
          set({
            user: updatedUser,
            usedUserIds: newUsedUserIds,
          })

          // 태스크 스토어의 currentUser도 업데이트 (userNumber는 유지)
          const { useTaskStore } = await import('./taskStore')
          const taskStore = useTaskStore.getState()
          taskStore.setCurrentUser(newUserId, user.userNumber) // userNumber는 변경하지 않음
          
          console.log(`[AuthStore] 사용자 ID 변경 성공: ${oldUserId} -> ${newUserId} (userNumber: ${user.userNumber})`)
          return true
        } catch (error) {
          console.error('[AuthStore] 사용자 ID 변경 실패:', error)
          return false
        }
      },

      // 사용자 ID 사용 가능 여부 확인
      isUserIdAvailable: (userId: string): boolean => {
        const { usedUserIds } = get()
        
        // ID 형식 검사
        if (!isValidUserId(userId)) {
          return false
        }
        
        // 이미 사용 중인지 확인
        return !usedUserIds.has(userId)
      },

      // 사용자 이름 변경 기능
      changeUserName: async (newName: string): Promise<boolean> => {
        const { user } = get()
        if (!user) return false
        if (!newName.trim()) return false
        try {
          await new Promise(resolve => setTimeout(resolve, 300))
          set({
            user: {
              ...user,
              name: newName,
              updatedAt: new Date().toISOString(),
            },
          })
          return true
        } catch {
          return false
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        nextUserId: state.nextUserId,
        nextUserNumber: state.nextUserNumber, // 사용자 번호 추가
        usedUserIds: Array.from(state.usedUserIds), // Set을 배열로 변환하여 저장
        registeredEmails: Array.from(state.registeredEmails), // Set을 배열로 변환하여 저장
      }),
      onRehydrateStorage: () => (state) => {
        // 로그인 상태 복원 시 taskStore의 currentUserId도 복원
        if (state?.user?.id) {
          import('./taskStore').then(({ useTaskStore }) => {
            const taskStore = useTaskStore.getState()
            taskStore.setCurrentUser(state.user!.id, state.user!.userNumber) // 사용자 번호도 복원
            console.log(`[AuthStore] onRehydrateStorage: taskStore currentUser 복원 완료: ${state.user!.id}, ${state.user!.userNumber}`)
            
            // 복원 확인
            const verifyCurrentUser = useTaskStore.getState()
            console.log(`[AuthStore] onRehydrateStorage: currentUser 복원 확인: ${verifyCurrentUser.currentUserId}, ${verifyCurrentUser.currentUserNumber}`)
          })
        } else {
          console.log('[AuthStore] onRehydrateStorage: 사용자 정보가 없어 currentUserId 복원하지 않음')
        }
        
        // usedUserIds를 Set으로 변환
        if (state && Array.isArray(state.usedUserIds)) {
          state.usedUserIds = new Set(state.usedUserIds)
        }
        
        // registeredEmails를 Set으로 변환
        if (state && Array.isArray(state.registeredEmails)) {
          state.registeredEmails = new Set(state.registeredEmails)
        }
      },
    }
  )
) 