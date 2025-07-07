import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { useTaskStore } from '@/stores/taskStore'
import { useAuthStore } from '@/stores/authStore'
import { useToastStore } from '@/stores'
import { TaskCard } from './TaskCard'
import { TaskForm } from './TaskForm'
import { Task, CreateTaskData, UpdateTaskData } from '@/types/task'

type TabType = 'todayUser' | 'todayPublic' | 'recent'

export function HomePage() {
  const navigate = useNavigate()
  const { currentUser } = useAuthStore()
  const { showToast } = useToastStore()
  const { t } = useTranslation()
  const {
    fetchUserTasks,
    fetchPublicTasks,
    createTask,
    updateTask,
    deleteTask,
    duplicateTask,
    toggleTaskCompletion,
    getTaskStats,
    getTasksByUserNumber,
    getAllPublicTasks,
    isLoading,
    error,
    clearError,
  } = useTaskStore()

  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>('todayUser')

  // 페이지 로드 시 데이터 가져오기
  useEffect(() => {
    const loadData = async () => {
      if (currentUser) {
        try {
          // 사용자 태스크와 공개 태스크를 병렬로 가져오기
          await Promise.all([
            fetchUserTasks(),
            fetchPublicTasks(undefined, undefined, true) // 공개 태스크는 항상 새로 가져오기
          ])
        } catch (error) {
          console.error('Failed to load data:', error)
          showToast('error', t('toast.loadError'))
        }
      }
    }

    loadData()
  }, [currentUser, fetchUserTasks, fetchPublicTasks, showToast, t])

  // 탭 전환 시 공개 태스크 새로 가져오기
  useEffect(() => {
    if (activeTab === 'todayPublic' && currentUser) {
      // 공개 태스크 탭을 클릭할 때마다 최신 데이터 가져오기
      fetchPublicTasks(undefined, undefined, true)
    }
  }, [activeTab, currentUser, fetchPublicTasks])

  // 에러 메시지 표시 후 자동 제거
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError()
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [error, clearError])

  // 사용자별 통계 계산 (사용자 번호로)
  const stats = currentUser ? getTaskStats(currentUser.userNumber) : {
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0,
    completionRate: 0,
  }

  // taskStore에서 currentUserNumber 직접 사용
  const currentUserNumber = useTaskStore(state => state.currentUserNumber)
  
  // 사용자별 태스크 필터링 - currentUserNumber를 사용하여 태스크 가져오기
  const userTasks = currentUserNumber ? getTasksByUserNumber(currentUserNumber) : []
  
  // 디버그 로그 추가
  console.log('[HomePage] 사용자별 태스크 필터링:', {
    currentUserNumber,
    currentUser: currentUser ? { id: currentUser.id, userNumber: currentUser.userNumber, email: currentUser.email } : null,
    userTasksCount: userTasks.length,
    userTasks: userTasks.map(task => ({ id: task.id, title: task.title, userNumber: task.userNumber }))
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

  // 태스크 탭으로 이동하는 함수
  const handleNavigateToTasks = () => {
    navigate('/tasks')
  }

  const handleCreateTask = async (data: CreateTaskData) => {
    try {
      await createTask(data)
      showToast('success', t('toast.taskCreated'))
      setIsTaskFormOpen(false)
    } catch (error) {
      showToast('error', t('toast.error'))
    }
  }

  const handleUpdateTask = async (data: UpdateTaskData) => {
    if (editingTask) {
      try {
        await updateTask(editingTask.id, data)
        setEditingTask(null)
        setIsTaskFormOpen(false)
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
    try {
      await deleteTask(id)
      showToast('success', t('toast.taskDeleted'))
    } catch (error) {
      showToast('error', t('toast.error'))
    }
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
      {/* 헤더 - 클릭 가능하도록 수정 */}
      <div 
        className="flex items-center justify-between cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800 p-2 rounded-lg transition-colors"
        onClick={handleNavigateToTasks}
      >
        <div>
          <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">{t('home.todayTasks')}</h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">{t('home.welcome')}</p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation() // 이벤트 버블링 방지
            setIsTaskFormOpen(true)
          }}
          className="btn-primary p-3 rounded-full shadow-lg"
          disabled={isLoading}
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      {/* 로딩 상태 */}
      {isLoading && (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      )}

      {/* 에러 메시지 */}
      {error && (
        <div className="p-3 rounded-lg bg-error-50 border border-error-200 dark:bg-error-900/20 dark:border-error-800">
          <p className="text-sm text-error-700 dark:text-error-300">{error}</p>
        </div>
      )}
      
      {/* 통계 카드 - '전체 태스크'만 클릭 가능 */}
      <div className="grid grid-cols-2 gap-3">
        <div
          className="card p-4 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
          onClick={handleNavigateToTasks}
        >
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
      <div className="flex space-x-1 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('todayUser')}
          className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'todayUser'
              ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-sm'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
          }`}
        >
          {t('home.todayUserTasks')} ({todayUserTasks.length})
        </button>
        <button
          onClick={() => setActiveTab('todayPublic')}
          className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'todayPublic'
              ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-sm'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
          }`}
        >
          {t('home.todayPublicTasks')} ({todayPublicTasks.length})
        </button>
        <button
          onClick={() => setActiveTab('recent')}
          className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'recent'
              ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-sm'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
          }`}
        >
          {t('home.recentTasks')} ({recentTasks.length})
        </button>
      </div>

      {/* 태스크 목록 - 클릭 가능하도록 수정 */}
      <div 
        className="space-y-3 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800 p-2 rounded-lg transition-colors"
        onClick={handleNavigateToTasks}
      >
        {currentTasks.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-neutral-500 dark:text-neutral-400">{getEmptyMessage()}</p>
          </div>
        ) : (
          currentTasks.map((task) => (
            <div key={task.id} onClick={(e) => e.stopPropagation()}>
              <TaskCard
                task={task}
                onToggleComplete={handleToggleComplete}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                onDuplicate={handleDuplicateTask}
                isLoading={isLoading}
              />
            </div>
          ))
        )}
      </div>

      {/* 태스크 생성/수정 폼 */}
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