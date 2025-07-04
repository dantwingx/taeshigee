import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { 
  Calendar, 
  Tag, 
  Folder, 
  Clock, 
  X, 
  Save, 
  Edit3, 
  Type, 
  FileText, 
  AlertTriangle, 
  Target,
  Eye,
  EyeOff,
  CheckCircle,
  Lock
} from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'
import { TagInput } from '@/components/ui/TagInput'
import type { Task, CreateTaskData, UpdateTaskData } from '@/types/task'

const taskSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요').max(100, '제목은 100자 이하여야 합니다'),
  description: z.string().max(500, '설명은 500자 이하여야 합니다').optional(),
  dueDate: z.string().optional(),
  dueTime: z.string().optional(),
  importance: z.enum(['low', 'medium', 'high']).default('medium'),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  category: z.string().optional(),
  tags: z.array(z.string()).default([]),
  isPublic: z.boolean().default(false),
})

type TaskFormData = z.infer<typeof taskSchema>

interface TaskFormProps {
  isOpen: boolean
  onClose: () => void
  task?: Task | null
  onSubmit: (data: CreateTaskData | UpdateTaskData) => Promise<void>
  isLoading?: boolean
}

const importanceOptions = [
  { value: 'low', label: '낮음', icon: '🟢' },
  { value: 'medium', label: '보통', icon: '🟡' },
  { value: 'high', label: '높음', icon: '🔴' },
]

const priorityOptions = [
  { value: 'low', label: '낮음', icon: '📌' },
  { value: 'medium', label: '보통', icon: '📍' },
  { value: 'high', label: '높음', icon: '🎯' },
]

const categoryOptions = [
  { value: 'work', label: '업무' },
  { value: 'personal', label: '개인' },
  { value: 'study', label: '학습' },
  { value: 'health', label: '건강' },
]

const visibilityOptions = [
  { value: false, label: '비공개', icon: Lock },
  { value: true, label: '공개', icon: Eye },
]

