import { NextRequest } from 'next/server';
import { authenticateRequest, createErrorResponse } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

// GET /api/tasks/[id] - Get specific task
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const user = await authenticateRequest(request);
    
    const { data: task, error } = await supabase
      .from('tasks')
      .select(`
        *,
        task_tags(tag_name),
        users!tasks_user_id_fkey(name, user_number)
      `)
      .eq('id', id)
      .eq('user_id', user.userId)
      .single();

    if (error || !task) {
      return createErrorResponse('Task not found', 404);
    }

    const transformedTask = {
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
    };

    return Response.json({
      success: true,
      task: transformedTask,
    });
  } catch (error) {
    return createErrorResponse('Authentication failed', 401);
  }
}

// PUT /api/tasks/[id] - Update task
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const user = await authenticateRequest(request);
    const { title, description, dueDate, dueTime, importance, priority, category, isPublic, tags } = await request.json();

    // Check if task exists and belongs to user
    const { data: existingTask, error: checkError } = await supabase
      .from('tasks')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.userId)
      .single();

    if (checkError || !existingTask) {
      return createErrorResponse('Task not found', 404);
    }

    // Validate input
    if (title !== undefined && title.trim().length === 0) {
      return createErrorResponse('Title cannot be empty');
    }

    if (importance && !['low', 'medium', 'high'].includes(importance)) {
      return createErrorResponse('Importance must be low, medium, or high');
    }

    if (priority && !['low', 'medium', 'high'].includes(priority)) {
      return createErrorResponse('Priority must be low, medium, or high');
    }

    // Update task
    const updateData: any = {};
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description?.trim() || null;
    if (dueDate !== undefined) updateData.due_date = dueDate || null;
    if (dueTime !== undefined) updateData.due_time = dueTime || null;
    if (importance !== undefined) updateData.importance = importance;
    if (priority !== undefined) updateData.priority = priority;
    if (category !== undefined) updateData.category = category || null;
    if (isPublic !== undefined) updateData.is_public = isPublic;

    const { data: task, error: updateError } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      return createErrorResponse('Failed to update task', 500);
    }

    // Update tags if provided
    if (tags !== undefined) {
      // Delete existing tags
      await supabase
        .from('task_tags')
        .delete()
        .eq('task_id', id);

      // Insert new tags
      if (Array.isArray(tags) && tags.length > 0) {
        const tagInserts = tags.map((tag: string) => ({
          task_id: id,
          tag_name: tag.trim(),
        }));

        await supabase
          .from('task_tags')
          .insert(tagInserts);
      }
    }

    // Fetch the complete updated task
    const { data: completeTask, error: fetchError } = await supabase
      .from('tasks')
      .select(`
        *,
        task_tags(tag_name),
        users!tasks_user_id_fkey(name, user_number)
      `)
      .eq('id', id)
      .single();

    if (fetchError) {
      return createErrorResponse('Failed to fetch updated task', 500);
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

// DELETE /api/tasks/[id] - Delete task
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const user = await authenticateRequest(request);

    // Check if task exists and belongs to user
    const { data: existingTask, error: checkError } = await supabase
      .from('tasks')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.userId)
      .single();

    if (checkError || !existingTask) {
      return createErrorResponse('Task not found', 404);
    }

    // Delete task tags first (due to foreign key constraint)
    await supabase
      .from('task_tags')
      .delete()
      .eq('task_id', id);

    // Delete task likes
    await supabase
      .from('task_likes')
      .delete()
      .eq('task_id', id);

    // Delete task
    const { error: deleteError } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (deleteError) {
      return createErrorResponse('Failed to delete task', 500);
    }

    return Response.json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    return createErrorResponse('Authentication failed', 401);
  }
} 