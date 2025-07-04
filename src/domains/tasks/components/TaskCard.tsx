import { useState } from 'react'
import { Calendar, Tag, MoreVertical, Edit, Trash2, Check, Clock, Eye, EyeOff, AlertTriangle, Target } from 'lucide-react'
import { useTagStore, useToastStore } from '@/stores'
import type { Task } from '@/types/task'

interface TaskCardProps {
  task: Task
  onToggleComplete: (id: string) => Promise<void>
  onEdit: (task: Task) => void
  onDelete: (id: string) => Promise<void>
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

export function TaskCard({ task, onToggleComplete, onEdit, onDelete, isLoading }: TaskCardProps) {
  const [showMenu, setShowMenu] = useState(false)
  const { getTagColor } = useTagStore()
  const { showToast } = useToastStore()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
    })
  }

  const formatDateTime = (dateString: string, timeString?: string) => {
    const date = new Date(dateString)
    const dateStr = date.toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
    })
    
    if (timeString) {
      return `${dateStr} ${timeString}`
    }
    return dateStr
  }

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.isCompleted

  const handleDelete = async () => {
    try {
      await onDelete(task.id)
      showToast('success', '태스크가 삭제되었습니다.')
    } catch (error) {
      showToast('error', '태스크 삭제에 실패했습니다.')
    }
    setShowMenu(false)
  }

  return (
    <div className={`bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-4 transition-all duration-200 ${
      task.isCompleted ? 'opacity-75' : ''
    } ${isOverdue ? 'border-error-300 bg-error-50 dark:border-error-600 dark:bg-error-900/20' : ''}`}>
      <div className="flex items-start space-x-3">
        {/* 체크박스 */}
        <button
          onClick={() => onToggleComplete(task.id)}
          disabled={isLoading}
          className={`flex-shrink-0 w-5 h-5 rounded border-2 transition-colors ${
            task.isCompleted
              ? 'bg-primary-500 border-primary-500'
              : 'border-neutral-300 dark:border-neutral-600 hover:border-primary-400 dark:hover:border-primary-400'
          }`}
        >
          {task.isCompleted && <Check className="h-3 w-3 text-white" />}
        </button>

        {/* 태스크 내용 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className={`font-medium text-neutral-900 dark:text-neutral-100 truncate ${
                  task.isCompleted ? 'line-through text-neutral-500 dark:text-neutral-400' : ''
                }`}>
                  {task.title}
                </h3>
                {task.isPublic && (
                  <Eye className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                )}
              </div>
              
              {task.description && (
                <p className={`mt-1 text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 ${
                  task.isCompleted ? 'line-through' : ''
                }`}>
                  {task.description}
                </p>
              )}
            </div>

            {/* 메뉴 버튼 */}
            <div className="relative flex-shrink-0 ml-2">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
              >
                <MoreVertical className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-1 w-32 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 py-1 z-10">
                  <button
                    onClick={() => {
                      onEdit(task)
                      setShowMenu(false)
                    }}
                    className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                    <span>수정</span>
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-error-700 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-900/20 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>삭제</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 태그 */}
          {task.tags && task.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {task.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getTagColor(tag)}`}
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

          {/* 메타 정보 */}
          <div className="mt-3 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
            <div className="flex items-center space-x-3">
              {task.dueDate && (
                <div className={`flex items-center space-x-1 ${
                  isOverdue ? 'text-error-600 dark:text-error-400' : ''
                }`}>
                  <Calendar className="h-3 w-3" />
                  <span>
                    {task.dueTime 
                      ? formatDateTime(task.dueDate, task.dueTime)
                      : formatDate(task.dueDate)
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

            {/* 중요도 및 우선순위 배지 */}
            <div className="flex items-center space-x-1">
              <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${importanceColors[task.importance]}`}>
                <AlertTriangle className="h-3 w-3" />
                <span>{importanceIcons[task.importance]} {task.importance === 'low' ? '낮음' : task.importance === 'medium' ? '보통' : '높음'}</span>
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${priorityColors[task.priority]}`}>
                <Target className="h-3 w-3" />
                <span>{priorityIcons[task.priority]} {task.priority === 'low' ? '낮음' : task.priority === 'medium' ? '보통' : '높음'}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 