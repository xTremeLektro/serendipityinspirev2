"use client";

// import Link from 'next/link'
import { useState, useEffect } from 'react';
import { getQuoteRequests, updateQuoteRequestStatus } from './actions';
// import { QuoteRequest } from '@/lib/types'; // Removed, using local interface below
import { Edu_NSW_ACT_Cursive } from 'next/font/google';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const eduNSW = Edu_NSW_ACT_Cursive({
  weight: ['400', '700'], // You can specify the weights you need
  fallback: ['cursive'],
  subsets: ['latin', 'latin-ext'],
});

export default function QuoteRequestsClient() {
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuoteRequests = async () => {
      setLoading(true);
      const { data, error } = await getQuoteRequests();
      if (error) {
        setError(error);
      } else if (data) {
        setQuoteRequests(data);
      }
      setLoading(false);
    };
    fetchQuoteRequests();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    const formData = new FormData();
    formData.append('id', id);
    formData.append('status', newStatus);
    const result = await updateQuoteRequestStatus(formData);
    if (result?.error) {
      alert(`Error updating status: ${result.error}`);
    } else {
      setQuoteRequests(prev => 
        prev.map(req => req.id === Number(id) ? { ...req, status: newStatus as QuoteRequest['status'] } : req)
      );
    }
  };

  if (loading) return <p>Cargando solicitudes...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className={`text-3xl font-bold mb-6 text-gray-900 ${eduNSW.className}`}>Solicitudes de Presupuesto</h1>
      {quoteRequests.length === 0 ? (
        <p>No hay solicitudes de presupuesto.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="py-3 px-4 text-left">Fecha</th>
                <th className="py-3 px-4 text-left">Nombre</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Teléfono</th>
                <th className="py-3 px-4 text-left">Servicio</th>
                <th className="py-3 px-4 text-left">Mensaje</th>
                <th className="py-3 px-4 text-left">Estado</th>
                <th className="py-3 px-4 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {quoteRequests.map((request) => (
                <tr key={request.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-4">{format(new Date(request.created_at), 'dd/MM/yyyy HH:mm', { locale: es })}</td>
                  <td className="py-3 px-4">{request.full_name}</td>
                  <td className="py-3 px-4">{request.email}</td>
                  <td className="py-3 px-4">{request.phone}</td>
                  <td className="py-3 px-4">{request.service_type}</td>
                  <td className="py-3 px-4">{request.message}</td>
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
                    <select
                      value={request.status}
                      onChange={(e) => handleStatusChange(request.id.toString(), e.target.value)}
                      className="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    >
                      <option value="pending">Pendiente</option>
                      <option value="contacted">Contactado</option>
                      <option value="completed">Completado</option>
                      <option value="cancelled">Cancelado</option>
                    </select>
                    <a 
                      href={`/admin/budget/${request.id}`}
                      className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Ver Detalles
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

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
  service_type?: string;
  spaces_to_address?: string[];
  estimated_budget?: string;
  how_found_us?: string;
  project_details?: string;
  attachments?: string[];
  message?: string;
  status: 'pending' | 'contacted' | 'completed' | 'cancelled';
}
