import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, UserSettings } from '@/types/auth'
import { useTaskStore } from '@/stores/taskStore'

interface AuthState {
  currentUser: User | null
  currentUserId: string | null
  currentUserNumber: number | null
  users: User[]
  nextUserNumber: number
  registeredEmails: Set<string>
  
  // Actions
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  changeUserId: (newUserId: string) => Promise<{ success: boolean; error?: string }>
  changeUserName: (newName: string) => Promise<{ success: boolean; error?: string }>
  isUserIdAvailable: (userId: string) => boolean
  isEmailAvailable: (email: string) => boolean
  createTestAccount: () => void
  
  // User Settings Actions
  updateUserSettings: (settings: Partial<UserSettings>) => Promise<{ success: boolean; error?: string }>
  getUserSettings: () => UserSettings | null
  setCurrentUser: (user: User) => void
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
      users: [],
      nextUserNumber: 1,
      registeredEmails: new Set(),
      setCurrentUser: (user) => set({ currentUser: user }),

      login: async (email: string, password: string) => {
        console.log('authStore login called', email, password)
        const { users } = get()
        const user = users.find(u => u.email === email)
        
        if (!user) {
          console.error('User not found:', email)
          return { success: false, error: 'User not found' }
        }
        
        if (user.password !== password) {
          console.error('Invalid password for:', email)
          return { success: false, error: 'Invalid password' }
        }

        // 사용자 설정이 없으면 기본 설정 생성
        if (!user.userSettings) {
          user.userSettings = { ...DEFAULT_USER_SETTINGS }
        }

        set({ 
          currentUser: user, 
          currentUserId: user.id,
          currentUserNumber: user.userNumber,
        })
        // taskStore 동기화
        useTaskStore.getState().setCurrentUser(user.id, user.userNumber)
        
        console.log('authStore login success', user)
        return { success: true }
      },

      register: async (email: string, password: string, name: string) => {
        console.log('authStore register called', email, password, name)
        const { users, nextUserNumber, registeredEmails } = get()
        
        // 이메일 중복 체크 (대소문자 무시)
        const emailLower = email.toLowerCase()
        const isDuplicate = users.some(u => u.email.toLowerCase() === emailLower)
        if (isDuplicate) {
          console.error('Email already registered:', email)
          return { success: false, error: '이미 가입된 이메일입니다.' }
        }

        const newUser: User = {
          id: generateUserId(),
          userNumber: nextUserNumber,
          email,
          password,
          name,
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
          userSettings: { ...DEFAULT_USER_SETTINGS }
        }

        const updatedUsers = [...users, newUser]
        const updatedEmails = new Set(registeredEmails).add(email)

        set({
          users: updatedUsers,
          currentUser: newUser,
          currentUserId: newUser.id,
          currentUserNumber: newUser.userNumber,
          nextUserNumber: nextUserNumber + 1,
          registeredEmails: updatedEmails
        })
        // taskStore 동기화
        useTaskStore.getState().setCurrentUser(newUser.id, newUser.userNumber)

        console.log('authStore register success', newUser)
        return { success: true }
      },

      logout: () => {
        set({ currentUser: null, currentUserId: null, currentUserNumber: null })
        useTaskStore.getState().setCurrentUser(null, null)
      },

      changeUserId: async (newUserId: string) => {
        const { currentUser, users, isUserIdAvailable } = get()
        
        if (!currentUser) {
          return { success: false, error: 'No user logged in' }
        }

        if (!isUserIdAvailable(newUserId)) {
          return { success: false, error: 'User ID already exists' }
        }

        const updatedUser = { ...currentUser, id: newUserId, lastUpdated: new Date().toISOString() }
        const updatedUsers = users.map(u => u.id === currentUser.id ? updatedUser : u)

        set({
          currentUser: updatedUser,
          users: updatedUsers,
          currentUserId: updatedUser.id,
        })
        useTaskStore.getState().setCurrentUser(updatedUser.id, updatedUser.userNumber)

        return { success: true }
      },

      changeUserName: async (newName: string) => {
        const { currentUser, users } = get()
        
        if (!currentUser) {
          return { success: false, error: 'No user logged in' }
        }

        if (!newName.trim()) {
          return { success: false, error: 'Name cannot be empty' }
        }

        const updatedUser = { ...currentUser, name: newName.trim(), lastUpdated: new Date().toISOString() }
        const updatedUsers = users.map(u => u.id === currentUser.id ? updatedUser : u)

        set({
          currentUser: updatedUser,
          users: updatedUsers
        })

        return { success: true }
      },

      isUserIdAvailable: (userId: string) => {
        const { users } = get()
        return !users.some(u => u.id === userId)
      },

      isEmailAvailable: (email: string) => {
        const { registeredEmails } = get()
        return !registeredEmails.has(email)
      },

      createTestAccount: () => {
        const { users, nextUserNumber, registeredEmails } = get()
        
        const testUser: User = {
          id: 'test_user',
          userNumber: nextUserNumber,
          email: 'test@example.com',
          password: 'password',
          name: 'Test User',
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
          userSettings: { ...DEFAULT_USER_SETTINGS }
        }

        const updatedUsers = [...users, testUser]
        const updatedEmails = new Set(registeredEmails).add(testUser.email)

        set({
          users: updatedUsers,
          currentUser: testUser,
          currentUserId: testUser.id,
          nextUserNumber: nextUserNumber + 1,
          registeredEmails: updatedEmails
        })
      },

      // User Settings Actions
      updateUserSettings: async (settings: Partial<UserSettings>) => {
        const { currentUser, users } = get()
        
        if (!currentUser) {
          return { success: false, error: 'No user logged in' }
        }

        const currentSettings = currentUser.userSettings || DEFAULT_USER_SETTINGS
        const updatedSettings = { ...currentSettings, ...settings }
        const updatedUser = { 
          ...currentUser, 
          userSettings: updatedSettings,
          lastUpdated: new Date().toISOString()
        }
        const updatedUsers = users.map(u => u.id === currentUser.id ? updatedUser : u)

        set({
          currentUser: updatedUser,
          users: updatedUsers
        })

        return { success: true }
      },

      getUserSettings: () => {
        const { currentUser } = get()
        return currentUser?.userSettings || null
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        users: state.users,
        nextUserNumber: state.nextUserNumber,
        registeredEmails: Array.from(state.registeredEmails),
        currentUserId: state.currentUserId,
        currentUserNumber: state.currentUserNumber,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.registeredEmails = new Set(state.registeredEmails || [])
          if (!state.currentUser && state.currentUserId && state.users) {
            const found = state.users.find(u => u.id === state.currentUserId)
            if (found) state.currentUser = found
          }
        }
      }
    }
  )
)

function generateUserId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  const length = Math.floor(Math.random() * 7) + 8 // 8-14 characters
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  
  return result
} 