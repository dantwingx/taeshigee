import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Task, CreateTaskData, UpdateTaskData } from '@/types/task'
import i18next from 'i18next'

interface TaskStore {
  // 사용자별 태스크 저장소
  userTasks: Record<string, Task[]>
  currentUserId: string | null
  isLoading: boolean
  error: string | null
  setCurrentUserId: (userId: string | null) => void
  createTask: (data: CreateTaskData) => Promise<void>
  updateTask: (id: string, data: UpdateTaskData) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  duplicateTask: (id: string) => Promise<void>
  toggleTaskCompletion: (id: string) => Promise<void>
  toggleTaskLike: (taskId: string) => Promise<void>
  getTasksByUserId: (userId: string) => Task[]
  getTaskStats: (userId: string) => {
    total: number
    completed: number
    pending: number
    overdue: number
    completionRate: number
  }
  isTaskLikedByUser: (taskId: string, userId: string) => boolean
  getTaskLikeCount: (taskId: string) => number
  // 현재 사용자가 볼 수 있는 태스크만 반환하는 함수
  getVisibleTasks: (userId: string) => Task[]
  // 모든 공개 태스크를 가져오는 함수
  getAllPublicTasks: () => Task[]
  // 개발용: 모든 데이터 초기화
  clearAllData: () => void
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      userTasks: {},
      currentUserId: null,
      isLoading: false,
      error: null,

      setCurrentUserId: (userId: string | null) => {
        console.log('[TaskStore] setCurrentUserId 호출:', userId)
        set({ currentUserId: userId })
      },

      // 개발용: 모든 데이터 초기화 함수
      clearAllData: () => {
        console.log('[TaskStore] 모든 데이터 초기화')
        set({
          userTasks: {},
          currentUserId: null,
          isLoading: false,
          error: null,
        })
      },

