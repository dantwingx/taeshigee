import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
}

if (!supabaseServiceKey) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
}

// Create Supabase client with service role key for server-side operations
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          user_number: number;
          email: string;
          name: string;
          language: string;
          dark_mode: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_number?: number;
          email: string;
          name: string;
          language?: string;
          dark_mode?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_number?: number;
          email?: string;
          name?: string;
          language?: string;
          dark_mode?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      tasks: {
        Row: {
          id: string;
          user_id: string;
          user_number: number;
          title: string;
          description: string | null;
          due_date: string | null;
          due_time: string | null;
          importance: 'low' | 'medium' | 'high';
          priority: 'low' | 'medium' | 'high';
          category: string | null;
          is_completed: boolean;
          is_public: boolean;
          likes_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          user_number: number;
          title: string;
          description?: string | null;
          due_date?: string | null;
          due_time?: string | null;
          importance?: 'low' | 'medium' | 'high';
          priority?: 'low' | 'medium' | 'high';
          category?: string | null;
          is_completed?: boolean;
          is_public?: boolean;
          likes_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          user_number?: number;
          title?: string;
          description?: string | null;
          due_date?: string | null;
          due_time?: string | null;
          importance?: 'low' | 'medium' | 'high';
          priority?: 'low' | 'medium' | 'high';
          category?: string | null;
          is_completed?: boolean;
          is_public?: boolean;
          likes_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      task_tags: {
        Row: {
          id: string;
          task_id: string;
          tag_name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          task_id: string;
          tag_name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          task_id?: string;
          tag_name?: string;
          created_at?: string;
        };
      };
      task_likes: {
        Row: {
          id: string;
          task_id: string;
          user_id: string;
          user_number: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          task_id: string;
          user_id: string;
          user_number: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          task_id?: string;
          user_id?: string;
          user_number?: number;
          created_at?: string;
        };
      };
    };
  };
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Inserts<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type Updates<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']; 