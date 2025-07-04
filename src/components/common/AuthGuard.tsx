import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { useTaskStore } from '@/stores/taskStore'

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, user } = useAuthStore()
  const { setCurrentUserId } = useTaskStore()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!isAuthenticated) {
      // 현재 위치를 state로 전달하여 로그인 후 원래 페이지로 리다이렉트
      navigate('/login', { state: { from: location } })
    } else if (user) {
      // 인증된 사용자가 있으면 태스크 로드
      setCurrentUserId(user.id)
    }
  }, [isAuthenticated, user, setCurrentUserId, navigate, location])

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
} 