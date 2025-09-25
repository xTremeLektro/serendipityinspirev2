'use client'

import { useState, useEffect } from 'react';
import AdminHeader from '@/components/AdminHeader';
import { getServices, addService, deleteService, getFaqTypes } from './actions';
import { FaTrash, FaEdit, FaAngleDoubleLeft, FaChevronLeft, FaChevronRight, FaAngleDoubleRight } from 'react-icons/fa';
import { Edu_NSW_ACT_Cursive } from 'next/font/google';
import Link from 'next/link';
import ServiceForm from './ServiceForm';
import ClientOnly from '@/components/ClientOnly';
import TiptapRenderer from '@/components/TiptapRenderer'; // New import
import { Service, FaqType } from '@/lib/types';

const eduNSW = Edu_NSW_ACT_Cursive({
  weight: ['400', '700'],
  subsets: ['latin'],
  fallback: ['cursive'],
});

const SERVICES_PER_PAGE = 10;

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [faqTypes, setFaqTypes] = useState<FaqType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalServices, setTotalServices] = useState(0);

  useEffect(() => {
    const fetchServices = async () => {
      const { data, count } = await getServices(currentPage, SERVICES_PER_PAGE);
      setServices(data || []);
      setTotalServices(count || 0);
      setTotalPages(Math.ceil((count || 0) / SERVICES_PER_PAGE));
    };
    fetchServices();
  }, [currentPage]);

  useEffect(() => {
    const fetchFaqTypes = async () => {
      const types = await getFaqTypes();
      setFaqTypes(types);
    };
    fetchFaqTypes();
  }, []);

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
                        <TiptapRenderer content={service.service_desc} />
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
            {/* Pagination */}
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-600">
                Mostrando <span className="font-bold">{(currentPage - 1) * SERVICES_PER_PAGE + 1}</span> a <span className="font-bold">{Math.min(currentPage * SERVICES_PER_PAGE, totalServices)}</span> de <span className="font-bold">{totalServices}</span> resultados
              </div>
              <nav aria-label="Pagination">
                <ul className="inline-flex items-center -space-x-px">
                  <li>
                    <button
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                      className="px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaAngleDoubleLeft />
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaChevronLeft />
                    </button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <li key={page}>
                      <button
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 leading-tight border border-gray-300 ${currentPage === page ? 'text-blue-600 bg-blue-50' : 'text-gray-500 bg-white'} hover:bg-gray-100 hover:text-gray-700`}
                      >
                        {page}
                      </button>
                    </li>
                  ))}
                  <li>
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaChevronRight />
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaAngleDoubleRight />
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}