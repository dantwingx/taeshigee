-- Taeshigee Database Schema
-- PostgreSQL/Supabase용 테이블 생성 스크립트

-- 사용자 테이블
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_number SERIAL UNIQUE NOT NULL, -- 사용자 번호 (자동 증가, 변경 불가)
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- bcrypt로 해시된 비밀번호
    name VARCHAR(100) NOT NULL,
    language VARCHAR(10) DEFAULT 'ko' NOT NULL,
    dark_mode BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 태스크 테이블
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user_number INTEGER NOT NULL REFERENCES users(user_number) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date DATE, -- 마감일
    due_time TIME, -- 마감시간
    importance VARCHAR(10) DEFAULT 'medium' CHECK (importance IN ('low', 'medium', 'high')) NOT NULL,
    priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')) NOT NULL,
    category VARCHAR(100), -- 카테고리 필드 추가
    is_completed BOOLEAN DEFAULT false NOT NULL,
    is_public BOOLEAN DEFAULT false NOT NULL,
    likes_count INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 태스크 태그 테이블
CREATE TABLE task_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    tag_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    UNIQUE(task_id, tag_name) -- 같은 태스크에 같은 태그 중복 방지
);

-- 태스크 좋아요 테이블
CREATE TABLE task_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user_number INTEGER NOT NULL REFERENCES users(user_number) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    UNIQUE(task_id, user_number) -- 같은 사용자가 같은 태스크에 중복 좋아요 방지
);

-- 인덱스 생성
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_user_number ON users(user_number);
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_user_number ON tasks(user_number);
CREATE INDEX idx_tasks_is_public ON tasks(is_public);
CREATE INDEX idx_tasks_is_completed ON tasks(is_completed);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_importance ON tasks(importance);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_category ON tasks(category);
CREATE INDEX idx_task_tags_task_id ON task_tags(task_id);
CREATE INDEX idx_task_tags_tag_name ON task_tags(tag_name);
CREATE INDEX idx_task_likes_task_id ON task_likes(task_id);
CREATE INDEX idx_task_likes_user_number ON task_likes(user_number);

-- 트리거 함수: updated_at 자동 업데이트
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 트리거 생성
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 좋아요 카운트 자동 업데이트 함수
CREATE OR REPLACE FUNCTION update_task_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE tasks SET likes_count = likes_count + 1 WHERE id = NEW.task_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE tasks SET likes_count = likes_count - 1 WHERE id = OLD.task_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- 좋아요 카운트 트리거
CREATE TRIGGER update_task_likes_count_trigger
    AFTER INSERT OR DELETE ON task_likes
    FOR EACH ROW EXECUTE FUNCTION update_task_likes_count();

-- RLS (Row Level Security) 활성화
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_likes ENABLE ROW LEVEL SECURITY;

-- RLS 정책 (기본적인 보안 정책)
-- 사용자는 자신의 데이터만 볼 수 있음
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

-- 태스크 정책
CREATE POLICY "Users can view own tasks" ON tasks
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view public tasks" ON tasks
    FOR SELECT USING (is_public = true);

CREATE POLICY "Users can insert own tasks" ON tasks
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own tasks" ON tasks
    FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own tasks" ON tasks
    FOR DELETE USING (auth.uid()::text = user_id::text);

-- 태그 정책
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

-- 좋아요 정책
CREATE POLICY "Users can view task likes" ON task_likes
    FOR SELECT USING (true);

CREATE POLICY "Users can insert task likes" ON task_likes
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own likes" ON task_likes
    FOR DELETE USING (auth.uid()::text = user_id::text);

-- 뷰 생성: 통계용
CREATE VIEW task_statistics AS
SELECT 
    t.user_id,
    t.user_number,
    COUNT(*) as total_tasks,
    COUNT(*) FILTER (WHERE t.is_completed = true) as completed_tasks,
    COUNT(*) FILTER (WHERE t.is_completed = false) as pending_tasks,
    COUNT(*) FILTER (WHERE t.is_completed = false AND t.due_date < CURRENT_DATE) as overdue_tasks,
    COUNT(*) FILTER (WHERE t.is_public = true) as public_tasks,
    COUNT(*) FILTER (WHERE t.importance = 'high') as important_tasks,
    COUNT(*) FILTER (WHERE t.priority = 'high') as urgent_tasks
FROM tasks t
GROUP BY t.user_id, t.user_number;

-- 뷰 생성: 태그 통계
CREATE VIEW tag_statistics AS
SELECT 
    tag_name,
    COUNT(*) as usage_count
FROM task_tags
GROUP BY tag_name
ORDER BY usage_count DESC, tag_name;

-- 샘플 데이터 삽입 (선택사항)
-- INSERT INTO users (email, password_hash, name, language, dark_mode) VALUES
--     ('test@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4tbQJ5qKqG', '테스트 사용자', 'ko', false);

-- 권한 설정 (Supabase에서 필요시)
-- GRANT USAGE ON SCHEMA public TO anon, authenticated;
-- GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
-- GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
-- GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated; 