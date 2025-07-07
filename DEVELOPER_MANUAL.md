# 태스크 관리 앱 개발자 매뉴얼

## 🏗️ 프로젝트 구조

### 프론트엔드 (React + TypeScript + Vite)
```
src/
├── components/          # 공통 컴포넌트
│   ├── common/         # 인증 관련
│   ├── layout/         # 레이아웃 컴포넌트
│   └── ui/            # UI 컴포넌트
├── domains/            # 도메인별 기능
│   ├── auth/          # 인증
│   ├── settings/      # 설정
│   ├── shared/        # 공개 태스크
│   └── tasks/         # 태스크 관리
├── hooks/             # 커스텀 훅
├── i18n/              # 다국어 지원
├── services/          # API 서비스
├── stores/            # 상태 관리 (Zustand)
├── types/             # TypeScript 타입 정의
├── utils/             # 유틸리티 함수
└── styles/            # 전역 스타일
```

### 백엔드 (Next.js + Supabase)
```
backend/
├── app/
│   └── api/           # API 라우트
│       ├── auth/      # 인증 API
│       ├── tasks/     # 태스크 API
│       ├── public-tasks/ # 공개 태스크 API
│       └── user/      # 사용자 API
├── lib/               # 라이브러리
└── src/               # 소스 코드
```

## 🚀 개발 환경 설정

### 필수 요구사항
- Node.js 18+
- npm 또는 yarn
- Git

### 설치 및 실행

#### 프론트엔드
```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 프로덕션 미리보기
npm run preview
```

#### 백엔드
```bash
cd backend

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 프로덕션 실행
npm start
```

### 환경변수 설정

#### 프론트엔드 (.env)
```env
VITE_API_BASE_URL=http://localhost:3000
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### 백엔드 (.env)
```env
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 🛠️ 기술 스택

### 프론트엔드
- **React 18**: UI 라이브러리
- **TypeScript**: 타입 안전성
- **Vite**: 빌드 도구
- **Tailwind CSS**: 스타일링
- **React Router**: 라우팅
- **Zustand**: 상태 관리
- **React Hook Form**: 폼 관리
- **Zod**: 스키마 검증
- **i18next**: 다국어 지원
- **React Query**: 서버 상태 관리

### 백엔드
- **Next.js 14**: React 프레임워크
- **Supabase**: 데이터베이스 및 인증
- **PostgreSQL**: 관계형 데이터베이스
- **JWT**: 토큰 기반 인증
- **CORS**: 크로스 오리진 리소스 공유

## 📊 데이터베이스 스키마

### 주요 테이블

#### users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  user_number INTEGER UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  last_updated TIMESTAMP DEFAULT NOW()
);
```

#### tasks
```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  due_date DATE,
  due_time TIME,
  importance VARCHAR(10) DEFAULT 'medium',
  priority VARCHAR(10) DEFAULT 'medium',
  category VARCHAR(50) DEFAULT 'other',
  is_public BOOLEAN DEFAULT false,
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### task_tags
```sql
CREATE TABLE task_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  tag VARCHAR(50) NOT NULL,
  UNIQUE(task_id, tag)
);
```

#### task_likes
```sql
CREATE TABLE task_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  user_number INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(task_id, user_number)
);
```

#### user_settings
```sql
CREATE TABLE user_settings (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  dark_mode BOOLEAN DEFAULT false,
  language VARCHAR(10) DEFAULT 'ko',
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🔧 주요 기능 구현

### 인증 시스템
- **JWT 토큰**: 서버 사이드 토큰 생성
- **Supabase Auth**: 클라이언트 사이드 인증
- **세션 관리**: 자동 로그인 유지

### 상태 관리 (Zustand)
```typescript
// stores/taskStore.ts
interface TaskStore {
  tasks: Task[]
  isLoading: boolean
  fetchTasks: () => Promise<void>
  createTask: (data: CreateTaskData) => Promise<void>
  updateTask: (id: string, data: UpdateTaskData) => Promise<void>
  deleteTask: (id: string) => Promise<void>
}
```

### 다국어 지원
- **20개 언어**: 한국어, 영어, 일본어 등
- **동적 언어 변경**: 실시간 언어 전환
- **로컬 스토리지**: 언어 설정 유지

### 다크모드
- **CSS 변수**: 테마별 색상 관리
- **로컬 스토리지**: 설정 유지
- **시스템 설정**: 기본값으로 활용

## 🧪 테스트

### 프론트엔드 테스트
```bash
# 단위 테스트
npm test

