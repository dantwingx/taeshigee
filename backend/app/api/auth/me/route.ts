import { NextRequest } from 'next/server';
import { authenticateRequest, createAuthResponse, createErrorResponse } from '@/lib/auth';
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

export async function GET(request: NextRequest) {
  try {
    // 인증 및 DB에서 사용자 정보 조회
    const user = await authenticateRequest(request);
    // DB에서 created_at, updated_at 조회
    const { data: userData } = await supabase
      .from('users')
      .select('created_at, updated_at')
      .eq('id', user.userId)
      .single();
    return setCorsHeaders(createAuthResponse({ ...user, created_at: userData?.created_at, updated_at: userData?.updated_at }));
  } catch {
    return setCorsHeaders(createErrorResponse('Authentication failed', 401));
  }
} 