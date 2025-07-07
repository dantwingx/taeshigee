import { NextRequest } from 'next/server';
import { authenticateRequest, createErrorResponse } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { logError } from '@/lib/errorHandler';

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

// GET /api/user/settings - Get user settings
export async function GET(request: NextRequest) {
  try {
    console.log('[Settings API] GET /api/user/settings - Request received');
    
    const user = await authenticateRequest(request);
    console.log('[Settings API] User authenticated:', user.userId);

    // Get user settings from database
    const { data: userData, error } = await supabase
      .from('users')
      .select('language, dark_mode, name')
      .eq('id', user.userId)
      .single();

    if (error) {
      console.error('[Settings API] Database error:', error);
      return setCorsHeaders(createErrorResponse('Failed to fetch user settings', 500));
    }

    console.log('[Settings API] User settings retrieved:', userData);

    return setCorsHeaders(Response.json({
      success: true,
      settings: {
        language: userData.language || 'ko',
        darkMode: userData.dark_mode || false,
        name: userData.name || '',
      },
    }));
      } catch (error) {
      console.error('[Settings API] GET error:', error);
      return setCorsHeaders(createErrorResponse('Authentication failed', 401));
    }
}

// PUT /api/user/settings - Update user settings
export async function PUT(request: NextRequest) {
  try {
    console.log('[Settings API] PUT /api/user/settings - Request received');
    
    const user = await authenticateRequest(request);
    console.log('[Settings API] User authenticated:', user.userId);

    const body = await request.json();
    console.log('[Settings API] Request body:', body);

    const { language, darkMode, name } = body;

    // Validate input
    const updateData: {
      language?: string;
      dark_mode?: boolean;
      name?: string;
      updated_at?: string;
    } = {};
    
    if (language !== undefined) {
      if (typeof language !== 'string' || !['ko', 'en', 'ja', 'zh', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ar', 'hi', 'th', 'vi', 'id', 'ms', 'tr', 'pl', 'nl', 'sv'].includes(language)) {
        console.error('[Settings API] Invalid language:', language);
        return setCorsHeaders(createErrorResponse('Invalid language setting', 400));
      }
      updateData.language = language;
    }

    if (darkMode !== undefined) {
      if (typeof darkMode !== 'boolean') {
        console.error('[Settings API] Invalid darkMode:', darkMode);
        return setCorsHeaders(createErrorResponse('Invalid dark mode setting', 400));
      }
      updateData.dark_mode = darkMode;
    }

    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim().length === 0) {
        console.error('[Settings API] Invalid name:', name);
        return setCorsHeaders(createErrorResponse('Name cannot be empty', 400));
      }
      if (name.trim().length > 50) {
        console.error('[Settings API] Name too long:', name.length);
        return setCorsHeaders(createErrorResponse('Name is too long (max 50 characters)', 400));
      }
      updateData.name = name.trim();
    }

    // Add updated_at timestamp
    updateData.updated_at = new Date().toISOString();

    console.log('[Settings API] Updating user with data:', updateData);
    console.log('[Settings API] User ID being updated:', user.userId);

    // Update user settings in database
    const { data: updatedUser, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', user.userId)
      .select('id, language, dark_mode, name, updated_at')
      .single();

    if (error) {
      console.error('[Settings API] Database update error:', error);
      return setCorsHeaders(createErrorResponse('Failed to update user settings', 500));
    }

    console.log('[Settings API] User settings updated successfully:', updatedUser);

    return setCorsHeaders(Response.json({
      success: true,
      settings: {
        language: updatedUser.language || 'ko',
        darkMode: updatedUser.dark_mode || false,
        name: updatedUser.name || '',
      },
      message: 'Settings updated successfully',
    }));
  } catch (error) {
    console.error('[Settings API] PUT error:', error);
    logError(error instanceof Error ? error : new Error('Unknown error'), { 
      context: 'Settings API PUT', 
      userId: 'unknown' 
    });
    return setCorsHeaders(createErrorResponse('Authentication failed', 401));
  }
} 