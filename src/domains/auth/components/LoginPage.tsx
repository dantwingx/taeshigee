import { Link } from 'react-router-dom'

export function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <div className="w-full max-w-md">
        <div className="card">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-neutral-900">태식이</h1>
            <p className="text-neutral-600">할 일 관리의 새로운 경험</p>
          </div>
          
          <form className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                이메일
              </label>
              <input
                type="email"
                id="email"
                className="input"
                placeholder="your@email.com"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1">
                비밀번호
              </label>
              <input
                type="password"
                id="password"
                className="input"
                placeholder="••••••••"
                required
              />
            </div>
            
            <button type="submit" className="btn-primary w-full">
              로그인
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