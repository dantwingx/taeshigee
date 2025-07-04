import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { BottomNavigation } from './BottomNavigation'

export function Layout() {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* 헤더 */}
      <Header />
      
      {/* 메인 콘텐츠 */}
      <main className="flex-1 pb-20">
        <div className="max-w-md mx-auto px-4 py-4">
          <Outlet />
        </div>
      </main>
      
      {/* 하단 네비게이션 */}
      <BottomNavigation />
    </div>
  )
} 