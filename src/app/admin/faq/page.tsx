import AdminHeader from '@/components/AdminHeader';
import { getFaqTypes, addFaqType, getFaqs, deleteFaqType } from './actions';
import { Edu_NSW_ACT_Cursive } from 'next/font/google';
import { FaTrash } from 'react-icons/fa';
import FaqListClient from './FaqListClient';
import AddFaqForm from './AddFaqForm';
import ClientOnly from '@/components/ClientOnly';

// Initialize the font for the Hero Section.
const eduNSW = Edu_NSW_ACT_Cursive({
  weight: ['400', '700'],
  fallback: ['cursive'],
});

export default async function AdminFAQPage() {
  const [faqTypes, faqs] = await Promise.all([getFaqTypes(), getFaqs()]);

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
                <FaqListClient initialFaqs={faqs} faqTypes={faqTypes} />
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
