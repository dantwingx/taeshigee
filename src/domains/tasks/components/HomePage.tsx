import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { TaskForm } from './TaskForm'
import { TaskCard } from './TaskCard'
import { useTaskStore, useToastStore } from '@/stores'
import { useAuthStore } from '@/stores/authStore'
import type { Task, CreateTaskData, UpdateTaskData } from '@/types/task'
import { useTranslation } from 'react-i18next'

export function HomePage() {
  const { user } = useAuthStore()
  const { showToast } = useToastStore()
  const { t } = useTranslation()
  const {
    tasks,
    isLoading,
    error,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    getTaskStats,
  } = useTaskStore()

  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  // 사용자별 통계 계산
  const stats = user ? getTaskStats(user.id) : {
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0,
    completionRate: 0,
  }

  // 사용자별 태스크 필터링
  const userTasks = user ? tasks.filter(task => task.userId === user.id) : []

  // 오늘 마감 예정 태스크 필터링
  const todayTasks = userTasks.filter(task => {
    if (!task.dueDate) return false
    const today = new Date()
    const dueDate = new Date(task.dueDate)
    return dueDate.toDateString() === today.toDateString()
  })

  // 최근 태스크 (최근 3개)
  const recentTasks = userTasks
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3)

  const handleCreateTask = async (data: CreateTaskData) => {
    try {
      await createTask(data)
      showToast('success', t('toast.taskCreated'))
    } catch (error) {
      showToast('error', t('toast.error'))
    }
  }

  const handleUpdateTask = async (data: UpdateTaskData) => {
    if (editingTask) {
      try {
        await updateTask(editingTask.id, data)
        setEditingTask(null)
        showToast('success', t('toast.taskUpdated'))
      } catch (error) {
        showToast('error', t('toast.error'))
      }
    }
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setIsTaskFormOpen(true)
  }

  const handleDeleteTask = async (id: string) => {
    // 커스텀 확인 다이얼로그 대신 toast로 안내
    showToast('warning', t('toast.warning'))
  }

  const handleToggleComplete = async (id: string) => {
    try {
      await toggleTaskCompletion(id)
      showToast('success', t('toast.success'))
    } catch (error) {
      showToast('error', t('toast.error'))
    }
  }

  return (
    <div className="space-y-4">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">{t('home.todayTasks')}</h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">{t('home.welcome')}</p>
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
        <div className="p-3 rounded-lg bg-error-50 border border-error-200 dark:bg-error-900/20 dark:border-error-800">
          <p className="text-sm text-error-700 dark:text-error-300">{error}</p>
        </div>
      )}
      
      {/* 통계 카드 */}
      <div className="grid grid-cols-2 gap-3">
        <div className="card p-4">
          <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1 text-sm">{t('home.totalTasks')}</h3>
          <p className="text-xl font-bold text-neutral-600 dark:text-neutral-400">{stats.total}</p>
        </div>
        
        <div className="card p-4">
          <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1 text-sm">{t('home.todayTasks')}</h3>
          <p className="text-xl font-bold text-primary-600 dark:text-primary-400">{todayTasks.length}</p>
        </div>
        
        <div className="card p-4">
          <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1 text-sm">{t('home.completedTasks')}</h3>
          <p className="text-xl font-bold text-success-600 dark:text-success-400">{stats.completed}</p>
        </div>
        
        <div className="card p-4">
          <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1 text-sm">{t('home.completionRate')}</h3>
          <p className="text-xl font-bold text-warning-600 dark:text-warning-400">{stats.completionRate}%</p>
        </div>
      </div>

      {/* 오늘 마감 예정 태스크 */}
      <div className="card p-4">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-3">{t('home.todayTasks')}</h2>
        {todayTasks.length === 0 ? (
          <p className="text-center text-neutral-500 dark:text-neutral-400 py-6 text-sm">
            {t('home.noTasksToday')}
          </p>
        ) : (
          <div className="space-y-3">
            {todayTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleComplete={handleToggleComplete}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                isLoading={isLoading}
              />
            ))}
          </div>
        )}
      </div>

      {/* 최근 태스크 */}
      <div className="card p-4">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-3">{t('home.recentTasks')}</h2>
        {recentTasks.length === 0 ? (
          <p className="text-center text-neutral-500 dark:text-neutral-400 py-6 text-sm">
            {t('home.noRecentTasks')}
          </p>
        ) : (
          <div className="space-y-3">
            {recentTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleComplete={handleToggleComplete}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                isLoading={isLoading}
              />
            ))}
          </div>
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