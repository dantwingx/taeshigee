import { NextRequest } from 'next/server';
import { authenticateRequest, createErrorResponse } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

// CORS 헤더 설정 함수
function setCorsHeaders(response: Response): Response {
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
  const origin = allowedOrigins[0] || 'https://taeshigee-production.up.railway.app';
  response.headers.set('Access-Control-Allow-Origin', origin);
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  response.headers.set('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');
  return response;
}

// OPTIONS 요청 처리 (프리플라이트)
export async function OPTIONS() {
  const response = new Response(null, { status: 204 });
  return setCorsHeaders(response);
}

// GET /api/tasks - Get user's tasks
export async function GET(request: NextRequest) {
  try {
    const user = await authenticateRequest(request);
    const { searchParams } = new URL(request.url);
    
    const search = searchParams.get('search') || '';
    const filter = searchParams.get('filter') || 'all';
    
    console.log(`[GET /api/tasks] 시작 - 사용자: ${user.userId}, 검색: "${search}", 필터: ${filter}`);
    
    let query = supabase
      .from('tasks')
      .select(`
        *,
        task_tags(tag_name),
        users!tasks_user_id_fkey(name, user_number)
      `)
      .eq('user_id', user.userId);

    // Apply search filter
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Apply status filter
    if (filter === 'important') {
      query = query.eq('importance', 'high');
    } else if (filter === 'urgent') {
      query = query.eq('priority', 'high');
    }

    const { data: tasks, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error(`[GET /api/tasks] 태스크 조회 실패:`, error);
      return setCorsHeaders(createErrorResponse('Failed to fetch tasks', 500));
    }

    // Transform data to match frontend expectations
    const transformedTasks = tasks.map(task => ({
      id: task.id,
      title: task.title,
      description: task.description,
      dueDate: task.due_date,
      dueTime: task.due_time,
      importance: task.importance,
      priority: task.priority,
      category: task.category,
      isCompleted: task.is_completed,
      isPublic: task.is_public,
      likesCount: task.likes_count,
      tags: task.task_tags.map((tag: { tag_name: string }) => tag.tag_name),
      author: task.users.name,
      userNumber: task.users.user_number,
      createdAt: task.created_at,
      updatedAt: task.updated_at,
    }));

    console.log(`[GET /api/tasks] 성공적으로 완료 - 태스크 수: ${transformedTasks.length}`);
    return setCorsHeaders(Response.json({
      success: true,
      tasks: transformedTasks,
    }));
  } catch (error) {
    console.error(`[GET /api/tasks] 예상치 못한 오류:`, error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return setCorsHeaders(createErrorResponse('Internal server error', 500));
  }
}

// POST /api/tasks - Create new task
export async function POST(request: NextRequest) {
  try {
    const user = await authenticateRequest(request);
    const { title, description, dueDate, dueTime, importance, priority, category, isPublic, tags } = await request.json();

    console.log(`[POST /api/tasks] 시작 - 사용자: ${user.userId}`);

    // Validate input
    if (!title || title.trim().length === 0) {
      console.error(`[POST /api/tasks] 제목이 비어있음`);
      return setCorsHeaders(createErrorResponse('Title is required'));
    }

    if (importance && !['low', 'medium', 'high'].includes(importance)) {
      console.error(`[POST /api/tasks] 잘못된 중요도 값: ${importance}`);
      return setCorsHeaders(createErrorResponse('Importance must be low, medium, or high'));
    }

    if (priority && !['low', 'medium', 'high'].includes(priority)) {
      console.error(`[POST /api/tasks] 잘못된 우선순위 값: ${priority}`);
      return setCorsHeaders(createErrorResponse('Priority must be low, medium, or high'));
    }

    console.log(`[POST /api/tasks] 태스크 생성 데이터:`, {
      title: title.trim(),
      description: description?.trim(),
      dueDate,
      dueTime,
      importance: importance || 'medium',
      priority: priority || 'medium',
      category,
      isPublic: isPublic || false,
      tags
    });

    // Create task
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .insert({
        user_id: user.userId,
        user_number: user.userNumber,
        title: title.trim(),
        description: description?.trim() || null,
        due_date: dueDate || null,
        due_time: dueTime || null,
        importance: importance || 'medium',
        priority: priority || 'medium',
        category: category || null,
        is_completed: false,
        is_public: isPublic || false,
        likes_count: 0,
      })
      .select()
      .single();

    if (taskError) {
      console.error(`[POST /api/tasks] 태스크 생성 실패:`, taskError);
      return setCorsHeaders(createErrorResponse('Failed to create task', 500));
    }

    // Add tags if provided
    if (tags && Array.isArray(tags) && tags.length > 0) {
      console.log(`[POST /api/tasks] 태그 추가 시작:`, tags);
      
      const tagInserts = tags.map((tag: string) => ({
        task_id: task.id,
        tag_name: tag.trim(),
      }));

      const { error: tagError } = await supabase
        .from('task_tags')
        .insert(tagInserts);

      if (tagError) {
        console.error(`[POST /api/tasks] 태그 삽입 실패:`, tagError);
      }
    }

    // Fetch the complete task with tags
    const { data: completeTask, error: fetchError } = await supabase
      .from('tasks')
      .select(`
        *,
        task_tags(tag_name),
        users!tasks_user_id_fkey(name, user_number)
      `)
      .eq('id', task.id)
      .single();

    if (fetchError) {
      console.error(`[POST /api/tasks] 생성된 태스크 조회 실패:`, fetchError);
      return setCorsHeaders(createErrorResponse('Failed to fetch created task', 500));
    }

    const transformedTask = {
      id: completeTask.id,
      title: completeTask.title,
      description: completeTask.description,
      dueDate: completeTask.due_date,
      dueTime: completeTask.due_time,
      importance: completeTask.importance,
      priority: completeTask.priority,
      category: completeTask.category,
      isCompleted: completeTask.is_completed,
      isPublic: completeTask.is_public,
      likesCount: completeTask.likes_count,
      tags: completeTask.task_tags.map((tag: { tag_name: string }) => tag.tag_name),
      author: completeTask.users.name,
      userNumber: completeTask.users.user_number,
      createdAt: completeTask.created_at,
      updatedAt: completeTask.updated_at,
    };

    console.log(`[POST /api/tasks] 성공적으로 완료 - 태스크 ID: ${task.id}`);
    return setCorsHeaders(Response.json({
      success: true,
      task: transformedTask,
    }));
  } catch (error) {
    console.error(`[POST /api/tasks] 예상치 못한 오류:`, error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return setCorsHeaders(createErrorResponse('Internal server error', 500));
  }
} 