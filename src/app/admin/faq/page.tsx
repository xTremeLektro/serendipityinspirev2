"use client";
import { useState, useEffect, FC } from 'react';
import AdminHeader from '@/components/AdminHeader';
import { getFaqTypes, addFaqType, getFaqs, addFaq, deleteFaq, deleteFaqType } from './actions';
import { Edu_NSW_ACT_Cursive } from 'next/font/google';
import { FaTrash, FaBold, FaItalic, FaListUl, FaListOl } from 'react-icons/fa';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TurndownService from 'turndown';
import { marked } from 'marked';

// Initialize the font for the Hero Section.
const eduNSW = Edu_NSW_ACT_Cursive({
  weight: ['400', '700'],
  fallback: ['cursive'],
});

type FaqType = {
  id: number;
  faq_type: string;
};

type Faq = {
  id: number;
  question: string;
  answer: string;
  faq_type_list: FaqType;
};

/**
 * A simple component to render Markdown content safely.
 * @param {string} content The Markdown string to be converted to HTML.
 * @returns {JSX.Element} A div with the HTML content.
 */
const MarkdownRenderer: FC<{ content: string }> = ({ content }) => {
  // Normalize newlines to ensure proper paragraph breaks in Markdown.
  // This replaces single newlines with double newlines.
  const normalizedContent = content.replace(/(\n)(?=[^\n])/g, '\n\n');
  
  // Parse the markdown to HTML
  const parsedHtml = marked.parse(normalizedContent);

  return (
    <div dangerouslySetInnerHTML={{ __html: parsedHtml }} className="prose max-w-none" />
  );
};

export default function AdminFAQPage() {
  const [faqTypes, setFaqTypes] = useState<FaqType[]>([]);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [answer, setAnswer] = useState('');

  // Tiptap editor setup
  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content: answer,
    onUpdate: ({ editor }) => {
      setAnswer(editor.getHTML());
    },
    immediatelyRender: false,
  });

  // Fetch initial data on component mount
  useEffect(() => {
    const fetchData = async () => {
      const [faqTypesData, faqsData] = await Promise.all([getFaqTypes(), getFaqs()]);
      setFaqTypes(faqTypesData);
      setFaqs(faqsData);
    };
    fetchData();
  }, []);

  // Handle form submission for adding a new FAQ
  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    
    // Convert HTML from Tiptap editor to Markdown before saving
    const turndownService = new TurndownService();
    const markdownAnswer = turndownService.turndown(answer);
    formData.set('answer', markdownAnswer);

    await addFaq(formData);

    // Refresh FAQs and reset the form
    const faqsData = await getFaqs();
    setFaqs(faqsData);
    (event.target as HTMLFormElement).reset();
    setAnswer('');
    if (editor) {
      editor.commands.setContent('');
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader title="Gestión de Preguntas Frecuentes" />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* FAQs Management */}
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white p-8 rounded-lg shadow-md w-full mb-8">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h2 className={`text-2xl font-bold mb-4 text-gray-900 ${eduNSW.className}`}>Administrar Preguntas Frecuentes</h2>
            </div>
            <div className="p-4 mt-4 bg-gray-100 rounded-lg">
              <form onSubmit={handleFormSubmit}>
                <div className="mb-4">
                  <label htmlFor="question" className="block text-sm font-medium text-gray-700">Pregunta</label>
                  <input type="text" name="question" id="question" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900" required />
                </div>
                <div className="mb-4">
                  <label htmlFor="answer" className="block text-sm font-medium text-gray-700">Respuesta</label>
                  {editor && (
                    <div className="mb-2 p-2 border border-gray-300 rounded-md bg-gray-50 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        disabled={!editor.can().chain().focus().toggleBold().run()}
                        className={`p-2 rounded-md ${editor.isActive('bold') ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                      >
                        <FaBold />
                      </button>
                      <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        disabled={!editor.can().chain().focus().toggleItalic().run()}
                        className={`p-2 rounded-md ${editor.isActive('italic') ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                      >
                        <FaItalic />
                      </button>
                      <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        disabled={!editor.can().chain().focus().toggleBulletList().run()}
                        className={`p-2 rounded-md ${editor.isActive('bulletList') ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                      >
                        <FaListUl />
                      </button>
                      <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        disabled={!editor.can().chain().focus().toggleOrderedList().run()}
                        className={`p-2 rounded-md ${editor.isActive('orderedList') ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                      >
                        <FaListOl />
                      </button>
                    </div>
                  )}
                  <div className="border border-gray-300 rounded-md overflow-hidden">
                    <EditorContent editor={editor} className="min-h-[150px] p-2 bg-white" />
                  </div>
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
            </div>
            <div className="p-4 mt-4 bg-gray-50 rounded-lg">
              <h3 className={`text-lg font-medium text-gray-900 ${eduNSW.className}`}>Preguntas Frecuentes Existentes</h3>
              <table className="min-w-full divide-y divide-gray-200 mt-4">
                <thead className="bg-gray-200">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pregunta</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Respuesta</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {faqs.map((faq) => (
                    <tr key={faq.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{faq.question}</td>
                      <td className="px-6 py-4 whitespace-normal text-sm text-gray-500 max-w-xs">
                        {/* The fix is right here: render the Markdown content */}
                        <MarkdownRenderer content={faq.answer} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{faq.faq_type_list.faq_type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <form action={deleteFaq} className="inline-block">
                          <input type="hidden" name="id" value={faq.id} />
                          <button type="submit" className="text-red-600 hover:text-red-900">
                            <FaTrash />
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* FAQ Types Management */}
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white p-8 rounded-lg shadow-md w-full">
            <div className="p-4 mt-4 bg-gray-50 rounded-lg">
              <h2 className={`text-2xl font-bold mb-4 text-gray-900 ${eduNSW.className}`}>Aministrar Tipos de Lista</h2>
            </div>
            <div className="p-4 mt-4 bg-gray-100 rounded-lg">
              <form action={addFaqType}>
                <div className="mb-4">
                  <label htmlFor="faq_type" className="block text-sm font-medium text-gray-700">Nuevo Tipo de Lista</label>
                  <input type="text" name="faq_type" id="faq_type" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900" required />
                </div>
                <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Add Type</button>
              </form>
            </div>
            <div className="p-4 mt-4 bg-gray-50 rounded-lg">
              <h3 className={`text-lg font-medium text-gray-900 ${eduNSW.className}`}>Tipos de Lista Existentes</h3>
              <ul className="mt-4 space-y-2">
                {faqTypes.map((type) => (
                  <li key={type.id} className="p-2 bg-gray-200 rounded-md text-gray-900 flex justify-between items-center">
                    {type.faq_type}
                    <form action={deleteFaqType} className="inline-block">
                      <input type="hidden" name="id" value={type.id} />
                      <button type="submit" className="text-red-600 hover:text-red-900">
                        <FaTrash />
                      </button>
                    </form>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
