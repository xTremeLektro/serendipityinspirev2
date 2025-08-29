'use client';

import { useState, FC, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TurndownService from 'turndown';
import { marked } from 'marked';
import { FaBold, FaItalic, FaListUl, FaListOl, FaTimes } from 'react-icons/fa';
import { updateFaq } from './actions';

type FaqType = {
  id: string;
  faq_type: string;
};

type Faq = {
  id: string;
  question: string;
  answer: string;
  type: string;
  ord: number | null;
  faq_type_list: {
    faq_type: string;
  };
};

interface EditFaqModalProps {
  faq: Faq;
  faqTypes: FaqType[];
  onClose: () => void;
}

const EditFaqModal: FC<EditFaqModalProps> = ({ faq, faqTypes, onClose }) => {
  const [question, setQuestion] = useState(faq.question);
  const [answer, setAnswer] = useState(faq.answer);
  const [type, setType] = useState(faq.type);
  const [isClient, setIsClient] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const turndownService = new TurndownService();
      setAnswer(turndownService.turndown(html));
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    setIsClient(true);
    if (editor) {
      // Handle both literal \n strings and actual newline characters.
      const normalizedContent = faq.answer.replace(/(\r\n|\r|\n)/g, '\n');
      const contentWithBreaks = normalizedContent.replace(/\n\n/g, '<br/><br/>'); // Ensure two new lines are treated as a paragraph break.
      const htmlAnswer = marked.parse(contentWithBreaks);      
      // const normalizedContent = faq.answer.replace(/(\\n|\n)+/g, '\n\n');
      // const htmlAnswer = marked.parse(normalizedContent) as string;
      editor.commands.setContent(htmlAnswer);
    }
  }, [faq.answer, editor]);

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    formData.set('answer', answer);
    formData.set('id', faq.id);

    await updateFaq(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Editar Pregunta Frecuente</h2>
            <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
                <FaTimes size={24} />
            </button>
        </div>
        <form onSubmit={handleFormSubmit}>
          <input type="hidden" name="id" value={faq.id} />
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Pregunta</label>
            <input
              type="text"
              name="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Respuesta</label>
            {isClient && editor && (
              <>
                <div className="mb-2 p-2 border border-gray-300 rounded-md bg-gray-50 flex flex-wrap gap-2">
                  <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} disabled={!editor.can().chain().focus().toggleBold().run()} className={`p-2 rounded-md ${editor.isActive('bold') ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}><FaBold /></button>
                  <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} disabled={!editor.can().chain().focus().toggleItalic().run()} className={`p-2 rounded-md ${editor.isActive('italic') ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}><FaItalic /></button>
                  <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} disabled={!editor.can().chain().focus().toggleBulletList().run()} className={`p-2 rounded-md ${editor.isActive('bulletList') ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}><FaListUl /></button>
                  <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} disabled={!editor.can().chain().focus().toggleOrderedList().run()} className={`p-2 rounded-md ${editor.isActive('orderedList') ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}><FaListOl /></button>
                </div>
                <EditorContent editor={editor} className="min-h-[200px] p-2 bg-white border border-gray-300 rounded-md overflow-y-auto" />
              </>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Tipo</label>
            <select
              name="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border text-gray-900"
            >
              {faqTypes.map((typeOpt) => (
                <option key={typeOpt.id} value={typeOpt.id}>{typeOpt.faq_type}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Orden</label>
            <input type="number" name="ord" defaultValue={faq.ord || ''} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900" />
          </div>
          <div className="flex justify-end items-center">
            <button type="button" onClick={onClose} className="mr-4 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Cancelar</button>
            <button type="submit" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Guardar Cambios</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditFaqModal;
