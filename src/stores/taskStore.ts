import { create } from 'zustand'
import type { Task, CreateTaskData, UpdateTaskData, TaskFilters, TaskStats } from '@/types/task'

interface TaskState {
  tasks: Task[]
  currentTask: Task | null
  filters: TaskFilters
  stats: TaskStats
  isLoading: boolean
  error: string | null
}

interface TaskActions {
  // CRUD Operations
  createTask: (taskData: CreateTaskData) => Promise<void>
  updateTask: (id: string, taskData: UpdateTaskData) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  toggleTaskCompletion: (id: string) => Promise<void>
  
  // Filters and View
  setFilters: (filters: Partial<TaskFilters>) => void
  clearFilters: () => void
  
  // Stats
  updateStats: () => void
  
  // State Management
  setCurrentTask: (task: Task | null) => void
  clearError: () => void
}

interface TaskStore extends TaskState, TaskActions {}

const defaultFilters: TaskFilters = {
  view: 'daily',
  date: new Date().toISOString().split('T')[0],
  hideCompleted: false,
  sortBy: 'dueDate',
  order: 'asc',
}

const defaultStats: TaskStats = {
  total: 0,
  completed: 0,
  pending: 0,
  completionRate: 0,
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  // State
  tasks: [],
  currentTask: null,
  filters: defaultFilters,
  stats: defaultStats,
  isLoading: false,
  error: null,

  // Actions
  createTask: async (taskData: CreateTaskData) => {
    set({ isLoading: true, error: null })
    
    try {
      // TODO: 실제 API 호출로 대체
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const newTask: Task = {
        id: Date.now().toString(),
        title: taskData.title,
        description: taskData.description,
        dueDate: taskData.dueDate,
        recurrenceType: taskData.recurrenceType || 'none',
        recurrenceDetail: taskData.recurrenceDetail,
        importance: taskData.importance || 'medium',
        priority: taskData.priority || 'medium',
        isCompleted: false,
        tags: taskData.tags || [],
        category: taskData.category,
        attachments: [],
        subtasks: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      
      set(state => ({
        tasks: [...state.tasks, newTask],
        isLoading: false,
      }))
      
      get().updateStats()
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : '태스크 생성에 실패했습니다.',
      })
    }
  },

  updateTask: async (id: string, taskData: UpdateTaskData) => {
    set({ isLoading: true, error: null })
    
    try {
      // TODO: 실제 API 호출로 대체
      await new Promise(resolve => setTimeout(resolve, 500))
      
      set(state => ({
        tasks: state.tasks.map(task =>
          task.id === id
            ? { ...task, ...taskData, updatedAt: new Date().toISOString() }
            : task
        ),
        isLoading: false,
      }))
      
      get().updateStats()
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : '태스크 수정에 실패했습니다.',
      })
    }
  },

  deleteTask: async (id: string) => {
    set({ isLoading: true, error: null })
    
    try {
      // TODO: 실제 API 호출로 대체
      await new Promise(resolve => setTimeout(resolve, 500))
      
      set(state => ({
        tasks: state.tasks.filter(task => task.id !== id),
        isLoading: false,
      }))
      
      get().updateStats()
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : '태스크 삭제에 실패했습니다.',
      })
    }
  },

  toggleTaskCompletion: async (id: string) => {
    set({ isLoading: true, error: null })
    
    try {
      // TODO: 실제 API 호출로 대체
      await new Promise(resolve => setTimeout(resolve, 300))
      
      set(state => ({
        tasks: state.tasks.map(task =>
          task.id === id
            ? { ...task, isCompleted: !task.isCompleted, updatedAt: new Date().toISOString() }
            : task
        ),
        isLoading: false,
      }))
      
      get().updateStats()
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : '태스크 상태 변경에 실패했습니다.',
      })
    }
  },

  setFilters: (filters: Partial<TaskFilters>) => {
    set(state => ({
      filters: { ...state.filters, ...filters },
    }))
  },

  clearFilters: () => {
    set({ filters: defaultFilters })
  },

  updateStats: () => {
    const { tasks } = get()
    const total = tasks.length
    const completed = tasks.filter(task => task.isCompleted).length
    const pending = total - completed
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0
    
    set({
      stats: {
        total,
        completed,
        pending,
        completionRate,
      },
    })
  },

  setCurrentTask: (task: Task | null) => {
    set({ currentTask: task })
  },

  clearError: () => {
    set({ error: null })
  },
})) 