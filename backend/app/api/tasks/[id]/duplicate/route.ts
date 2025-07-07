import { NextRequest } from 'next/server';
import { authenticateRequest, createErrorResponse } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

// POST /api/tasks/[id]/duplicate - Duplicate task
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const user = await authenticateRequest(request);

    // Get the original task with tags
    const { data: originalTask, error: taskError } = await supabase
      .from('tasks')
      .select(`
        *,
        task_tags(tag_name)
      `)
      .eq('id', id)
      .single();

    if (taskError || !originalTask) {
      return createErrorResponse('Task not found', 404);
    }

    // Create new task with same properties (except id and timestamps)
    const { data: newTask, error: createError } = await supabase
      .from('tasks')
      .insert({
        user_id: user.userId,
        user_number: user.userNumber,
        title: `${originalTask.title} (Copy)`,
        description: originalTask.description,
        due_date: originalTask.due_date,
        due_time: originalTask.due_time,
        importance: originalTask.importance,
        priority: originalTask.priority,
        category: originalTask.category,
        is_completed: false, // 복제된 태스크는 미완료 상태로 시작
        is_public: false, // Duplicated tasks are private by default
        likes_count: 0,
      })
      .select()
      .single();

    if (createError) {
      console.error('Failed to create duplicated task:', createError);
      return createErrorResponse('Failed to duplicate task', 500);
    }

    // Copy tags to new task
    if (originalTask.task_tags && originalTask.task_tags.length > 0) {
      const tagInserts = originalTask.task_tags.map((tag: any) => ({
        task_id: newTask.id,
        tag_name: tag.tag_name,
      }));

      const { error: tagError } = await supabase
        .from('task_tags')
        .insert(tagInserts);

      if (tagError) {
        console.error('Failed to copy tags:', tagError);
      }
    }

    // Fetch the complete duplicated task
    const { data: completeTask, error: fetchError } = await supabase
      .from('tasks')
      .select(`
        *,
        task_tags(tag_name),
        users!tasks_user_id_fkey(name, user_number)
      `)
      .eq('id', newTask.id)
      .single();

    if (fetchError) {
      console.error('Failed to fetch duplicated task:', fetchError);
      return createErrorResponse('Failed to fetch duplicated task', 500);
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
    console.error('Duplicate task error:', error);
    return createErrorResponse('Internal server error', 500);
  }
} 