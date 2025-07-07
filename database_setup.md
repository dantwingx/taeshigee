# Taeshigee 데이터베이스 설정 가이드

## 1. Supabase 프로젝트 설정

### 1.1 Supabase 프로젝트 생성
1. [Supabase](https://supabase.com)에 로그인
2. 새 프로젝트 생성
3. 프로젝트 이름: `taeshigee`
4. 데이터베이스 비밀번호 설정 (기억해두세요)

### 1.2 환경 변수 설정
프로젝트 설정에서 다음 정보를 복사하여 `.env.local` 파일에 저장:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# JWT Configuration
JWT_SECRET=your-jwt-secret-key
```

## 2. 데이터베이스 스키마 생성

### 2.1 SQL 에디터에서 스키마 실행
1. Supabase 대시보드 → SQL Editor
2. `database_schema.sql` 파일의 내용을 복사하여 실행
3. 또는 다음 명령어로 파일을 직접 실행:

```bash
# Supabase CLI 사용 시
supabase db reset

# 또는 SQL 파일을 직접 실행
psql "postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres" -f database_schema.sql
```

### 2.2 스키마 확인
다음 쿼리로 테이블이 정상적으로 생성되었는지 확인:

```sql
-- 테이블 목록 확인
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- 사용자 테이블 구조 확인
\d users;

-- 태스크 테이블 구조 확인
\d tasks;
```

## 3. 데이터베이스 연결 테스트

### 3.1 백엔드 서버 실행
```bash
cd backend
npm install
npm run dev
```

### 3.2 연결 테스트
브라우저에서 `http://localhost:3000/api/stats` 접속하여 401 에러가 나오면 연결 성공 (인증이 필요한 엔드포인트이므로)

## 4. 주요 테이블 구조

### 4.1 users 테이블
- `id`: UUID (기본키)
- `user_number`: SERIAL (자동 증가, 변경 불가)
- `email`: VARCHAR(255) (고유)
- `password_hash`: VARCHAR(255) (bcrypt 해시)
- `name`: VARCHAR(100)
- `language`: VARCHAR(10) (기본값: 'ko')
- `dark_mode`: BOOLEAN (기본값: false)

### 4.2 tasks 테이블
- `id`: UUID (기본키)
- `user_id`: UUID (users.id 참조)
- `user_number`: INTEGER (users.user_number 참조)
- `title`: VARCHAR(255)
- `description`: TEXT
- `due_date`: DATE (마감일)
- `due_time`: TIME (마감시간)
- `importance`: ENUM('low', 'medium', 'high')
- `priority`: ENUM('low', 'medium', 'high')
- `category`: VARCHAR(100)
- `is_completed`: BOOLEAN
- `is_public`: BOOLEAN
- `likes_count`: INTEGER

### 4.3 task_tags 테이블
- `id`: UUID (기본키)
- `task_id`: UUID (tasks.id 참조)
- `tag_name`: VARCHAR(100)

### 4.4 task_likes 테이블
- `id`: UUID (기본키)
- `task_id`: UUID (tasks.id 참조)
- `user_id`: UUID (users.id 참조)
- `user_number`: INTEGER (users.user_number 참조)

## 5. 인덱스 및 성능 최적화

스키마에 다음 인덱스들이 자동으로 생성됩니다:

- `idx_users_email`: 이메일 검색 최적화
- `idx_users_user_number`: 사용자 번호 검색 최적화
- `idx_tasks_user_id`: 사용자별 태스크 조회 최적화
- `idx_tasks_is_public`: 공개 태스크 조회 최적화
- `idx_tasks_due_date`: 마감일 기준 정렬 최적화
- `idx_task_tags_tag_name`: 태그 검색 최적화

## 6. 보안 설정

### 6.1 Row Level Security (RLS)
모든 테이블에 RLS가 활성화되어 있으며, 다음 정책들이 적용됩니다:

- 사용자는 자신의 데이터만 조회/수정 가능
- 공개 태스크는 모든 사용자가 조회 가능
- 태그는 모든 사용자가 조회 가능
- 좋아요는 자신의 것만 삭제 가능

### 6.2 트리거
- `updated_at` 자동 업데이트
- `likes_count` 자동 업데이트

## 7. 문제 해결

### 7.1 연결 오류
```bash
# 환경 변수 확인
echo $NEXT_PUBLIC_SUPABASE_URL
echo $SUPABASE_SERVICE_ROLE_KEY

# Supabase 상태 확인
supabase status
```

### 7.2 스키마 오류
```sql
-- 테이블 존재 확인
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name = 'users'
);

-- 컬럼 존재 확인
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users';
```

### 7.3 권한 오류
```sql
-- RLS 정책 확인
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public';
```

## 8. 개발 환경 팁

### 8.1 샘플 데이터 삽입
```sql
-- 테스트 사용자 생성
INSERT INTO users (email, password_hash, name, language, dark_mode) 
VALUES ('test@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4tbQJ5qKqG', '테스트 사용자', 'ko', false);

-- 테스트 태스크 생성
INSERT INTO tasks (user_id, user_number, title, description, importance, priority, is_public) 
VALUES (
  (SELECT id FROM users WHERE email = 'test@example.com'),
  (SELECT user_number FROM users WHERE email = 'test@example.com'),
  '테스트 태스크',
  '테스트 설명',
  'medium',
  'high',
  true
);
```

### 8.2 데이터베이스 리셋
```bash
# 모든 데이터 삭제 후 스키마 재생성
supabase db reset

# 또는 수동으로 삭제
DROP TABLE IF EXISTS task_likes, task_tags, tasks, users CASCADE;
```

이제 데이터베이스가 완전히 설정되었습니다! 백엔드 서버를 실행하여 API가 정상적으로 작동하는지 확인해보세요. 