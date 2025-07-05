import { useState, useEffect } from 'react'
import { Eye, Search, Calendar, User, Tag, AlertTriangle, Target, Copy, Heart } from 'lucide-react'
import { useTaskStore } from '@/stores/taskStore'
import { useToastStore } from '@/stores'
import type { Task } from '@/types/task'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'

interface PublicTask extends Task {
  authorName: string
  authorId: string
}

export function SharedPage() {
  const { getAllPublicTasks, duplicateTask, toggleTaskLike, isTaskLikedByUser, getTaskLikeCount, currentUserId } = useTaskStore()
  const { showToast } = useToastStore()
  const { t } = useTranslation()
  const [publicTasks, setPublicTasks] = useState<PublicTask[]>([])
  const [filteredTasks, setFilteredTasks] = useState<PublicTask[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTask, setSelectedTask] = useState<PublicTask | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  // 공개된 태스크만 필터링하고 최신순으로 정렬
  useEffect(() => {
    const publicTaskList = getAllPublicTasks()
      .map(task => ({
        ...task,
        authorName: t('shared.createdBy'), // 실제로는 사용자 정보에서 가져와야 함
        authorId: task.userId,
      }))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) // 최신순 정렬
    setPublicTasks(publicTaskList)
    setFilteredTasks(publicTaskList)
  }, [getAllPublicTasks, t])

  // 검색 필터링
  useEffect(() => {
    if (!searchTerm) {
      setFilteredTasks(publicTasks)
      return
    }

    const filtered = publicTasks.filter(task =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      task.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    setFilteredTasks(filtered)
  }, [searchTerm, publicTasks])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(i18next.language, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatDateTime = (dateString: string, timeString?: string) => {
    const date = new Date(dateString)
    const dateStr = date.toLocaleDateString(i18next.language, {
      month: 'short',
      day: 'numeric',
    })
    
    if (timeString) {
      return `${dateStr} ${timeString}`
    }
    return dateStr
  }

  const getImportanceIcon = (importance: string) => {
    switch (importance) {
      case 'low': return '🟢'
      case 'medium': return '🟡'
      case 'high': return '🔴'
      default: return '⚪'
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'low': return '📌'
      case 'medium': return '📍'
      case 'high': return '🎯'
      default: return '📌'
    }
  }

  const openTaskDetail = (task: PublicTask) => {
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
    if (!currentUserId) {
      showToast('error', t('auth.invalidCredentials'))
      return
    }
    
    try {
      await toggleTaskLike(taskId)
      const isLiked = isTaskLikedByUser(taskId, currentUserId)
      showToast('success', isLiked ? t('toast.taskLiked') : t('toast.taskUnliked'))
    } catch (error) {
      showToast('error', t('toast.likeError'))
    }
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

      {/* 검색 - 태스크탭과 동일한 스타일 */}
      <div className="flex items-center w-full rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 px-3 py-2 focus-within:ring-2 focus-within:ring-primary-500">
        <Search className="shrink-0 h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
        <input
          type="text"
          placeholder={t('task.searchTasks')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent border-none focus:ring-0 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 w-full"
        />
      </div>

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
        {filteredTasks.length === 0 ? (
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
          filteredTasks.map((task) => (
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
                  title={currentUserId && isTaskLikedByUser(task.id, currentUserId) ? t('task.unlike') : t('task.like')}
                >
                  <Heart 
                    className={`h-4 w-4 mr-1 ${
                      currentUserId && isTaskLikedByUser(task.id, currentUserId) 
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
                  
                  {task.description && (
                    <p className={`text-sm text-neutral-600 dark:text-neutral-300 line-clamp-2 mb-3 ${
                      task.isCompleted ? 'line-through' : ''
                    }`}>
                      {task.description}
                    </p>
                  )}

                  {/* 태그 */}
                  {task.tags && task.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {task.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 rounded-full text-xs font-medium bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200"
                        >
                          #{tag}
                        </span>
                      ))}
                      {task.tags.length > 3 && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300">
                          +{task.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* 메타 정보 */}
                  <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>{task.authorName} ({task.authorId})</span>
                      </div>
                      
                      {task.dueDate && (
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {task.dueTime 
                              ? formatDateTime(task.dueDate, task.dueTime)
                              : formatDateTime(task.dueDate)
                            }
                          </span>
                        </div>
                      )}

                      {task.category && (
                        <div className="flex items-center space-x-1">
                          <Tag className="h-3 w-3" />
                          <span>{task.category}</span>
                        </div>
                      )}
                    </div>

                    {/* 중요도 및 우선순위 */}
                    <div className="flex items-center space-x-1">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200">
                        <AlertTriangle className="h-3 w-3 inline mr-1" />
                        {getImportanceIcon(task.importance)} {task.importance === 'low' ? t('task.importanceLow') : task.importance === 'medium' ? t('task.importanceMedium') : t('task.importanceHigh')}
                      </span>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200">
                        <Target className="h-3 w-3 inline mr-1" />
                        {getPriorityIcon(task.priority)} {task.priority === 'low' ? t('task.priorityLow') : (task.priority === 'medium' ? t('task.priorityMedium') : t('task.priorityHigh'))}
                      </span>
                    </div>
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
                    <span className="ml-2 text-neutral-900 dark:text-neutral-100">{selectedTask.authorName} ({selectedTask.authorId})</span>
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
                          ? formatDateTime(selectedTask.dueDate, selectedTask.dueTime)
                          : formatDateTime(selectedTask.dueDate)
                        }
                      </span>
                    </div>
                  )}
                  {selectedTask.category && (
                    <div>
                      <span className="text-neutral-600 dark:text-neutral-300">{t('task.category')}:</span>
                      <span className="ml-2 text-neutral-900 dark:text-neutral-100">{selectedTask.category}</span>
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
                      {getImportanceIcon(selectedTask.importance)} {selectedTask.importance === 'low' ? t('task.importanceLow') : selectedTask.importance === 'medium' ? t('task.importanceMedium') : t('task.importanceHigh')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-neutral-600 dark:text-neutral-300">{t('task.priority')}:</span>
                    <span className="text-sm font-medium">
                      {getPriorityIcon(selectedTask.priority)} {selectedTask.priority === 'low' ? t('task.priorityLow') : (selectedTask.priority === 'medium' ? t('task.priorityMedium') : t('task.priorityHigh'))}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-neutral-500 dark:text-neutral-400 text-center pt-4 border-t border-neutral-200 dark:border-neutral-700">
                  {t('shared.createdAt')}: {formatDate(selectedTask.createdAt)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 