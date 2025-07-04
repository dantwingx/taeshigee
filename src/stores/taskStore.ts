import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Task, CreateTaskData, UpdateTaskData } from '@/types/task'

interface TaskStore {
  tasks: Task[]
  currentUserId: string | null
  isLoading: boolean
  error: string | null
  setCurrentUserId: (userId: string) => void
  createTask: (data: CreateTaskData) => Promise<void>
  updateTask: (id: string, data: UpdateTaskData) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  toggleTaskCompletion: (id: string) => Promise<void>
  getTasksByUserId: (userId: string) => Task[]
  getTaskStats: (userId: string) => {
    total: number
    completed: number
    pending: number
    overdue: number
    completionRate: number
  }
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      currentUserId: null,
      isLoading: false,
      error: null,

      setCurrentUserId: (userId: string) => {
        set({ currentUserId: userId })
      },

      createTask: async (data: CreateTaskData) => {
        set({ isLoading: true, error: null })
        try {
          const newTask: Task = {
            id: Date.now().toString(),
            ...data,
            isCompleted: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            userId: get().currentUserId || 'anonymous',
          }
          
          set((state) => ({
            tasks: [...state.tasks, newTask],
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
          set((state) => ({
            tasks: state.tasks.map((task) =>
              task.id === id
                ? {
                    ...task,
                    ...data,
                    updatedAt: new Date().toISOString(),
                  }
                : task
            ),
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
          set((state) => ({
            tasks: state.tasks.filter((task) => task.id !== id),
            isLoading: false,
          }))
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : '태스크 삭제에 실패했습니다.',
            isLoading: false,
          })
        }
      },

      toggleTaskCompletion: async (id: string) => {
        set({ isLoading: true, error: null })
        try {
          set((state) => ({
            tasks: state.tasks.map((task) =>
              task.id === id
                ? {
                    ...task,
                    isCompleted: !task.isCompleted,
                    updatedAt: new Date().toISOString(),
                  }
                : task
            ),
            isLoading: false,
          }))
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : '태스크 상태 변경에 실패했습니다.',
            isLoading: false,
          })
        }
      },

      getTasksByUserId: (userId: string) => {
        return get().tasks.filter((task) => task.userId === userId)
      },

      getTaskStats: (userId: string) => {
        const userTasks = get().getTasksByUserId(userId)
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
    }),
    {
      name: 'task-storage',
      partialize: (state) => ({ tasks: state.tasks }),
    }
  )
) 