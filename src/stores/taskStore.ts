import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Task, CreateTaskData, UpdateTaskData } from '@/types/task'
import i18next from 'i18next'

interface TaskStore {
  // 사용자별 태스크 저장소 (사용자 번호로 관리)
  userTasks: Record<number, Task[]>
  currentUserId: string | null
  currentUserNumber: number | null
  isLoading: boolean
  error: string | null
  setCurrentUser: (userId: string | null, userNumber: number | null) => void
  createTask: (data: CreateTaskData) => Promise<void>
  updateTask: (id: string, data: UpdateTaskData) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  duplicateTask: (id: string) => Promise<void>
  toggleTaskCompletion: (id: string) => Promise<void>
  toggleTaskLike: (taskId: string) => Promise<void>
  getTasksByUserNumber: (userNumber: number) => Task[]
  getTaskStats: (userNumber: number) => {
    total: number
    completed: number
    pending: number
    overdue: number
    completionRate: number
  }
  isTaskLikedByUser: (taskId: string, userNumber: number) => boolean
  getTaskLikeCount: (taskId: string) => number
  // 현재 사용자가 볼 수 있는 태스크만 반환하는 함수
  getVisibleTasks: (userNumber: number) => Task[]
  // 모든 공개 태스크를 가져오는 함수
  getAllPublicTasks: () => Task[]
  // 개발용: 모든 데이터 초기화
  clearAllData: () => void
  // 기존 userId 기반 데이터를 userNumber 기반으로 마이그레이션
  migrateToUserNumber: () => void
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      userTasks: {},
      currentUserId: null,
      currentUserNumber: null,
      isLoading: false,
      error: null,

      setCurrentUser: (userId: string | null, userNumber: number | null) => {
        console.log('[TaskStore] setCurrentUser 호출:', { userId, userNumber })
        set({ currentUserId: userId, currentUserNumber: userNumber })
      },

      // 개발용: 모든 데이터 초기화 함수
      clearAllData: () => {
        console.log('[TaskStore] 모든 데이터 초기화')
        set({
          userTasks: {},
          currentUserId: null,
          currentUserNumber: null,
          isLoading: false,
          error: null,
        })
      },

      // 기존 userId 기반 데이터를 userNumber 기반으로 마이그레이션
      migrateToUserNumber: () => {
        const state = get()
        const oldUserTasks = state.userTasks as any // 임시로 any 타입 사용
        
        // userId 기반 데이터가 있는지 확인
        if (Object.keys(oldUserTasks).some(key => isNaN(Number(key)))) {
          console.log('[TaskStore] userId 기반 데이터를 userNumber 기반으로 마이그레이션 시작')
          
          const newUserTasks: Record<number, Task[]> = {}
          
          // 각 사용자별로 태스크를 userNumber로 재구성
          Object.entries(oldUserTasks).forEach(([userId, tasks]) => {
            if (Array.isArray(tasks)) {
              // 임시로 userNumber를 1부터 할당 (실제로는 사용자 정보에서 가져와야 함)
              const userNumber = 1 // 임시 값
              
              const migratedTasks = tasks.map(task => ({
                ...task,
                userNumber: userNumber, // userNumber 필드 추가
              }))
              
              newUserTasks[userNumber] = migratedTasks
            }
          })
          
          set({
            userTasks: newUserTasks,
          })
          
          console.log('[TaskStore] 마이그레이션 완료:', newUserTasks)
        } else {
          console.log('[TaskStore] 이미 userNumber 기반 데이터입니다.')
        }
      },

