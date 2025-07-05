import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { TaskForm } from './TaskForm'
import { TaskCard } from './TaskCard'
import { useTaskStore, useToastStore } from '@/stores'
import { useAuthStore } from '@/stores/authStore'
import type { Task, CreateTaskData, UpdateTaskData } from '@/types/task'
import { useTranslation } from 'react-i18next'

type TabType = 'todayUser' | 'todayPublic' | 'recent'

export function HomePage() {
  const { user } = useAuthStore()
  const { showToast } = useToastStore()
  const { t } = useTranslation()
  const {
    isLoading,
    error,
    createTask,
    updateTask,
    deleteTask,
    duplicateTask,
    toggleTaskCompletion,
    getTaskStats,
    getTasksByUserId,
    getAllPublicTasks,
  } = useTaskStore()

  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>('todayUser')

  // 사용자별 통계 계산
  const stats = user ? getTaskStats(user.id) : {
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0,
    completionRate: 0,
  }

  // taskStore에서 currentUserId 직접 사용
  const currentUserId = useTaskStore(state => state.currentUserId)
  
  // 사용자별 태스크 필터링 - currentUserId를 사용하여 태스크 가져오기
  const userTasks = currentUserId ? getTasksByUserId(currentUserId) : []
  
  // 디버그 로그 추가
  console.log('[HomePage] 사용자별 태스크 필터링:', {
    currentUserId,
    currentUser: user ? { id: user.id, email: user.email } : null,
    userTasksCount: userTasks.length,
    userTasks: userTasks.map(task => ({ id: task.id, title: task.title, userId: task.userId }))
  })
  
  // 모든 공개 태스크 가져오기
  const allPublicTasks = getAllPublicTasks()

  // 오늘 마감 예정 사용자 태스크 필터링
  const todayUserTasks = userTasks.filter(task => {
    if (!task.dueDate) return false
    const today = new Date()
    const dueDate = new Date(task.dueDate)
    return dueDate.toDateString() === today.toDateString()
  })

  // 오늘 마감 예정 공개 태스크 필터링
  const todayPublicTasks = allPublicTasks.filter(task => {
    if (!task.dueDate) return false
    const today = new Date()
    const dueDate = new Date(task.dueDate)
    return dueDate.toDateString() === today.toDateString()
  })

  // 최근 태스크 (최근 5개)
  const recentTasks = userTasks
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

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

  const handleDuplicateTask = async (id: string) => {
    try {
      await duplicateTask(id)
      showToast('success', t('toast.taskDuplicated'))
    } catch (error) {
      showToast('error', t('toast.error'))
    }
  }

  // 현재 활성 탭에 따른 태스크 목록 반환
  const getCurrentTasks = () => {
    switch (activeTab) {
      case 'todayUser':
        return todayUserTasks
      case 'todayPublic':
        return todayPublicTasks
      case 'recent':
        return recentTasks
      default:
        return []
    }
  }

  // 현재 탭에 따른 빈 상태 메시지 반환
  const getEmptyMessage = () => {
    switch (activeTab) {
      case 'todayUser':
        return t('home.noTodayUserTasks')
      case 'todayPublic':
        return t('home.noTodayPublicTasks')
      case 'recent':
        return t('home.noRecentTasks')
      default:
        return t('home.noTasksToday')
    }
  }

  const currentTasks = getCurrentTasks()

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
          <p className="text-xl font-bold text-primary-600 dark:text-primary-400">{todayUserTasks.length}</p>
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

      {/* 탭 네비게이션 */}
      <div className="card p-0">
        <div className="flex border-b border-neutral-200 dark:border-neutral-700">
          <button
            onClick={() => setActiveTab('todayUser')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'todayUser'
                ? 'text-primary-600 border-b-2 border-primary-600 dark:text-primary-400 dark:border-primary-400'
                : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100'
            }`}
          >
            {t('home.todayUserTasks')}
            <span className="ml-2 text-xs bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded-full">
              {todayUserTasks.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('todayPublic')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'todayPublic'
                ? 'text-primary-600 border-b-2 border-primary-600 dark:text-primary-400 dark:border-primary-400'
                : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100'
            }`}
          >
            {t('home.todayPublicTasks')}
            <span className="ml-2 text-xs bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded-full">
              {todayPublicTasks.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('recent')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'recent'
                ? 'text-primary-600 border-b-2 border-primary-600 dark:text-primary-400 dark:border-primary-400'
                : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100'
            }`}
          >
            {t('home.recentTasks')}
            <span className="ml-2 text-xs bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded-full">
              {recentTasks.length}
            </span>
          </button>
        </div>

        {/* 탭 컨텐츠 */}
        <div className="p-4">
          {currentTasks.length === 0 ? (
            <p className="text-center text-neutral-500 dark:text-neutral-400 py-6 text-sm">
              {getEmptyMessage()}
            </p>
          ) : (
            <div className="space-y-3">
              {currentTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggleComplete={handleToggleComplete}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                  onDuplicate={handleDuplicateTask}
                  isLoading={isLoading}
                />
              ))}
            </div>
          )}
        </div>
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