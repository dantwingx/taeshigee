import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/supabase';
import { signToken } from '@/lib/jwt';
import { generateRandomName, createErrorResponse } from '@/lib/auth';

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

    // Create user
    const { data: user, error } = await supabase
      .from('users')
      .insert({
        email,
        password_hash: hashedPassword, // 비밀번호 해시 저장
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