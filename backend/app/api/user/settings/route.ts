import { NextRequest } from 'next/server';
import { authenticateRequest, createErrorResponse } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const user = await authenticateRequest(request);
    
    const { data: userData, error } = await supabase
      .from('users')
      .select('language, dark_mode')
      .eq('id', user.userId)
      .single();

    if (error) {
      return createErrorResponse('Failed to fetch user settings', 500);
    }

    return Response.json({
      success: true,
      settings: {
        language: userData.language,
        darkMode: userData.dark_mode,
      },
    });
  } catch (error) {
    return createErrorResponse('Authentication failed', 401);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await authenticateRequest(request);
    const { language, darkMode } = await request.json();

    // Validate input
    if (language && typeof language !== 'string') {
      return createErrorResponse('Language must be a string');
    }

    if (darkMode !== undefined && typeof darkMode !== 'boolean') {
      return createErrorResponse('Dark mode must be a boolean');
    }

    // Update user settings
    const updateData: any = {};
    if (language !== undefined) updateData.language = language;
    if (darkMode !== undefined) updateData.dark_mode = darkMode;

    const { data: userData, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', user.userId)
      .select('language, dark_mode')
      .single();

    if (error) {
      return createErrorResponse('Failed to update user settings', 500);
    }

    return Response.json({
      success: true,
      settings: {
        language: userData.language,
        darkMode: userData.dark_mode,
      },
    });
  } catch (error) {
    return createErrorResponse('Authentication failed', 401);
  }
} 