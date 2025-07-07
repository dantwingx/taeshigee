import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Task, CreateTaskData, UpdateTaskData } from '@/types/task'
import { taskService } from '@/services/taskService'
import i18next from 'i18next'

interface TaskStore {
  // 사용자별 태스크 저장소 (사용자 번호로 관리)
  userTasks: Record<number, Task[]>
  publicTasks: Task[] // 공개 태스크 캐시
  currentUserId: string | null
  currentUserNumber: number | null
  isLoading: boolean
  error: string | null
  
  // Actions
  setCurrentUser: (userId: string | null, userNumber: number | null) => void
  createTask: (data: CreateTaskData) => Promise<void>
  updateTask: (id: string, data: UpdateTaskData) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  duplicateTask: (id: string) => Promise<void>
  toggleTaskCompletion: (id: string) => Promise<void>
  toggleTaskLike: (taskId: string) => Promise<void>
  
  // Data fetching
  fetchUserTasks: (search?: string, filter?: string) => Promise<void>
  fetchPublicTasks: (search?: string, filter?: string) => Promise<void>
  
  // Getters
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
  getVisibleTasks: (userNumber: number) => Task[]
  getAllPublicTasks: () => Task[]
  
  // Utility
  clearError: () => void
  clearAllData: () => void
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      userTasks: {},
      publicTasks: [],
      currentUserId: null,
      currentUserNumber: null,
      isLoading: false,
      error: null,

      setCurrentUser: (userId: string | null, userNumber: number | null) => {
        console.log('[TaskStore] setCurrentUser 호출:', { userId, userNumber })
        set({ currentUserId: userId, currentUserNumber: userNumber })
      },

      clearError: () => set({ error: null }),

      clearAllData: () => {
        console.log('[TaskStore] 모든 데이터 초기화')
        set({
          userTasks: {},
          publicTasks: [],
          currentUserId: null,
          currentUserNumber: null,
          isLoading: false,
          error: null,
        })
      },

