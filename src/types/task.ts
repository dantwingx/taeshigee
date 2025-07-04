export interface Task {
  id: string
  title: string
  description?: string
  dueDate?: string
  recurrenceType?: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom'
  recurrenceDetail?: Record<string, any>
  importance: 'low' | 'medium' | 'high'
  priority: 'low' | 'medium' | 'high'
  isCompleted: boolean
  tags: string[]
  category?: string
  attachments?: Attachment[]
  subtasks?: Subtask[]
  createdAt: string
  updatedAt: string
}

export interface Attachment {
  id: string
  fileName: string
  fileUrl: string
  fileType: string
  fileSize: number
  uploadedAt: string
}

export interface Subtask {
  id: string
  content: string
  isCompleted: boolean
}

export interface CreateTaskData {
  title: string
  description?: string
  dueDate?: string
  recurrenceType?: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom'
  recurrenceDetail?: Record<string, any>
  importance?: 'low' | 'medium' | 'high'
  priority?: 'low' | 'medium' | 'high'
  tags?: string[]
  category?: string
}

export interface UpdateTaskData extends Partial<CreateTaskData> {
  isCompleted?: boolean
}

export interface TaskFilters {
  view?: 'daily' | 'weekly' | 'monthly'
  date?: string
  tags?: string[]
  hideCompleted?: boolean
  sortBy?: 'dueDate' | 'priority' | 'importance' | 'createdAt'
  order?: 'asc' | 'desc'
}

export interface TaskStats {
  total: number
  completed: number
  pending: number
  completionRate: number
} 