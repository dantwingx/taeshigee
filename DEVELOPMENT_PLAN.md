# 태식이(Taeshigee) 개발 계획

## 📋 개발 현황

| 항목 | 상태 | 완료일 | 비고 |
|------|------|--------|------|
| **Git 저장소 초기화** | ✅ 완료 | 2025-01-XX | GitHub 연동 완료 |
| **보안 설정** | ✅ 완료 | 2025-01-XX | 환경변수, .gitignore 설정 |
| **Cursor Rules 설정** | ✅ 완료 | 2025-01-XX | 토스 프론트엔드 가이드라인 적용 |
| **기획안 작성** | ✅ 완료 | 2025-01-XX | 상세 기획서 완성 |
| **프로젝트 구조 설계** | 🔄 진행 중 | - | 도메인별 구조 설계 |
| **기술 스택 설정** | ⏳ 대기 | - | React + Zustand + React Query + Tailwind CSS |
| **백엔드 API 설계** | ⏳ 대기 | - | Flask + Supabase |
| **UI/UX 컴포넌트 개발** | ⏳ 대기 | - | 디자인 시스템 구축 |

## 🎯 핵심 기능 개발 우선순위

### Phase 1: 기본 인프라 (1-2주)
1. **프로젝트 구조 설정**
   - React + TypeScript 프로젝트 초기화
   - Tailwind CSS 설정
   - ESLint, Prettier 설정
   - 폴더 구조 (도메인별 구성)

2. **기본 컴포넌트 시스템**
   - 디자인 시스템 구축
   - 공통 컴포넌트 (Button, Input, Modal 등)
   - 레이아웃 컴포넌트

3. **상태 관리 설정**
   - Zustand 스토어 설계
   - React Query 설정

### Phase 2: 핵심 기능 (2-3주)
1. **태스크 관리**
   - 태스크 CRUD 기능
   - 태스크 완료/미완료 상태 변경
   - 태그 및 카테고리 관리

2. **보기 기능**
   - 일간/주간/월간 뷰
   - 필터링 및 정렬 기능

3. **사용자 인증**
   - 회원가입/로그인
   - 비밀번호 찾기

### Phase 3: 고급 기능 (2-3주)
1. **생산성 분석**
   - 완료율 리포트
   - 통계 시각화

2. **사용자 설정**
   - 다크모드
   - 알림 설정
   - 언어/지역 설정

### Phase 4: 최적화 및 배포 (1-2주)
1. **성능 최적화**
   - Lighthouse 점수 90+ 목표
   - 접근성 개선

2. **배포 및 모니터링**
   - Vercel 배포
   - Sentry, PostHog 설정

## 🏗️ 프로젝트 구조

```
src/
├── components/           # 공통 컴포넌트
│   ├── ui/              # 기본 UI 컴포넌트
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   └── ...
│   ├── layout/          # 레이아웃 컴포넌트
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── ...
│   └── common/          # 공통 기능 컴포넌트
│       ├── Loading.tsx
│       ├── ErrorBoundary.tsx
│       └── ...
├── domains/             # 도메인별 기능
│   ├── auth/            # 인증 관련
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types.ts
│   ├── tasks/           # 태스크 관리
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types.ts
│   ├── analytics/       # 생산성 분석
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types.ts
│   └── settings/        # 사용자 설정
│       ├── components/
│       ├── hooks/
│       ├── services/
│       └── types.ts
├── hooks/               # 공통 커스텀 훅
│   ├── useAuth.ts
│   ├── useLocalStorage.ts
│   └── ...
├── stores/              # Zustand 스토어
│   ├── authStore.ts
│   ├── taskStore.ts
│   ├── settingsStore.ts
│   └── index.ts
├── services/            # API 서비스
│   ├── api.ts
│   ├── authService.ts
│   ├── taskService.ts
│   └── ...
├── utils/               # 유틸리티 함수
│   ├── constants.ts
│   ├── helpers.ts
│   ├── validation.ts
│   └── ...
├── types/               # 전역 타입 정의
│   ├── auth.ts
│   ├── task.ts
│   ├── common.ts
│   └── index.ts
├── styles/              # 전역 스타일
│   ├── globals.css
│   └── tailwind.css
└── App.tsx              # 메인 앱 컴포넌트
```

## 🎨 디자인 시스템

### 컬러 팔레트
```css
/* Primary Colors */
--primary-50: #eff6ff;
--primary-500: #3b82f6;
--primary-600: #2563eb;
--primary-700: #1d4ed8;

/* Neutral Colors */
--neutral-50: #f9fafb;
--neutral-100: #f3f4f6;
--neutral-500: #6b7280;
--neutral-900: #111827;

/* Semantic Colors */
--success-500: #10b981;
--warning-500: #f59e0b;
--error-500: #ef4444;
```

### 타이포그래피
```css
/* Font Family */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

/* Font Sizes */
--text-xs: 0.75rem;
--text-sm: 0.875rem;
--text-base: 1rem;
--text-lg: 1.125rem;
--text-xl: 1.25rem;
--text-2xl: 1.5rem;
```

### 간격 시스템
```css
/* Spacing (8px grid) */
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
```

## 🔧 기술 스택

### 프론트엔드
- **React 18** + TypeScript
- **Zustand** (상태 관리)
- **React Query** (서버 상태 관리)
- **Tailwind CSS** (스타일링)
- **React Router** (라우팅)
- **React Hook Form** (폼 관리)
- **Zod** (스키마 검증)

### 백엔드
- **Flask** (Python 웹 프레임워크)
- **Supabase** (PostgreSQL + Auth + Storage)
- **JWT** (인증)

### 개발 도구
- **Vite** (빌드 도구)
- **ESLint** + **Prettier** (코드 품질)
- **Jest** + **React Testing Library** (테스팅)

### 배포 & 모니터링
- **Vercel** (프론트엔드 배포)
- **Render/Railway** (백엔드 배포)
- **Sentry** (에러 추적)
- **PostHog** (사용자 분석)

## 📊 데이터 모델

### 주요 테이블 구조
```sql
-- 사용자 테이블
users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 태스크 테이블
tasks (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMP WITH TIME ZONE,
  recurrence_type TEXT,
  recurrence_detail JSONB,
  importance TEXT DEFAULT 'medium',
  priority TEXT DEFAULT 'medium',
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 태그 테이블
tags (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  name TEXT NOT NULL,
  UNIQUE(user_id, name)
);

-- 태스크-태그 연결 테이블
task_tags (
  task_id UUID REFERENCES tasks(id),
  tag_id UUID REFERENCES tags(id),
  PRIMARY KEY (task_id, tag_id)
);
```

## 🚀 다음 단계

1. **React 프로젝트 초기화**
2. **기본 컴포넌트 시스템 구축**
3. **라우팅 및 레이아웃 설정**
4. **상태 관리 스토어 설계**

각 단계별로 상세한 구현 가이드를 제공하여 체계적으로 개발을 진행할 예정입니다. 