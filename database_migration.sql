-- Taeshigee Database Migration Script
-- UUID 기반 users 테이블을 VARCHAR 기반으로 마이그레이션

-- 1. 임시 테이블 생성
CREATE TABLE users_temp (
    id VARCHAR(100) PRIMARY KEY,
    user_number SERIAL UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    language VARCHAR(10) DEFAULT 'ko' NOT NULL,
    dark_mode BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 2. 기존 데이터를 임시 테이블로 복사 (UUID를 이메일 기반 ID로 변환)
INSERT INTO users_temp (id, user_number, email, password_hash, name, language, dark_mode, created_at, updated_at)
SELECT 
    CASE 
        WHEN email LIKE '%@%' THEN 
            SUBSTRING(email, 1, POSITION('@' IN email) - 1)
        ELSE 
            email
    END as id,
    user_number,
    email,
    password_hash,
    name,
    language,
    dark_mode,
    created_at,
    updated_at
FROM users;

-- 3. 중복 ID 처리 (같은 ID가 있으면 난수 추가)
UPDATE users_temp 
SET id = id || '_' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0')
WHERE id IN (
    SELECT id 
    FROM users_temp 
    GROUP BY id 
    HAVING COUNT(*) > 1
);

-- 4. 기존 테이블 삭제
DROP TABLE users CASCADE;

-- 5. 임시 테이블을 새로운 users 테이블로 이름 변경
ALTER TABLE users_temp RENAME TO users;

-- 6. 인덱스 재생성
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_user_number ON users(user_number);

-- 7. 트리거 재생성
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 8. RLS 재활성화
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 9. RLS 정책 재생성
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

-- 10. tasks 테이블의 user_id 컬럼 타입 변경
ALTER TABLE tasks ALTER COLUMN user_id TYPE VARCHAR(100);

-- 11. task_likes 테이블의 user_id 컬럼 타입 변경
ALTER TABLE task_likes ALTER COLUMN user_id TYPE VARCHAR(100);

-- 12. 외래키 제약 조건 재생성
ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_user_id_fkey;
ALTER TABLE tasks ADD CONSTRAINT tasks_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE task_likes DROP CONSTRAINT IF EXISTS task_likes_user_id_fkey;
ALTER TABLE task_likes ADD CONSTRAINT task_likes_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- 13. task_tags 테이블 수정 - id 컬럼을 UUID로 변경
-- 기존 task_tags 테이블이 있다면 삭제하고 재생성
DROP TABLE IF EXISTS task_tags CASCADE;

CREATE TABLE task_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    tag_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    UNIQUE(task_id, tag_name) -- 같은 태스크에 같은 태그 중복 방지
);

-- task_tags 인덱스 재생성
CREATE INDEX idx_task_tags_task_id ON task_tags(task_id);
CREATE INDEX idx_task_tags_tag_name ON task_tags(tag_name);

-- task_tags RLS 활성화
ALTER TABLE task_tags ENABLE ROW LEVEL SECURITY;

-- task_tags RLS 정책 재생성
CREATE POLICY "Users can view task tags" ON task_tags
    FOR SELECT USING (true);

CREATE POLICY "Users can insert task tags" ON task_tags
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM tasks 
            WHERE tasks.id = task_tags.task_id 
            AND tasks.user_id::text = auth.uid()::text
        )
    );

CREATE POLICY "Users can delete task tags" ON task_tags
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM tasks 
            WHERE tasks.id = task_tags.task_id 
            AND tasks.user_id::text = auth.uid()::text
        )
    );

-- 마이그레이션 완료 확인
SELECT 'Migration completed successfully' as status; 