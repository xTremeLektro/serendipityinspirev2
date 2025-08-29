'use client';

import { useState, FC, Fragment } from 'react';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { marked } from 'marked';
import { deleteFaq } from './actions';
import EditFaqModal from './EditFaqModal'; // Import the modal component

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

interface FaqListClientProps {
  initialFaqs: Faq[]
  faqTypes: FaqType[];
}

const MarkdownRenderer: FC<{ content: string }> = ({ content }) => {
  // Handle both literal \n strings and actual newline characters.
  const normalizedContent = content.replace(/(\r\n|\r|\n)/g, '\n');
  const contentWithBreaks = normalizedContent.replace(/\n\n/g, '<br/><br/>'); // Ensure two new lines are treated as a paragraph break.
  const parsedHtml = marked.parse(contentWithBreaks);

  return <div dangerouslySetInnerHTML={{ __html: parsedHtml as string }} className="prose max-w-none" />;
};

const FaqListClient: FC<FaqListClientProps> = ({ initialFaqs, faqTypes }) => {
  const [faqs] = useState<Faq[]>(initialFaqs);
  const [editingFaq, setEditingFaq] = useState<Faq | null>(null);

  const handleEdit = (faq: Faq) => {
    setEditingFaq(faq);
  };

  const handleCloseModal = () => {
    setEditingFaq(null);
  };

  return (
    <Fragment>
      <table className="min-w-full divide-y divide-gray-200 mt-4">
        <thead className="bg-gray-200">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pregunta</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Respuesta</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orden</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {faqs.map((faq) => (
            <tr key={faq.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 max-w-xs truncate">{faq.question}</td>
              <td className="px-6 py-4 whitespace-normal text-sm text-gray-500">
                <MarkdownRenderer content={faq.answer} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{faq.faq_type_list.faq_type}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {faq.ord}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button onClick={() => handleEdit(faq)} className="text-indigo-600 hover:text-indigo-900 mr-4"><FaEdit /></button>
                <form action={deleteFaq} className="inline-block">
                  <input type="hidden" name="id" value={faq.id} />
                  <button type="submit" className="text-red-600 hover:text-red-900"><FaTrash /></button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {editingFaq && (
        <EditFaqModal 
          faq={editingFaq} 
          faqTypes={faqTypes} 
          onClose={handleCloseModal} 
        />
      )}
    </Fragment>
  );
};

export default FaqListClient;
