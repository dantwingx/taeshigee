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
        title: `${originalTask.title} (Copy)`,
        description: originalTask.description,
        importance: originalTask.importance,
        priority: originalTask.priority,
        is_public: false, // Duplicated tasks are private by default
        likes_count: 0,
      })
      .select()
      .single();

    if (createError) {
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
        users!tasks_user_id_fkey(name)
      `)
      .eq('id', newTask.id)
      .single();

    if (fetchError) {
      return createErrorResponse('Failed to fetch duplicated task', 500);
    }

    const transformedTask = {
      id: completeTask.id,
      title: completeTask.title,
      description: completeTask.description,
      importance: completeTask.importance,
      priority: completeTask.priority,
      isPublic: completeTask.is_public,
      likesCount: completeTask.likes_count,
      tags: completeTask.task_tags.map((tag: any) => tag.tag_name),
      author: completeTask.users.name,
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