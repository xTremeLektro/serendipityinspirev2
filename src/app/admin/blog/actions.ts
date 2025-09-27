'use server'

import { JSONContent } from '@tiptap/react';
import { createClient } from '@/lib/supabase/server'


import { revalidatePath } from 'next/cache';


import { generateHTML } from '@tiptap/html';
import { getTiptapServerExtensions } from '../../../lib/tiptap';
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
  const content = formData.get('content') as string // Raw stringified JSON from form

  let parsedContent: JSONContent | null = null; 
  let content_html = '';
  
  const contentToParse = content?.trim();

  // --- STEP 1: Parse the JSON string (MUST be isolated) ---
  if (contentToParse) {
    try {
      // If parsing succeeds, parsedContent retains the object value.
      parsedContent = JSON.parse(contentToParse);
    } catch (e) {
      // If parsing fails (e.g., malformed JSON), parsedContent remains null.
      console.error('Error parsing content JSON (The input string was not valid JSON):', e);
    }
  }

  // --- STEP 2: Generate HTML (Prone to server-side errors like 'window is not defined') ---
  if (parsedContent) {
    try {
      // console.log('Parsed Content before generateHTML:', parsedContent);
      // NOTE: The "window is not defined" error happens here.
      content_html = generateHTML(parsedContent, getTiptapServerExtensions());
    } catch (error) {
      // If HTML generation fails, we log the error, clear the HTML, 
      // but we RETAIN the successfully parsed JSON data (parsedContent).
      console.error('Error generating HTML from content (Likely a server-side dependency issue):', error);
      // HINT: Review getTiptapServerExtensions() for client-only dependencies.
      content_html = ''; 
    }
  }
  // If parsedContent is null, both loops are skipped, and NULL is correctly saved.


  const excerpt = formData.get('excerpt') as string
  const image_url = formData.get('image_url') as string
  const published_at = formData.get('published_at') as string

  const postData: Partial<BlogPost> = {
    title,
    slug,
    content: parsedContent, // <--- FIX: We save the JavaScript Object here!
    content_html: content_html,
    excerpt,
    image_url,
  };
  
  // Handling published_at as before...
  if (published_at) {
    postData.published_at = published_at;
  } else {
    // Note: If you want to explicitly null the date, you might need to exclude it 
    // from the object or ensure your Supabase client handles the type conversion correctly.
    // Assuming 'null' is passed correctly to clear the timestamp.
    postData.published_at = null as unknown as string; 
  }

  // ... (rest of the function)
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
