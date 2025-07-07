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
      return setCorsHeaders(createErrorResponse('Failed to fetch user tasks', 500));
    }

    // Get user's liked tasks count
    const { data: userLikes, error: userLikesError } = await supabase
      .from('task_likes')
      .select('id')
      .eq('user_id', user.userId);

    if (userLikesError) {
      return setCorsHeaders(createErrorResponse('Failed to fetch user likes', 500));
    }

    // Get system-wide statistics
    const { data: totalTasks, error: totalTasksError } = await supabase
      .from('tasks')
      .select('id', { count: 'exact' });

    if (totalTasksError) {
      return setCorsHeaders(createErrorResponse('Failed to fetch total tasks', 500));
    }

    const { data: publicTasks, error: publicTasksError } = await supabase
      .from('tasks')
      .select('id', { count: 'exact' })
      .eq('is_public', true);

    if (publicTasksError) {
      return setCorsHeaders(createErrorResponse('Failed to fetch public tasks', 500));
    }

    const { data: totalLikes, error: totalLikesError } = await supabase
      .from('task_likes')
      .select('id', { count: 'exact' });

    if (totalLikesError) {
      return setCorsHeaders(createErrorResponse('Failed to fetch total likes', 500));
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

    return setCorsHeaders(Response.json({
      success: true,
      userStats,
      systemStats,
    }));
  } catch {
    return setCorsHeaders(createErrorResponse('Authentication failed', 401));
  }
} 