import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/supabase';
import { signToken } from '@/lib/jwt';
import { createApiErrorResponse, createValidationError, handleUnexpectedError } from '@/lib/errorHandler';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return createValidationError('credentials', '이메일과 비밀번호를 입력해주세요.');
    }

    // Find user by email (including password_hash)
    const { data: user, error } = await supabase
      .from('users')
      .select('id, user_number, email, password_hash, name, language, dark_mode, created_at, updated_at')
      .eq('email', email)
      .single();

    if (error || !user) {
      return createApiErrorResponse('INVALID_CREDENTIALS');
    }

    // Verify password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return createApiErrorResponse('INVALID_CREDENTIALS');
    }

    // Generate JWT token
    const token = signToken({
      userId: user.id,
      userNumber: user.user_number,
      email: user.email,
      name: user.name,
    });

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