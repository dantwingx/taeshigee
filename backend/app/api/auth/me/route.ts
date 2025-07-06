import { NextRequest } from 'next/server';
import { authenticateRequest, createAuthResponse, createErrorResponse } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await authenticateRequest(request);
    
    return createAuthResponse(user);
  } catch (error) {
    return createErrorResponse('Authentication failed', 401);
  }
} 