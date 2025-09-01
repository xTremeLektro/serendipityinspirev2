'use client';

import { FC, useEffect, useState, useMemo, useCallback } from 'react';
import { useEditor, EditorContent, JSONContent } from '@tiptap/react';
import { FaBold, FaItalic, FaListUl, FaListOl, FaLink, FaUnderline } from 'react-icons/fa';
import { getTiptapExtensions } from '@/lib/tiptap';

// Define the types for the props
type FaqType = {
  id: string;
  faq_type: string;
};

type Service = {
  id: string;
  service_name: string;
  service_desc: JSONContent;
  fac_type_id: string | null;
  ord: number | null;
};

interface ServiceFormProps {
  faqTypes: FaqType[];
  action: (formData: FormData) => Promise<void>;
  initialData?: Service;
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

const ServiceForm: FC<ServiceFormProps> = ({ faqTypes, action, initialData }) => {
  const [isClient, setIsClient] = useState(false);

  const initialContent = useMemo(() => parseContent(initialData?.service_desc ?? null), [initialData?.service_desc]);
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
    formData.set('service_desc', description);
    if (initialData) {
      formData.set('id', initialData.id);
    }
    await action(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="service_name" className="block text-sm font-medium text-gray-700">Nombre del Servicio</label>
        <input 
          type="text" 
          name="service_name" 
          id="service_name" 
          defaultValue={initialData?.service_name}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900" 
          required 
        />
      </div>
      <div className="mb-4">
        <label htmlFor="service_desc" className="block text-sm font-medium text-gray-700">Descripción del Servicio</label>
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
      <div className="mb-4">
        <label htmlFor="ord" className="block text-sm font-medium text-gray-700">Order</label>
        <input
          type="number"
          id="ord"
          name="ord"
          defaultValue={initialData?.ord || 0}
          className="mt-1 block w-full pl-3 pr-10 py-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="fac_type_id" className="block text-sm font-medium text-gray-700">Tipo de FAQ</label>
        <select 
          name="fac_type_id" 
          id="fac_type_id" 
          defaultValue={initialData?.fac_type_id || ''}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border text-gray-900"
        >
          <option value="">Seleccionar un tipo</option>
          {faqTypes.map((type) => (
            <option key={type.id} value={type.id} className="text-gray-900">{type.faq_type}</option>
          ))}
        </select>
      </div>
      <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        {initialData ? 'Update Service' : 'Add Service'}
      </button>
    </form>
  );
};

export default ServiceForm;


