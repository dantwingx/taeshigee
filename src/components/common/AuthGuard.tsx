import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { currentUser } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!currentUser) {
      navigate('/login', { state: { from: location } })
    }
  }, [currentUser, navigate, location])

  if (!currentUser) {
    return null
  }

  return <>{children}</>
} 