      createTask: async (data: CreateTaskData) => {
        set({ isLoading: true, error: null })
        try {
          const { currentUserId, currentUserNumber } = get()
          if (!currentUserId || !currentUserNumber) {
            throw new Error('로그인이 필요합니다. currentUser가 설정되지 않았습니다.')
          }

          const newTask: Task = {
            id: Date.now().toString(),
            ...data,
            isCompleted: false,
            likes: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            userId: currentUserId,
            userNumber: currentUserNumber, // 사용자 번호 저장
          }
          
          set((state) => ({
            userTasks: {
              ...state.userTasks,
              [currentUserNumber]: [...(state.userTasks[currentUserNumber] || []), newTask],
            },
            isLoading: false,
          }))
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : '태스크 생성에 실패했습니다.',
            isLoading: false,
          })
        }
      },

      updateTask: async (id: string, data: UpdateTaskData) => {
        set({ isLoading: true, error: null })
        try {
          const { currentUserId, currentUserNumber } = get()
          if (!currentUserId || !currentUserNumber) {
            throw new Error('로그인이 필요합니다. currentUser가 설정되지 않았습니다.')
          }

          // 모든 사용자의 태스크에서 해당 태스크 찾기
          const allTasks = Object.values(get().userTasks).flat()
          const taskToUpdate = allTasks.find((task) => task.id === id)
          
          if (!taskToUpdate) {
            throw new Error('태스크를 찾을 수 없습니다.')
          }

          // 태스크 소유자 확인 (사용자 번호로 비교)
          if (taskToUpdate.userNumber !== currentUserNumber) {
            throw new Error('자신의 태스크만 수정할 수 있습니다.')
          }

          set((state) => ({
            userTasks: {
              ...state.userTasks,
              [taskToUpdate.userNumber]: (state.userTasks[taskToUpdate.userNumber] || []).map((task) => {
                if (task.id === id) {
                  return {
                    ...task,
                    ...data,
                    likes: task.likes || [],
                    updatedAt: new Date().toISOString(),
                  }
                }
                return task
              }),
            },
            isLoading: false,
          }))
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : '태스크 수정에 실패했습니다.',
            isLoading: false,
          })
        }
      },

      deleteTask: async (id: string) => {
        set({ isLoading: true, error: null })
        try {
          const { currentUserId, currentUserNumber } = get()
          console.log('[TaskStore] deleteTask 호출:', { id, currentUserId, currentUserNumber })
          
          if (!currentUserId || !currentUserNumber) {
            throw new Error('로그인이 필요합니다. currentUser가 설정되지 않았습니다.')
          }

          // 모든 사용자의 태스크에서 해당 태스크 찾기
          const allTasks = Object.values(get().userTasks).flat()
          const taskToDelete = allTasks.find((task) => task.id === id)
          
          console.log('[TaskStore] 태스크 찾기 결과:', { 
            allTasksCount: allTasks.length, 
            taskToDelete: taskToDelete ? { id: taskToDelete.id, userNumber: taskToDelete.userNumber } : null 
          })
          
          if (!taskToDelete) {
            throw new Error('태스크를 찾을 수 없습니다.')
          }

          // 태스크 소유자 확인 (사용자 번호로 비교)
          if (taskToDelete.userNumber !== currentUserNumber) {
            throw new Error('자신의 태스크만 삭제할 수 있습니다.')
          }

          console.log('[TaskStore] 태스크 삭제 실행:', { 
            taskId: taskToDelete.id, 
            userNumber: taskToDelete.userNumber 
          })

          set((state) => ({
            userTasks: {
              ...state.userTasks,
              [taskToDelete.userNumber]: (state.userTasks[taskToDelete.userNumber] || []).filter((task) => task.id !== id),
            },
            isLoading: false,
          }))
          
          console.log('[TaskStore] 태스크 삭제 완료')
        } catch (error) {
          console.error('[TaskStore] deleteTask 에러:', error)
          set({
            error: error instanceof Error ? error.message : '태스크 삭제에 실패했습니다.',
            isLoading: false,
          })
        }
      },

      duplicateTask: async (id: string) => {
        set({ isLoading: true, error: null })
        try {
          const { currentUserId, currentUserNumber } = get()
          console.log('[TaskStore] duplicateTask 호출:', { id, currentUserId, currentUserNumber })
          
          if (!currentUserId || !currentUserNumber) {
            throw new Error('로그인이 필요합니다.')
          }

          // 모든 사용자의 태스크에서 원본 태스크 찾기
          const allTasks = Object.values(get().userTasks).flat()
          const originalTask = allTasks.find((task) => task.id === id)
          
          console.log('[TaskStore] 원본 태스크 찾기 결과:', { 
            allTasksCount: allTasks.length, 
            originalTask: originalTask ? { id: originalTask.id, userNumber: originalTask.userNumber } : null 
          })
          
          if (!originalTask) {
            throw new Error('태스크를 찾을 수 없습니다.')
          }

          const copySuffix = i18next.t('task.copySuffix')
          const duplicatedTask: Task = {
            ...originalTask,
            id: Date.now().toString(),
            title: `${originalTask.title} ${copySuffix}`,
            isCompleted: false,
            isPublic: false,
            likes: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            userId: currentUserId,
            userNumber: currentUserNumber, // 사용자 번호 저장
          }

          console.log('[TaskStore] 복제된 태스크 생성:', { 
            duplicatedTaskId: duplicatedTask.id, 
            duplicatedTaskTitle: duplicatedTask.title, 
            duplicatedTaskUserId: duplicatedTask.userId,
            duplicatedTaskUserNumber: duplicatedTask.userNumber
          })

          set((state) => ({
            userTasks: {
              ...state.userTasks,
              [currentUserNumber]: [...(state.userTasks[currentUserNumber] || []), duplicatedTask],
            },
            isLoading: false,
          }))
          
          console.log('[TaskStore] 태스크 복제 완료')
        } catch (error) {
          console.error('[TaskStore] duplicateTask 에러:', error)
          set({
            error: error instanceof Error ? error.message : '태스크 복제에 실패했습니다.',
            isLoading: false,
          })
        }
      },

      toggleTaskCompletion: async (id: string) => {
        set({ isLoading: true, error: null })
        try {
          const { currentUserId, currentUserNumber } = get()
          console.log('[TaskStore] toggleTaskCompletion 호출:', { id, currentUserId, currentUserNumber })
          
          if (!currentUserId || !currentUserNumber) {
            throw new Error('로그인이 필요합니다.')
          }

          // 모든 사용자의 태스크에서 해당 태스크 찾기
          const allTasks = Object.values(get().userTasks).flat()
          const taskToToggle = allTasks.find((task) => task.id === id)
          
          console.log('[TaskStore] 태스크 찾기 결과:', { 
            allTasksCount: allTasks.length, 
            taskToToggle: taskToToggle ? { id: taskToToggle.id, userNumber: taskToToggle.userNumber, isCompleted: taskToToggle.isCompleted } : null 
          })
          
          if (!taskToToggle) {
            throw new Error('태스크를 찾을 수 없습니다.')
          }

          // 태스크 소유자 확인 (사용자 번호로 비교)
          if (taskToToggle.userNumber !== currentUserNumber) {
            throw new Error('자신의 태스크만 수정할 수 있습니다.')
          }

          console.log('[TaskStore] 태스크 상태 변경 실행:', { 
            taskId: taskToToggle.id, 
            userNumber: taskToToggle.userNumber,
            currentStatus: taskToToggle.isCompleted,
            newStatus: !taskToToggle.isCompleted
          })

          set((state) => ({
            userTasks: {
              ...state.userTasks,
              [taskToToggle.userNumber]: (state.userTasks[taskToToggle.userNumber] || []).map((task) => {
                if (task.id === id) {
                  return {
                    ...task,
                    likes: task.likes || [],
                    isCompleted: !task.isCompleted,
                    updatedAt: new Date().toISOString(),
                  }
                }
                return task
              }),
            },
            isLoading: false,
          }))
          
          console.log('[TaskStore] 태스크 상태 변경 완료')
        } catch (error) {
          console.error('[TaskStore] toggleTaskCompletion 에러:', error)
          set({
            error: error instanceof Error ? error.message : '태스크 상태 변경에 실패했습니다.',
            isLoading: false,
          })
        }
      },

      toggleTaskLike: async (taskId: string) => {
        set({ isLoading: true, error: null })
        try {
          const { currentUserId, currentUserNumber } = get()
          if (!currentUserId || !currentUserNumber) {
            throw new Error('로그인이 필요합니다.')
          }

          // 모든 사용자의 태스크에서 해당 태스크 찾기
          const allTasks = Object.values(get().userTasks).flat()
          const taskToUpdate = allTasks.find((task) => task.id === taskId)
          
          if (!taskToUpdate) {
            throw new Error('태스크를 찾을 수 없습니다.')
          }

          const taskOwnerNumber = taskToUpdate.userNumber
          const currentLikes = taskToUpdate.likes || []
          const isLiked = currentLikes.includes(currentUserNumber)
          const updatedLikes = isLiked
            ? currentLikes.filter((num) => num !== currentUserNumber)
            : [...currentLikes, currentUserNumber]

          set((state) => ({
            userTasks: {
              ...state.userTasks,
              [taskOwnerNumber]: (state.userTasks[taskOwnerNumber] || []).map((task) => {
                if (task.id === taskId) {
                  return {
                    ...task,
                    likes: updatedLikes,
                    updatedAt: new Date().toISOString(),
                  }
                }
                return task
              }),
            },
            isLoading: false,
          }))
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : '좋아요 처리에 실패했습니다.',
            isLoading: false,
          })
        }
      },

      isTaskLikedByUser: (taskId: string, userNumber: number) => {
        const allTasks = Object.values(get().userTasks).flat()
        const task = allTasks.find((t) => t.id === taskId)
        return task ? (task.likes || []).includes(userNumber) : false
      },

      getTaskLikeCount: (taskId: string) => {
        const allTasks = Object.values(get().userTasks).flat()
        const task = allTasks.find((t) => t.id === taskId)
        return task ? (task.likes || []).length : 0
      },

      getTasksByUserNumber: (userNumber: number) => {
        return get().userTasks[userNumber] || []
      },

      getTaskStats: (userNumber: number) => {
        const userTasks = get().userTasks[userNumber] || []
        const total = userTasks.length
        const completed = userTasks.filter((task) => task.isCompleted).length
        const pending = total - completed
        const overdue = userTasks.filter(
          (task) => !task.isCompleted && task.dueDate && new Date(task.dueDate) < new Date()
        ).length
        const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

        return {
          total,
          completed,
          pending,
          overdue,
          completionRate,
        }
      },

      getAllPublicTasks: () => {
        const allTasks = Object.values(get().userTasks).flat()
        return allTasks.filter((task) => task.isPublic)
      },

      getVisibleTasks: (userNumber: number) => {
        const userTasks = get().userTasks[userNumber] || []
        const allTasks = Object.values(get().userTasks).flat()
        const otherPublicTasks = allTasks.filter(task => 
          task.isPublic && task.userNumber !== userNumber
        )
        
        // 사용자 자신의 태스크 + 다른 사용자의 공개 태스크
        return [...userTasks, ...otherPublicTasks]
      },
    }),
    {
      name: 'task-storage',
      partialize: (state) => ({ 
        userTasks: state.userTasks,
        currentUserId: state.currentUserId,
        currentUserNumber: state.currentUserNumber
      }),
    }
  )
) 