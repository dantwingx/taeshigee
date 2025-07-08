import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useEffect, useState, useRef, useLayoutEffect } from 'react'
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
  Target,
  Eye,
  Lock
} from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'
import { TagInput } from '@/components/ui/TagInput'
import { TaskTemplateSelector } from '@/components/ui/TaskTemplateSelector'
import { EmojiPicker } from '@/components/ui/EmojiPicker'
import type { Task, CreateTaskData, UpdateTaskData, TaskTemplate } from '@/types/task'
import { getTodayDate, getLastTimeOfDay } from '@/utils/dateUtils'

interface TaskFormProps {
  isOpen: boolean
  onClose: () => void
  task?: Task | null
  onSubmit: (data: CreateTaskData | UpdateTaskData) => Promise<void>
  isLoading?: boolean
}

export function TaskForm({ isOpen, onClose, task, onSubmit, isLoading }: TaskFormProps) {
  const { t } = useTranslation()

  const taskSchema = z.object({
    title: z.string().min(1, t('task.titleRequired')).max(100, t('task.titleMaxLength')),
    description: z.string().max(500, t('task.descriptionMaxLength')).optional(),
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

// 오늘 날짜와 마지막 시간은 dateUtils에서 import

  const [showTemplateSelector, setShowTemplateSelector] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [emojiTarget, setEmojiTarget] = useState<'title' | 'description' | null>(null)
  const titleInputRef = useRef<HTMLInputElement | null>(null)
  const descriptionInputRef = useRef<HTMLTextAreaElement | null>(null)
  const [pendingEmojiInsert, setPendingEmojiInsert] = useState<{
    target: 'title' | 'description';
    emoji: string;
    position: number;
  } | null>(null)
  const [focusedField, setFocusedField] = useState<'title' | 'description'>('title')
  
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
    { value: 'false', label: t('common.private'), icon: Lock },
    { value: 'true', label: t('common.public'), icon: Eye },
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

  // task prop이 바뀔 때와 isOpen이 true가 될 때 form 값을 업데이트
  useEffect(() => {
    console.log('[TaskForm] task prop changed:', task, 'isOpen:', isOpen)
    
    // 모달이 열릴 때만 폼을 초기화
    if (!isOpen) return
    
    if (task) {
      console.log('[TaskForm] task.title:', task.title)
      console.log('[TaskForm] task.description:', task.description)
      
      // 이모지 분리 (더 넓은 범위의 이모지 지원)
      const emojiMatch = task.title.match(/^([\p{Emoji_Presentation}\p{Emoji}\u200d\ufe0f]+)/u)
      const emoji = emojiMatch ? emojiMatch[0] : ''
      let titleWithoutEmoji = emoji ? task.title.replace(emoji, '').trim() : task.title
      if (!titleWithoutEmoji && emoji) {
        // 제목이 이모지만 있는 경우, 이모지를 제목으로 사용
        titleWithoutEmoji = emoji
      }
      
      console.log('[TaskForm] emojiMatch:', emojiMatch)
      console.log('[TaskForm] emoji:', emoji)
      console.log('[TaskForm] titleWithoutEmoji:', titleWithoutEmoji)
      
      const resetData = {
        title: titleWithoutEmoji,
        description: task.description || '',
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
        dueTime: task.dueTime || '',
        importance: task.importance,
        priority: task.priority,
        category: task.category || '',
        tags: task.tags || [],
        isPublic: task.isPublic || false,
        isCompleted: task.isCompleted || false,
      }
      
      console.log('[TaskForm] reset data:', resetData)
      // reset 대신 개별 setValue 사용
      setValue('title', titleWithoutEmoji)
      setValue('description', task.description || '')
      setValue('dueDate', task.dueDate ? task.dueDate.split('T')[0] : '')
      setValue('dueTime', task.dueTime || '')
      setValue('importance', task.importance)
      setValue('priority', task.priority)
      setValue('category', task.category || '')
      setValue('tags', task.tags || [])
      setValue('isPublic', task.isPublic || false)
      setValue('isCompleted', task.isCompleted || false)
    } else {
      console.log('[TaskForm] No task, resetting to defaults')
      reset({
        title: '',
        description: '',
        dueDate: getTodayDate(),
        dueTime: getLastTimeOfDay(),
        importance: 'medium',
        priority: 'medium',
        category: 'other',
        tags: [],
        isPublic: false,
        isCompleted: false,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task, isOpen])

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

  const handleTemplateSelect = (template: TaskTemplate) => {
    // 템플릿의 모든 필드를 한 번에 reset으로 세팅
    const today = new Date()
    const dueDate = new Date(today)
    if (template.duration) {
      dueDate.setDate(today.getDate() + template.duration - 1)
    }
    reset({
      title: t(template.title),
      description: t(template.description),
      tags: template.tags.map(tagKey => t(tagKey)),
      category: template.autoSettings?.category || 'other',
      importance: template.autoSettings?.importance || 'medium',
      priority: template.autoSettings?.priority || 'medium',
      isPublic: template.autoSettings?.isPublic ?? false,
      dueDate: template.duration ? dueDate.toISOString().split('T')[0] : getTodayDate(),
      dueTime: template.autoSettings?.dueTime || getLastTimeOfDay(),
      isCompleted: false,
    })
    setShowTemplateSelector(false)
  }

  // 이모지 삽입 핸들러 (입력란 구분)
  const handleEmojiSelect = (emoji: string) => {
    if (emojiTarget === 'title' && titleInputRef.current) {
      const input = titleInputRef.current
      const start = input.selectionStart || 0
      const end = input.selectionEnd || 0
      const value = input.value
      const newValue = value.slice(0, start) + emoji + value.slice(end)
      setValue('title', newValue, { shouldDirty: true, shouldTouch: false, shouldValidate: false })
      setPendingEmojiInsert({ target: 'title', emoji, position: start + emoji.length })
    } else if (emojiTarget === 'description' && descriptionInputRef.current) {
      const input = descriptionInputRef.current
      const start = input.selectionStart || 0
      const end = input.selectionEnd || 0
      const value = input.value
      const newValue = value.slice(0, start) + emoji + value.slice(end)
      setValue('description', newValue, { shouldDirty: true, shouldTouch: false, shouldValidate: false })
      setPendingEmojiInsert({ target: 'description', emoji, position: start + emoji.length })
    }
    setShowEmojiPicker(false)
    setEmojiTarget(null)
  }

  // 입력란 value가 실제로 바뀐 후 커서 이동 (useLayoutEffect로 보장)
  useLayoutEffect(() => {
    if (pendingEmojiInsert) {
      if (pendingEmojiInsert.target === 'title' && titleInputRef.current) {
        titleInputRef.current.focus()
        titleInputRef.current.setSelectionRange(pendingEmojiInsert.position, pendingEmojiInsert.position)
      } else if (pendingEmojiInsert.target === 'description' && descriptionInputRef.current) {
        descriptionInputRef.current.focus()
        descriptionInputRef.current.setSelectionRange(pendingEmojiInsert.position, pendingEmojiInsert.position)
      }
      setPendingEmojiInsert(null)
    }
  }, [watch('title'), watch('description')])

  return (
    <>
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
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="title" className="flex items-center space-x-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  <Type className="h-4 w-4" />
                  <span>{t('task.title')} *</span>
                </label>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowTemplateSelector(true)}
                    className="px-3 py-1 text-xs bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors"
                  >
                    📋 {t('task.templateButton')}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEmojiPicker(true);
                      setEmojiTarget(focusedField); // 마지막 포커스된 필드에 이모지 삽입
                    }}
                    className="px-3 py-1 text-xs bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors"
                  >
                    😊 {t('task.emojiButton')}
                  </button>
                </div>
              </div>
              <div className="relative">
                {/* selectedEmoji는 제거 */}
                <input
                  {...register('title')}
                  type="text"
                  id="title"
                  ref={e => {
                    register('title').ref(e);
                    titleInputRef.current = e;
                  }}
                  onFocus={() => setFocusedField('title')}
                  className={`input text-base ${errors.title ? 'border-error-500 dark:border-error-400' : ''}`}
                  placeholder={t('task.titleRequired')}
                  disabled={isLoading}
                  style={{ 
                    textIndent: '0',
                    paddingLeft: '12px',
                    paddingRight: '12px',
                    textAlign: 'left',
                    direction: 'ltr'
                  }}
                />
              </div>
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
                ref={e => {
                  register('description').ref(e);
                  descriptionInputRef.current = e;
                }}
                onFocus={() => setFocusedField('description')}
                rows={3}
                className={`input text-base ${errors.description ? 'border-error-500 dark:border-error-400' : ''}`}
                placeholder={t('task.description')}
                disabled={isLoading}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-error-600 dark:text-error-400">{errors.description.message}</p>
              )}
            </div>

            {/* 날짜 및 시간 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="dueDate" className="flex items-center space-x-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  <Calendar className="h-4 w-4" />
                  <span>{t('task.dueDate')}</span>
                </label>
                <input
                  {...register('dueDate')}
                  type="date"
                  id="dueDate"
                  className={`input text-base ${errors.dueDate ? 'border-error-500 dark:border-error-400' : ''}`}
                  disabled={isLoading}
                />
                {errors.dueDate && (
                  <p className="mt-1 text-sm text-error-600 dark:text-error-400">{errors.dueDate.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="dueTime" className="flex items-center space-x-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  <Clock className="h-4 w-4" />
                  <span>{t('task.dueTime')}</span>
                </label>
                <input
                  {...register('dueTime')}
                  type="time"
                  id="dueTime"
                  className={`input text-base ${errors.dueTime ? 'border-error-500 dark:border-error-400' : ''}`}
                  disabled={isLoading}
                />
                {errors.dueTime && (
                  <p className="mt-1 text-sm text-error-600 dark:text-error-400">{errors.dueTime.message}</p>
                )}
              </div>
            </div>

            {/* 중요도, 우선순위, 카테고리 - 가로 배치 */}
            <div className="grid grid-cols-3 gap-4">
              {/* 중요도 */}
              <div>
                <label className="flex items-center space-x-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  <Target className="h-3 w-3" />
                  <span>{t('task.importance')}</span>
                </label>
                <Select
                  options={importanceOptions}
                  value={watch('importance')}
                  onChange={(value) => handleImportanceSelect(value as 'low' | 'medium' | 'high')}
                  disabled={isLoading}
                  className="text-xs"
                />
                {errors.importance && (
                  <p className="mt-1 text-xs text-error-600 dark:text-error-400">{errors.importance.message}</p>
                )}
              </div>

              {/* 우선순위 */}
              <div>
                <label className="flex items-center space-x-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  <Tag className="h-3 w-3" />
                  <span>{t('task.priority')}</span>
                </label>
                <Select
                  options={priorityOptions}
                  value={watch('priority')}
                  onChange={(value) => handlePrioritySelect(value as 'low' | 'medium' | 'high')}
                  disabled={isLoading}
                  className="text-xs"
                />
                {errors.priority && (
                  <p className="mt-1 text-xs text-error-600 dark:text-error-400">{errors.priority.message}</p>
                )}
              </div>

              {/* 카테고리 */}
              <div>
                <label className="flex items-center space-x-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  <Folder className="h-3 w-3" />
                  <span>{t('task.category')}</span>
                </label>
                <Select
                  options={categoryOptions}
                  value={watch('category') || ''}
                  onChange={handleCategorySelect}
                  disabled={isLoading}
                  className="text-xs"
                />
                {errors.category && (
                  <p className="mt-1 text-xs text-error-600 dark:text-error-400">{errors.category.message}</p>
                )}
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
                onChange={handleTagsChange}
                placeholder={t('task.tagsInputPlaceholder')}
                className="w-full"
                disabled={isLoading}
              />
            </div>

            {/* 공개 여부 */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
                <Eye className="h-4 w-4" />
                <span>{t('common.visibility')}</span>
              </label>
              <Select
                options={visibilityOptions}
                value={String(watch('isPublic'))}
                onChange={(value) => handleVisibilitySelect(value === 'true')}
                disabled={isLoading}
              />
            </div>
          </div>
          {/* 폼 하단 버튼 영역 */}
          <div className="flex justify-end gap-2 p-4 border-t border-neutral-200 dark:border-neutral-700">
            <button
              type="button"
              onClick={handleClose}
              className="btn-secondary"
              disabled={isLoading}
            >
              <X className="h-4 w-4 mr-1" /> {t('common.cancel')}
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isLoading}
            >
              <Save className="h-4 w-4 mr-1" /> {t('common.save')}
            </button>
          </div>
        </form>
      </Modal>

      {/* 템플릿 선택 다이얼로그 */}
      {showTemplateSelector && (
        <TaskTemplateSelector
          onSelectTemplate={handleTemplateSelect}
          onClose={() => setShowTemplateSelector(false)}
        />
      )}

      {/* 이모지 피커 다이얼로그 */}
      {showEmojiPicker && (
        <EmojiPicker
          onSelectEmoji={handleEmojiSelect}
          onClose={() => { setShowEmojiPicker(false); setEmojiTarget(null) }}
        />
      )}
    </>
  )
}