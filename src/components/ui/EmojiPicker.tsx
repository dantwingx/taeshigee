import React, { useState } from 'react'
import { EmojiCategory } from '@/types/task'
import { EMOJI_CATEGORIES } from '@/utils/constants'

interface EmojiPickerProps {
  onSelectEmoji: (emoji: string) => void
  onClose: () => void
}

export function EmojiPicker({ onSelectEmoji, onClose }: EmojiPickerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('faces')

  const currentCategory = EMOJI_CATEGORIES.find(cat => cat.id === selectedCategory)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-neutral-800 rounded-lg max-w-md w-full max-h-[80vh] overflow-hidden">
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
              이모지 선택
            </h2>
            <button
              onClick={onClose}
              className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
            >
              ✕
            </button>
          </div>

          {/* 카테고리 탭 */}
          <div className="flex flex-wrap gap-1">
            {EMOJI_CATEGORIES.map(category => (
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

        <div className="p-4 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-8 gap-2">
            {currentCategory?.emojis.map((emoji, index) => (
              <button
                key={index}
                onClick={() => {
                  onSelectEmoji(emoji)
                  onClose()
                }}
                className="w-10 h-10 text-xl hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors flex items-center justify-center"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 