export function TaskForm({ isOpen, onClose, task, onSubmit, isLoading }: TaskFormProps) {
  const { t } = useTranslation()
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      dueDate: '',
      dueTime: '',
      importance: 'medium',
      priority: 'medium',
      category: '',
      tags: [],
      isPublic: false,
    },
  })

  // task prop이 변경될 때 form 값을 업데이트
  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description || '',
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
        dueTime: task.dueTime || '',
        importance: task.importance,
        priority: task.priority,
        category: task.category || '',
        tags: task.tags || [],
        isPublic: task.isPublic || false,
      })
    } else {
      reset({
        title: '',
        description: '',
        dueDate: '',
        dueTime: '',
        importance: 'medium',
        priority: 'medium',
        category: '',
        tags: [],
        isPublic: false,
      })
    }
  }, [task, reset])

  const handleFormSubmit = async (data: TaskFormData) => {
    try {
      await onSubmit({
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
      })
      reset()
      onClose()
    } catch (error) {
      // 에러는 상위 컴포넌트에서 처리
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleTagsChange = (tags: string[]) => {
    setValue('tags', tags)
  }

  const handleCategorySelect = (category: string) => {
    setValue('category', category)
  }

  const handleImportanceSelect = (importance: 'low' | 'medium' | 'high') => {
    setValue('importance', importance)
  }

  const handlePrioritySelect = (priority: 'low' | 'medium' | 'high') => {
    setValue('priority', priority)
  }

  const handleVisibilitySelect = (isPublic: boolean) => {
    setValue('isPublic', isPublic)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={
        <div className="flex items-center space-x-2">
          {task && <Edit3 className="h-5 w-5 text-primary-600 dark:text-primary-400" />}
          <span>{task ? t('task.editTask') : t('task.createTask')}</span>
        </div>
      }
      size="full"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="h-full flex flex-col">
        {/* 스크롤 가능한 컨텐츠 영역 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
          {/* 제목 */}
          <div>
            <label htmlFor="title" className="flex items-center space-x-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              <Type className="h-4 w-4" />
              <span>{t('task.title')} *</span>
            </label>
            <input
              {...register('title')}
              type="text"
              id="title"
              className={`input text-lg ${errors.title ? 'border-error-500 dark:border-error-400' : ''}`}
              placeholder={t('task.titleRequired')}
              disabled={isLoading}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-error-600 dark:text-error-400">{errors.title.message}</p>
            )}
          </div>

          {/* 설명 */}
          <div>
            <label htmlFor="description" className="flex items-center space-x-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              <FileText className="h-4 w-4" />
              <span>설명</span>
            </label>
            <textarea
              {...register('description')}
              id="description"
              rows={3}
              className={`input resize-none ${errors.description ? 'border-error-500 dark:border-error-400' : ''}`}
              placeholder="태스크에 대한 자세한 설명을 입력하세요"
              disabled={isLoading}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-error-600 dark:text-error-400">{errors.description.message}</p>
            )}
          </div>

          {/* 마감일 및 마감시간 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="dueDate" className="flex items-center space-x-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                <Calendar className="h-4 w-4" />
                <span>마감일</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
                <input
                  {...register('dueDate')}
                  type="date"
                  id="dueDate"
                  className="input pl-10 text-center"
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="dueTime" className="flex items-center space-x-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                <Clock className="h-4 w-4" />
                <span>마감시간</span>
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
                <input
                  {...register('dueTime')}
                  type="time"
                  id="dueTime"
                  className="input pl-10 text-center"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          {/* 태그 */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              <Tag className="h-4 w-4" />
              <span>태그</span>
            </label>
            <TagInput
              value={watch('tags')}
              onChange={handleTagsChange}
              placeholder="태그를 입력하세요 (Enter 또는 쉼표로 구분)"
              disabled={isLoading}
            />
          </div>

          {/* 중요도 */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              <AlertTriangle className="h-4 w-4" />
              <span>중요도</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {importanceOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleImportanceSelect(option.value as 'low' | 'medium' | 'high')}
                  className={`p-2 rounded-lg border-2 transition-colors ${
                    watch('importance') === option.value
                      ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300'
                      : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:border-neutral-500'
                  }`}
                  disabled={isLoading}
                >
                  <div className="flex flex-col items-center space-y-1">
                    <span className="text-sm">{option.icon}</span>
                    <span className="text-xs font-medium">{option.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 우선순위 */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              <Target className="h-4 w-4" />
              <span>우선순위</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {priorityOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handlePrioritySelect(option.value as 'low' | 'medium' | 'high')}
                  className={`p-2 rounded-lg border-2 transition-colors ${
                    watch('priority') === option.value
                      ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300'
                      : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:border-neutral-500'
                  }`}
                  disabled={isLoading}
                >
                  <div className="flex flex-col items-center space-y-1">
                    <span className="text-sm">{option.icon}</span>
                    <span className="text-xs font-medium">{option.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 카테고리 */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              <Folder className="h-4 w-4" />
              <span>카테고리</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {categoryOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleCategorySelect(option.value)}
                  className={`p-2 rounded-lg border-2 transition-colors ${
                    watch('category') === option.value
                      ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300'
                      : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:border-neutral-500'
                  }`}
                  disabled={isLoading}
                >
                  <div className="flex items-center space-x-2">
                    <Folder className="h-3 w-3" />
                    <span className="text-xs font-medium">{option.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 공개 여부 */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              {watch('isPublic') ? <Eye className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
              <span>공개 여부</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {visibilityOptions.map((option) => {
                const Icon = option.icon
                return (
                  <button
                    key={option.value.toString()}
                    type="button"
                    onClick={() => handleVisibilitySelect(option.value)}
                    className={`p-2 rounded-lg border-2 transition-colors ${
                      watch('isPublic') === option.value
                        ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300'
                        : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:border-neutral-500'
                    }`}
                    disabled={isLoading}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon className="h-3 w-3" />
                      <span className="text-xs font-medium">{option.label}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* 고정된 버튼 영역 */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-end space-x-3 p-4 border-t border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800">
          <button
            type="button"
            onClick={handleClose}
            className="btn-secondary px-6 py-3"
            disabled={isLoading}
          >
            취소
          </button>
          <button
            type="submit"
            className="btn-primary px-6 py-3 flex items-center space-x-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>저장 중...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>{task ? '수정' : '생성'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  )
} 