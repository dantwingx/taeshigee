import { supabase } from '@/lib/supabase';

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

// GET /api/tags - Get all unique tags with usage counts
export async function GET() {
  try {
    // Get all unique tags with their usage counts
    const { data: tags, error } = await supabase
      .from('task_tags')
      .select('tag_name')
      .order('tag_name');

    if (error) {
      return setCorsHeaders(Response.json(
        { success: false, error: 'Failed to fetch tags' },
        { status: 500 }
      ));
    }

    // Count occurrences of each tag
    const tagCounts: { [key: string]: number } = {};
    tags.forEach(tag => {
      tagCounts[tag.tag_name] = (tagCounts[tag.tag_name] || 0) + 1;
    });

    // Convert to array format
    const uniqueTags = Object.entries(tagCounts).map(([name, count]) => ({
      name,
      count,
    }));

    // Sort by count (descending) then by name (ascending)
    uniqueTags.sort((a, b) => {
      if (b.count !== a.count) {
        return b.count - a.count;
      }
      return a.name.localeCompare(b.name);
    });

    return setCorsHeaders(Response.json({
      success: true,
      tags: uniqueTags,
    }));
  } catch {
    return setCorsHeaders(Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    ));
  }
} 