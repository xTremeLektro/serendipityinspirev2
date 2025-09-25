'use client';

import { useEffect, useState } from 'react';
import { updateBlogPost } from '../actions';
import AdminHeader from '@/components/AdminHeader';
import Image from 'next/image';
import { BlogPost } from '@/lib/types';
import { getPostBySlugForClient } from '@/lib/blog.client';
import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor'; // New import

interface EditBlogPostFormProps {
  slug: string;
}

export default function EditBlogPostForm({ slug }: EditBlogPostFormProps) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isClient, setIsClient] = useState(false);

  const [title, setTitle] = useState('');
  const [currentSlug, setCurrentSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [publishedAt, setPublishedAt] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [description, setDescription] = useState<string>(JSON.stringify({ type: 'doc', content: [] })); // This will be updated by SimpleEditor

  useEffect(() => {
    const fetchPost = async () => {
      const blogPost = await getPostBySlugForClient(slug);
      if (blogPost) {
        setPost(blogPost);
        setTitle(blogPost.title);
        setCurrentSlug(blogPost.slug);
        setExcerpt(blogPost.excerpt || '');
        setImageUrl(blogPost.image_url || '');
        setPublishedAt(blogPost.published_at ? blogPost.published_at : null);
        setImagePreview(blogPost.image_url);
        // Assuming post.content is already JSONContent or can be parsed by SimpleEditor
        setDescription(JSON.stringify(blogPost.content)); // Update description with fetched content
      }
    };
    fetchPost();
  }, [slug]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (post && title) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setCurrentSlug(generatedSlug);
    }
  }, [title, post]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!post) return;
    const formData = new FormData(event.currentTarget);
    formData.set('content', description); // description now holds the updated content from SimpleEditor
    formData.set('id', post.id);
    formData.set('title', title);
    formData.set('slug', currentSlug);
    formData.set('excerpt', excerpt);
    formData.set('image_url', imageUrl);
    if (publishedAt) {
      formData.set('published_at', publishedAt);
    }
    await updateBlogPost(formData);
  };

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader title="Edit Blog Post" backUrl="/admin/blog" backText="Return to Blog Posts" />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full">
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700">Slug</label>
              <input
                type="text"
                id="slug"
                value={currentSlug}
                onChange={(e) => setCurrentSlug(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">Excerpt</label>
              <textarea
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image</label>
              <input
                type="file"
                id="image"
                onChange={handleImageChange}
                className="mt-1 block w-full"
              />
              {imagePreview && <Image src={imagePreview} alt="Image preview" width={128} height={128} className="mt-2 h-32 object-cover" />}
            </div>
            <div className="mb-4">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
              {isClient && (
                <SimpleEditor
                  content={post.content} // Pass initial content
                  onUpdate={(editorState) => {
                    setDescription(JSON.stringify(editorState.editor.getJSON()));
                  }}
                />
              )}
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Save
              </button>
              <div className="flex items-center">
                {publishedAt ? (
                  <button
                    type="button"
                    onClick={() => setPublishedAt(null)}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Unpublish
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setPublishedAt(new Date().toISOString())}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Publish
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}