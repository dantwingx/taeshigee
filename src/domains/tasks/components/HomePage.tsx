import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { TaskForm } from './TaskForm'
import { TaskCard } from './TaskCard'
import { useTaskStore } from '@/stores/taskStore'
import { useAuthStore } from '@/stores/authStore'
import type { Task, CreateTaskData, UpdateTaskData } from '@/types/task'

export function HomePage() {
  const { user } = useAuthStore()
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
    await createTask(data)
  }

  const handleUpdateTask = async (data: UpdateTaskData) => {
    if (editingTask) {
      await updateTask(editingTask.id, data)
      setEditingTask(null)
    }
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setIsTaskFormOpen(true)
  }

  const handleDeleteTask = async (id: string) => {
    if (window.confirm('정말로 이 태스크를 삭제하시겠습니까?')) {
      await deleteTask(id)
    }
  }

  const handleToggleComplete = async (id: string) => {
    await toggleTaskCompletion(id)
  }

  return (
    <div className="space-y-4">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">오늘의 태스크</h1>
          <p className="text-sm text-neutral-600">오늘 마감 예정인 태스크들을 확인해보세요</p>
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
        <div className="p-3 rounded-lg bg-error-50 border border-error-200">
          <p className="text-sm text-error-700">{error}</p>
        </div>
      )}
      
      {/* 통계 카드 */}
      <div className="grid grid-cols-2 gap-3">
        <div className="card p-4">
          <h3 className="font-semibold text-neutral-900 mb-1 text-sm">전체</h3>
          <p className="text-xl font-bold text-neutral-600">{stats.total}</p>
        </div>
        
        <div className="card p-4">
          <h3 className="font-semibold text-neutral-900 mb-1 text-sm">오늘 마감</h3>
          <p className="text-xl font-bold text-primary-600">{todayTasks.length}</p>
        </div>
        
        <div className="card p-4">
          <h3 className="font-semibold text-neutral-900 mb-1 text-sm">완료됨</h3>
          <p className="text-xl font-bold text-success-600">{stats.completed}</p>
        </div>
        
        <div className="card p-4">
          <h3 className="font-semibold text-neutral-900 mb-1 text-sm">진행률</h3>
          <p className="text-xl font-bold text-warning-600">{stats.completionRate}%</p>
        </div>
      </div>

      {/* 오늘 마감 예정 태스크 */}
      <div className="card p-4">
        <h2 className="text-lg font-semibold text-neutral-900 mb-3">오늘 마감 예정</h2>
        {todayTasks.length === 0 ? (
          <p className="text-center text-neutral-500 py-6 text-sm">
            오늘 마감 예정인 태스크가 없습니다.
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
        <h2 className="text-lg font-semibold text-neutral-900 mb-3">최근 태스크</h2>
        {recentTasks.length === 0 ? (
          <p className="text-center text-neutral-500 py-6 text-sm">
            아직 태스크가 없습니다. 새 태스크를 추가해보세요!
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