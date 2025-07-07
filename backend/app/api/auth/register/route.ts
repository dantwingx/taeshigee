import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/supabase';
import { signToken } from '@/lib/jwt';
import { generateRandomName, createErrorResponse } from '@/lib/auth';

// 이메일에서 기본 ID 생성 함수
function generateUserIdFromEmail(email: string): string {
  const atIndex = email.indexOf('@');
  if (atIndex === -1) {
    return email; // @가 없으면 전체 이메일 사용
  }
  return email.substring(0, atIndex);
}

// 중복되지 않는 ID 생성 함수
async function generateUniqueUserId(baseUserId: string): Promise<string> {
  let userId = baseUserId;
  let counter = 0;
  const maxAttempts = 100; // 무한 루프 방지

  while (counter < maxAttempts) {
    // 현재 ID가 사용 중인지 확인
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .single();

    if (!existingUser) {
      // 사용 가능한 ID
      return userId;
    }

    // 중복되면 난수 생성하여 붙이기
    const randomSuffix = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    userId = `${baseUserId}_${randomSuffix}`;
    counter++;
  }

  // 최대 시도 횟수 초과 시 타임스탬프 사용
  const timestamp = Date.now().toString();
  return `${baseUserId}_${timestamp}`;
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return createErrorResponse('Email and password are required');
    }

    if (password.length < 6) {
      return createErrorResponse('Password must be at least 6 characters long');
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return createErrorResponse('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate random name
    const name = generateRandomName();

    // 이메일에서 기본 ID 생성
    const baseUserId = generateUserIdFromEmail(email);
    
    // 중복되지 않는 고유 ID 생성
    const uniqueUserId = await generateUniqueUserId(baseUserId);

    // Create user with custom ID
    const { data: user, error } = await supabase
      .from('users')
      .insert({
        id: uniqueUserId, // 커스텀 ID 사용
        email,
        password_hash: hashedPassword,
        name,
        language: 'en',
        dark_mode: false,
      })
      .select('id, user_number, email, name, language, dark_mode, created_at, updated_at')
      .single();

    if (error) {
      console.error('Database error:', error);
      return createErrorResponse('Failed to create user', 500);
    }

    // Generate JWT token
    const token = signToken({
      userId: user.id,
      userNumber: user.user_number,
      email: user.email,
      name: user.name,
    });

    return NextResponse.json({
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
    console.error('Registration error:', error);
    return createErrorResponse('Internal server error', 500);
  }
} 