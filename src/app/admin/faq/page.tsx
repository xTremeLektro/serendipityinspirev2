'use client';

import { useState, useEffect, useMemo, FC, Fragment } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import AdminHeader from '@/components/AdminHeader';
import { getFaqTypes, addFaqType, getFaqs, deleteFaqType, deleteFaq } from './actions';
import { eduNSW } from '@/lib/fonts';
import { FaTrash, FaEdit, FaAngleDoubleLeft, FaChevronLeft, FaChevronRight, FaAngleDoubleRight } from 'react-icons/fa';
import AddFaqForm from './AddFaqForm';
import ClientOnly from '@/components/ClientOnly';
import EditFaqModal from './EditFaqModal';
import { generateHTML } from '@tiptap/core';
import { JSONContent } from '@tiptap/react';
import { getTiptapClientExtensions as getTiptapExtensions } from '@/lib/tiptap.client';

export interface FaqType {
  id: string;
  faq_type: string;
}

export interface Faq {
  id: string;
  question: string;
  answer: JSONContent;
  type: string;
  ord: number | null;
  faq_type_list: {
    faq_type: string;
  };
}

const FAQS_PER_PAGE = 10;

const TiptapRenderer: FC<{ content: JSONContent | string | null }> = ({ content }) => {
  const output = useMemo(() => {
    if (!content) return '';
    let tiptapContent = content;
    if (typeof tiptapContent === 'string') {
      try {
        tiptapContent = JSON.parse(tiptapContent);
      } catch {
        return tiptapContent;
      }
    }
    if (typeof tiptapContent === 'object' && tiptapContent?.type === 'doc') {
      return generateHTML(tiptapContent, getTiptapExtensions());
    }
    if (typeof content === 'string') return content;
    return JSON.stringify(content);
  }, [content]);

  return <div dangerouslySetInnerHTML={{ __html: output }} className="prose prose-sm max-w-none [&_p:empty]:after:content-['\00a0']" />;
};

export default function AdminFAQPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  const [faqTypes, setFaqTypes] = useState<FaqType[]>([]);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalFaqs, setTotalFaqs] = useState(0);
  const [editingFaq, setEditingFaq] = useState<Faq | null>(null);

  useEffect(() => {
    const fetchFaqs = async () => {
      const { data, count } = await getFaqs(currentPage, FAQS_PER_PAGE);
      setFaqs(data || []);
      setTotalFaqs(count || 0);
      setTotalPages(Math.ceil((count || 0) / FAQS_PER_PAGE));
    };
    fetchFaqs();
  }, [currentPage]);

  useEffect(() => {
    const fetchFaqTypes = async () => {
      const types = await getFaqTypes();
      setFaqTypes(types);
    };
    fetchFaqTypes();
  }, []);

  const handleEdit = (faq: Faq) => {
    setEditingFaq(faq);
  };

  const handleCloseModal = () => {
    setEditingFaq(null);
  };

  const handlePageChange = (page: number) => {
    router.push(`/admin/faq?page=${page}`);
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
              <ClientOnly>
                <AddFaqForm faqTypes={faqTypes} />
              </ClientOnly>
            </div>
            <div className="p-4 mt-4 bg-gray-50 rounded-lg">
              <h3 className={`text-lg font-medium text-gray-900 ${eduNSW.className}`}>Preguntas Frecuentes Existentes</h3>
              <ClientOnly>
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
                            <TiptapRenderer content={faq.answer} />
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
                  {/* Pagination */}
                  <div className="flex justify-between items-center mt-6">
                    <div className="text-sm text-gray-600">
                      Mostrando <span className="font-bold">{(currentPage - 1) * FAQS_PER_PAGE + 1}</span> a <span className="font-bold">{Math.min(currentPage * FAQS_PER_PAGE, totalFaqs)}</span> de <span className="font-bold">{totalFaqs}</span> resultados
                    </div>
                    <nav aria-label="Pagination">
                      <ul className="inline-flex items-center -space-x-px">
                        <li>
                          <button
                            onClick={() => handlePageChange(1)}
                            disabled={currentPage === 1}
                            className="px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <FaAngleDoubleLeft />
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <FaChevronLeft />
                          </button>
                        </li>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                          <li key={page}>
                            <button
                              onClick={() => handlePageChange(page)}
                              className={`px-3 py-2 leading-tight border border-gray-300 ${currentPage === page ? 'text-blue-600 bg-blue-50' : 'text-gray-500 bg-white'} hover:bg-gray-100 hover:text-gray-700`}
                            >
                              {page}
                            </button>
                          </li>
                        ))}
                        <li>
                          <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <FaChevronRight />
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => handlePageChange(totalPages)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <FaAngleDoubleRight />
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                  {editingFaq && (
                    <EditFaqModal 
                      faq={editingFaq} 
                      faqTypes={faqTypes} 
                      onClose={handleCloseModal} 
                    />
                  )}
                </Fragment>
              </ClientOnly>
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
