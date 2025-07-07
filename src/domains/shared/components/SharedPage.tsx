import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { FaUser } from 'react-icons/fa'
import { Calendar, Tag, MoreVertical, Copy, Heart, Eye, Clock, Search, AlertTriangle, Target, Plus, ChevronDown, ChevronUp, CheckCircle, Filter, SortAsc, SortDesc, User } from 'lucide-react'
import { useTaskStore } from '@/stores/taskStore'
import { useAuthStore } from '@/stores/authStore'
import { useToastStore } from '@/stores'
import { Modal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'
import { formatDueDateTime, formatLocalDate, formatLocalDateTime, formatRelativeTime } from '@/utils/dateUtils'
import i18next from 'i18next'
import { Task } from '@/types/task'
import { useTagStore } from '@/stores'

interface PublicTask extends Task {
  authorName: string
  authorId: string
}

export function SharedPage() {
  const { getAllPublicTasks, duplicateTask, toggleTaskLike, isTaskLikedByUser, getTaskLikeCount, currentUserId, currentUserNumber } = useTaskStore()
  const { showToast } = useToastStore()
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  // 필터/정렬 상태 추가 (TasksPage와 동일)
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending' | 'overdue'>('all')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [importanceFilter, setImportanceFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [sortField, setSortField] = useState<'createdAt' | 'dueDate' | 'title' | 'importance' | 'priority'>('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [isFilterExpanded, setIsFilterExpanded] = useState(false)

  // 공개 태스크 목록을 store에서 직접 가져옴
  const publicTasks = getAllPublicTasks()

  // 카테고리 옵션 생성 (공개 태스크 기준)
  const categoryOptions = Array.from(new Set(publicTasks.map(task => task.category).filter(Boolean) as string[]))
  const categorySelectOptions = [
    { value: '', label: t('task.filterByCategory') },
    ...categoryOptions.map(category => ({ value: category, label: category }))
  ]

  // 필터링된 태스크 (TasksPage와 동일한 순서)
  const filteredTasks = publicTasks.filter(task => {
    // 검색
    if (searchTerm && !(
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      task.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    )) return false
    // 상태
    switch (statusFilter) {
      case 'completed':
        if (!task.isCompleted) return false
        break
      case 'pending':
        if (task.isCompleted) return false
        break
      case 'overdue':
        if (!task.dueDate || task.isCompleted) return false
        if (new Date(task.dueDate) >= new Date()) return false
        break
    }
    // 카테고리
    if (categoryFilter && task.category !== categoryFilter) return false
    // 중요도
    if (importanceFilter !== 'all' && task.importance !== importanceFilter) return false
    // 우선순위
    if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false
    return true
  })

  // 정렬
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    let aValue: any, bValue: any
    switch (sortField) {
      case 'createdAt':
        aValue = new Date(a.createdAt).getTime(); bValue = new Date(b.createdAt).getTime(); break
      case 'dueDate':
        aValue = a.dueDate ? new Date(a.dueDate).getTime() : 0; bValue = b.dueDate ? new Date(b.dueDate).getTime() : 0; break
      case 'title':
        aValue = a.title.toLowerCase(); bValue = b.title.toLowerCase(); break
      case 'importance':
        const importanceOrder = { low: 1, medium: 2, high: 3 }
        aValue = importanceOrder[a.importance]; bValue = importanceOrder[b.importance]; break
      case 'priority':
        const priorityOrder = { low: 1, medium: 2, high: 3 }
        aValue = priorityOrder[a.priority]; bValue = priorityOrder[b.priority]; break
      default: return 0
    }
    if (sortOrder === 'asc') return aValue > bValue ? 1 : -1
    else return aValue < bValue ? 1 : -1
  })

  // 필터 리셋
  const clearFilters = () => {
    setSearchTerm('')
    setStatusFilter('all')
    setCategoryFilter('')
    setImportanceFilter('all')
    setPriorityFilter('all')
    setSortField('createdAt')
    setSortOrder('desc')
  }
  const toggleFilterExpansion = () => setIsFilterExpanded(v => !v)
  const toggleSortOrder = () => setSortOrder(o => o === 'asc' ? 'desc' : 'asc')

  // 날짜 포맷팅은 dateUtils 함수 사용

  const { getTagColor } = useTagStore()

  const importanceColors = {
    low: 'bg-success-100 text-success-700 dark:bg-success-900/20 dark:text-success-300',
    medium: 'bg-warning-100 text-warning-700 dark:bg-warning-900/20 dark:text-warning-300',
    high: 'bg-error-100 text-error-700 dark:bg-error-900/20 dark:text-error-300',
  }
  const priorityColors = {
    low: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300',
    medium: 'bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300',
    high: 'bg-error-100 text-error-700 dark:bg-error-900/20 dark:text-error-300',
  }
  const importanceIcons = {
    low: '🟢',
    medium: '🟡',
    high: '🔴',
  }
  const priorityIcons = {
    low: '📌',
    medium: '📍',
    high: '🎯',
  }

  const openTaskDetail = (task: Task) => {
    setSelectedTask(task)
    setIsDetailOpen(true)
  }

  const handleDuplicate = async (id: string) => {
    try {
      await duplicateTask(id)
      showToast('success', t('toast.taskDuplicated'))
    } catch (error) {
      showToast('error', t('toast.error'))
    }
  }

  const handleLike = async (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!currentUserNumber) {
      showToast('error', t('auth.invalidCredentials'))
      return
    }
    
    try {
      await toggleTaskLike(taskId)
      const isLiked = isTaskLikedByUser(taskId, currentUserNumber)
      showToast('success', isLiked ? t('toast.taskLiked') : t('toast.taskUnliked'))
    } catch (error) {
      showToast('error', t('toast.likeError'))
    }
  }

  // 카테고리명 변환 함수
  function getCategoryLabel(category: string) {
    if (!category) return ''
    // 첫글자 대문자
    const key = category.charAt(0).toUpperCase() + category.slice(1)
    return t('task.category' + key)
  }

  return (
    <div className="space-y-4">
      {/* 헤더 */}
      <div>
        <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">{t('shared.title')}</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {t('shared.publicTasks')}
        </p>
      </div>

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
      {/* 필터 전체 영역 */}
      {isFilterExpanded && (
        <div className="flex flex-wrap gap-2 items-center mb-2">
          <Select
            value={statusFilter}
            onChange={v => setStatusFilter(v as any)}
            options={[
              { value: 'all', label: t('task.filterByStatus') + ': ' + t('common.all') },
              { value: 'pending', label: t('task.filterByStatus') + ': ' + t('common.pending') },
              { value: 'completed', label: t('task.filterByStatus') + ': ' + t('common.completed') },
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
            value={categoryFilter}
            onChange={v => setCategoryFilter(v)}
            options={categorySelectOptions}
            className="min-w-[120px] w-auto"
          />
          <Select
            value={sortField}
            onChange={v => setSortField(v as any)}
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
            className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            {sortOrder === 'asc' ? (
              <SortAsc className="h-4 w-4 text-neutral-500" />
            ) : (
              <SortDesc className="h-4 w-4 text-neutral-500" />
            )}
          </button>
          <div className="flex-1 flex justify-end gap-2 min-w-[120px]">
            <button
              onClick={clearFilters}
              className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
            >
              {t('common.reset')}
            </button>
          </div>
        </div>
      )}

      {/* 통계 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">{publicTasks.length}</div>
          <div className="text-sm text-neutral-600 dark:text-neutral-400">{t('shared.publicTasks')}</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-success-600 dark:text-success-400">
            {publicTasks.filter(task => task.isCompleted).length}
          </div>
          <div className="text-sm text-neutral-600 dark:text-neutral-400">{t('home.completedTasks')}</div>
        </div>
      </div>

      {/* 공개 태스크 목록 */}
      <div className="space-y-3">
        {sortedTasks.length === 0 ? (
          <div className="card p-8 text-center">
            <Eye className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
            <p className="text-neutral-500 dark:text-neutral-400 mb-2">
              {searchTerm ? t('task.noTasksFound') : t('shared.noPublicTasks')}
            </p>
            <p className="text-sm text-neutral-400 dark:text-neutral-500">
              {t('shared.publicTasks')}
            </p>
          </div>
        ) : (
          sortedTasks.map((task) => (
            <div
              key={task.id}
              className="card p-4 cursor-pointer hover:shadow-md transition-shadow group relative"
              onClick={() => openTaskDetail(task)}
            >
              {/* 좋아요+복제 버튼 묶음 */}
              <div className="absolute top-2 right-2 flex flex-row gap-2 z-10">
                {/* 좋아요 버튼 */}
                <button
                  className="opacity-100 bg-neutral-100 dark:bg-neutral-700 rounded-full p-1 transition-opacity flex items-center text-xs text-neutral-700 dark:text-neutral-200 hover:bg-red-100 dark:hover:bg-red-700"
                  onClick={(e) => handleLike(task.id, e)}
                  title={currentUserNumber && isTaskLikedByUser(task.id, currentUserNumber) ? t('task.unlike') : t('task.like')}
                >
                  <Heart 
                    className={`h-4 w-4 mr-1 ${
                      currentUserNumber && isTaskLikedByUser(task.id, currentUserNumber) 
                        ? 'text-red-500 fill-current' 
                        : 'text-neutral-500'
                    }`} 
                  />
                  <span className="text-xs">{getTaskLikeCount(task.id)}</span>
                </button>
                {/* 복제 버튼 */}
                <button
                  className="opacity-100 bg-neutral-100 dark:bg-neutral-700 rounded-full p-1 transition-opacity flex items-center text-xs text-neutral-700 dark:text-neutral-200 hover:bg-primary-100 dark:hover:bg-primary-700"
                  onClick={e => { e.stopPropagation(); handleDuplicate(task.id) }}
                  title={t('common.duplicate')}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  {t('common.duplicate')}
                </button>
              </div>
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className={`font-medium text-neutral-900 dark:text-neutral-100 truncate ${
                      task.isCompleted ? 'line-through text-neutral-500' : ''
                    }`}>
                      {task.title}
                    </h3>
                    <Eye className="h-4 w-4 text-primary-600 flex-shrink-0" />
                  </div>
                  
                  {/* 설명 */}
                  {task.description && (
                    <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
                      {task.description}
                    </p>
                  )}

                  {/* 태그 */}
                  {task.tags && task.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {task.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className={`px-2 py-1 rounded-full text-xs font-medium max-w-[100px] truncate break-words ${getTagColor(tag)}`}
                          title={tag}
                        >
                          #{tag}
                        </span>
                      ))}
                      {task.tags.length > 3 && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400">
                          +{task.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* 작성자/작성시간 */}
                  <div className="mt-2 flex items-center gap-x-3 text-xs text-neutral-500 dark:text-neutral-400">
                    <span className="flex items-center gap-x-1">
                      <User className="h-3 w-3" />
                      <span className="truncate max-w-[90px] text-neutral-700 dark:text-neutral-200">{task.author} ({task.userNumber})</span>
                    </span>
                    <span className="flex items-center gap-x-1">
                      <Clock className="h-3 w-3" />
                      <span className="truncate max-w-[90px]" title={formatLocalDateTime(task.createdAt, i18next.language)}>
                        {formatRelativeTime(task.createdAt, t, i18next.language)}
                      </span>
                    </span>
                  </div>

                  {/* 중요도/우선순위 */}
                  <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                    <span className={`px-2 py-1 rounded-full font-medium flex items-center space-x-1 max-w-[120px] truncate break-words ${importanceColors[task.importance]}`}
                      title={t(
                        task.importance === 'low'
                          ? 'task.importanceLow'
                          : task.importance === 'medium'
                          ? 'task.importanceMedium'
                          : 'task.importanceHigh'
                      )}
                    >
                      <AlertTriangle className="h-3 w-3" />
                      <span>
                        {importanceIcons[task.importance]} {task.importance === 'low' ? t('task.importanceLow') : task.importance === 'medium' ? t('task.importanceMedium') : t('task.importanceHigh')}
                      </span>
                    </span>
                    <span className={`px-2 py-1 rounded-full font-medium flex items-center space-x-1 max-w-[120px] truncate break-words ${priorityColors[task.priority]}`}
                      title={t(
                        task.priority === 'low'
                          ? 'task.priorityLow'
                          : task.priority === 'medium'
                          ? 'task.priorityMedium'
                          : 'task.priorityHigh'
                      )}
                    >
                      <Target className="h-3 w-3" />
                      <span>
                        {priorityIcons[task.priority]} {task.priority === 'low' ? t('task.priorityLow') : (task.priority === 'medium' ? t('task.priorityMedium') : t('task.priorityHigh'))}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 태스크 상세 모달 */}
      {selectedTask && isDetailOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-neutral-800 rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">{t('shared.viewTaskDetails')}</h2>
                <button
                  onClick={() => setIsDetailOpen(false)}
                  className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-neutral-900 dark:text-neutral-100 mb-2">{selectedTask.title}</h3>
                  {selectedTask.description && (
                    <p className="text-sm text-neutral-600 dark:text-neutral-300">{selectedTask.description}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-neutral-600 dark:text-neutral-300">{t('shared.createdBy')}:</span>
                    <span className="ml-2 text-neutral-900 dark:text-neutral-100">{selectedTask.author} ({selectedTask.userNumber})</span>
                  </div>
                  <div>
                    <span className="text-neutral-600 dark:text-neutral-300">{t('task.isCompleted')}:</span>
                    <span className={`ml-2 ${selectedTask.isCompleted ? 'text-success-600 dark:text-success-400' : 'text-warning-600 dark:text-warning-400'}`}>
                      {selectedTask.isCompleted ? t('common.completed') : t('common.inProgress')}
                    </span>
                  </div>
                  {selectedTask.dueDate && (
                    <div>
                      <span className="text-neutral-600 dark:text-neutral-300">{t('task.dueDate')}:</span>
                      <span className="ml-2 text-neutral-900 dark:text-neutral-100">
                        {selectedTask.dueTime 
                          ? formatDueDateTime(selectedTask.dueDate, selectedTask.dueTime, i18next.language)
                          : formatLocalDate(selectedTask.dueDate, i18next.language)
                        }
                      </span>
                    </div>
                  )}
                  {selectedTask.category && (
                    <div>
                      <span className="text-neutral-600 dark:text-neutral-300">{t('task.category')}:</span>
                      <span className="ml-2 text-neutral-900 dark:text-neutral-100">{getCategoryLabel(selectedTask.category)}</span>
                    </div>
                  )}
                </div>

                {selectedTask.tags && selectedTask.tags.length > 0 && (
                  <div>
                    <span className="text-sm text-neutral-600 dark:text-neutral-300">{t('task.tags')}:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedTask.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 rounded-full text-xs font-medium bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-neutral-200 dark:border-neutral-700">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-neutral-600 dark:text-neutral-300">{t('task.importance')}:</span>
                    <span className="text-sm font-medium">
                      {importanceIcons[selectedTask.importance]} {selectedTask.importance === 'low' ? t('task.importanceLow') : selectedTask.importance === 'medium' ? t('task.importanceMedium') : t('task.importanceHigh')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-neutral-600 dark:text-neutral-300">{t('task.priority')}:</span>
                    <span className="text-sm font-medium">
                      {priorityIcons[selectedTask.priority]} {selectedTask.priority === 'low' ? t('task.priorityLow') : (selectedTask.priority === 'medium' ? t('task.priorityMedium') : t('task.priorityHigh'))}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-neutral-500 dark:text-neutral-400 text-center pt-4 border-t border-neutral-200 dark:border-neutral-700">
                  {t('shared.createdAt')}: {formatLocalDateTime(selectedTask.createdAt, i18next.language, true)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 