      fetchUserTasks: async (search?: string, filter?: string) => {
        const { currentUserNumber } = get()
        if (!currentUserNumber) {
          console.warn('[TaskStore] fetchUserTasks: 사용자가 로그인되지 않음')
          return
        }

        set({ isLoading: true, error: null })
        try {
          const response = await taskService.getUserTasks(search, filter)
          
          if (response.success && response.tasks) {
            set((state) => ({
              userTasks: {
                ...state.userTasks,
                [currentUserNumber]: response.tasks
              },
              isLoading: false,
              error: null
            }))
          } else {
            throw new Error('Failed to fetch user tasks')
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : '태스크 조회에 실패했습니다.'
          set({ 
            error: errorMessage, 
            isLoading: false 
          })
          console.error('[TaskStore] fetchUserTasks error:', error)
        }
      },

      fetchPublicTasks: async (search?: string, filter?: string) => {
        set({ isLoading: true, error: null })
        try {
          const response = await taskService.getPublicTasks(search, filter)
          
          if (response.success && response.tasks) {
            // 좋아요 정보를 포함하여 태스크 데이터 변환
            const tasksWithLikes = response.tasks.map(task => ({
              ...task,
              likes: [] // 초기에는 빈 배열로 설정, 좋아요 정보는 별도로 관리
            }))
            
            set({
              publicTasks: tasksWithLikes,
              isLoading: false,
              error: null
            })
            console.log('[TaskStore] 공개 태스크 로드 완료:', tasksWithLikes.length, '개')
          } else {
            throw new Error('Failed to fetch public tasks')
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : '공개 태스크 조회에 실패했습니다.'
          set({ 
            error: errorMessage, 
            isLoading: false 
          })
          console.error('[TaskStore] fetchPublicTasks error:', error)
        }
      },

      createTask: async (data: CreateTaskData) => {
        const { currentUserId, currentUserNumber } = get()
        if (!currentUserId || !currentUserNumber) {
          throw new Error('로그인이 필요합니다.')
        }

        set({ isLoading: true, error: null })
        try {
          const response = await taskService.createTask(data)
          
          if (response.success && response.task) {
            const newTask = response.task
            
            set((state) => ({
              userTasks: {
                ...state.userTasks,
                [currentUserNumber]: [...(state.userTasks[currentUserNumber] || []), newTask],
              },
              isLoading: false,
              error: null
            }))
          } else {
            throw new Error('Failed to create task')
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : '태스크 생성에 실패했습니다.'
          set({
            error: errorMessage,
            isLoading: false,
          })
          throw error
        }
      },

      updateTask: async (id: string, data: UpdateTaskData) => {
        const { currentUserId, currentUserNumber } = get()
        if (!currentUserId || !currentUserNumber) {
          throw new Error('로그인이 필요합니다.')
        }

        set({ isLoading: true, error: null })
        try {
          const response = await taskService.updateTask(id, data)
          
          if (response.success && response.task) {
            const updatedTask = response.task
            
            set((state) => ({
              userTasks: {
                ...state.userTasks,
                [currentUserNumber]: (state.userTasks[currentUserNumber] || []).map((task) => {
                  if (task.id === id) {
                    return updatedTask
                  }
                  return task
                }),
              },
              isLoading: false,
              error: null
            }))
          } else {
            throw new Error('Failed to update task')
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : '태스크 수정에 실패했습니다.'
          set({
            error: errorMessage,
            isLoading: false,
          })
          throw error
        }
      },

      deleteTask: async (id: string) => {
        const { currentUserId, currentUserNumber } = get()
        if (!currentUserId || !currentUserNumber) {
          throw new Error('로그인이 필요합니다.')
        }

        set({ isLoading: true, error: null })
        try {
          const response = await taskService.deleteTask(id)
          
          if (response.success) {
            set((state) => ({
              userTasks: {
                ...state.userTasks,
                [currentUserNumber]: (state.userTasks[currentUserNumber] || []).filter((task) => task.id !== id),
              },
              isLoading: false,
              error: null
            }))
          } else {
            throw new Error('Failed to delete task')
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : '태스크 삭제에 실패했습니다.'
          set({
            error: errorMessage,
            isLoading: false,
          })
          throw error
        }
      },

      duplicateTask: async (id: string) => {
        const { currentUserId, currentUserNumber } = get()
        if (!currentUserId || !currentUserNumber) {
          throw new Error('로그인이 필요합니다.')
        }

        set({ isLoading: true, error: null })
        try {
          const response = await taskService.duplicateTask(id)
          
          if (response.success && response.task) {
            const duplicatedTask = {
              ...response.task,
              userId: currentUserId, // 현재 사용자 ID로 설정
              userNumber: currentUserNumber, // 현재 사용자 번호로 설정
              likes: [], // 새로운 태스크는 좋아요가 없음
            } as Task
            
            set((state) => ({
              userTasks: {
                ...state.userTasks,
                [currentUserNumber]: [...(state.userTasks[currentUserNumber] || []), duplicatedTask],
              },
              isLoading: false,
              error: null
            }))
          } else {
            throw new Error('Failed to duplicate task')
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : '태스크 복제에 실패했습니다.'
          set({
            error: errorMessage,
            isLoading: false,
          })
          throw error
        }
      },

      toggleTaskCompletion: async (id: string) => {
        const { currentUserId, currentUserNumber } = get()
        if (!currentUserId || !currentUserNumber) {
          throw new Error('로그인이 필요합니다.')
        }

        // 현재 태스크 상태 확인
        const currentTasks = get().userTasks[currentUserNumber] || []
        const taskToToggle = currentTasks.find(task => task.id === id)
        
        if (!taskToToggle) {
          throw new Error('태스크를 찾을 수 없습니다.')
        }

        // 낙관적 업데이트
        const optimisticUpdate = !taskToToggle.isCompleted
        
        set((state) => ({
          userTasks: {
            ...state.userTasks,
            [currentUserNumber]: (state.userTasks[currentUserNumber] || []).map((task) => {
              if (task.id === id) {
                return { ...task, isCompleted: optimisticUpdate }
              }
              return task
            }),
          }
        }))

        try {
          // API 호출
          await taskService.updateTask(id, { isCompleted: optimisticUpdate })
        } catch (error) {
          // 실패 시 원래 상태로 되돌리기
          set((state) => ({
            userTasks: {
              ...state.userTasks,
              [currentUserNumber]: (state.userTasks[currentUserNumber] || []).map((task) => {
                if (task.id === id) {
                  return { ...task, isCompleted: !optimisticUpdate }
                }
                return task
              }),
            }
          }))
          
          const errorMessage = error instanceof Error ? error.message : '태스크 상태 변경에 실패했습니다.'
          set({ error: errorMessage })
          throw error
        }
      },

      toggleTaskLike: async (taskId: string) => {
        const { currentUserId, currentUserNumber } = get()
        if (!currentUserId || !currentUserNumber) {
          throw new Error('로그인이 필요합니다.')
        }

        try {
          const response = await taskService.toggleLike(taskId)
          
          if (response.success) {
            // 모든 태스크에서 해당 태스크 업데이트
            set((state) => ({
              userTasks: Object.keys(state.userTasks).reduce((acc, userNumber) => {
                acc[Number(userNumber)] = (state.userTasks[Number(userNumber)] || []).map((task) => {
                  if (task.id === taskId) {
                    return {
                      ...task,
                      likes: response.liked 
                        ? [...(task.likes || []), currentUserNumber]
                        : (task.likes || []).filter(num => num !== currentUserNumber)
                    }
                  }
                  return task
                })
                return acc
              }, {} as Record<number, Task[]>),
              publicTasks: state.publicTasks.map((task) => {
                if (task.id === taskId) {
                  return {
                    ...task,
                    likes: response.liked 
                      ? [...(task.likes || []), currentUserNumber]
                      : (task.likes || []).filter(num => num !== currentUserNumber)
                  }
                }
                return task
              })
            }))
          } else {
            throw new Error('Failed to toggle like')
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : '좋아요 처리에 실패했습니다.'
          set({ error: errorMessage })
          throw error
        }
      },

      isTaskLikedByUser: (taskId: string, userNumber: number) => {
        const allTasks = Object.values(get().userTasks).flat()
        const publicTasks = get().publicTasks
        const task = allTasks.find((t) => t.id === taskId) || publicTasks.find((t) => t.id === taskId)
        return task ? (task.likes || []).includes(userNumber) : false
      },

      getTaskLikeCount: (taskId: string) => {
        const allTasks = Object.values(get().userTasks).flat()
        const publicTasks = get().publicTasks
        const task = allTasks.find((t) => t.id === taskId) || publicTasks.find((t) => t.id === taskId)
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
        return get().publicTasks
      },

      getVisibleTasks: (userNumber: number) => {
        const userTasks = get().userTasks[userNumber] || []
        const publicTasks = get().publicTasks
        
        // 사용자 자신의 태스크 + 다른 사용자의 공개 태스크
        return [...userTasks, ...publicTasks.filter(task => task.userNumber !== userNumber)]
      },
    }),
    {
      name: 'task-storage',
      partialize: (state) => ({ 
        userTasks: state.userTasks,
        publicTasks: state.publicTasks,
        currentUserId: state.currentUserId,
        currentUserNumber: state.currentUserNumber
      }),
    }
  )
) 