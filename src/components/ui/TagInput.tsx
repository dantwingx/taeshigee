import React, { useState, useRef, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTagStore } from '@/stores/tagStore'

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function TagInput({ value, onChange, placeholder, disabled, className }: TagInputProps) {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showCreateOption, setShowCreateOption] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { tags, addTag } = useTagStore()

  // 기존 태그들 (현재 입력된 태그 제외)
  const availableTags = tags.filter(tag => !value.includes(tag.name))

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    setShowSuggestions(e.target.value.length > 0)
  }

  const handleCompositionStart = () => {
    setIsComposing(true)
  }

  const handleCompositionEnd = () => {
    setIsComposing(false)
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // IME 조합 중에는 처리하지 않음
    if (isComposing) return

    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addNewTag()
    } else if (e.key === 'Backspace' && inputValue === '' && value.length > 0) {
      // 마지막 태그 제거
      const newTags = value.slice(0, -1)
      onChange(newTags)
    }
  }

  const addNewTag = () => {
    const trimmedTag = inputValue.trim()
    if (trimmedTag && !value.includes(trimmedTag)) {
      const newTags = [...value, trimmedTag]
      onChange(newTags)
      addTag(trimmedTag, 'current-user') // 실제로는 현재 사용자 ID 전달
      setInputValue('')
      setShowSuggestions(false)
    }
  }

  const removeTag = (tagToRemove: string) => {
    const newTags = value.filter(tag => tag !== tagToRemove)
    onChange(newTags)
  }

  const selectSuggestion = (suggestedTag: string) => {
    if (!value.includes(suggestedTag)) {
      const newTags = [...value, suggestedTag]
      onChange(newTags)
      addTag(suggestedTag, 'current-user')
    }
    setInputValue('')
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  const handleInputFocus = () => {
    if (inputValue.length > 0) {
      setShowSuggestions(true)
    }
  }

  const handleInputBlur = () => {
    // 약간의 지연을 두어 클릭 이벤트가 처리될 수 있도록 함
    setTimeout(() => {
      setShowSuggestions(false)
    }, 200)
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="flex flex-wrap gap-2 p-2 border border-neutral-300 rounded-lg focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500 transition-colors">
        {value.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 text-primary-800 text-sm rounded-md"
          >
            <span>#{tag}</span>
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="hover:bg-primary-200 rounded-full p-0.5 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={placeholder || t('task.tagsPlaceholder')}
          disabled={disabled}
          className="flex-1 min-w-0 outline-none bg-transparent text-sm"
        />
      </div>

      {/* 태그 제안 */}
      {showSuggestions && availableTags.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
          {availableTags
            .filter(tag => tag.name.toLowerCase().includes(inputValue.toLowerCase()))
            .map((tag) => (
              <button
                key={tag.name}
                type="button"
                onClick={() => selectSuggestion(tag.name)}
                className="flex items-center justify-between w-full px-3 py-2 text-left hover:bg-neutral-50 transition-colors"
              >
                <span className="text-sm">{tag.name}</span>
                <span className="text-xs text-neutral-500">({tag.count}{t('common.count')})</span>
              </button>
            ))}
        </div>
      )}

      {/* 새 태그 추가 버튼 */}
      {inputValue.trim() && !value.includes(inputValue.trim()) && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg z-10">
          <button
            type="button"
            onClick={addNewTag}
            className="flex items-center gap-2 w-full px-3 py-2 text-left hover:bg-neutral-50 transition-colors"
          >
            <Plus className="h-4 w-4 text-primary-600" />
            <span className="text-sm text-primary-600">
              "{inputValue.trim()}" {t('task.addTag')}
            </span>
          </button>
        </div>
      )}
    </div>
  )
} 