      createTask: async (data: CreateTaskData) => {
        set({ isLoading: true, error: null })
        try {
          const currentUserId = get().currentUserId
          if (!currentUserId) {
            throw new Error('로그인이 필요합니다. currentUserId가 설정되지 않았습니다.')
          }

          const newTask: Task = {
            id: Date.now().toString(),
            ...data,
            isCompleted: false,
            likes: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            userId: currentUserId,
          }
          
          set((state) => ({
            userTasks: {
              ...state.userTasks,
              [currentUserId]: [...(state.userTasks[currentUserId] || []), newTask],
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
          const currentUserId = get().currentUserId
          if (!currentUserId) {
            throw new Error('로그인이 필요합니다. currentUserId가 설정되지 않았습니다.')
          }

          // 모든 사용자의 태스크에서 해당 태스크 찾기
          const allTasks = Object.values(get().userTasks).flat()
          const taskToUpdate = allTasks.find((task) => task.id === id)
          
          if (!taskToUpdate) {
            throw new Error('태스크를 찾을 수 없습니다.')
          }

          // 태스크 소유자 확인 (자신의 태스크만 수정 가능)
          if (taskToUpdate.userId !== currentUserId) {
            throw new Error('자신의 태스크만 수정할 수 있습니다.')
          }

          set((state) => ({
            userTasks: {
              ...state.userTasks,
              [taskToUpdate.userId]: (state.userTasks[taskToUpdate.userId] || []).map((task) => {
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
          const currentUserId = get().currentUserId
          console.log('[TaskStore] deleteTask 호출:', { id, currentUserId })
          
          if (!currentUserId) {
            throw new Error('로그인이 필요합니다. currentUserId가 설정되지 않았습니다.')
          }

          // 모든 사용자의 태스크에서 해당 태스크 찾기
          const allTasks = Object.values(get().userTasks).flat()
          const taskToDelete = allTasks.find((task) => task.id === id)
          
          console.log('[TaskStore] 태스크 찾기 결과:', { 
            allTasksCount: allTasks.length, 
            taskToDelete: taskToDelete ? { id: taskToDelete.id, userId: taskToDelete.userId } : null 
          })
          
          if (!taskToDelete) {
            throw new Error('태스크를 찾을 수 없습니다.')
          }

          // 태스크 소유자 확인 (자신의 태스크만 삭제 가능)
          if (taskToDelete.userId !== currentUserId) {
            throw new Error('자신의 태스크만 삭제할 수 있습니다.')
          }

          console.log('[TaskStore] 태스크 삭제 실행:', { 
            taskId: taskToDelete.id, 
            userId: taskToDelete.userId 
          })

          set((state) => ({
            userTasks: {
              ...state.userTasks,
              [taskToDelete.userId]: (state.userTasks[taskToDelete.userId] || []).filter((task) => task.id !== id),
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
          const currentUserId = get().currentUserId
          console.log('[TaskStore] duplicateTask 호출:', { id, currentUserId })
          
          if (!currentUserId) {
            throw new Error('로그인이 필요합니다.')
          }

          // 모든 사용자의 태스크에서 원본 태스크 찾기
          const allTasks = Object.values(get().userTasks).flat()
          const originalTask = allTasks.find((task) => task.id === id)
          
          console.log('[TaskStore] 원본 태스크 찾기 결과:', { 
            allTasksCount: allTasks.length, 
            originalTask: originalTask ? { id: originalTask.id, userId: originalTask.userId } : null 
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
          }

          console.log('[TaskStore] 복제된 태스크 생성:', { 
            duplicatedTaskId: duplicatedTask.id, 
            duplicatedTaskTitle: duplicatedTask.title, 
            duplicatedTaskUserId: duplicatedTask.userId 
          })

          set((state) => ({
            userTasks: {
              ...state.userTasks,
              [currentUserId]: [...(state.userTasks[currentUserId] || []), duplicatedTask],
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
          const currentUserId = get().currentUserId
          console.log('[TaskStore] toggleTaskCompletion 호출:', { id, currentUserId })
          
          if (!currentUserId) {
            throw new Error('로그인이 필요합니다.')
          }

          // 모든 사용자의 태스크에서 해당 태스크 찾기
          const allTasks = Object.values(get().userTasks).flat()
          const taskToToggle = allTasks.find((task) => task.id === id)
          
          console.log('[TaskStore] 태스크 찾기 결과:', { 
            allTasksCount: allTasks.length, 
            taskToToggle: taskToToggle ? { id: taskToToggle.id, userId: taskToToggle.userId, isCompleted: taskToToggle.isCompleted } : null 
          })
          
          if (!taskToToggle) {
            throw new Error('태스크를 찾을 수 없습니다.')
          }

          // 태스크 소유자 확인 (자신의 태스크만 토글 가능)
          if (taskToToggle.userId !== currentUserId) {
            throw new Error('자신의 태스크만 수정할 수 있습니다.')
          }

          console.log('[TaskStore] 태스크 상태 변경 실행:', { 
            taskId: taskToToggle.id, 
            userId: taskToToggle.userId,
            currentStatus: taskToToggle.isCompleted,
            newStatus: !taskToToggle.isCompleted
          })

          set((state) => ({
            userTasks: {
              ...state.userTasks,
              [taskToToggle.userId]: (state.userTasks[taskToToggle.userId] || []).map((task) => {
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
          const currentUserId = get().currentUserId
          if (!currentUserId) {
            throw new Error('로그인이 필요합니다.')
          }

          // 모든 사용자의 태스크에서 해당 태스크 찾기
          const allTasks = Object.values(get().userTasks).flat()
          const taskToUpdate = allTasks.find((task) => task.id === taskId)
          
          if (!taskToUpdate) {
            throw new Error('태스크를 찾을 수 없습니다.')
          }

          const taskOwnerId = taskToUpdate.userId
          const currentLikes = taskToUpdate.likes || []
          const isLiked = currentLikes.includes(currentUserId)
          const updatedLikes = isLiked
            ? currentLikes.filter((userId) => userId !== currentUserId)
            : [...currentLikes, currentUserId]

          set((state) => ({
            userTasks: {
              ...state.userTasks,
              [taskOwnerId]: (state.userTasks[taskOwnerId] || []).map((task) => {
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

      isTaskLikedByUser: (taskId: string, userId: string) => {
        const allTasks = Object.values(get().userTasks).flat()
        const task = allTasks.find((t) => t.id === taskId)
        return task ? (task.likes || []).includes(userId) : false
      },

      getTaskLikeCount: (taskId: string) => {
        const allTasks = Object.values(get().userTasks).flat()
        const task = allTasks.find((t) => t.id === taskId)
        return task ? (task.likes || []).length : 0
      },

      getTasksByUserId: (userId: string) => {
        return get().userTasks[userId] || []
      },

      getTaskStats: (userId: string) => {
        const userTasks = get().userTasks[userId] || []
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

      getVisibleTasks: (userId: string) => {
        const userTasks = get().userTasks[userId] || []
        const allTasks = Object.values(get().userTasks).flat()
        const otherPublicTasks = allTasks.filter(task => 
          task.isPublic && task.userId !== userId
        )
        
        // 사용자 자신의 태스크 + 다른 사용자의 공개 태스크
        return [...userTasks, ...otherPublicTasks]
      },
    }),
    {
      name: 'task-storage',
      partialize: (state) => ({ 
        userTasks: state.userTasks,
        currentUserId: state.currentUserId 
      }),
    }
  )
) 