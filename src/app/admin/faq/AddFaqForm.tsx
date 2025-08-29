'use client';

import { useState, FC, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TurndownService from 'turndown';
import { FaBold, FaItalic, FaListUl, FaListOl } from 'react-icons/fa';
import { addFaq } from './actions';

type FaqType = {
    id: string;
    faq_type: string;
  };

interface AddFaqFormProps {
    faqTypes: FaqType[];
}

const AddFaqForm: FC<AddFaqFormProps> = ({ faqTypes }) => {
    const [answer, setAnswer] = useState('');
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const editor = useEditor({
        extensions: [StarterKit],
        content: answer,
        onUpdate: ({ editor }) => {
            setAnswer(editor.getHTML());
        },
        immediatelyRender: false,
    });

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);
        
        const turndownService = new TurndownService();
        const markdownAnswer = turndownService.turndown(answer);
        formData.set('answer', markdownAnswer);

        await addFaq(formData);

        (event.target as HTMLFormElement).reset();
        setAnswer('');
        if (editor) {
            editor.commands.setContent('');
        }
    };

    return (
        <form onSubmit={handleFormSubmit}>
            <div className="mb-4">
                <label htmlFor="question" className="block text-sm font-medium text-gray-700">Pregunta</label>
                <input type="text" name="question" id="question" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900" required />
            </div>
            <div className="mb-4">
                <label htmlFor="answer" className="block text-sm font-medium text-gray-700">Respuesta</label>
                {isClient && editor && (
                    <>
                        <div className="mb-2 p-2 border border-gray-300 rounded-md bg-gray-50 flex flex-wrap gap-2">
                            <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} disabled={!editor.can().chain().focus().toggleBold().run()} className={`p-2 rounded-md ${editor.isActive('bold') ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}><FaBold /></button>
                            <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} disabled={!editor.can().chain().focus().toggleItalic().run()} className={`p-2 rounded-md ${editor.isActive('italic') ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}><FaItalic /></button>
                            <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} disabled={!editor.can().chain().focus().toggleBulletList().run()} className={`p-2 rounded-md ${editor.isActive('bulletList') ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}><FaListUl /></button>
                            <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} disabled={!editor.can().chain().focus().toggleOrderedList().run()} className={`p-2 rounded-md ${editor.isActive('orderedList') ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}><FaListOl /></button>
                        </div>
                        <EditorContent editor={editor} className="min-h-[150px] p-2 bg-white border border-gray-300 rounded-md" />
                    </>
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
