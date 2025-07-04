import { useState } from 'react'
import { User, Moon, Sun, Folder, AlertTriangle, Target, Plus, X } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useDarkModeStore } from '@/stores'
import { applyDarkMode } from '@/utils/darkMode'

interface Category {
  id: string
  name: string
  color: string
}

interface ImportanceLevel {
  id: string
  name: string
  icon: string
  color: string
}

interface PriorityLevel {
  id: string
  name: string
  icon: string
  color: string
}

export function SettingsPage() {
  const { user } = useAuthStore()
  const { isDarkMode, toggleDarkMode } = useDarkModeStore()
  const [categories, setCategories] = useState<Category[]>([
    { id: '1', name: '업무', color: 'bg-blue-100 text-blue-700' },
    { id: '2', name: '개인', color: 'bg-green-100 text-green-700' },
    { id: '3', name: '학습', color: 'bg-purple-100 text-purple-700' },
    { id: '4', name: '건강', color: 'bg-red-100 text-red-700' },
  ])
  const [importanceLevels, setImportanceLevels] = useState<ImportanceLevel[]>([
    { id: '1', name: '낮음', icon: '🟢', color: 'bg-green-100 text-green-700' },
    { id: '2', name: '보통', icon: '🟡', color: 'bg-yellow-100 text-yellow-700' },
    { id: '3', name: '높음', icon: '🔴', color: 'bg-red-100 text-red-700' },
  ])
  const [priorityLevels, setPriorityLevels] = useState<PriorityLevel[]>([
    { id: '1', name: '낮음', icon: '📌', color: 'bg-gray-100 text-gray-700' },
    { id: '2', name: '보통', icon: '📍', color: 'bg-blue-100 text-blue-700' },
    { id: '3', name: '높음', icon: '🎯', color: 'bg-red-100 text-red-700' },
  ])
  const [newCategory, setNewCategory] = useState('')
  const [newImportance, setNewImportance] = useState('')
  const [newPriority, setNewPriority] = useState('')

  const handleToggleDarkMode = () => {
    toggleDarkMode()
    applyDarkMode(!isDarkMode)
  }

  const addCategory = () => {
    const trimmedName = newCategory.trim()
    if (trimmedName) {
      // 중복 체크
      const isDuplicate = categories.some(cat => 
        cat.name.toLowerCase() === trimmedName.toLowerCase()
      )
      
      if (isDuplicate) {
        alert('이미 존재하는 카테고리입니다.')
        return
      }

      const newCat: Category = {
        id: Date.now().toString(),
        name: trimmedName,
        color: 'bg-gray-100 text-gray-700',
      }
      setCategories([...categories, newCat])
      setNewCategory('')
    }
  }

  const removeCategory = (id: string) => {
    setCategories(categories.filter(cat => cat.id !== id))
  }

  const addImportance = () => {
    const trimmedName = newImportance.trim()
    if (trimmedName) {
      // 중복 체크
      const isDuplicate = importanceLevels.some(imp => 
        imp.name.toLowerCase() === trimmedName.toLowerCase()
      )
      
      if (isDuplicate) {
        alert('이미 존재하는 중요도입니다.')
        return
      }

      const newImp: ImportanceLevel = {
        id: Date.now().toString(),
        name: trimmedName,
        icon: '⚡',
        color: 'bg-gray-100 text-gray-700',
      }
      setImportanceLevels([...importanceLevels, newImp])
      setNewImportance('')
    }
  }

  const removeImportance = (id: string) => {
    setImportanceLevels(importanceLevels.filter(imp => imp.id !== id))
  }

  const addPriority = () => {
    const trimmedName = newPriority.trim()
    if (trimmedName) {
      // 중복 체크
      const isDuplicate = priorityLevels.some(pri => 
        pri.name.toLowerCase() === trimmedName.toLowerCase()
      )
      
      if (isDuplicate) {
        alert('이미 존재하는 우선순위입니다.')
        return
      }

      const newPri: PriorityLevel = {
        id: Date.now().toString(),
        name: trimmedName,
        icon: '📌',
        color: 'bg-gray-100 text-gray-700',
      }
      setPriorityLevels([...priorityLevels, newPri])
      setNewPriority('')
    }
  }

  const removePriority = (id: string) => {
    setPriorityLevels(priorityLevels.filter(pri => pri.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div>
        <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">마이</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">내 정보와 설정을 관리하세요</p>
      </div>

      {/* 사용자 정보 */}
      <div className="card p-4">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
            <User className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h2 className="font-semibold text-neutral-900 dark:text-neutral-100">{user?.email}</h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">사용자 ID: {user?.id}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-neutral-600 dark:text-neutral-400">가입일:</span>
            <span className="ml-2 text-neutral-900 dark:text-neutral-100">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('ko-KR') : '-'}
            </span>
          </div>
          <div>
            <span className="text-neutral-600 dark:text-neutral-400">마지막 업데이트:</span>
            <span className="ml-2 text-neutral-900 dark:text-neutral-100">
              {user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString('ko-KR') : '-'}
            </span>
          </div>
        </div>
      </div>

      {/* 다크모드 설정 */}
      <div className="card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {isDarkMode ? <Moon className="h-5 w-5 text-neutral-600 dark:text-neutral-400" /> : <Sun className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />}
            <div>
              <h3 className="font-medium text-neutral-900 dark:text-neutral-100">다크모드</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">어두운 테마로 변경</p>
            </div>
          </div>
          <button
            onClick={handleToggleDarkMode}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isDarkMode ? 'bg-primary-600' : 'bg-neutral-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isDarkMode ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* 카테고리 설정 */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Folder className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
            <h3 className="font-medium text-neutral-900 dark:text-neutral-100">카테고리</h3>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="새 카테고리"
              className="input text-sm w-32"
              onKeyPress={(e) => e.key === 'Enter' && addCategory()}
            />
            <button
              onClick={addCategory}
              className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
            >
              <Plus className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between p-2 rounded-lg border border-neutral-200 dark:border-neutral-700"
            >
              <span className={`px-2 py-1 rounded text-xs font-medium ${category.color}`}>
                {category.name}
              </span>
              <button
                onClick={() => removeCategory(category.id)}
                className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
              >
                <X className="h-3 w-3 text-neutral-500 dark:text-neutral-400" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 중요도 설정 */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
            <h3 className="font-medium text-neutral-900 dark:text-neutral-100">중요도</h3>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newImportance}
              onChange={(e) => setNewImportance(e.target.value)}
              placeholder="새 중요도"
              className="input text-sm w-32"
              onKeyPress={(e) => e.key === 'Enter' && addImportance()}
            />
            <button
              onClick={addImportance}
              className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
            >
              <Plus className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          {importanceLevels.map((importance) => (
            <div
              key={importance.id}
              className="flex items-center justify-between p-2 rounded-lg border border-neutral-200 dark:border-neutral-700"
            >
              <span className={`px-2 py-1 rounded text-xs font-medium ${importance.color}`}>
                {importance.icon} {importance.name}
              </span>
              <button
                onClick={() => removeImportance(importance.id)}
                className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
              >
                <X className="h-3 w-3 text-neutral-500 dark:text-neutral-400" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 우선순위 설정 */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
            <h3 className="font-medium text-neutral-900 dark:text-neutral-100">우선순위</h3>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value)}
              placeholder="새 우선순위"
              className="input text-sm w-32"
              onKeyPress={(e) => e.key === 'Enter' && addPriority()}
            />
            <button
              onClick={addPriority}
              className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
            >
              <Plus className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          {priorityLevels.map((priority) => (
            <div
              key={priority.id}
              className="flex items-center justify-between p-2 rounded-lg border border-neutral-200 dark:border-neutral-700"
            >
              <span className={`px-2 py-1 rounded text-xs font-medium ${priority.color}`}>
                {priority.icon} {priority.name}
              </span>
              <button
                onClick={() => removePriority(priority.id)}
                className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
              >
                <X className="h-3 w-3 text-neutral-500 dark:text-neutral-400" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 