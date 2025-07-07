import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/supabase';
import { signToken } from '@/lib/jwt';
import { createApiErrorResponse, createValidationError, handleUnexpectedError } from '@/lib/errorHandler';

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
  console.log('ALLOWED_ORIGINS (OPTIONS):', process.env.ALLOWED_ORIGINS);
  const response = new Response(null, { status: 204 });
  return setCorsHeaders(response);
}

export async function POST(request: NextRequest) {
  try {
    console.log('ALLOWED_ORIGINS (POST):', process.env.ALLOWED_ORIGINS);
    console.log('[Login API] POST /api/auth/login - Request received');
    
    const { email, password } = await request.json();
    console.log('[Login API] Login attempt for email:', email);

    // Validate input
    if (!email || !password) {
      console.error('[Login API] Missing credentials');
      const errorResponse = createValidationError('credentials', '이메일과 비밀번호를 입력해주세요.');
      return setCorsHeaders(errorResponse);
    }

    // Find user by email (including password_hash)
    const { data: user, error } = await supabase
      .from('users')
      .select('id, user_number, email, password_hash, name, language, dark_mode, created_at, updated_at')
      .eq('email', email)
      .single();

    if (error || !user) {
      console.error('[Login API] User not found or database error:', error);
      const errorResponse = createApiErrorResponse('INVALID_CREDENTIALS');
      return setCorsHeaders(errorResponse);
    }

    console.log('[Login API] User found:', user.id);

    // Verify password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      console.error('[Login API] Invalid password for user:', user.id);
      const errorResponse = createApiErrorResponse('INVALID_CREDENTIALS');
      return setCorsHeaders(errorResponse);
    }

    console.log('[Login API] Password verified successfully for user:', user.id);

    // Generate JWT token
    const token = signToken({
      userId: user.id,
      userNumber: user.user_number,
      email: user.email,
      name: user.name,
    });

    console.log('[Login API] Login successful for user:', user.id);

    const successResponse = Response.json({
      success: true,
      token,
      user: {
        id: user.id,
        userNumber: user.user_number,
        email: user.email,
        name: user.name,
        language: user.language,
        darkMode: user.dark_mode,
        createdAt: user.created_at,
        lastUpdated: user.updated_at,
      },
    });
    
    return setCorsHeaders(successResponse);
  } catch (error) {
    console.error('Login error:', error);
    const errorResponse = handleUnexpectedError(error, 'login');
    return setCorsHeaders(errorResponse);
  }
} 