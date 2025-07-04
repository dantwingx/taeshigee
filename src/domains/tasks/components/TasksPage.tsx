import { useState, useEffect, useMemo } from 'react'
import { Plus, Search, Filter, SortAsc, SortDesc, AlertTriangle, Target, Eye, EyeOff, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react'
import { TaskForm } from './TaskForm'
import { TaskCard } from './TaskCard'
import { Select } from '@/components/ui/Select'
import { useTaskStore } from '@/stores/taskStore'
import { useAuthStore } from '@/stores/authStore'
import type { Task, CreateTaskData, UpdateTaskData } from '@/types/task'

type SortField = 'createdAt' | 'dueDate' | 'title' | 'importance' | 'priority'
type SortOrder = 'asc' | 'desc'
type FilterStatus = 'all' | 'completed' | 'pending' | 'overdue'

export function TasksPage() {
  const { user } = useAuthStore()
  const {
    tasks,
    isLoading,
    error,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
  } = useTaskStore()

  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [importanceFilter, setImportanceFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [publicFilter, setPublicFilter] = useState('all')
  const [sortField, setSortField] = useState<SortField>('createdAt')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [isFilterExpanded, setIsFilterExpanded] = useState(false)

  // 사용자별 태스크 필터링
  const userTasks = user ? tasks.filter(task => task.userId === user.id) : []

  // 카테고리 옵션 생성
  const categoryOptions = useMemo(() => {
    const categories = Array.from(new Set(userTasks.map(task => task.category).filter(Boolean) as string[]))
    return [
      { value: '', label: '전체 카테고리' },
      ...categories.map(category => ({ value: category, label: category }))
    ]
  }, [userTasks])

  // 필터링된 태스크
  const filteredTasks = useMemo(() => {
    let filtered = userTasks

    // 검색 필터
    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // 상태 필터
    switch (statusFilter) {
      case 'completed':
        filtered = filtered.filter(task => task.isCompleted)
        break
      case 'pending':
        filtered = filtered.filter(task => !task.isCompleted)
        break
      case 'overdue':
        filtered = filtered.filter(task => {
          if (!task.dueDate || task.isCompleted) return false
          return new Date(task.dueDate) < new Date()
        })
        break
    }

    // 카테고리 필터
    if (categoryFilter) {
      filtered = filtered.filter(task => task.category === categoryFilter)
    }

    // 중요도 필터
    if (importanceFilter !== 'all') {
      filtered = filtered.filter(task => task.importance === importanceFilter)
    }

    // 우선순위 필터
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(task => task.priority === priorityFilter)
    }

    // 공개 여부 필터
    if (publicFilter !== 'all') {
      const isPublic = publicFilter === 'public'
      filtered = filtered.filter(task => task.isPublic === isPublic)
    }

    return filtered
  }, [userTasks, searchTerm, statusFilter, categoryFilter, importanceFilter, priorityFilter, publicFilter])

  // 정렬된 태스크
  const sortedTasks = useMemo(() => {
    return [...filteredTasks].sort((a, b) => {
      let aValue: any
      let bValue: any

      switch (sortField) {
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime()
          bValue = new Date(b.createdAt).getTime()
          break
        case 'dueDate':
          aValue = a.dueDate ? new Date(a.dueDate).getTime() : 0
          bValue = b.dueDate ? new Date(b.dueDate).getTime() : 0
          break
        case 'title':
          aValue = a.title.toLowerCase()
          bValue = b.title.toLowerCase()
          break
        case 'importance':
          const importanceOrder = { low: 1, medium: 2, high: 3 }
          aValue = importanceOrder[a.importance]
          bValue = importanceOrder[b.importance]
          break
        case 'priority':
          const priorityOrder = { low: 1, medium: 2, high: 3 }
          aValue = priorityOrder[a.priority]
          bValue = priorityOrder[b.priority]
          break
        default:
          return 0
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })
  }, [filteredTasks, sortField, sortOrder])

  const handleCreateTask = async (data: CreateTaskData) => {
    await createTask(data)
  }

  const handleUpdateTask = async (data: UpdateTaskData) => {
    if (editingTask) {
      await updateTask(editingTask.id, data)
      setEditingTask(null)
    }
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setIsTaskFormOpen(true)
  }

  const handleDeleteTask = async (id: string) => {
    if (window.confirm('정말로 이 태스크를 삭제하시겠습니까?')) {
      await deleteTask(id)
    }
  }

  const handleToggleComplete = async (id: string) => {
    await toggleTaskCompletion(id)
  }

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
  }

  const clearFilters = () => {
    setSearchTerm('')
    setStatusFilter('all')
    setCategoryFilter('')
    setImportanceFilter('all')
    setPriorityFilter('all')
    setPublicFilter('all')
  }

  const toggleFilterExpansion = () => {
    setIsFilterExpanded(!isFilterExpanded)
  }

  return (
    <div className="space-y-4">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">모든 태스크</h1>
          <p className="text-sm text-neutral-600">
            총 {userTasks.length}개 중 {filteredTasks.length}개 표시
          </p>
        </div>
        <button
          onClick={() => setIsTaskFormOpen(true)}
          className="btn-primary p-3 rounded-full shadow-lg"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="p-3 rounded-lg bg-error-50 border border-error-200">
          <p className="text-sm text-error-700">{error}</p>
        </div>
      )}

      {/* 검색 및 필터 */}
      <div className="card p-4 space-y-3">
        {/* 검색 */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="태스크 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>

        {/* 기본 필터 (항상 표시) */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-neutral-600" />
            <span className="text-sm font-medium text-neutral-700">상태</span>
          </div>
          <div className="flex items-center space-x-2">
            {[
              { value: 'all', label: '전체' },
              { value: 'pending', label: '진행 중' },
              { value: 'completed', label: '완료됨' },
              { value: 'overdue', label: '지연됨' },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setStatusFilter(option.value as FilterStatus)}
                className={`px-3 py-1 rounded-lg border-2 transition-colors text-xs ${
                  statusFilter === option.value
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* 고급 필터 토글 */}
        <div className="flex items-center justify-between">
          <button
            onClick={toggleFilterExpansion}
            className="flex items-center space-x-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <Filter className="h-4 w-4" />
            <span>고급 필터</span>
            {isFilterExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          <button
            onClick={clearFilters}
            className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            초기화
          </button>
        </div>

        {/* 고급 필터 (폴딩) */}
        {isFilterExpanded && (
          <div className="space-y-3 pt-3 border-t">
            {/* 중요도 필터 */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-neutral-700 mb-2">
                <AlertTriangle className="h-4 w-4" />
                <span>중요도</span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { value: 'all', label: '전체', icon: '🔍' },
                  { value: 'low', label: '낮음', icon: '🟢' },
                  { value: 'medium', label: '보통', icon: '🟡' },
                  { value: 'high', label: '높음', icon: '🔴' },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setImportanceFilter(option.value)}
                    className={`p-2 rounded-lg border-2 transition-colors text-xs ${
                      importanceFilter === option.value
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-1">
                      <span className="text-xs">{option.icon}</span>
                      <span className="text-xs">{option.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 우선순위 필터 */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-neutral-700 mb-2">
                <Target className="h-4 w-4" />
                <span>우선순위</span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { value: 'all', label: '전체', icon: '🔍' },
                  { value: 'low', label: '낮음', icon: '📌' },
                  { value: 'medium', label: '보통', icon: '📍' },
                  { value: 'high', label: '높음', icon: '🎯' },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setPriorityFilter(option.value)}
                    className={`p-2 rounded-lg border-2 transition-colors text-xs ${
                      priorityFilter === option.value
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-1">
                      <span className="text-xs">{option.icon}</span>
                      <span className="text-xs">{option.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 공개 여부 필터 */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-neutral-700 mb-2">
                <Eye className="h-4 w-4" />
                <span>공개 여부</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'all', label: '전체', icon: '🔍' },
                  { value: 'private', label: '비공개', icon: '👁️‍🗨️' },
                  { value: 'public', label: '공개', icon: '👁️' },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setPublicFilter(option.value)}
                    className={`p-2 rounded-lg border-2 transition-colors text-xs ${
                      publicFilter === option.value
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-1">
                      <span className="text-xs">{option.icon}</span>
                      <span className="text-xs">{option.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 정렬 */}
            <div className="flex items-center space-x-2">
              <Select
                value={sortField}
                onChange={(value) => setSortField(value as SortField)}
                options={[
                  { value: 'createdAt', label: '생성일' },
                  { value: 'dueDate', label: '마감일' },
                  { value: 'title', label: '제목' },
                  { value: 'importance', label: '중요도' },
                  { value: 'priority', label: '우선순위' },
                ]}
                className="w-32"
              />
              <button
                onClick={toggleSortOrder}
                className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
              >
                {sortOrder === 'asc' ? (
                  <SortAsc className="h-4 w-4 text-neutral-500" />
                ) : (
                  <SortDesc className="h-4 w-4 text-neutral-500" />
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 태스크 목록 */}
      <div className="space-y-3">
        {sortedTasks.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-neutral-500 mb-4">
              {filteredTasks.length === 0 && userTasks.length > 0
                ? '검색 조건에 맞는 태스크가 없습니다.'
                : '아직 태스크가 없습니다. 새 태스크를 추가해보세요!'}
            </p>
            {filteredTasks.length === 0 && userTasks.length > 0 && (
              <button
                onClick={clearFilters}
                className="btn-secondary"
              >
                필터 초기화
              </button>
            )}
          </div>
        ) : (
          sortedTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleComplete={handleToggleComplete}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              isLoading={isLoading}
            />
          ))
        )}
      </div>

      {/* 태스크 생성/수정 모달 */}
      <TaskForm
        isOpen={isTaskFormOpen}
        onClose={() => {
          setIsTaskFormOpen(false)
          setEditingTask(null)
        }}
        task={editingTask}
        onSubmit={async (data) => {
          if (editingTask) {
            await handleUpdateTask(data as UpdateTaskData)
          } else {
            await handleCreateTask(data as CreateTaskData)
          }
        }}
        isLoading={isLoading}
      />
    </div>
  )
} 