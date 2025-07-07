import { NextRequest } from 'next/server';
import { authenticateRequest, createErrorResponse } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import crypto from 'crypto';

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

// Simple translation function for backend
function getTranslation(language: string = 'ko') {
  const translations = {
    ko: { copySuffix: '(복사본)' },
    en: { copySuffix: '(Copy)' },
    ja: { copySuffix: '(コピー)' },
    zh: { copySuffix: '(副本)' },
    fr: { copySuffix: '(copie)' },
    es: { copySuffix: '(copia)' },
    de: { copySuffix: '(Kopie)' },
    it: { copySuffix: '(copia)' },
    pt: { copySuffix: '(cópia)' },
    ru: { copySuffix: '(копия)' },
    ar: { copySuffix: '(نسخة)' },
    hi: { copySuffix: '(प्रतिलिपि)' },
    th: { copySuffix: '(สำเนา)' },
    vi: { copySuffix: '(bản sao)' },
    id: { copySuffix: '(salinan)' },
    ms: { copySuffix: '(salinan)' },
    tr: { copySuffix: '(kopya)' },
    pl: { copySuffix: '(kopia)' },
    nl: { copySuffix: '(kopie)' },
    sv: { copySuffix: '(kopia)' },
  };
  
  return translations[language as keyof typeof translations] || translations.ko;
}

// POST /api/tasks/[id]/duplicate - Duplicate task
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const user = await authenticateRequest(request);

    // Get language from request headers or query params
    const acceptLanguage = request.headers.get('accept-language') || '';
    const url = new URL(request.url);
    const langParam = url.searchParams.get('lang');
    
    // Determine language (priority: query param > accept-language header > default)
    let language = 'ko';
    if (langParam) {
      language = langParam;
    } else if (acceptLanguage) {
      // Extract primary language from accept-language header
      const primaryLang = acceptLanguage.split(',')[0].split('-')[0];
      language = primaryLang;
    }

    const t = getTranslation(language);

    console.log(`[POST /api/tasks/${id}/duplicate] 시작 - 사용자: ${user.userId}, 언어: ${language}`);

    // Get original task
    const { data: originalTask, error: fetchError } = await supabase
      .from('tasks')
      .select(`
        *,
        task_tags(tag_name)
      `)
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error(`[POST /api/tasks/${id}/duplicate] 원본 태스크 조회 실패:`, fetchError);
      return setCorsHeaders(createErrorResponse('Task not found', 404));
    }

    if (!originalTask) {
      console.error(`[POST /api/tasks/${id}/duplicate] 원본 태스크를 찾을 수 없음`);
      return setCorsHeaders(createErrorResponse('Task not found', 404));
    }

    // Create duplicated task
    const duplicatedTaskData = {
      user_id: user.userId,
      user_number: user.userNumber,
      title: `${originalTask.title} ${t.copySuffix}`,
      description: originalTask.description,
      due_date: originalTask.due_date,
      due_time: originalTask.due_time,
      importance: originalTask.importance,
      priority: originalTask.priority,
      category: originalTask.category,
      is_completed: false,
      is_public: false, // 복사본은 기본적으로 비공개
      likes_count: 0,
    };

    console.log(`[POST /api/tasks/${id}/duplicate] 복제 태스크 데이터:`, duplicatedTaskData);

    const { data: newTask, error: createError } = await supabase
      .from('tasks')
      .insert(duplicatedTaskData)
      .select()
      .single();

    if (createError) {
      console.error(`[POST /api/tasks/${id}/duplicate] 태스크 복제 실패:`, createError);
      return setCorsHeaders(createErrorResponse('Failed to duplicate task', 500));
    }

    // Copy tags
    if (originalTask.task_tags && originalTask.task_tags.length > 0) {
      console.log(`[POST /api/tasks/${id}/duplicate] 태그 복제 시작:`, originalTask.task_tags);
      
      // 태그 데이터 준비 - id 컬럼에 명시적으로 UUID 생성
      const tagInserts = originalTask.task_tags.map((tag: { tag_name: string }) => ({
        id: crypto.randomUUID(), // 명시적으로 UUID 생성
        task_id: newTask.id,
        tag_name: tag.tag_name,
      }));

      console.log(`[POST /api/tasks/${id}/duplicate] 삽입할 태그 데이터:`, tagInserts);

      // 각 태그를 개별적으로 삽입하여 오류 추적
      for (const tagData of tagInserts) {
        try {
          const { error: singleTagError } = await supabase
            .from('task_tags')
            .insert(tagData);

          if (singleTagError) {
            console.error(`[POST /api/tasks/${id}/duplicate] 개별 태그 삽입 실패:`, tagData, singleTagError);
          } else {
            console.log(`[POST /api/tasks/${id}/duplicate] 개별 태그 삽입 성공:`, tagData);
          }
        } catch (error) {
          console.error(`[POST /api/tasks/${id}/duplicate] 개별 태그 삽입 중 예외 발생:`, tagData, error);
        }
      }
    }

    // Fetch the complete duplicated task
    const { data: completeTask, error: fetchCompleteError } = await supabase
      .from('tasks')
      .select(`
        *,
        task_tags(tag_name),
        users!tasks_user_id_fkey(name, user_number)
      `)
      .eq('id', newTask.id)
      .single();

    if (fetchCompleteError) {
      console.error(`[POST /api/tasks/${id}/duplicate] 복제된 태스크 조회 실패:`, fetchCompleteError);
      return setCorsHeaders(createErrorResponse('Failed to fetch duplicated task', 500));
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

    console.log(`[POST /api/tasks/${id}/duplicate] 성공적으로 완료 - 새 태스크 ID: ${newTask.id}`);
    return setCorsHeaders(Response.json({
      success: true,
      task: transformedTask,
    }));
  } catch (error) {
    console.error(`[POST /api/tasks/[id]/duplicate] 예상치 못한 오류:`, error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return setCorsHeaders(createErrorResponse('Internal server error', 500));
  }
} 