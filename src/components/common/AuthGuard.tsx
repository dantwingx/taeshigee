import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { currentUser, currentUserId, users, setCurrentUser } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!currentUser && currentUserId && users && setCurrentUser) {
      const found = users.find(u => u.id === currentUserId)
      if (found) setCurrentUser(found)
    }
    if (!currentUser) {
      navigate('/login', { state: { from: location } })
    }
  }, [currentUser, currentUserId, users, setCurrentUser, navigate, location])

  if (!currentUser) {
    return null
  }

  return <>{children}</>
} 