import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/supabase';
import { signToken } from '@/lib/jwt';
import { createApiErrorResponse, createValidationError, handleUnexpectedError } from '@/lib/errorHandler';

export async function POST(request: NextRequest) {
  try {
    console.log('[Login API] POST /api/auth/login - Request received');
    
    const { email, password } = await request.json();
    console.log('[Login API] Login attempt for email:', email);

    // Validate input
    if (!email || !password) {
      console.error('[Login API] Missing credentials');
      return createValidationError('credentials', '이메일과 비밀번호를 입력해주세요.');
    }

    // Find user by email (including password_hash)
    const { data: user, error } = await supabase
      .from('users')
      .select('id, user_number, email, password_hash, name, language, dark_mode, created_at, updated_at')
      .eq('email', email)
      .single();

    if (error || !user) {
      console.error('[Login API] User not found or database error:', error);
      return createApiErrorResponse('INVALID_CREDENTIALS');
    }

    console.log('[Login API] User found:', user.id);

    // Verify password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      console.error('[Login API] Invalid password for user:', user.id);
      return createApiErrorResponse('INVALID_CREDENTIALS');
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

    return Response.json({
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
  } catch (error) {
    console.error('Login error:', error);
    return handleUnexpectedError(error, 'login');
  }
} 