import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { TagStats } from '@/types/task'

interface TagState {
  tags: TagStats[]
  isLoading: boolean
  error: string | null
}

interface TagActions {
  // 태그 관리
  addTag: (tagName: string) => void
  removeTag: (tagName: string) => void
  updateTagStats: (tasks: any[]) => void
  getTagColor: (tagName: string) => string
  
  // 상태 관리
  clearError: () => void
}

interface TagStore extends TagState, TagActions {}

// 태그 색상 팔레트
const TAG_COLORS = [
  'bg-blue-100 text-blue-800',
  'bg-green-100 text-green-800',
  'bg-yellow-100 text-yellow-800',
  'bg-red-100 text-red-800',
  'bg-purple-100 text-purple-800',
  'bg-pink-100 text-pink-800',
  'bg-indigo-100 text-indigo-800',
  'bg-gray-100 text-gray-800',
]

export const useTagStore = create<TagStore>()(
  persist(
    (set, get) => ({
      // State
      tags: [],
      isLoading: false,
      error: null,

      // Actions
      addTag: (tagName: string) => {
        const { tags } = get()
        const trimmedTagName = tagName.trim()
        
        if (!trimmedTagName) return
        
        // 이미 존재하는 태그인지 확인
        const existingTag = tags.find(tag => tag.name === trimmedTagName)
        if (existingTag) {
          // 기존 태그의 카운트 증가
          set(state => ({
            tags: state.tags.map(tag =>
              tag.name === trimmedTagName
                ? { ...tag, count: tag.count + 1 }
                : tag
            )
          }))
        } else {
          // 새 태그 추가
          const newTag: TagStats = {
            name: trimmedTagName,
            count: 1,
            color: get().getTagColor(trimmedTagName)
          }
          
          set(state => ({
            tags: [...state.tags, newTag]
          }))
        }
      },

      removeTag: (tagName: string) => {
        const { tags } = get()
        const existingTag = tags.find(tag => tag.name === tagName)
        
        if (existingTag && existingTag.count > 1) {
          // 카운트 감소
          set(state => ({
            tags: state.tags.map(tag =>
              tag.name === tagName
                ? { ...tag, count: tag.count - 1 }
                : tag
            )
          }))
        } else if (existingTag && existingTag.count === 1) {
          // 태그 완전 제거
          set(state => ({
            tags: state.tags.filter(tag => tag.name !== tagName)
          }))
        }
      },

      updateTagStats: (tasks: any[]) => {
        // 모든 태그 수집
        const tagCounts: Record<string, number> = {}
        
        tasks.forEach(task => {
          if (task.tags && Array.isArray(task.tags)) {
            task.tags.forEach((tag: string) => {
              tagCounts[tag] = (tagCounts[tag] || 0) + 1
            })
          }
        })
        
        // 태그 통계 업데이트
        const updatedTags: TagStats[] = Object.entries(tagCounts).map(([name, count]) => ({
          name,
          count,
          color: get().getTagColor(name)
        }))
        
        set({ tags: updatedTags })
      },

      getTagColor: (tagName: string) => {
        // 태그 이름의 해시값을 기반으로 색상 결정
        let hash = 0
        for (let i = 0; i < tagName.length; i++) {
          const char = tagName.charCodeAt(i)
          hash = ((hash << 5) - hash) + char
          hash = hash & hash // 32bit 정수로 변환
        }
        
        const index = Math.abs(hash) % TAG_COLORS.length
        return TAG_COLORS[index]
      },

      clearError: () => {
        set({ error: null })
      },
    }),
    {
      name: 'tag-storage',
      partialize: (state) => ({
        tags: state.tags,
      }),
    }
  )
) 