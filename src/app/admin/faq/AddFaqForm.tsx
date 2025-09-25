'use client';

import { useState, FC, useEffect } from 'react';
import { addFaq } from './actions';
import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor';
import { JSONContent } from '@tiptap/react';

type FaqType = {
    id: string;
    faq_type: string;
  };

interface AddFaqFormProps {
    faqTypes: FaqType[];
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

const AddFaqForm: FC<AddFaqFormProps> = ({ faqTypes }) => {
    const [answer, setAnswer] = useState(JSON.stringify({ type: 'doc', content: [{ type: 'paragraph' }] }));
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);
        
        formData.set('answer', answer);

        await addFaq(formData);

        (event.target as HTMLFormElement).reset();
        setAnswer(JSON.stringify({ type: 'doc', content: [{ type: 'paragraph' }] }));
    };

    return (
        <form onSubmit={handleFormSubmit}>
            <div className="mb-4">
                <label htmlFor="question" className="block text-sm font-medium text-gray-700">Pregunta</label>
                <input type="text" name="question" id="question" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900" required />
            </div>
            <div className="mb-4">
                <label htmlFor="answer" className="block text-sm font-medium text-gray-700">Respuesta</label>
                {isClient && (
                    <SimpleEditor
                      content={parseContent(answer)} // Pass initial content
                      onUpdate={(editorState) => {
                        setAnswer(JSON.stringify(editorState.editor.getJSON()));
                      }}
                    />
                )}
            </div>
            <div className="mb-4">
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">Tipo de Lista</label>
                <select name="type" id="type" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border text-gray-900" required>
                    <option value="" className="text-gray-500">Seleccionar un tipo</option>
                    {faqTypes.map((type) => (
                        <option key={type.id} value={type.id} className="text-gray-900">{type.faq_type}</option>
                    ))}
                </select>
            </div>
            <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Add FAQ</button>
        </form>
    );
}

export default AddFaqForm;
