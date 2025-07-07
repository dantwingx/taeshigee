import { NextRequest, NextResponse } from 'next/server';
import { verifyTokenFromHeader, JWTPayload } from './jwt';
import { supabase } from './supabase';

/**
 * Authentication middleware for API routes
 */
export async function authenticateRequest(request: NextRequest): Promise<JWTPayload> {
  const authHeader = request.headers.get('authorization');
  
  try {
    const payload = verifyTokenFromHeader(authHeader);
    
    // Verify user still exists in database
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, name')
      .eq('id', payload.userId)
      .single();
    
    if (error || !user) {
      throw new Error('User not found');
    }
    
    return payload;
  } catch (error) {
    throw new Error('Authentication failed');
  }
}

/**
 * Create authenticated response with user data
 */
export function createAuthResponse(user: JWTPayload & { created_at?: string, updated_at?: string }, data?: any) {
  return NextResponse.json({
    success: true,
    user: {
      id: user.userId,
      userNumber: user.userNumber, // 추가
      email: user.email,
      name: user.name,
      createdAt: user.created_at,
      lastUpdated: user.updated_at,
    },
    ...data,
  });
}

/**
 * Create error response
 */
export function createErrorResponse(message: string, status: number = 400) {
  return NextResponse.json(
    { success: false, error: message },
    { status }
  );
}

/**
 * Generate random user name
 */
export function generateRandomName(): string {
  const adjectives = ['Happy', 'Clever', 'Brave', 'Wise', 'Swift', 'Bright', 'Calm', 'Eager'];
  const nouns = ['Panda', 'Tiger', 'Eagle', 'Dolphin', 'Phoenix', 'Wolf', 'Lion', 'Bear'];
  
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const number = Math.floor(Math.random() * 1000);
  
  return `${adjective}${noun}${number}`;
} 