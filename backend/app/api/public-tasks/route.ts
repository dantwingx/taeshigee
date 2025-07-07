import { NextRequest } from 'next/server';
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

// GET /api/public-tasks - Get public tasks from all users
export async function GET(request: NextRequest) {
  console.error('public-tasks API 진입: ', new Date().toISOString());
  try {
    const { searchParams } = new URL(request.url);
    
    const search = searchParams.get('search') || '';
    const filter = searchParams.get('filter') || 'all';
    
    let query = supabase
      .from('tasks')
      .select(`
        *,
        task_tags(tag_name),
        users!tasks_user_id_fkey(name, user_number)
      `)
      .eq('is_public', true);

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
      console.error('Supabase public-tasks 쿼리 에러:', error);
      return setCorsHeaders(Response.json(
        { success: false, error: 'Failed to fetch public tasks', detail: error.message || String(error) },
        { status: 500 }
      ));
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
      tags: (task.task_tags ?? []).map((tag: { tag_name: string }) => tag.tag_name),
      author: task.users?.name ?? '',
      userNumber: task.users?.user_number ?? null,
      createdAt: task.created_at,
      updatedAt: task.updated_at,
    }));

    return setCorsHeaders(Response.json({
      success: true,
      tasks: transformedTasks,
    }));
  } catch (error) {
    // 상세 에러 로그 출력
    console.error('GET /api/public-tasks error:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return setCorsHeaders(Response.json(
      { 
        success: false, 
        error: 'Internal server error', 
        detail: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    ));
  }
} 