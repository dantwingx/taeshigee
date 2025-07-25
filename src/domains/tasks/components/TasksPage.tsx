import { useState, useEffect, useMemo } from 'react'
import { Plus, Search, Filter, SortAsc, SortDesc, ChevronDown, ChevronUp } from 'lucide-react'
import { TaskForm } from './TaskForm'
import { TaskCard } from './TaskCard'
import { Select } from '@/components/ui/Select'
import { useTaskStore } from '@/stores/taskStore'
import { useAuthStore } from '@/stores/authStore'
import type { Task, CreateTaskData, UpdateTaskData } from '@/types/task'
import { useTranslation } from 'react-i18next'
import { useToastStore } from '@/stores'

type SortField = 'createdAt' | 'dueDate' | 'title' | 'importance' | 'priority'
type SortOrder = 'asc' | 'desc'
type FilterStatus = 'all' | 'completed' | 'pending' | 'overdue'

export function TasksPage() {
  const { currentUser } = useAuthStore()
  const {
    isLoading,
    error,
    createTask,
    updateTask,
    deleteTask,
    duplicateTask,
    toggleTaskCompletion,
    getTasksByUserNumber,
  } = useTaskStore()

  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const { defaultFilter } = useTaskStore()
  const [statusFilter, setStatusFilter] = useState<FilterStatus>(defaultFilter.statusFilter as FilterStatus)
  const [categoryFilter, setCategoryFilter] = useState(defaultFilter.categoryFilter)
  const [importanceFilter, setImportanceFilter] = useState(defaultFilter.importanceFilter)
  const [priorityFilter, setPriorityFilter] = useState(defaultFilter.priorityFilter)
  const [publicFilter, setPublicFilter] = useState(defaultFilter.publicFilter)
  const [dueDateFrom, setDueDateFrom] = useState('')
  const [dueDateTo, setDueDateTo] = useState('')
  const [sortField, setSortField] = useState<SortField>('createdAt')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [isFilterExpanded, setIsFilterExpanded] = useState(false)

  const { t } = useTranslation()
  const { showToast } = useToastStore()

  // taskStore에서 currentUserNumber 직접 사용
  const currentUserNumber = useTaskStore(state => state.currentUserNumber)
  
  // 컴포넌트 마운트 시 defaultFilter 초기화
  useEffect(() => {
    const { setDefaultFilter } = useTaskStore.getState()
    setDefaultFilter({
      statusFilter: 'all',
      categoryFilter: '',
      importanceFilter: 'all',
      priorityFilter: 'all',
      publicFilter: 'all'
    })
  }, [])
  
  // 사용자별 태스크 필터링 - currentUserNumber를 사용하여 태스크 가져오기
  const userTasks = currentUserNumber ? getTasksByUserNumber(currentUserNumber) : []
  
  // 디버그 로그 추가
  console.log('[TasksPage] 사용자별 태스크 필터링:', {
    currentUserNumber,
    currentUser: currentUser ? { id: currentUser.id, userNumber: currentUser.userNumber, email: currentUser.email } : null,
    userTasksCount: userTasks.length,
    userTasks: userTasks.map(task => ({ id: task.id, title: task.title, userNumber: task.userNumber }))
  })

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

    // 마감일 기간 필터
    if (dueDateFrom || dueDateTo) {
      filtered = filtered.filter(task => {
        if (!task.dueDate) return false
        
        const taskDueDate = new Date(task.dueDate)
        const fromDate = dueDateFrom ? new Date(dueDateFrom) : null
        const toDate = dueDateTo ? new Date(dueDateTo) : null
        
        if (fromDate && toDate) {
          return taskDueDate >= fromDate && taskDueDate <= toDate
        } else if (fromDate) {
          return taskDueDate >= fromDate
        } else if (toDate) {
          return taskDueDate <= toDate
        }
        
        return true
      })
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
    try {
      await deleteTask(id)
      showToast('success', t('toast.taskDeleted'))
    } catch (error) {
      console.error('Delete task error:', error)
      showToast('error', t('toast.error'))
    }
  }

  const handleToggleComplete = async (id: string) => {
    try {
      await toggleTaskCompletion(id)
    } catch (error) {
      console.error('Toggle completion error:', error)
      // 에러는 이미 taskStore에서 처리되므로 추가 처리 불필요
    }
  }

  const handleDuplicateTask = async (id: string) => {
    try {
      await duplicateTask(id)
    } catch (error) {
      console.error('Duplicate task error:', error)
      // 에러는 이미 taskStore에서 처리되므로 추가 처리 불필요
    }
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
    setDueDateFrom('')
    setDueDateTo('')
  }

  const toggleFilterExpansion = () => {
    setIsFilterExpanded(!isFilterExpanded)
  }

  return (
    <div className="space-y-4">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">{t('navigation.tasks')}</h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {t('task.totalTasksDisplay', { shown: filteredTasks.length, total: userTasks.length })}
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

      {/* 검색 + 고급필터 토글 */}
      <div className="flex items-center gap-2 mb-2">
        <div className="flex items-center w-full rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 px-3 py-2 focus-within:ring-2 focus-within:ring-primary-500">
          <Search className="shrink-0 h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
          <input
            type="text"
            placeholder={t('task.searchTasks')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 border-none focus:ring-0"
          />
        </div>
        <button
          onClick={toggleFilterExpansion}
          className="ml-2 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center"
          aria-label={isFilterExpanded ? t('common.collapse') : t('common.expand')}
        >
          <Filter className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          {isFilterExpanded
            ? <ChevronUp className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            : <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />}
        </button>
      </div>

      {/* 필터 영역 */}
      {isFilterExpanded && (
        <div className="space-y-3 mb-4">
          {/* 필터 조건들 */}
          <div className="flex flex-wrap gap-2 items-center">
            <Select
              value={statusFilter}
              onChange={v => setStatusFilter(v as FilterStatus)}
              options={[
                { value: 'all', label: t('task.filterByStatus') + ': ' + t('common.all') },
                { value: 'pending', label: t('task.filterByStatus') + ': ' + t('task.incomplete') },
                { value: 'completed', label: t('task.filterByStatus') + ': ' + t('task.completed') },
                { value: 'overdue', label: t('task.filterByStatus') + ': ' + t('common.overdue') },
              ]}
              className="min-w-[120px] w-auto"
            />
            <Select
              value={importanceFilter}
              onChange={v => setImportanceFilter(v)}
              options={[
                { value: 'all', label: t('task.importance') + ': ' + t('common.all') },
                { value: 'low', label: t('task.importance') + ': ' + t('task.importanceLow') },
                { value: 'medium', label: t('task.importance') + ': ' + t('task.importanceMedium') },
                { value: 'high', label: t('task.importance') + ': ' + t('task.importanceHigh') },
              ]}
              className="min-w-[120px] w-auto"
            />
            <Select
              value={priorityFilter}
              onChange={v => setPriorityFilter(v)}
              options={[
                { value: 'all', label: t('task.priority') + ': ' + t('common.all') },
                { value: 'low', label: t('task.priority') + ': ' + t('task.priorityLow') },
                { value: 'medium', label: t('task.priority') + ': ' + t('task.priorityMedium') },
                { value: 'high', label: t('task.priority') + ': ' + t('task.priorityHigh') },
              ]}
              className="min-w-[120px] w-auto"
            />
            <Select
              value={publicFilter}
              onChange={v => setPublicFilter(v)}
              options={[
                { value: 'all', label: t('task.isPublic') + ': ' + t('common.all') },
                { value: 'private', label: t('task.isPublic') + ': ' + t('common.private') },
                { value: 'public', label: t('task.isPublic') + ': ' + t('common.public') },
              ]}
              className="min-w-[120px] w-auto"
            />
            <div className="flex-1 flex justify-end">
              <button
                onClick={clearFilters}
                className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
              >
                {t('common.reset')}
              </button>
            </div>
          </div>

          {/* 마감일 기간 검색 */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{t('task.dueDate')}:</span>
            <input
              type="date"
              value={dueDateFrom}
              onChange={(e) => setDueDateFrom(e.target.value)}
              className="px-3 py-1 text-sm border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
              placeholder={t('task.dueDate') + ' (시작)'}
            />
            <span className="text-sm text-neutral-500">~</span>
            <input
              type="date"
              value={dueDateTo}
              onChange={(e) => setDueDateTo(e.target.value)}
              className="px-3 py-1 text-sm border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
              placeholder={t('task.dueDate') + ' (종료)'}
            />
          </div>

          {/* 정렬 옵션들 */}
          <div className="flex flex-wrap gap-2 items-center pt-2 border-t border-neutral-200 dark:border-neutral-700">
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{t('common.sort')}:</span>
            <Select
              value={sortField}
              onChange={(value) => setSortField(value as SortField)}
              options={[
                { value: 'createdAt', label: t('task.createdAt') },
                { value: 'dueDate', label: t('task.dueDate') },
                { value: 'title', label: t('task.title') },
                { value: 'importance', label: t('task.importance') },
                { value: 'priority', label: t('task.priority') },
              ]}
              className="min-w-[100px] w-auto"
            />
            <button
              onClick={toggleSortOrder}
              className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
              title={sortOrder === 'asc' ? t('common.sortAsc') : t('common.sortDesc')}
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

      {/* 고급 필터 (폴딩) */}
      {isFilterExpanded && (
        <div className="space-y-3 pt-3 border-t">
          {/* (고급 필터 내용은 필요시 추가) */}
        </div>
      )}

      {/* 태스크 목록 */}
      <div className="space-y-3">
        {sortedTasks.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-neutral-500 mb-4">
              {filteredTasks.length === 0 && userTasks.length > 0
                ? t('task.noTasksFound')
                : t('task.noTasks')}
            </p>
            {filteredTasks.length === 0 && userTasks.length > 0 && (
              <button
                onClick={clearFilters}
                className="btn-secondary"
              >
                {t('common.reset')}
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
              onDuplicate={handleDuplicateTask}
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