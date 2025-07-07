import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';

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
      return Response.json(
        { success: false, error: 'Failed to fetch public tasks' },
        { status: 500 }
      );
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
      tags: (task.task_tags ?? []).map((tag: any) => tag.tag_name),
      author: task.users?.name ?? '',
      userNumber: task.users?.user_number ?? null,
      createdAt: task.created_at,
      updatedAt: task.updated_at,
    }));

    return Response.json({
      success: true,
      tasks: transformedTasks,
    });
  } catch (error) {
    // 상세 에러 로그 출력
    console.error('GET /api/public-tasks error:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return Response.json(
      { 
        success: false, 
        error: 'Internal server error', 
        detail: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
} 