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
  userId: string // 사용자 ID (변경 가능)
  userNumber: number // 사용자 번호 (변경 불가, 태스크 소유권 식별용)
  likes: number[] // 좋아요한 사용자 번호 배열
  author?: string // 작성자 이름 (백엔드에서 제공)
}

export type CreateTaskData = Omit<Task, 'id' | 'isCompleted' | 'createdAt' | 'updatedAt' | 'userId' | 'likes'>

export type UpdateTaskData = Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'userId' | 'likes'>>

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

// 좋아요 관련 타입
export interface LikeInfo {
  taskId: string
  userId: string
  timestamp: string
} 