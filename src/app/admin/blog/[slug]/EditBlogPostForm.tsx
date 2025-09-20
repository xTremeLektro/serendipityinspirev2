'use client';

import { FC, useEffect, useState, useMemo, useCallback } from 'react';
import { useEditor, EditorContent, JSONContent } from '@tiptap/react';
import { FaBold, FaItalic, FaListUl, FaListOl, FaLink, FaUnderline } from 'react-icons/fa';
import { getTiptapExtensions } from '@/lib/tiptap';
import { updateBlogPost } from '../actions';
import AdminHeader from '@/components/AdminHeader';
import Image from 'next/image';
import { BlogPost } from '@/lib/types';

interface EditBlogPostFormProps {
  post: BlogPost;
}

function parseContent(content: JSONContent | string | null): JSONContent {
  if (!content) {
    return { type: 'doc', content: [{ type: 'paragraph' }] };
  }
  if (typeof content === 'string') {
    try {
      const parsed = JSON.parse(content);
      if (parsed.type === 'doc') {
        return parsed;
      }
    } catch {
      // Not JSON, treat as plain text
    }
    return {
      type: 'doc',
      content: [{ type: 'paragraph', content: [{ type: 'text', text: content }] }],
    };
  }
  if (typeof content === 'object' && content.type === 'doc') {
    return content;
  }
  return { type: 'doc', content: [{ type: 'paragraph' }] }; // fallback for unknown
}

const EditBlogPostForm: FC<EditBlogPostFormProps> = ({ post }) => {
  const [isClient, setIsClient] = useState(false);

  const initialContent = useMemo(() => parseContent(post.content), [post.content]);
  const [title, setTitle] = useState(post.title);
  const [slug, setSlug] = useState(post.slug);
  const [excerpt, setExcerpt] = useState(post.excerpt);
  const [imageUrl, setImageUrl] = useState(post.image_url);
  const [publishedAt, setPublishedAt] = useState(post.published_at);
  const [imagePreview, setImagePreview] = useState<string | null>(post.image_url);
  const [description, setDescription] = useState(JSON.stringify(initialContent));


  const editor = useEditor({
    extensions: getTiptapExtensions(),
    content: initialContent,
    onUpdate: ({ editor }) => {
      setDescription(JSON.stringify(editor.getJSON()));
    },
    immediatelyRender: false,
  });

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) {
        return;
    }

    if (url === '') {
        editor.chain().focus().extendMarkRange('link').unsetLink().run();
        return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (editor && initialContent) {
      editor.commands.setContent(initialContent);
    }
  }, [initialContent, editor]);

  useEffect(() => {
    const generatedSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    setSlug(generatedSlug);
  }, [title]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      // Here you would typically upload the file to a storage service
      // and setImageUrl with the returned URL.
      // For this example, we'll just use the local preview.
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.set('content', description);
    formData.set('id', post.id);
    formData.set('title', title);
    formData.set('slug', slug);
    formData.set('excerpt', excerpt);
    formData.set('image_url', imageUrl);
    if (publishedAt) {
      formData.set('published_at', publishedAt);
    }
    await updateBlogPost(formData);
  };

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
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
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
              {isClient && editor && (
              <>
                  <div className="mb-2 p-2 border border-gray-300 rounded-md bg-gray-50 flex flex-wrap gap-2">
                  <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} disabled={!editor.can().chain().focus().toggleBold().run()} className={`p-2 rounded-md ${editor.isActive('bold') ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}><FaBold /></button>
                  <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} disabled={!editor.can().chain().focus().toggleItalic().run()} className={`p-2 rounded-md ${editor.isActive('italic') ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}><FaItalic /></button>
                  <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} disabled={!editor.can().chain().focus().toggleUnderline().run()} className={`p-2 rounded-md ${editor.isActive('underline') ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}><FaUnderline /></button>
                  <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} disabled={!editor.can().chain().focus().toggleBulletList().run()} className={`p-2 rounded-md ${editor.isActive('bulletList') ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}><FaListUl /></button>
                  <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} disabled={!editor.can().chain().focus().toggleOrderedList().run()} className={`p-2 rounded-md ${editor.isActive('orderedList') ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}><FaListOl /></button>
                  <button type="button" onClick={setLink} className={`p-2 rounded-md ${editor.isActive('link') ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}><FaLink /></button>
                  </div>
                  <EditorContent editor={editor} className="min-h-[200px] p-2 bg-white border border-gray-300 rounded-md overflow-y-auto" />
              </>
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
};

export default EditBlogPostForm;
