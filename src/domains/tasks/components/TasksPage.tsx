import { useState, useEffect, useMemo } from 'react'
import { Plus, Search, Filter, SortAsc, SortDesc } from 'lucide-react'
import { TaskForm } from './TaskForm'
import { TaskCard } from './TaskCard'
import { Select } from '@/components/ui/Select'
import { useTaskStore } from '@/stores/taskStore'
import type { Task, CreateTaskData, UpdateTaskData } from '@/types/task'

type SortField = 'createdAt' | 'dueDate' | 'title' | 'importance' | 'priority'
type SortOrder = 'asc' | 'desc'
type FilterStatus = 'all' | 'completed' | 'pending' | 'overdue'

export function TasksPage() {
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
  const [sortField, setSortField] = useState<SortField>('createdAt')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')

  // 카테고리 옵션 생성
  const categoryOptions = useMemo(() => {
    const categories = Array.from(new Set(tasks.map(task => task.category).filter(Boolean) as string[]))
    return [
      { value: '', label: '전체 카테고리' },
      ...categories.map(category => ({ value: category, label: category }))
    ]
  }, [tasks])

  // 필터링된 태스크
  const filteredTasks = useMemo(() => {
    let filtered = tasks

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

    return filtered
  }, [tasks, searchTerm, statusFilter, categoryFilter])

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">모든 태스크</h1>
          <p className="text-neutral-600">태스크를 관리하고 진행 상황을 확인하세요</p>
        </div>
        <button
          onClick={() => setIsTaskFormOpen(true)}
          className="btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          새 태스크
        </button>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="p-4 rounded-lg bg-error-50 border border-error-200">
          <p className="text-sm text-error-700">{error}</p>
        </div>
      )}

      {/* 필터 및 검색 */}
      <div className="card">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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

          {/* 상태 필터 */}
          <Select
            value={statusFilter}
            onChange={(value) => setStatusFilter(value as FilterStatus)}
            options={[
              { value: 'all', label: '전체' },
              { value: 'pending', label: '진행 중' },
              { value: 'completed', label: '완료됨' },
              { value: 'overdue', label: '지연됨' },
            ]}
          />

          {/* 카테고리 필터 */}
          <Select
            value={categoryFilter}
            onChange={setCategoryFilter}
            options={categoryOptions}
          />

          {/* 정렬 */}
          <div className="flex space-x-2">
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
            />
            <button
              onClick={toggleSortOrder}
              className="p-2 rounded-lg border border-neutral-300 hover:bg-neutral-50 transition-colors"
            >
              {sortOrder === 'asc' ? (
                <SortAsc className="h-4 w-4 text-neutral-600" />
              ) : (
                <SortDesc className="h-4 w-4 text-neutral-600" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 태스크 목록 */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-neutral-900">
            태스크 목록 ({sortedTasks.length}개)
          </h2>
          {(searchTerm || statusFilter !== 'all' || categoryFilter) && (
            <button
              onClick={() => {
                setSearchTerm('')
                setStatusFilter('all')
                setCategoryFilter('')
              }}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              필터 초기화
            </button>
          )}
        </div>

        {sortedTasks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-neutral-500 mb-2">
              {searchTerm || statusFilter !== 'all' || categoryFilter
                ? '검색 조건에 맞는 태스크가 없습니다.'
                : '아직 태스크가 없습니다.'}
            </p>
            {!searchTerm && statusFilter === 'all' && !categoryFilter && (
              <button
                onClick={() => setIsTaskFormOpen(true)}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                첫 번째 태스크를 추가해보세요
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {sortedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleComplete={handleToggleComplete}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                isLoading={isLoading}
              />
            ))}
          </div>
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