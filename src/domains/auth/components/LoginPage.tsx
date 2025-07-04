import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthStore } from '@/stores/authStore'

const loginSchema = z.object({
  email: z.string().email('올바른 이메일 주소를 입력해주세요'),
  password: z.string().min(1, '비밀번호를 입력해주세요'),
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginPage() {
  const { login, isLoading, error, clearError } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data)
      // 로그인 성공 시 원래 페이지로 리다이렉트
      const from = location.state?.from?.pathname || '/'
      navigate(from, { replace: true })
    } catch (error) {
      // 에러는 store에서 처리됨
    }
  }

  useEffect(() => {
    // 컴포넌트 마운트 시 에러 초기화
    clearError()
  }, [clearError])

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <div className="w-full max-w-md">
        <div className="card">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-neutral-900">태식이</h1>
            <p className="text-neutral-600">할 일 관리의 새로운 경험</p>
          </div>
          
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-error-50 border border-error-200">
              <p className="text-sm text-error-700">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                이메일
              </label>
              <input
                {...register('email')}
                type="email"
                id="email"
                className={`input ${errors.email ? 'border-error-500' : ''}`}
                placeholder="your@email.com"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-error-600">{errors.email.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1">
                비밀번호
              </label>
              <input
                {...register('password')}
                type="password"
                id="password"
                className={`input ${errors.password ? 'border-error-500' : ''}`}
                placeholder="••••••••"
                disabled={isLoading}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-error-600">{errors.password.message}</p>
              )}
            </div>
            
            <button 
              type="submit" 
              className="btn-primary w-full"
              disabled={isLoading}
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-600">
              계정이 없으신가요?{' '}
              <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
                회원가입
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 