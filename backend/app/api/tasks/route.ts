import { NextRequest } from 'next/server';
import { authenticateRequest, createErrorResponse } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

// GET /api/tasks - Get user's tasks
export async function GET(request: NextRequest) {
  try {
    const user = await authenticateRequest(request);
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
      return createErrorResponse('Failed to fetch tasks', 500);
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
      tags: task.task_tags.map((tag: any) => tag.tag_name),
      author: task.users.name,
      userNumber: task.users.user_number,
      createdAt: task.created_at,
      updatedAt: task.updated_at,
    }));

    return Response.json({
      success: true,
      tasks: transformedTasks,
    });
  } catch (error) {
    return createErrorResponse('Authentication failed', 401);
  }
}

// POST /api/tasks - Create new task
export async function POST(request: NextRequest) {
  try {
    const user = await authenticateRequest(request);
    const { title, description, dueDate, dueTime, importance, priority, category, isPublic, tags } = await request.json();

    // Validate input
    if (!title || title.trim().length === 0) {
      return createErrorResponse('Title is required');
    }

    if (importance && !['low', 'medium', 'high'].includes(importance)) {
      return createErrorResponse('Importance must be low, medium, or high');
    }

    if (priority && !['low', 'medium', 'high'].includes(priority)) {
      return createErrorResponse('Priority must be low, medium, or high');
    }

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
      return createErrorResponse('Failed to create task', 500);
    }

    // Add tags if provided
    if (tags && Array.isArray(tags) && tags.length > 0) {
      const tagInserts = tags.map((tag: string) => ({
        task_id: task.id,
        tag_name: tag.trim(),
      }));

      const { error: tagError } = await supabase
        .from('task_tags')
        .insert(tagInserts);

      if (tagError) {
        console.error('Failed to insert tags:', tagError);
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
      return createErrorResponse('Failed to fetch created task', 500);
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
      tags: completeTask.task_tags.map((tag: any) => tag.tag_name),
      author: completeTask.users.name,
      userNumber: completeTask.users.user_number,
      createdAt: completeTask.created_at,
      updatedAt: completeTask.updated_at,
    };

    return Response.json({
      success: true,
      task: transformedTask,
    });
  } catch (error) {
    return createErrorResponse('Authentication failed', 401);
  }
} 