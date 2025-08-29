import AdminHeader from '@/components/AdminHeader';
import { getServices, addService, deleteService, getFaqTypes } from './actions';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { Edu_NSW_ACT_Cursive } from 'next/font/google';
import Link from 'next/link';
import { marked } from 'marked';
import { FC } from 'react';
import ServiceForm from './ServiceForm'; // Import the new form component
import ClientOnly from '@/components/ClientOnly'; // Import ClientOnly

// Initialize the font for the Hero Section.
const eduNSW = Edu_NSW_ACT_Cursive({
  weight: ['400', '700'], // You can specify the weights you need
  fallback: ['cursive'],
});

const MarkdownRenderer: FC<{ content: string | null }> = ({ content }) => {
  if (!content) return null;
  // Handle both literal \n strings and actual newline characters.
  const normalizedContent = content.replace(/(\n|\n)+/g, '\n\n');
  const parsedHtml = marked.parse(normalizedContent);
  return <div dangerouslySetInnerHTML={{ __html: parsedHtml as string }} className="prose max-w-none" />;
};

export default async function AdminServicesPage() {
  const services = await getServices();
  const faqTypes = await getFaqTypes();

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader title="Gestión de Servicios" />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white p-8 rounded-lg shadow-md w-full mb-8">
            <h2 className={`text-2xl font-bold mb-4 text-gray-900 ${eduNSW.className}`}>Agregar Nuevo Servicio</h2>
            <ClientOnly>
              <ServiceForm faqTypes={faqTypes} action={addService} />
            </ClientOnly>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md w-full">
            <h2 className={`text-2xl font-bold mb-4 text-gray-900 ${eduNSW.className}`}>Servicios Existentes</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre del Servicio</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo de FAQ</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orden</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {services.map((service) => (
                    <tr key={service.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{service.service_name}</td>
                      <td className="px-6 py-4 whitespace-normal text-sm text-gray-500 max-w-md">
                        <MarkdownRenderer content={service.service_desc} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{service.faq_type_list?.faq_type || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {service.ord}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-4">
                          <Link href={`/admin/services/${service.id}`} className="text-indigo-600 hover:text-indigo-900">
                            <FaEdit />
                          </Link>
                          <form action={deleteService} className="inline-block">
                            <input type="hidden" name="id" value={service.id} />
                            <button type="submit" className="text-red-600 hover:text-red-900">
                              <FaTrash />
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

