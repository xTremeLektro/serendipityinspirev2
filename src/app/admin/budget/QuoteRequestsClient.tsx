"use client";

import { deleteQuoteRequest } from './actions';
import { FaEye, FaTrash } from 'react-icons/fa';
import Link from 'next/link';
import { Edu_NSW_ACT_Cursive } from 'next/font/google';

// Initialize the font for the Hero Section.
const eduNSW = Edu_NSW_ACT_Cursive({
  weight: ['400', '700'], // You can specify the weights you need
  fallback: ['cursive'],
});

interface QuoteRequest {
  id: number;
  created_at: string;
  full_name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  project_type?: string;
  spaces_to_address?: string[];
  estimated_budget?: string;
  how_found_us?: string;
  project_details?: string;
  attachments?: string[];
}

interface QuoteRequestsClientProps {
  quoteRequests: QuoteRequest[];
}

export default function QuoteRequestsClient({ quoteRequests }: QuoteRequestsClientProps) {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full">
      <h2 className={`text-2xl font-bold mb-4 text-gray-900 ${eduNSW.className}`}>Lista de Solicitudes de Presupuesto</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo de Proyecto</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {quoteRequests.map((quote) => (
              <tr key={quote.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(quote.created_at).toISOString().split('T')[0]}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{quote.full_name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{quote.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{quote.project_type}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link href={`/admin/budget/${quote.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4 inline-block">
                    <FaEye />
                  </Link>
                  <form action={deleteQuoteRequest} className="inline-block">
                    <input type="hidden" name="id" value={quote.id.toString()} />
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
  );
}
