import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Calendar, Tag, Folder, Clock, X, Save, Edit3 } from 'lucide-react'
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
  { value: 'low', label: '낮음' },
  { value: 'medium', label: '보통' },
  { value: 'high', label: '높음' },
]

const priorityOptions = [
  { value: 'low', label: '낮음' },
  { value: 'medium', label: '보통' },
  { value: 'high', label: '높음' },
]

const categoryOptions = [
  { value: 'work', label: '업무' },
  { value: 'personal', label: '개인' },
  { value: 'study', label: '학습' },
  { value: 'health', label: '건강' },
]

export function TaskForm({ isOpen, onClose, task, onSubmit, isLoading }: TaskFormProps) {
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
      title: task?.title || '',
      description: task?.description || '',
      dueDate: task?.dueDate ? task.dueDate.split('T')[0] : '',
      dueTime: task?.dueTime || '',
      importance: task?.importance || 'medium',
      priority: task?.priority || 'medium',
      category: task?.category || '',
      tags: task?.tags || [],
    },
  })

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

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={
        <div className="flex items-center space-x-2">
          {task && <Edit3 className="h-5 w-5 text-primary-600" />}
          <span>{task ? '태스크 수정' : '새 태스크'}</span>
        </div>
      }
      size="full"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 px-4 py-2">
        {/* 제목 */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-2">
            제목 *
          </label>
          <input
            {...register('title')}
            type="text"
            id="title"
            className={`input text-lg ${errors.title ? 'border-error-500' : ''}`}
            placeholder="태스크 제목을 입력하세요"
            disabled={isLoading}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-error-600">{errors.title.message}</p>
          )}
        </div>

        {/* 설명 */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-2">
            설명
          </label>
          <textarea
            {...register('description')}
            id="description"
            rows={4}
            className={`input resize-none ${errors.description ? 'border-error-500' : ''}`}
            placeholder="태스크에 대한 자세한 설명을 입력하세요"
            disabled={isLoading}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-error-600">{errors.description.message}</p>
          )}
        </div>

        {/* 마감일 및 마감시간 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-neutral-700 mb-2">
              마감일
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
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
            <label htmlFor="dueTime" className="block text-sm font-medium text-neutral-700 mb-2">
              마감시간
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
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
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            태그
          </label>
          <TagInput
            value={watch('tags')}
            onChange={handleTagsChange}
            placeholder="태그를 입력하세요 (Enter 또는 쉼표로 구분)"
            disabled={isLoading}
          />
        </div>

        {/* 중요도 및 우선순위 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              중요도
            </label>
            <Select
              value={watch('importance')}
              onChange={(value) => setValue('importance', value as 'low' | 'medium' | 'high')}
              options={importanceOptions}
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              우선순위
            </label>
            <Select
              value={watch('priority')}
              onChange={(value) => setValue('priority', value as 'low' | 'medium' | 'high')}
              options={priorityOptions}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* 카테고리 */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            카테고리
          </label>
          <div className="grid grid-cols-2 gap-2">
            {categoryOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleCategorySelect(option.value)}
                className={`p-3 rounded-lg border-2 transition-colors ${
                  watch('category') === option.value
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'
                }`}
                disabled={isLoading}
              >
                <div className="flex items-center space-x-2">
                  <Folder className="h-4 w-4" />
                  <span className="text-sm font-medium">{option.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex justify-end space-x-3 pt-6 border-t">
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