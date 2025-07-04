export interface ApiResponse<T = any> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface ApiError {
  message: string
  code?: string
  details?: Record<string, any>
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
} 