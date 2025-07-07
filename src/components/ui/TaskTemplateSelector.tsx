import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { TaskTemplate } from '@/types/task'
import { TASK_TEMPLATES } from '@/utils/constants'
import { EmojiPicker } from './EmojiPicker'

interface TaskTemplateSelectorProps {
  onSelectTemplate: (template: TaskTemplate) => void
  onClose: () => void
}

export function TaskTemplateSelector({ onSelectTemplate, onClose }: TaskTemplateSelectorProps) {
  const { t } = useTranslation()
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [emojiTarget, setEmojiTarget] = useState<{ type: 'name' | 'description'; templateId: string } | null>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const categories = [
    { id: 'all', name: t('template.category.all') },
    { id: 'health', name: t('template.category.health') },
    { id: 'study', name: t('template.category.study') },
    { id: 'work', name: t('template.category.work') },
    { id: 'hobby', name: t('template.category.hobby') },
    { id: 'daily', name: t('template.category.daily') }
  ]

  const filteredTemplates = TASK_TEMPLATES.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const popularTemplates = TASK_TEMPLATES.filter(template => template.isPopular)

  const handleEmojiSelect = (emoji: string) => {
    if (emojiTarget && searchInputRef.current) {
      const input = searchInputRef.current
      const start = input.selectionStart || 0
      const end = input.selectionEnd || 0
      const currentValue = input.value
      
      const newValue = currentValue.slice(0, start) + emoji + currentValue.slice(end)
      input.value = newValue
      
      // 커서 위치를 이모지 뒤로 이동
      const newCursorPosition = start + emoji.length
      input.setSelectionRange(newCursorPosition, newCursorPosition)
      input.focus()
      
      // 검색어 상태 업데이트
      setSearchTerm(newValue)
    }
    setShowEmojiPicker(false)
    setEmojiTarget(null)
  }

  function capitalizeFirst(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-neutral-800 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
              {t('template.selectTemplate')}
            </h2>
            <button
              onClick={onClose}
              className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
            >
              ✕
            </button>
          </div>
          
          {/* 검색 */}
          <div className="mb-4">
            <div className="relative">
              <input
                ref={searchInputRef}
                type="text"
                placeholder={t('template.searchTemplate')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 pr-10 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
              />
            </div>
          </div>

          {/* 카테고리 필터 */}
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-primary-500 text-white'
                    : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-y-auto max-h-[60vh] p-6">
          {/* 인기 템플릿 */}
          {selectedCategory === 'all' && searchTerm === '' && (
            <div className="mb-6">
              <h3 className="text-md font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                {t('template.popularTemplates')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                {popularTemplates.map(template => (
                  <button
                    key={template.id}
                    onClick={() => onSelectTemplate(template)}
                    className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{template.emoji}</span>
                      <div className="flex-1">
                        <h4 className="font-medium text-neutral-900 dark:text-neutral-100">
                          {t(template.name)}
                        </h4>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                          {t(template.description)}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 px-2 py-1 rounded">
                            {template.duration}{t('template.days')}
                          </span>
                          {template.autoSettings?.category && (
                            <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                              {t(`task.category${capitalizeFirst(template.autoSettings.category)}`)}
                            </span>
                          )}
                          {template.autoSettings?.importance && (
                            <span className="text-xs bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 px-2 py-1 rounded">
                              {t(`task.importance${capitalizeFirst(template.autoSettings.importance)}`)}
                            </span>
                          )}
                          {template.autoSettings?.priority && (
                            <span className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 px-2 py-1 rounded">
                              {t(`task.priority${capitalizeFirst(template.autoSettings.priority)}`)}
                            </span>
                          )}
                          {template.tags.slice(0, 1).map(tagKey => (
                            <span key={tagKey} className="text-xs bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 px-2 py-1 rounded">
                              {t(tagKey)}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 전체 템플릿 */}
          <div>
            <h3 className="text-md font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
              {selectedCategory === 'all' ? t('template.allTemplates') : t('template.categoryTemplates', { category: categories.find(c => c.id === selectedCategory)?.name })}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredTemplates.map(template => (
                <button
                  key={template.id}
                  onClick={() => onSelectTemplate(template)}
                  className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{template.emoji}</span>
                    <div className="flex-1">
                      <h4 className="font-medium text-neutral-900 dark:text-neutral-100">
                        {t(template.name)}
                      </h4>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                        {t(template.description)}
                      </p>
                                              <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 px-2 py-1 rounded">
                            {template.duration}{t('template.days')}
                          </span>
                          {template.autoSettings?.category && (
                            <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                              {t(`task.category${capitalizeFirst(template.autoSettings.category)}`)}
                            </span>
                          )}
                          {template.autoSettings?.importance && (
                            <span className="text-xs bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 px-2 py-1 rounded">
                              {t(`task.importance${capitalizeFirst(template.autoSettings.importance)}`)}
                            </span>
                          )}
                          {template.autoSettings?.priority && (
                            <span className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 px-2 py-1 rounded">
                              {t(`task.priority${capitalizeFirst(template.autoSettings.priority)}`)}
                            </span>
                          )}
                          {template.tags.slice(0, 1).map(tagKey => (
                            <span key={tagKey} className="text-xs bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 px-2 py-1 rounded">
                              {t(tagKey)}
                            </span>
                          ))}
                        </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* 이모지 피커 */}
      {showEmojiPicker && (
        <EmojiPicker
          onSelectEmoji={handleEmojiSelect}
          onClose={() => {
            setShowEmojiPicker(false)
            setEmojiTarget(null)
          }}
        />
      )}
    </div>
  )
} 