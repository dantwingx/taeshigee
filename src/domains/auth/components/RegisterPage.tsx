import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, UserPlus, ArrowRight } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useTranslation } from 'react-i18next'

export function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { register: registerUser } = useAuthStore()
  const { t } = useTranslation()

  const registerSchema = z.object({
    email: z.string().email(t('auth.emailInvalid')),
    password: z.string().min(6, t('auth.passwordMin')),
    confirmPassword: z.string().min(1, t('auth.confirmPasswordRequired')),
  }).refine((data) => data.password === data.confirmPassword, {
    message: t('auth.passwordsDontMatch'),
    path: ['confirmPassword'],
  })

  type RegisterFormData = z.infer<typeof registerSchema>

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    try {
      const generatedName = 'User' + new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14)
      console.log('RegisterPage onSubmit called', data.email, generatedName)
      const result = await registerUser(data.email, data.password, generatedName)
      console.log('registerUser result:', result)
      if (result && result.success) {
        navigate('/')
      } else {
        console.error('Registration failed:', result?.error)
        setError('root', { type: 'manual', message: result?.error || t('toast.error') })
      }
    } catch (error) {
      console.error('RegisterPage onSubmit error:', error)
      setError('root', {
        type: 'manual',
        message: t('toast.error'),
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* 메인 이미지 */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-primary-600 rounded-3xl mx-auto mb-4 flex items-center justify-center shadow-lg">
            <UserPlus className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">{t('auth.taskManager')}</h1>
          <p className="text-neutral-600">{t('home.welcome')}</p>
        </div>

        {/* 회원가입 폼 */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-2">{t('auth.register')}</h2>
            <p className="text-sm text-neutral-600">{t('home.welcome')}</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* 이름 */}
            {/* 에러 메시지 */}
            {errors.root && (
              <div className="p-3 rounded-lg bg-red-200 border border-red-400 flex items-center gap-2">
                {/* 에러 아이콘 */}
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0Z" />
                </svg>
                <p className="text-sm text-red-800 font-bold">{errors.root.message && errors.root.message.startsWith('auth.') ? t(errors.root.message) : errors.root.message}</p>
              </div>
            )}

            {/* 이메일 */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                {t('auth.email')}
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

            {/* 비밀번호 */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1">
                {t('auth.password')}
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  {...register('password')}
                  placeholder={t('auth.passwordPlaceholder')}
                  className="input pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-error-600">{errors.password.message}</p>
              )}
            </div>

            {/* 비밀번호 확인 */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 mb-1">
                {t('auth.confirmPassword')}
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="confirmPassword"
                  {...register('confirmPassword')}
                  placeholder={t('auth.confirmPasswordPlaceholder')}
                  className="input pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-error-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* 회원가입 버튼 */}
            <button
              type="submit"
              className="w-full btn-primary py-3 text-base font-medium flex items-center justify-center space-x-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{t('auth.registering')}</span>
                </>
              ) : (
                <>
                  <span>{t('auth.register')}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* 로그인 링크 */}
          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-600">
              {t('auth.alreadyHaveAccount')}{' '}
              <Link
                to="/login"
                className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                {t('auth.login')}
              </Link>
            </p>
          </div>
        </div>

        {/* 하단 정보 */}
        <div className="text-center mt-6">
          <p className="text-xs text-neutral-500">
          한글을 배우고 싶을 땐 phoLingo
          </p>
        </div>
      </div>
    </div>
  )
} 