# 테스트 감시 모드
npm run test:watch

# 커버리지 리포트
npm run test:coverage
```

### 백엔드 테스트
```bash
cd backend

# 테스트 실행
npm test

# 특정 테스트 파일
npm test auth.test.ts
```

## 🚀 배포

### Railway 배포

#### 프론트엔드
1. Railway 프로젝트 생성
2. GitHub 저장소 연결
3. 환경변수 설정
4. 자동 배포 활성화

#### 백엔드
1. 별도 Railway 서비스 생성
2. 환경변수 설정
3. 데이터베이스 연결

### 환경변수 (프로덕션)
```env
# 프론트엔드
VITE_API_BASE_URL=https://your-backend-url.railway.app

# 백엔드
DATABASE_URL=your_production_database_url
JWT_SECRET=your_production_jwt_secret
```

## 🔍 디버깅

### 프론트엔드 디버깅
- **React DevTools**: 컴포넌트 상태 확인
- **Redux DevTools**: Zustand 상태 확인
- **Network 탭**: API 요청/응답 확인

### 백엔드 디버깅
- **Railway 로그**: 실시간 로그 확인
- **Supabase 대시보드**: 데이터베이스 상태 확인
- **API 테스트**: Postman 또는 curl 사용

### 일반적인 문제 해결

#### CORS 오류
```typescript
// backend/app/api/tasks/route.ts
export async function GET(request: Request) {
  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
```

#### 인증 오류
```typescript
// JWT 토큰 검증
const token = request.headers.get('Authorization')?.replace('Bearer ', '')
if (!token) {
  return new Response(JSON.stringify({ error: 'Unauthorized' }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' }
  })
}
```

## 📈 성능 최적화

### 프론트엔드
- **코드 스플리팅**: React.lazy 사용
- **이미지 최적화**: WebP 포맷 사용
- **번들 최적화**: Tree shaking 적용

### 백엔드
- **데이터베이스 인덱스**: 쿼리 성능 향상
- **캐싱**: Redis 활용 (필요시)
- **API 최적화**: 페이지네이션 적용

## 🔒 보안

### 인증 보안
- **JWT 만료**: 토큰 자동 만료
- **비밀번호 해싱**: bcrypt 사용
- **CORS 설정**: 허용된 도메인만 접근

### 데이터 보안
- **SQL 인젝션 방지**: 파라미터화된 쿼리
- **XSS 방지**: 입력값 검증
- **CSRF 방지**: 토큰 기반 검증

## 📚 API 문서

### 인증 API
```
POST /api/auth/register - 회원가입
POST /api/auth/login - 로그인
GET /api/auth/me - 사용자 정보 조회
```

### 태스크 API
```
GET /api/tasks - 태스크 목록 조회
POST /api/tasks - 태스크 생성
PUT /api/tasks/[id] - 태스크 수정
DELETE /api/tasks/[id] - 태스크 삭제
POST /api/tasks/[id]/duplicate - 태스크 복제
POST /api/tasks/[id]/like - 좋아요 토글
```

### 공개 태스크 API
```
GET /api/public-tasks - 공개 태스크 목록 조회
```

### 사용자 설정 API
```
PUT /api/user/settings - 사용자 설정 업데이트
```

## 🤝 기여 가이드

### 코드 스타일
- **ESLint**: 코드 품질 검사
- **Prettier**: 코드 포맷팅
- **TypeScript**: 엄격한 타입 검사

### 커밋 컨벤션
```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅
refactor: 코드 리팩토링
test: 테스트 추가
chore: 빌드 프로세스 수정
```

### 브랜치 전략
- **main**: 프로덕션 브랜치
- **develop**: 개발 브랜치
- **feature/**: 기능 개발 브랜치
- **hotfix/**: 긴급 수정 브랜치

---

**버전**: 1.0  
**최종 업데이트**: 2025년 7월 8일  
**기술 스택**: React, TypeScript, Next.js, Supabase 