import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/tags - Get all unique tags with usage counts
export async function GET(request: NextRequest) {
  try {
    // Get all unique tags with their usage counts
    const { data: tags, error } = await supabase
      .from('task_tags')
      .select('tag_name')
      .order('tag_name');

    if (error) {
      return Response.json(
        { success: false, error: 'Failed to fetch tags' },
        { status: 500 }
      );
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

    return Response.json({
      success: true,
      tags: uniqueTags,
    });
  } catch (error) {
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 