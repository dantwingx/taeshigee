import { create } from 'zustand'
import type { ToastType } from '@/components/ui/Toast'
import { UI_CONSTANTS } from '@/utils/constants'

interface Toast {
  id: string
  type: ToastType
  message: string
  duration?: number
}

interface ToastStore {
  toasts: Toast[]
  showToast: (type: ToastType, message: string, duration?: number) => void
  removeToast: (id: string) => void
  clearToasts: () => void
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],

  showToast: (type: ToastType, message: string, duration = UI_CONSTANTS.TOAST_DURATION) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
    const newToast: Toast = { id, type, message, duration }
    
    set((state) => ({
      toasts: [...state.toasts, newToast],
    }))
  },

  removeToast: (id: string) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }))
  },

  clearToasts: () => {
    set({ toasts: [] })
  },
})) 