import { createSupabaseServerClient } from './supabase/utils';
import { BlogPost } from './types';

export async function getLatestBlogPosts(limit: number = 3): Promise<BlogPost[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .not('published_at', 'is', null) // Only published posts
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching latest blog posts:', error);
    return [];
  }

  return data as BlogPost[];
}

export async function getAllBlogPostsForDisplay(): Promise<BlogPost[]> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .not('published_at', 'is', null) // Only published posts
        .order('published_at', { ascending: false });

    if (error) {
        console.error('Error fetching all blog posts for display:', error);
        return [];
    }

    return data as BlogPost[];
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error(`Error fetching blog post with slug ${slug}:`, error);
    return null;
  }

  return data as BlogPost | null;
}
