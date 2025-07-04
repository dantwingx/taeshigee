import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthStore } from '@/stores/authStore'

const registerSchema = z.object({
  email: z.string().email('올바른 이메일 주소를 입력해주세요'),
  password: z.string().min(8, '비밀번호는 최소 8자 이상이어야 합니다'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "비밀번호가 일치하지 않습니다",
  path: ["confirmPassword"],
})

type RegisterFormData = z.infer<typeof registerSchema>

export function RegisterPage() {
  const { register: registerUser, isLoading, error, clearError } = useAuthStore()
  const navigate = useNavigate()
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data)
      // 회원가입 성공 시 홈페이지로 리다이렉트
      navigate('/', { replace: true })
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
            <h1 className="text-2xl font-bold text-neutral-900">회원가입</h1>
            <p className="text-neutral-600">태식이와 함께 시작하세요</p>
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
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 mb-1">
                비밀번호 확인
              </label>
              <input
                {...register('confirmPassword')}
                type="password"
                id="confirmPassword"
                className={`input ${errors.confirmPassword ? 'border-error-500' : ''}`}
                placeholder="••••••••"
                disabled={isLoading}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-error-600">{errors.confirmPassword.message}</p>
              )}
            </div>
            
            <button 
              type="submit" 
              className="btn-primary w-full"
              disabled={isLoading}
            >
              {isLoading ? '회원가입 중...' : '회원가입'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-600">
              이미 계정이 있으신가요?{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                로그인
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 