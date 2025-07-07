import { NextRequest } from 'next/server';
import { authenticateRequest, createErrorResponse } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

// POST /api/tasks/[id]/like - Toggle task like
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await authenticateRequest(request);

    // Check if task exists
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .select('id, likes_count')
      .eq('id', params.id)
      .single();

    if (taskError || !task) {
      return createErrorResponse('Task not found', 404);
    }

    // Check if user already liked the task
    const { data: existingLike, error: likeError } = await supabase
      .from('task_likes')
      .select('id')
      .eq('task_id', params.id)
      .eq('user_id', user.userId)
      .single();

    if (existingLike) {
      // Unlike: Remove like and decrease count
      await supabase
        .from('task_likes')
        .delete()
        .eq('task_id', params.id)
        .eq('user_id', user.userId);

      await supabase
        .from('tasks')
        .update({ likes_count: task.likes_count - 1 })
        .eq('id', params.id);

      return Response.json({
        success: true,
        liked: false,
        likesCount: task.likes_count - 1,
      });
    } else {
      // Like: Add like and increase count
      await supabase
        .from('task_likes')
        .insert({
          task_id: params.id,
          user_id: user.userId,
          user_number: user.userNumber,
        });

      await supabase
        .from('tasks')
        .update({ likes_count: task.likes_count + 1 })
        .eq('id', params.id);

      return Response.json({
        success: true,
        liked: true,
        likesCount: task.likes_count + 1,
      });
    }
  } catch (error) {
    return createErrorResponse('Authentication failed', 401);
  }
} 