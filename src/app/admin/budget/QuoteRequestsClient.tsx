"use client";

import { useRouter } from 'next/navigation';
import { QuoteRequest } from '@/lib/types';
import { eduNSW } from '@/lib/fonts';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { FaAngleDoubleLeft, FaChevronLeft, FaChevronRight, FaAngleDoubleRight } from 'react-icons/fa';

const QUOTES_PER_PAGE = 15;

interface QuoteRequestsClientProps {
  quoteRequests: QuoteRequest[];
  totalPages: number;
  currentPage: number;
  totalQuoteRequests: number;
}

export default function QuoteRequestsClient({ 
  quoteRequests,
  totalPages,
  currentPage,
  totalQuoteRequests
}: QuoteRequestsClientProps) {
  const router = useRouter();

  const handlePageChange = (page: number) => {
    router.push(`/admin/budget?page=${page}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className={`text-3xl font-bold mb-6 text-gray-900 ${eduNSW.className}`}>Solicitudes de Presupuesto</h1>
      {quoteRequests.length === 0 ? (
        <p>No hay solicitudes de presupuesto.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="py-3 px-4 text-left">Fecha</th>
                  <th className="py-3 px-4 text-left">Nombre</th>
                  <th className="py-3 px-4 text-left">Tipo de Projecto</th>
                  <th className="py-3 px-4 text-left">Ubicacion</th>
                  <th className="py-3 px-4 text-left">Estado</th>
                  <th className="py-3 px-4 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {quoteRequests.map((request) => (
                  <tr key={request.id} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-4">{format(new Date(request.created_at), 'dd/MM/yyyy HH:mm', { locale: es })}</td>
                    <td className="py-3 px-4">{request.full_name}</td>
                    <td className="py-3 px-4">{request.project_type}</td>
                    <td className="py-3 px-4">{request.city}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold
                        ${request.status === 'pending' ? 'bg-yellow-200 text-yellow-800' :
                          request.status === 'contacted' ? 'bg-blue-200 text-blue-800' :
                          request.status === 'completed' ? 'bg-green-200 text-green-800' :
                          'bg-gray-200 text-gray-800'}
                      `}>
                        {request.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <a 
                        href={`/admin/budget/${request.id}`}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Ver Detalles
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-gray-600">
              Mostrando <span className="font-bold">{(currentPage - 1) * QUOTES_PER_PAGE + 1}</span> a <span className="font-bold">{Math.min(currentPage * QUOTES_PER_PAGE, totalQuoteRequests)}</span> de <span className="font-bold">{totalQuoteRequests}</span> resultados
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
        </>
      )}
    </div>
  );
}