'use client';

import { useState, FC, useEffect, useMemo } from 'react';
import { JSONContent } from '@tiptap/react';
import { FaTimes } from 'react-icons/fa';
import { updateFaq } from './actions';
import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor';

type FaqType = {
  id: string;
  faq_type: string;
};

type Faq = {
  id: string;
  question: string;
  answer: JSONContent;
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

function parseContent(content: JSONContent | string | null): JSONContent {
  if (!content || content === '') {
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

const EditFaqModal: FC<EditFaqModalProps> = ({ faq, faqTypes, onClose }) => {
  const [question, setQuestion] = useState(faq.question);
  const [type, setType] = useState(faq.type);
  const [isClient, setIsClient] = useState(false);

  const initialContent = useMemo(() => parseContent(faq.answer), [faq.answer]);
  const [answer, setAnswer] = useState(JSON.stringify(initialContent));

  useEffect(() => {
    setIsClient(true);
  }, []);

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
            {isClient && (
              <SimpleEditor
                content={initialContent} // Pass initial content
                onUpdate={(editorState) => {
                  setAnswer(JSON.stringify(editorState.editor.getJSON()));
                }}
              />
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
