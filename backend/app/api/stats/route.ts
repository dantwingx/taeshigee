import { NextRequest } from 'next/server';
import { authenticateRequest, createErrorResponse } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

// GET /api/stats - Get user and system statistics
export async function GET(request: NextRequest) {
  try {
    const user = await authenticateRequest(request);

    // Get user's task statistics
    const { data: userTasks, error: userTasksError } = await supabase
      .from('tasks')
      .select('id, importance, priority, is_public')
      .eq('user_id', user.userId);

    if (userTasksError) {
      return createErrorResponse('Failed to fetch user tasks', 500);
    }

    // Get user's liked tasks count
    const { data: userLikes, error: userLikesError } = await supabase
      .from('task_likes')
      .select('id')
      .eq('user_id', user.userId);

    if (userLikesError) {
      return createErrorResponse('Failed to fetch user likes', 500);
    }

    // Get system-wide statistics
    const { data: totalTasks, error: totalTasksError } = await supabase
      .from('tasks')
      .select('id', { count: 'exact' });

    if (totalTasksError) {
      return createErrorResponse('Failed to fetch total tasks', 500);
    }

    const { data: publicTasks, error: publicTasksError } = await supabase
      .from('tasks')
      .select('id', { count: 'exact' })
      .eq('is_public', true);

    if (publicTasksError) {
      return createErrorResponse('Failed to fetch public tasks', 500);
    }

    const { data: totalLikes, error: totalLikesError } = await supabase
      .from('task_likes')
      .select('id', { count: 'exact' });

    if (totalLikesError) {
      return createErrorResponse('Failed to fetch total likes', 500);
    }

    // Calculate user statistics
    const userStats = {
      totalTasks: userTasks.length,
      importantTasks: userTasks.filter(task => task.importance === 'high').length,
      urgentTasks: userTasks.filter(task => task.priority === 'high').length,
      publicTasks: userTasks.filter(task => task.is_public).length,
      privateTasks: userTasks.filter(task => !task.is_public).length,
      totalLikes: userLikes.length,
    };

    // Calculate system statistics
    const systemStats = {
      totalTasks: totalTasks.length,
      publicTasks: publicTasks.length,
      totalLikes: totalLikes.length,
    };

    return Response.json({
      success: true,
      userStats,
      systemStats,
    });
  } catch {
    return createErrorResponse('Authentication failed', 401);
  }
} 