export type Task = {
  id: string
  title: string
  description?: string
  dueDate?: string
  dueTime?: string
  importance: 'low' | 'medium' | 'high'
  priority: 'low' | 'medium' | 'high'
  category?: string
  tags: string[]
  isCompleted: boolean
  isPublic: boolean
  createdAt: string
  updatedAt: string
  userId: string
}

export type CreateTaskData = Omit<Task, 'id' | 'isCompleted' | 'createdAt' | 'updatedAt' | 'userId'>

export type UpdateTaskData = Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'userId'>>

export type TaskStats = {
  total: number
  completed: number
  pending: number
  overdue: number
  completionRate: number
}

// 태그 관리용 타입 추가
export interface TagStats {
  name: string
  count: number
  color?: string
} 