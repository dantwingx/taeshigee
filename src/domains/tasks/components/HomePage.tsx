import { Plus } from 'lucide-react'

export function HomePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">오늘의 태스크</h1>
          <p className="text-neutral-600">오늘 마감 예정인 태스크들을 확인해보세요</p>
        </div>
        <button className="btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          새 태스크
        </button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="card">
          <h3 className="font-semibold text-neutral-900 mb-2">오늘 마감</h3>
          <p className="text-2xl font-bold text-primary-600">5</p>
          <p className="text-sm text-neutral-600">개 태스크</p>
        </div>
        
        <div className="card">
          <h3 className="font-semibold text-neutral-900 mb-2">완료됨</h3>
          <p className="text-2xl font-bold text-success-600">3</p>
          <p className="text-sm text-neutral-600">개 태스크</p>
        </div>
        
        <div className="card">
          <h3 className="font-semibold text-neutral-900 mb-2">진행률</h3>
          <p className="text-2xl font-bold text-warning-600">60%</p>
          <p className="text-sm text-neutral-600">완료율</p>
        </div>
      </div>
      
      <div className="card">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">최근 태스크</h2>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-neutral-50">
            <div className="h-3 w-3 rounded-full bg-primary-500"></div>
            <span className="flex-1">프로젝트 기획서 작성</span>
            <span className="text-sm text-neutral-500">오후 3시</span>
          </div>
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-neutral-50">
            <div className="h-3 w-3 rounded-full bg-success-500"></div>
            <span className="flex-1 line-through text-neutral-500">팀 미팅 참석</span>
            <span className="text-sm text-neutral-500">오전 10시</span>
          </div>
        </div>
      </div>
    </div>
  )
} 