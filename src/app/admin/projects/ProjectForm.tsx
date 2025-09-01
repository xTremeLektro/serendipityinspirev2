'use client';

import { FC, useEffect, useState, useMemo, useCallback } from 'react';
import { useEditor, EditorContent, JSONContent } from '@tiptap/react';
import { FaBold, FaItalic, FaListUl, FaListOl, FaLink, FaUnderline } from 'react-icons/fa';
import { getTiptapExtensions } from '@/lib/tiptap';

// Define the types for the props
type Project = {
  id: string;
  project_name: string;
  short_description: string | null;
  detailed_description: JSONContent;
  location: string | null;
  end_date: string | null;
  property_type: string | null;
  style: string | null;
  scope: string | null;
  is_home: boolean | null;
};

interface ProjectFormProps {
  action: (formData: FormData) => Promise<void>;
  initialData?: Project;
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

const ProjectForm: FC<ProjectFormProps> = ({ action, initialData }) => {
  const [isClient, setIsClient] = useState(false);

  const initialContent = useMemo(() => parseContent(initialData?.detailed_description ?? null), [initialData?.detailed_description]);
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.set('detailed_description', description);
    if (initialData) {
      formData.set('id', initialData.id);
    }
    await action(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
                <label htmlFor="project_name" className="block text-sm font-medium text-gray-700">Project Name</label>
                <input type="text" name="project_name" id="project_name" defaultValue={initialData?.project_name} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900" required />
            </div>
            <div className="mb-4">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">Ubicación</label>
                <input type="text" name="location" id="location" defaultValue={initialData?.location} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900" />
            </div>
            <div className="mb-4">
                <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">Fecha de Finalización</label>
                <input type="date" name="end_date" id="end_date" defaultValue={initialData?.end_date} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900" />
            </div>
            <div className="mb-4">
                <label htmlFor="property_type" className="block text-sm font-medium text-gray-700">Tipo de Propiedad</label>
                <input type="text" name="property_type" id="property_type" defaultValue={initialData?.property_type} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900" />
            </div>
            <div className="mb-4">
                <label htmlFor="style" className="block text-sm font-medium text-gray-700">Estilo</label>
                <input type="text" name="style" id="style" defaultValue={initialData?.style} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900" />
            </div>
            <div className="mb-4">
                <label htmlFor="scope" className="block text-sm font-medium text-gray-700">Alcance</label>
                <input type="text" name="scope" id="scope" defaultValue={initialData?.scope} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900" />
            </div>
        </div>
        <div className="mb-4">
            <label htmlFor="short_description" className="block text-sm font-medium text-gray-700">Descripción Corta</label>
            <textarea name="short_description" id="short_description" rows={2} defaultValue={initialData?.short_description} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"></textarea>
        </div>
        <div className="mb-4">
            <label htmlFor="detailed_description" className="block text-sm font-medium text-gray-700">Descripción Detallada</label>
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
        <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            {initialData ? 'Update Project' : 'Add Project'}
        </button>
    </form>
  );
};

export default ProjectForm;
