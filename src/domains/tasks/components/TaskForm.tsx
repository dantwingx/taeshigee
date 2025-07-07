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
import { getTodayDate, getLastTimeOfDay } from '@/utils/dateUtils'

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
  isCompleted: z.boolean().default(false), // 추가
})

type TaskFormData = z.infer<typeof taskSchema>

interface TaskFormProps {
  isOpen: boolean
  onClose: () => void
  task?: Task | null
  onSubmit: (data: CreateTaskData | UpdateTaskData) => Promise<void>
  isLoading?: boolean
}

// 오늘 날짜와 마지막 시간은 dateUtils에서 import

export function TaskForm({ isOpen, onClose, task, onSubmit, isLoading }: TaskFormProps) {
  const { t } = useTranslation()
  
  const importanceOptions = [
    { value: 'low', label: t('task.importanceLow'), icon: '🟢' },
    { value: 'medium', label: t('task.importanceMedium'), icon: '🟡' },
    { value: 'high', label: t('task.importanceHigh'), icon: '🔴' },
  ]

  const priorityOptions = [
    { value: 'low', label: t('task.priorityLow'), icon: '📌' },
    { value: 'medium', label: t('task.priorityMedium'), icon: '📍' },
    { value: 'high', label: t('task.priorityHigh'), icon: '🎯' },
  ]

  const categoryOptions = [
    { value: 'work', label: t('task.categoryWork') },
    { value: 'personal', label: t('task.categoryPersonal') },
    { value: 'study', label: t('task.categoryStudy') },
    { value: 'health', label: t('task.categoryHealth') },
    { value: 'finance', label: t('task.categoryFinance') },
    { value: 'other', label: t('task.categoryOther') },
  ]

  const visibilityOptions = [
    { value: false, label: t('common.private'), icon: Lock },
    { value: true, label: t('common.public'), icon: Eye },
  ]

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
      category: 'other', // 기타로 기본 설정
      tags: [],
      isPublic: false,
      isCompleted: false, // 추가
    },
  })

  // task prop이 변경될 때 form 값을 업데이트
  useEffect(() => {
    if (task) {
      // 기존 태스크 편집 시
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
        isCompleted: task.isCompleted || false, // 추가
      })
    } else {
      // 새 태스크 생성 시 - 기본값 설정
      reset({
        title: '',
        description: '',
        dueDate: getTodayDate(), // 오늘 날짜로 기본 설정
        dueTime: getLastTimeOfDay(), // 23:59로 기본 설정
        importance: 'medium',
        priority: 'medium',
        category: 'other', // 기타로 기본 설정
        tags: [],
        isPublic: false,
        isCompleted: false, // 추가
      })
    }
  }, [task, reset])

  const handleFormSubmit = async (data: TaskFormData) => {
    try {
      const formData = {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate).toISOString().split('T')[0] : undefined,
        dueTime: data.dueTime || undefined,
      }
      
      await onSubmit(formData)
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
      size="xl"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="max-h-[80vh] flex flex-col">
        {/* 스크롤 가능한 컨텐츠 영역 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[calc(80vh-140px)]">
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
              <span>{t('task.description')}</span>
            </label>
            <textarea
              {...register('description')}
              id="description"
              rows={3}
              className={`input resize-y min-h-[80px] max-h-[300px] ${errors.description ? 'border-error-500 dark:border-error-400' : ''}`}
              placeholder={t('task.descriptionPlaceholder')}
              disabled={isLoading}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-error-600 dark:text-error-400">{errors.description.message}</p>
            )}
          </div>

          {/* 완료 여부 체크박스 */}
          {task && (
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isCompleted"
                {...register('isCompleted')}
                className="form-checkbox h-5 w-5 text-primary-600"
                disabled={isLoading}
              />
              <label htmlFor="isCompleted" className="text-sm font-medium text-neutral-700 dark:text-neutral-300 select-none">
                <CheckCircle className="inline h-4 w-4 mr-1 text-success-500 align-text-bottom" />
                {t('task.completed')}
              </label>
            </div>
          )}

          {/* 마감일 및 마감시간 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="dueDate" className="flex items-center space-x-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                <Calendar className="h-4 w-4" />
                <span>{t('task.dueDate')}</span>
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
                <span>{t('task.dueTime')}</span>
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
              <span>{t('task.tags')}</span>
            </label>
            <TagInput
              value={watch('tags') || []}
              onChange={(tags) => setValue('tags', tags)}
              placeholder={t('task.tagsInputPlaceholder')}
              className="w-full"
              disabled={isLoading}
            />
          </div>

          {/* 중요도 */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              <AlertTriangle className="h-4 w-4" />
              <span>{t('task.importance')}</span>
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
              <span>{t('task.priority')}</span>
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
              <span>{t('task.category')}</span>
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
              <span>{t('task.isPublic')}</span>
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
        <div className="flex justify-end space-x-3 p-4 border-t border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 flex-shrink-0">
          <button
            type="button"
            onClick={handleClose}
            className="btn-secondary px-6 py-3"
            disabled={isLoading}
          >
            {t('common.cancel')}
          </button>
          <button
            type="submit"
            className="btn-primary px-6 py-3 flex items-center space-x-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{t('common.saving')}</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>{task ? t('task.update') : t('common.create')}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  )
}