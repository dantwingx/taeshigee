import { NextRequest } from 'next/server';
import { authenticateRequest, createErrorResponse } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import crypto from 'crypto'

// POST /api/tasks/[id]/like - Toggle task like
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const user = await authenticateRequest(request);

    console.log(`[POST /api/tasks/${id}/like] 시작 - 사용자: ${user.userId}`);

    // Check if task exists
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .select('id, likes_count')
      .eq('id', id)
      .single();

    if (taskError) {
      console.error(`[POST /api/tasks/${id}/like] 태스크 조회 실패:`, taskError);
      return createErrorResponse('Task not found', 404);
    }

    if (!task) {
      console.error(`[POST /api/tasks/${id}/like] 태스크를 찾을 수 없음`);
      return createErrorResponse('Task not found', 404);
    }

    // Check if user already liked the task
    const { data: existingLike, error: likeError } = await supabase
      .from('task_likes')
      .select('id')
      .eq('task_id', id)
      .eq('user_id', user.userId)
      .single();

    if (likeError && likeError.code !== 'PGRST116') { // PGRST116는 "no rows returned" 에러
      console.error(`[POST /api/tasks/${id}/like] 기존 좋아요 확인 실패:`, likeError);
    }

    if (existingLike) {
      console.log(`[POST /api/tasks/${id}/like] 좋아요 취소 - 현재 카운트: ${task.likes_count}`);
      
      // Unlike: Remove like and decrease count
      const { error: deleteLikeError } = await supabase
        .from('task_likes')
        .delete()
        .eq('task_id', id)
        .eq('user_id', user.userId);

      if (deleteLikeError) {
        console.error(`[POST /api/tasks/${id}/like] 좋아요 삭제 실패:`, deleteLikeError);
      }

      const { error: updateCountError } = await supabase
        .from('tasks')
        .update({ likes_count: Math.max(0, task.likes_count - 1) })
        .eq('id', id);

      if (updateCountError) {
        console.error(`[POST /api/tasks/${id}/like] 좋아요 카운트 감소 실패:`, updateCountError);
      }

      const newLikesCount = Math.max(0, task.likes_count - 1)
      console.log(`[POST /api/tasks/${id}/like] 좋아요 취소 완료 - 새로운 카운트: ${newLikesCount}`);
      return Response.json({
        success: true,
        liked: false,
        likesCount: newLikesCount,
      });
    } else {
      console.log(`[POST /api/tasks/${id}/like] 좋아요 추가 - 현재 카운트: ${task.likes_count}`);
      
      // Like: Add like and increase count
      const { error: insertLikeError } = await supabase
        .from('task_likes')
        .insert({
          id: crypto.randomUUID(), // 명시적으로 UUID 생성
          task_id: id,
          user_id: user.userId,
          user_number: user.userNumber,
        });

      if (insertLikeError) {
        console.error(`[POST /api/tasks/${id}/like] 좋아요 추가 실패:`, insertLikeError);
      }

      const { error: updateCountError } = await supabase
        .from('tasks')
        .update({ likes_count: task.likes_count + 1 })
        .eq('id', id);

      if (updateCountError) {
        console.error(`[POST /api/tasks/${id}/like] 좋아요 카운트 증가 실패:`, updateCountError);
      }

      console.log(`[POST /api/tasks/${id}/like] 좋아요 추가 완료`);
      return Response.json({
        success: true,
        liked: true,
        likesCount: task.likes_count + 1,
      });
    }
  } catch (error) {
    console.error(`[POST /api/tasks/[id]/like] 예상치 못한 오류:`, error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return createErrorResponse('Internal server error', 500);
  }
} 