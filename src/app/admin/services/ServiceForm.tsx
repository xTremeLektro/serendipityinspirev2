'use client';

import { FC, useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TurndownService from 'turndown';
import { marked } from 'marked';
import { FaBold, FaItalic, FaListUl, FaListOl } from 'react-icons/fa';

// Define the types for the props
type FaqType = {
  id: string;
  faq_type: string;
};

type Service = {
  id: string;
  service_name: string;
  service_desc: string;
  fac_type_id: string | null;
  ord: number | null;
};

interface ServiceFormProps {
  faqTypes: FaqType[];
  action: (formData: FormData) => Promise<void>;
  initialData?: Service;
}

const ServiceForm: FC<ServiceFormProps> = ({ faqTypes, action, initialData }) => {
  const [description, setDescription] = useState(initialData?.service_desc || '');
  const [isClient, setIsClient] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const turndownService = new TurndownService();
      setDescription(turndownService.turndown(html));
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    setIsClient(true);
    if (editor && initialData?.service_desc) {
      const normalizedContent = initialData.service_desc.replace(/(\n|\n)+/g, '\n\n');
      const htmlAnswer = marked.parse(normalizedContent) as string;
      editor.commands.setContent(htmlAnswer);
    }
  }, [initialData, editor]);

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
        {isClient && editor ? (
          <>
            <div className="mb-2 p-2 border border-gray-300 rounded-md bg-gray-50 flex flex-wrap gap-2">
              <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} disabled={!editor.can().chain().focus().toggleBold().run()} className={`p-2 rounded-md ${editor.isActive('bold') ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}><FaBold /></button>
              <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} disabled={!editor.can().chain().focus().toggleItalic().run()} className={`p-2 rounded-md ${editor.isActive('italic') ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}><FaItalic /></button>
              <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} disabled={!editor.can().chain().focus().toggleBulletList().run()} className={`p-2 rounded-md ${editor.isActive('bulletList') ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}><FaListUl /></button>
              <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} disabled={!editor.can().chain().focus().toggleOrderedList().run()} className={`p-2 rounded-md ${editor.isActive('orderedList') ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}><FaListOl /></button>
            </div>
            <EditorContent editor={editor} className="min-h-[200px] p-2 bg-white border border-gray-300 rounded-md overflow-y-auto" />
          </>
        ) : (
          <textarea 
            name="service_desc" 
            id="service_desc" 
            rows={4} 
            defaultValue={initialData?.service_desc}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900" 
            required
          ></textarea>
        )}
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
