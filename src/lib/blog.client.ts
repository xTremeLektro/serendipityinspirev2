import { createBuildTimeClient } from './supabase/client';
import { BlogPost } from './types';

// This function uses the build-time client because it's called by generateStaticParams
export async function getAllBlogPosts(): Promise<Pick<BlogPost, 'slug'>[]> {
  const supabase = createBuildTimeClient();
  const { data, error } = await supabase
    .from('blog_posts')
    .select('slug') // Only fetch the slug as that's all generateStaticParams needs
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching all blog posts for generateStaticParams:', error);
    return [];
  }

  return data as Pick<BlogPost, 'slug'>[];
}

export async function getPostBySlugForClient(slug: string): Promise<BlogPost | null> {
  const supabase = createBuildTimeClient();
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
