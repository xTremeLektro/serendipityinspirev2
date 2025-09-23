'use server'

import { createClient } from '@/lib/supabase/server'


import { revalidatePath } from 'next/cache';


import { generateHTML } from '@tiptap/html';
import { getTiptapExtensions } from '../../../lib/tiptap';
import { BlogPost } from '@/lib/types';

export async function getBlogPosts(searchTerm: string, statusFilter: string, page: number, pageSize: number) {
  const supabase = await createClient()
  let query = supabase.from('blog_posts').select('*', { count: 'exact' })

  if (searchTerm) {
    query = query.ilike('title', `%${searchTerm}%`)
  }

  if (statusFilter === 'published') {
    query = query.not('published_at', 'is', null)
  } else if (statusFilter === 'draft') {
    query = query.is('published_at', null)
  }

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1)

  if (error) {
    console.error('Error fetching blog posts:', error)
    return { posts: [], count: 0 }
  }
  return { posts: data, count: count ?? 0 }
}

export async function getBlogPost(slug: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('blog_posts').select('*').eq('slug', slug).single()
  if (error) {
    console.error('Error fetching blog post:', error)
    return null
  }
  return data
}

export async function updateBlogPost(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string
  const title = formData.get('title') as string
  const slug = formData.get('slug') as string
  const content = formData.get('content') as string
  const parsedContent = JSON.parse(content);
  const content_html = generateHTML(parsedContent, getTiptapExtensions());
  const excerpt = formData.get('excerpt') as string
  const image_url = formData.get('image_url') as string
  const published_at = formData.get('published_at') as string

  const postData: Partial<BlogPost> = {
    title,
    slug,
    content: parsedContent,
    content_html,
    excerpt,
    image_url,
  };

  if (published_at) {
    postData.published_at = published_at;
  } else {
    postData.published_at = null as unknown as string; // Explicitly cast null to string to satisfy type, as Supabase handles null for date fields
  }

  const { error } = await supabase.from('blog_posts').update(postData).eq('id', id)

  if (error) {
    console.error('Error updating blog post:', error)
    throw new Error(error.message)
  }

  revalidatePath(`/admin/blog`)
  revalidatePath(`/admin/blog/${slug}`)
}

export async function deleteBlogPost(id: number) {
    const supabase = await createClient()
    const { error } = await supabase.from('blog_posts').delete().match({ id })
    if (error) {
        console.error('Error deleting blog post:', error)
        throw new Error(error.message)
    }
    revalidatePath('/admin/blog')
}

export async function deleteMultipleBlogPosts(ids: string[]) {
  const supabase = await createClient()
  const { error } = await supabase.from('blog_posts').delete().in('id', ids)
  if (error) {
    console.error('Error deleting multiple blog posts:', error)
    throw new Error(error.message)
  }
  revalidatePath('/admin/blog')
}
