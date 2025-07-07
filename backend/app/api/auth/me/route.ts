import { NextRequest } from 'next/server';
import { authenticateRequest, createAuthResponse, createErrorResponse } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

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
    return createAuthResponse({ ...user, created_at: userData?.created_at, updated_at: userData?.updated_at });
  } catch (error) {
    return createErrorResponse('Authentication failed', 401);
  }
} 