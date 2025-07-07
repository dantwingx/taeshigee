import { NextRequest } from 'next/server';
import { authenticateRequest, createErrorResponse } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { randomUUID } from 'crypto';

// GET /api/tasks/[id] - Get specific task
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const user = await authenticateRequest(request);

    console.log(`[GET /api/tasks/${id}] 시작 - 사용자: ${user.userId}`);

    const { data: task, error } = await supabase
      .from('tasks')
      .select(`
        *,
        task_tags(tag_name),
        users!tasks_user_id_fkey(name, user_number)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error(`[GET /api/tasks/${id}] 태스크 조회 실패:`, error);
      return createErrorResponse('Task not found', 404);
    }

    if (!task) {
      console.error(`[GET /api/tasks/${id}] 태스크를 찾을 수 없음`);
      return createErrorResponse('Task not found', 404);
    }

    // Check if user owns the task
    if (task.user_id !== user.userId) {
      console.error(`[GET /api/tasks/${id}] 권한 없음 - 태스크 소유자: ${task.user_id}, 요청자: ${user.userId}`);
      return createErrorResponse('Permission denied', 403);
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
      tags: task.task_tags.map((tag: { tag_name: string }) => tag.tag_name),
      author: task.users.name,
      userNumber: task.users.user_number,
      createdAt: task.created_at,
      updatedAt: task.updated_at,
    };

    console.log(`[GET /api/tasks/${id}] 성공적으로 완료`);
    return Response.json({
      success: true,
      task: transformedTask,
    });
  } catch (error) {
    console.error(`[GET /api/tasks/[id]] 예상치 못한 오류:`, error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return createErrorResponse('Internal server error', 500);
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
    const { title, description, dueDate, dueTime, importance, priority, category, isPublic, tags, isCompleted } = await request.json();

    console.log(`[PUT /api/tasks/${id}] 시작 - 사용자: ${user.userId}`);

    // Check if task exists and belongs to user
    const { data: existingTask, error: checkError } = await supabase
      .from('tasks')
      .select('id, user_id')
      .eq('id', id)
      .single();

    if (checkError) {
      console.error(`[PUT /api/tasks/${id}] 태스크 존재 확인 실패:`, checkError);
      return createErrorResponse('Task not found', 404);
    }

    if (!existingTask) {
      console.error(`[PUT /api/tasks/${id}] 태스크를 찾을 수 없음`);
      return createErrorResponse('Task not found', 404);
    }

    // Check if user owns the task
    if (existingTask.user_id !== user.userId) {
      console.error(`[PUT /api/tasks/${id}] 권한 없음 - 태스크 소유자: ${existingTask.user_id}, 요청자: ${user.userId}`);
      return createErrorResponse('Permission denied', 403);
    }

    // Validate input
    if (title !== undefined && title.trim().length === 0) {
      console.error(`[PUT /api/tasks/${id}] 제목이 비어있음`);
      return createErrorResponse('Title cannot be empty');
    }

    if (importance && !['low', 'medium', 'high'].includes(importance)) {
      console.error(`[PUT /api/tasks/${id}] 잘못된 중요도 값: ${importance}`);
      return createErrorResponse('Importance must be low, medium, or high');
    }

    if (priority && !['low', 'medium', 'high'].includes(priority)) {
      console.error(`[PUT /api/tasks/${id}] 잘못된 우선순위 값: ${priority}`);
      return createErrorResponse('Priority must be low, medium, or high');
    }

    // Update task
    const updateData: {
      title?: string;
      description?: string | null;
      due_date?: string | null;
      due_time?: string | null;
      importance?: string;
      priority?: string;
      category?: string | null;
      is_public?: boolean;
      is_completed?: boolean;
    } = {};
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description?.trim() || null;
    if (dueDate !== undefined) updateData.due_date = dueDate || null;
    if (dueTime !== undefined) updateData.due_time = dueTime || null;
    if (importance !== undefined) updateData.importance = importance;
    if (priority !== undefined) updateData.priority = priority;
    if (category !== undefined) updateData.category = category || null;
    if (isPublic !== undefined) updateData.is_public = isPublic;
    if (isCompleted !== undefined) updateData.is_completed = isCompleted;

    console.log(`[PUT /api/tasks/${id}] 업데이트 데이터:`, updateData);

    // 업데이트할 데이터가 있는지 확인
    if (Object.keys(updateData).length === 0) {
      console.log(`[PUT /api/tasks/${id}] 업데이트할 데이터가 없음`);
      // 업데이트할 데이터가 없으면 기존 태스크를 그대로 반환
    } else {
      const { data: task, error: updateError } = await supabase
        .from('tasks')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        console.error(`[PUT /api/tasks/${id}] 태스크 업데이트 실패:`, updateError);
        return createErrorResponse('Failed to update task', 500);
      }

      if (!task) {
        console.error(`[PUT /api/tasks/${id}] 업데이트 후 태스크를 찾을 수 없음`);
        return createErrorResponse('Task not found after update', 404);
      }
    }

    // Update tags if provided
    if (tags !== undefined) {
      console.log(`[PUT /api/tasks/${id}] 태그 업데이트 시작:`, tags);
      
      // Delete existing tags
      const { error: deleteTagsError } = await supabase
        .from('task_tags')
        .delete()
        .eq('task_id', id);

      if (deleteTagsError) {
        console.error(`[PUT /api/tasks/${id}] 기존 태그 삭제 실패:`, deleteTagsError);
      }

      // Insert new tags
      if (Array.isArray(tags) && tags.length > 0) {
        // 태그 데이터 준비 - id 컬럼에 명시적으로 UUID 생성
        const tagInserts = tags.map((tag: string) => ({
          id: randomUUID(), // 명시적으로 UUID 생성
          task_id: id,
          tag_name: tag.trim(),
        }));

        console.log(`[PUT /api/tasks/${id}] 삽입할 태그 데이터:`, tagInserts);

        // 각 태그를 개별적으로 삽입하여 오류 추적
        for (const tagData of tagInserts) {
          try {
            const { error: singleTagError } = await supabase
              .from('task_tags')
              .insert(tagData);

            if (singleTagError) {
              console.error(`[PUT /api/tasks/${id}] 개별 태그 삽입 실패:`, tagData, singleTagError);
            } else {
              console.log(`[PUT /api/tasks/${id}] 개별 태그 삽입 성공:`, tagData);
            }
          } catch (error) {
            console.error(`[PUT /api/tasks/${id}] 개별 태그 삽입 중 예외 발생:`, tagData, error);
          }
        }
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
      console.error(`[PUT /api/tasks/${id}] 업데이트된 태스크 조회 실패:`, fetchError);
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
      tags: completeTask.task_tags.map((tag: { tag_name: string }) => tag.tag_name),
      author: completeTask.users.name,
      userNumber: completeTask.users.user_number,
      createdAt: completeTask.created_at,
      updatedAt: completeTask.updated_at,
    };

    console.log(`[PUT /api/tasks/${id}] 성공적으로 완료`);
    return Response.json({
      success: true,
      task: transformedTask,
    });
  } catch (error) {
    console.error(`[PUT /api/tasks/[id]] 예상치 못한 오류:`, error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return createErrorResponse('Internal server error', 500);
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

    console.log(`[DELETE /api/tasks/${id}] 시작 - 사용자: ${user.userId}`);

    // Check if task exists and belongs to user
    const { data: existingTask, error: checkError } = await supabase
      .from('tasks')
      .select('id, user_id')
      .eq('id', id)
      .single();

    if (checkError) {
      console.error(`[DELETE /api/tasks/${id}] 태스크 존재 확인 실패:`, checkError);
      return createErrorResponse('Task not found', 404);
    }

    if (!existingTask) {
      console.error(`[DELETE /api/tasks/${id}] 태스크를 찾을 수 없음`);
      return createErrorResponse('Task not found', 404);
    }

    // Check if user owns the task
    if (existingTask.user_id !== user.userId) {
      console.error(`[DELETE /api/tasks/${id}] 권한 없음 - 태스크 소유자: ${existingTask.user_id}, 요청자: ${user.userId}`);
      return createErrorResponse('Permission denied', 403);
    }

    // Delete task tags first (due to foreign key constraint)
    const { error: deleteTagsError } = await supabase
      .from('task_tags')
      .delete()
      .eq('task_id', id);

    if (deleteTagsError) {
      console.error(`[DELETE /api/tasks/${id}] 태그 삭제 실패:`, deleteTagsError);
    }

    // Delete task likes
    const { error: deleteLikesError } = await supabase
      .from('task_likes')
      .delete()
      .eq('task_id', id);

    if (deleteLikesError) {
      console.error(`[DELETE /api/tasks/${id}] 좋아요 삭제 실패:`, deleteLikesError);
    }

    // Delete task
    const { error: deleteError } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error(`[DELETE /api/tasks/${id}] 태스크 삭제 실패:`, deleteError);
      return createErrorResponse('Failed to delete task', 500);
    }

    console.log(`[DELETE /api/tasks/${id}] 성공적으로 완료`);
    return Response.json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    console.error(`[DELETE /api/tasks/[id]] 예상치 못한 오류:`, error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return createErrorResponse('Internal server error', 500);
  }
} 