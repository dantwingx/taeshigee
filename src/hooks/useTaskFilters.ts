import { useState, useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Task } from '@/types/task'
import { SEARCH_CONSTANTS } from '@/utils/constants'

export type TaskStatus = 'all' | 'completed' | 'incomplete'
export type TaskImportance = 'all' | 'low' | 'medium' | 'high'
export type TaskPriority = 'all' | 'low' | 'medium' | 'high'
export type TaskSortBy = 'createdAt' | 'dueDate' | 'title' | 'importance' | 'priority'
export type TaskSortOrder = 'asc' | 'desc'

interface UseTaskFiltersOptions {
  tasks: Task[]
  initialStatus?: TaskStatus
  initialImportance?: TaskImportance
  initialPriority?: TaskPriority
  initialSortBy?: TaskSortBy
  initialSortOrder?: TaskSortOrder
  initialSearchTerm?: string
}

interface UseTaskFiltersReturn {
  // 필터 상태
  status: TaskStatus
  importance: TaskImportance
  priority: TaskPriority
  sortBy: TaskSortBy
  sortOrder: TaskSortOrder
  searchTerm: string
  
  // 필터 변경 함수
  setStatus: (status: TaskStatus) => void
  setImportance: (importance: TaskImportance) => void
  setPriority: (priority: TaskPriority) => void
  setSortBy: (sortBy: TaskSortBy) => void
  setSortOrder: (sortOrder: TaskSortOrder) => void
  setSearchTerm: (searchTerm: string) => void
  
  // 필터 초기화
  resetFilters: () => void
  
  // 필터링된 결과
  filteredTasks: Task[]
  
  // 통계
  totalTasks: number
  filteredCount: number
  
  // 정렬 옵션
  sortOptions: Array<{ value: TaskSortBy; label: string }>
}

export function useTaskFilters({
  tasks,
  initialStatus = 'all',
  initialImportance = 'all',
  initialPriority = 'all',
  initialSortBy = 'createdAt',
  initialSortOrder = 'desc',
  initialSearchTerm = '',
}: UseTaskFiltersOptions): UseTaskFiltersReturn {
  const { t } = useTranslation()
  
  // 필터 상태
  const [status, setStatus] = useState<TaskStatus>(initialStatus)
  const [importance, setImportance] = useState<TaskImportance>(initialImportance)
  const [priority, setPriority] = useState<TaskPriority>(initialPriority)
  const [sortBy, setSortBy] = useState<TaskSortBy>(initialSortBy)
  const [sortOrder, setSortOrder] = useState<TaskSortOrder>(initialSortOrder)
  const [searchTerm, setSearchTerm] = useState<string>(initialSearchTerm)

  // 정렬 옵션
  const sortOptions = useMemo(() => [
    { value: 'createdAt' as TaskSortBy, label: t('sort.createdAt') },
    { value: 'dueDate' as TaskSortBy, label: t('sort.dueDate') },
    { value: 'title' as TaskSortBy, label: t('sort.title') },
    { value: 'importance' as TaskSortBy, label: t('sort.importance') },
    { value: 'priority' as TaskSortBy, label: t('sort.priority') },
  ], [t])

  // 필터 초기화
  const resetFilters = useCallback(() => {
    setStatus(initialStatus)
    setImportance(initialImportance)
    setPriority(initialPriority)
    setSortBy(initialSortBy)
    setSortOrder(initialSortOrder)
    setSearchTerm(initialSearchTerm)
  }, [initialStatus, initialImportance, initialPriority, initialSortBy, initialSortOrder, initialSearchTerm])

  // 필터링된 태스크
  const filteredTasks = useMemo(() => {
    let result = [...tasks]

    // 검색어 필터링
    if (searchTerm.trim().length >= SEARCH_CONSTANTS.MIN_SEARCH_LENGTH) {
      const searchLower = searchTerm.toLowerCase().trim()
      result = result.filter(task => 
        task.title.toLowerCase().includes(searchLower) ||
        (task.description && task.description.toLowerCase().includes(searchLower)) ||
        (task.tags && task.tags.some(tag => tag.toLowerCase().includes(searchLower))) ||
        (task.category && task.category.toLowerCase().includes(searchLower))
      )
    }

    // 상태 필터링
    if (status !== 'all') {
      result = result.filter(task => 
        status === 'completed' ? task.isCompleted : !task.isCompleted
      )
    }

    // 중요도 필터링
    if (importance !== 'all') {
      result = result.filter(task => task.importance === importance)
    }

    // 우선순위 필터링
    if (priority !== 'all') {
      result = result.filter(task => task.priority === priority)
    }

    // 정렬
    result.sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          break
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) comparison = 0
          else if (!a.dueDate) comparison = 1
          else if (!b.dueDate) comparison = -1
          else comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
          break
        case 'title':
          comparison = a.title.localeCompare(b.title)
          break
        case 'importance':
          const importanceOrder = { low: 1, medium: 2, high: 3 }
          comparison = importanceOrder[a.importance] - importanceOrder[b.importance]
          break
        case 'priority':
          const priorityOrder = { low: 1, medium: 2, high: 3 }
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority]
          break
        default:
          comparison = 0
      }

      return sortOrder === 'asc' ? comparison : -comparison
    })

    return result
  }, [tasks, searchTerm, status, importance, priority, sortBy, sortOrder])

  // 통계
  const totalTasks = tasks.length
  const filteredCount = filteredTasks.length

  return {
    // 필터 상태
    status,
    importance,
    priority,
    sortBy,
    sortOrder,
    searchTerm,
    
    // 필터 변경 함수
    setStatus,
    setImportance,
    setPriority,
    setSortBy,
    setSortOrder,
    setSearchTerm,
    
    // 필터 초기화
    resetFilters,
    
    // 필터링된 결과
    filteredTasks,
    
    // 통계
    totalTasks,
    filteredCount,
    
    // 정렬 옵션
    sortOptions,
  }
} 