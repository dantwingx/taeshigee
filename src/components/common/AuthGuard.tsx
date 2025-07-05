import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { useTaskStore } from '@/stores/taskStore'

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, user } = useAuthStore()
  const { setCurrentUser } = useTaskStore()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!isAuthenticated) {
      // 현재 위치를 state로 전달하여 로그인 후 원래 페이지로 리다이렉트
      navigate('/login', { state: { from: location } })
    } else if (user) {
      setCurrentUser(user.id, user.userNumber)
    }
  }, [isAuthenticated, user, setCurrentUser, navigate, location])

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
} 