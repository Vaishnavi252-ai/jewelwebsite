import { supabase } from '../lib/supabase';
import { BlogPost } from '../types';

export async function getBlogPosts(filters?: { category?: string; search?: string }): Promise<BlogPost[]> {
  let query = supabase.from('blog_posts').select('*').eq('is_published', true).order('created_at', { ascending: false });
  if (filters?.category && filters.category !== 'all') query = query.eq('category', filters.category);
  const { data, error } = await query;
  if (error) throw error;
  let posts = (data as BlogPost[]) || [];
  if (filters?.search) {
    const s = filters.search.toLowerCase();
    posts = posts.filter(p =>
      p.title.toLowerCase().includes(s) ||
      p.excerpt?.toLowerCase().includes(s) ||
      p.author.toLowerCase().includes(s)
    );
  }
  return posts;
}
