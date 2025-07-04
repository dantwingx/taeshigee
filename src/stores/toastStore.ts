import { create } from 'zustand'
import type { ToastType } from '@/components/ui/Toast'

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

export const useToastStore = create<ToastStore>((set, get) => ({
  toasts: [],

  showToast: (type: ToastType, message: string, duration = 5000) => {
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