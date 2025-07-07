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
  likesCount?: number // 좋아요 개수 (백엔드에서 동기화)
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

export interface TaskTemplate {
  id: string
  name: string
  emoji: string
  title: string
  description: string
  tags: string[]
  duration: number // 일 단위
  category: 'health' | 'work' | 'study' | 'hobby' | 'daily' | 'custom'
  isPopular?: boolean
  // 자동 설정을 위한 추가 데이터
  autoSettings?: {
    category?: string
    importance?: 'low' | 'medium' | 'high'
    priority?: 'low' | 'medium' | 'high'
    isPublic?: boolean
    dueTime?: string // HH:mm 형식
    reminderTime?: string // HH:mm 형식
  }
}

export interface EmojiCategory {
  id: string
  name: string
  emojis: string[]
} 