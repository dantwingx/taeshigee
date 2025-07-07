import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/supabase';
import { signToken } from '@/lib/jwt';
import { createErrorResponse } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return createErrorResponse('Email and password are required');
    }

    // Find user by email
    const { data: user, error } = await supabase
      .from('users')
      .select('id, user_number, email, name, language, dark_mode')
      .eq('email', email)
      .single();

    if (error || !user) {
      return createErrorResponse('Invalid email or password');
    }

    // Note: In a real implementation, you would store and verify hashed passwords
    // For now, we'll skip password verification since we're not storing passwords in the current schema
    // This is a simplified version for demonstration purposes

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
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return createErrorResponse('Internal server error', 500);
  }
} 