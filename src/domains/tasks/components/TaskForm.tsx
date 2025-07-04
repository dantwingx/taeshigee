import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Calendar, Tag, Folder, Clock, X } from 'lucide-react'
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={task ? '태스크 수정' : '새 태스크'}
      size="full"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {/* 제목 */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-1">
            제목 *
          </label>
          <input
            {...register('title')}
            type="text"
            id="title"
            className={`input ${errors.title ? 'border-error-500' : ''}`}
            placeholder="태스크 제목을 입력하세요"
            disabled={isLoading}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-error-600">{errors.title.message}</p>
          )}
        </div>

        {/* 설명 */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-1">
            설명
          </label>
          <textarea
            {...register('description')}
            id="description"
            rows={3}
            className={`input resize-none ${errors.description ? 'border-error-500' : ''}`}
            placeholder="태스크에 대한 자세한 설명을 입력하세요"
            disabled={isLoading}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-error-600">{errors.description.message}</p>
          )}
        </div>

        {/* 마감일 및 마감시간 */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-neutral-700 mb-1">
              마감일
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                {...register('dueDate')}
                type="date"
                id="dueDate"
                className="input pl-10"
                disabled={isLoading}
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="dueTime" className="block text-sm font-medium text-neutral-700 mb-1">
              마감시간
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                {...register('dueTime')}
                type="time"
                id="dueTime"
                className="input pl-10"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        {/* 태그 */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
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
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
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
            <label className="block text-sm font-medium text-neutral-700 mb-1">
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
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            카테고리
          </label>
          <div className="relative">
            <Folder className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <Select
              value={watch('category') || ''}
              onChange={(value) => setValue('category', value)}
              options={categoryOptions}
              placeholder="카테고리를 선택하세요"
              disabled={isLoading}
              className="pl-10"
            />
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button
            type="button"
            onClick={handleClose}
            className="btn-secondary"
            disabled={isLoading}
          >
            취소
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={isLoading}
          >
            {isLoading ? '저장 중...' : (task ? '수정' : '생성')}
          </button>
        </div>
      </form>
    </Modal>
  )
} 