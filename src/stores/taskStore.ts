import { create } from 'zustand'
import type { Task, CreateTaskData, UpdateTaskData, TaskFilters, TaskStats } from '@/types/task'

interface TaskState {
  tasks: Task[]
  currentTask: Task | null
  filters: TaskFilters
  stats: TaskStats
  isLoading: boolean
  error: string | null
  currentUserId: string | null
}

interface TaskActions {
  // CRUD Operations
  createTask: (taskData: CreateTaskData) => Promise<void>
  updateTask: (id: string, taskData: UpdateTaskData) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  toggleTaskCompletion: (id: string) => Promise<void>
  
  // User Management
  setCurrentUser: (userId: string) => void
  clearCurrentUser: () => void
  loadUserTasks: (userId: string) => Promise<void>
  
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

// 로컬 스토리지 키
const TASKS_STORAGE_KEY = 'taeshigee_tasks'

// 로컬 스토리지에서 태스크 로드
const loadTasksFromStorage = (): Record<string, Task[]> => {
  try {
    const stored = localStorage.getItem(TASKS_STORAGE_KEY)
    const tasksByUser = stored ? JSON.parse(stored) : {}
    
    // 테스트용 샘플 데이터 (여러 사용자용)
    const sampleUsers = {
      'dGVzdEB0ZXN0': [ // test@test.com
        {
          id: '1',
          title: '프로젝트 기획서 작성',
          description: '새로운 웹 애플리케이션 프로젝트의 기획서를 작성합니다.',
          dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          recurrenceType: 'none',
          recurrenceDetail: null,
          importance: 'high',
          priority: 'high',
          isCompleted: false,
          tags: ['업무', '기획'],
          category: 'work',
          attachments: [],
          subtasks: [],
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          title: '팀 미팅 참석',
          description: '주간 팀 미팅에 참석하여 진행 상황을 공유합니다.',
          dueDate: new Date().toISOString(),
          recurrenceType: 'weekly',
          recurrenceDetail: 'monday',
          importance: 'medium',
          priority: 'medium',
          isCompleted: true,
          tags: ['미팅', '팀'],
          category: 'work',
          attachments: [],
          subtasks: [],
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      'dXNlcjFAdGVzdA': [ // user1@test
        {
          id: '3',
          title: '운동하기',
          description: '헬스장에서 1시간 운동을 합니다.',
          dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          recurrenceType: 'daily',
          recurrenceDetail: 'weekdays',
          importance: 'medium',
          priority: 'low',
          isCompleted: false,
          tags: ['건강', '운동'],
          category: 'health',
          attachments: [],
          subtasks: [],
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '4',
          title: 'React 학습',
          description: 'React Hooks와 Context API에 대해 학습합니다.',
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          recurrenceType: 'none',
          recurrenceDetail: null,
          importance: 'high',
          priority: 'medium',
          isCompleted: false,
          tags: ['학습', '프로그래밍'],
          category: 'study',
          attachments: [],
          subtasks: [],
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      'dXNlcjJAdGVzdA': [ // user2@test
        {
          id: '5',
          title: '장보기',
          description: '주말 장보기를 위해 필요한 물건들을 구매합니다.',
          dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
          recurrenceType: 'weekly',
          recurrenceDetail: 'saturday',
          importance: 'low',
          priority: 'low',
          isCompleted: false,
          tags: ['개인', '쇼핑'],
          category: 'personal',
          attachments: [],
          subtasks: [],
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    }
    
    // 샘플 데이터가 없으면 추가
    Object.entries(sampleUsers).forEach(([userId, tasks]) => {
      if (!tasksByUser[userId] || tasksByUser[userId].length === 0) {
        tasksByUser[userId] = tasks
      }
    })
    
    // 샘플 데이터를 로컬 스토리지에 저장
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasksByUser))
    
    return tasksByUser
  } catch (error) {
    console.error('Failed to load tasks from storage:', error)
    return {}
  }
}

// 로컬 스토리지에 태스크 저장
const saveTasksToStorage = (tasksByUser: Record<string, Task[]>) => {
  try {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasksByUser))
  } catch (error) {
    console.error('Failed to save tasks to storage:', error)
  }
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  // State
  tasks: [],
  currentTask: null,
  filters: defaultFilters,
  stats: defaultStats,
  isLoading: false,
  error: null,
  currentUserId: null,

  // Actions
  setCurrentUser: (userId: string) => {
    console.log(`[TaskStore] 사용자 설정: ${userId}`)
    set({ currentUserId: userId })
    get().loadUserTasks(userId)
  },

  clearCurrentUser: () => {
    console.log('[TaskStore] 사용자 정보 정리')
    set({ 
      currentUserId: null, 
      tasks: [], 
      stats: defaultStats,
      currentTask: null 
    })
  },

  loadUserTasks: async (userId: string) => {
    console.log(`[TaskStore] 사용자 태스크 로드: ${userId}`)
    set({ isLoading: true, error: null })
    
    try {
      // TODO: 실제 API 호출로 대체
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const tasksByUser = loadTasksFromStorage()
      const userTasks = tasksByUser[userId] || []
      
      console.log(`[TaskStore] 로드된 태스크 수: ${userTasks.length}개`)
      
      set({ 
        tasks: userTasks,
        isLoading: false 
      })
      
      get().updateStats()
    } catch (error) {
      console.error('[TaskStore] 태스크 로드 실패:', error)
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : '태스크 로드에 실패했습니다.',
      })
    }
  },

  createTask: async (taskData: CreateTaskData) => {
    const { currentUserId } = get()
    if (!currentUserId) {
      set({ error: '사용자가 로그인되지 않았습니다.' })
      return
    }

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
      
      // 로컬 스토리지에 저장
      const tasksByUser = loadTasksFromStorage()
      tasksByUser[currentUserId] = get().tasks
      saveTasksToStorage(tasksByUser)
      
      get().updateStats()
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : '태스크 생성에 실패했습니다.',
      })
    }
  },

  updateTask: async (id: string, taskData: UpdateTaskData) => {
    const { currentUserId } = get()
    if (!currentUserId) {
      set({ error: '사용자가 로그인되지 않았습니다.' })
      return
    }

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
      
      // 로컬 스토리지에 저장
      const tasksByUser = loadTasksFromStorage()
      tasksByUser[currentUserId] = get().tasks
      saveTasksToStorage(tasksByUser)
      
      get().updateStats()
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : '태스크 수정에 실패했습니다.',
      })
    }
  },

  deleteTask: async (id: string) => {
    const { currentUserId } = get()
    if (!currentUserId) {
      set({ error: '사용자가 로그인되지 않았습니다.' })
      return
    }

    set({ isLoading: true, error: null })
    
    try {
      // TODO: 실제 API 호출로 대체
      await new Promise(resolve => setTimeout(resolve, 500))
      
      set(state => ({
        tasks: state.tasks.filter(task => task.id !== id),
        isLoading: false,
      }))
      
      // 로컬 스토리지에 저장
      const tasksByUser = loadTasksFromStorage()
      tasksByUser[currentUserId] = get().tasks
      saveTasksToStorage(tasksByUser)
      
      get().updateStats()
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : '태스크 삭제에 실패했습니다.',
      })
    }
  },

  toggleTaskCompletion: async (id: string) => {
    const { currentUserId } = get()
    if (!currentUserId) {
      set({ error: '사용자가 로그인되지 않았습니다.' })
      return
    }

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
      
      // 로컬 스토리지에 저장
      const tasksByUser = loadTasksFromStorage()
      tasksByUser[currentUserId] = get().tasks
      saveTasksToStorage(tasksByUser)
      
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