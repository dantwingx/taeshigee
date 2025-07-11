import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { 
  Calendar, 
  Clock, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Copy,
  CheckCircle,
  Circle,
  Heart,
  Eye,
  AlertTriangle,
  Target,
  User
} from 'lucide-react'
import { Task } from '@/types/task'
import { useToastStore, useTagStore, useTaskStore } from '@/stores'
import { formatRelativeTime, formatDueDateTime, formatLocalDate, formatLocalDateTime } from '@/utils/dateUtils'
import { sanitizeText } from '@/utils/security'
import i18next from 'i18next'

interface TaskCardProps {
  task: Task
  onToggleComplete: (id: string) => Promise<void>
  onEdit: (task: Task) => void
  onDelete: (id: string) => Promise<void>
  onDuplicate: (id: string) => Promise<void>
  isLoading?: boolean
}

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

export function TaskCard({ task, onToggleComplete, onEdit, onDelete, onDuplicate, isLoading }: TaskCardProps) {
  const [showMenu, setShowMenu] = useState(false)
  const { getTagColor } = useTagStore()
  const { showToast } = useToastStore()
  const { t } = useTranslation()
  const { currentUserNumber, toggleTaskLike, isTaskLikedByUser, getTaskLikeCount } = useTaskStore()

  // 작성자 정보 - task에서 직접 가져오기
  const authorDisplay = task.author || t('task.unknownUser')

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.isCompleted

  const handleDelete = async () => {
    try {
      await onDelete(task.id)
      showToast('success', t('toast.taskDeleted'))
    } catch (error) {
      showToast('error', t('toast.error'))
    }
    setShowMenu(false)
  }

  const handleDuplicate = async () => {
    try {
      await onDuplicate(task.id)
      showToast('success', t('toast.taskDuplicated'))
    } catch (error) {
      showToast('error', t('toast.error'))
    }
    setShowMenu(false)
  }

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!currentUserNumber) return
    
    // 중복 클릭 방지
    if (isLoading) {
      console.log('[TaskCard] 좋아요 요청이 이미 진행 중입니다.')
      return
    }
    
    await toggleTaskLike(task.id)
  }

  // 카드 영역 클릭 핸들러 (편집 기능)
  const handleCardClick = (e: React.MouseEvent) => {
    // 버튼이나 입력 요소를 클릭한 경우 편집하지 않음
    const target = e.target as HTMLElement
    if (
      target.tagName === 'BUTTON' ||
      target.tagName === 'INPUT' ||
      target.closest('button') ||
      target.closest('input') ||
      target.closest('[role="button"]')
    ) {
      return
    }
    
    // 내 태스크인 경우에만 편집 가능
    if (task.userNumber === currentUserNumber) {
      onEdit(task)
    }
  }

  const liked = currentUserNumber && isTaskLikedByUser(task.id, currentUserNumber)
  const likeCount = getTaskLikeCount(task.id)

  return (
    <div 
      className={`bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-4 transition-all duration-200 cursor-pointer hover:shadow-md ${
        task.isCompleted ? 'opacity-75' : ''
      } ${isOverdue ? 'border-error-300 bg-error-50 dark:border-error-600 dark:bg-error-900/20' : ''}`}
      onClick={handleCardClick}
    >
      {/* 제목 + 상태 표시 + 좋아요 + 메뉴 */}
      <div className="flex items-center space-x-2 mb-1">
        {/* 상태 표시: 내 태스크는 체크박스, 공개 태스크는 상태 아이콘 */}
        {task.userNumber === currentUserNumber ? (
          // 내 태스크: 체크박스로 상태 변경 가능
          <input
            type="checkbox"
            checked={task.isCompleted}
            onChange={(e) => {
              e.stopPropagation()
              onToggleComplete(task.id)
            }}
            className="form-checkbox h-5 w-5 text-primary-600 mr-2 cursor-pointer"
            aria-label={t('task.toggleComplete')}
            disabled={isLoading}
          />
        ) : (
          // 공개 태스크: 상태 아이콘으로 표시만
          <div className="mr-2 flex items-center">
            {task.isCompleted ? (
              <CheckCircle 
                className="h-5 w-5 text-success-600 dark:text-success-400" 
                aria-label={t('task.completed')}
              />
            ) : (
              <Circle 
                className="h-5 w-5 text-neutral-400 dark:text-neutral-500" 
                aria-label={t('task.incomplete')}
              />
            )}
          </div>
        )}
        <h3 className={`font-medium text-neutral-900 dark:text-neutral-100 truncate ${
          task.isCompleted ? 'line-through text-neutral-500 dark:text-neutral-400' : ''
        }`}>
          {sanitizeText(task.title)}
        </h3>
        {task.isPublic && (
          <Eye className="h-4 w-4 text-primary-600 dark:text-primary-400 flex-shrink-0" aria-label={t('common.public')} />
        )}
        <div className="flex-1" />
        {/* 좋아요 버튼 */}
        <button
          onClick={handleLike}
          className={`flex items-center space-x-1 group ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          title={liked ? t('task.unlike') : t('task.like')}
          disabled={isLoading}
        >
          <Heart className={`h-5 w-5 ${liked ? 'fill-red-500 text-red-500' : 'text-neutral-400 group-hover:text-red-400'} transition-colors`} />
          <span className="text-xs text-neutral-600 dark:text-neutral-300">{likeCount}</span>
        </button>
        {/* 메뉴 버튼 */}
        <div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowMenu(!showMenu)
            }}
            className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
          >
            <MoreVertical className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-1 w-32 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 py-1 z-10">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit(task)
                  setShowMenu(false)
                }}
                className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
              >
                <Edit className="h-4 w-4" />
                <span>{t('common.edit')}</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleDelete()
                }}
                className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-error-700 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-900/20 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                <span>{t('common.delete')}</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleDuplicate()
                }}
                className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
              >
                <Copy className="h-4 w-4" />
                <span>{t('common.duplicate')}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 마감일/마감시간 */}
      {task.dueDate && (
        <div className="mt-1 flex items-center gap-x-1 text-xs text-neutral-600 dark:text-neutral-400">
          <Calendar className="h-3 w-3" />
          <span className={`${isOverdue ? 'text-error-600 dark:text-error-400 font-medium' : ''}`}>
            {task.dueTime 
              ? formatDueDateTime(task.dueDate, task.dueTime, i18next.language)
              : formatLocalDate(task.dueDate, i18next.language)
            }
          </span>
        </div>
      )}

      {/* 설명 */}
      {task.description && (
        <p className={`mt-1 text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 ${
          task.isCompleted ? 'line-through' : ''
        }`}>
          {sanitizeText(task.description)}
        </p>
      )}

      {/* 태그 */}
      {task.tags && task.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {task.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className={`px-2 py-1 rounded-full text-xs font-medium max-w-[100px] truncate break-words ${getTagColor(tag)}`}
              title={sanitizeText(tag)}
            >
              #{sanitizeText(tag)}
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
          <span className="truncate max-w-[90px] text-neutral-700 dark:text-neutral-200">{sanitizeText(authorDisplay)}</span>
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
  )
} 