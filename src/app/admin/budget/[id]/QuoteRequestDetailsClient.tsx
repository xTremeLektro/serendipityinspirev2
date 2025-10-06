"use client";

import { useState } from 'react';
import Image from 'next/image';
import { FaDownload, FaEye, FaFileAlt } from 'react-icons/fa';
import { eduNSW } from '@/lib/fonts';
import { updateQuoteRequestStatus } from '../actions';
import { QuoteRequest } from '@/lib/types';



interface QuoteRequestDetailsClientProps {
  quoteRequest: QuoteRequest;
}

const statusOptions = [
  { value: 'pending', label: 'Nuevo' },
  { value: 'contacted', label: 'Contactado' },
  { value: 'completed', label: 'Completado' },
  { value: 'cancelled', label: 'Cancelado' },
];

export default function QuoteRequestDetailsClient({ quoteRequest }: QuoteRequestDetailsClientProps) {
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState<string | null>(null);
  const [status, setStatus] = useState(quoteRequest.status);

  const openImageModal = (imageUrl: string) => {
    setModalImageUrl(imageUrl);
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
    setModalImageUrl(null);
  };

  const handleStatusChange = async (newStatus: QuoteRequest['status']) => {
    const formData = new FormData();
    formData.append('id', quoteRequest.id.toString());
    formData.append('status', newStatus);

    const result = await updateQuoteRequestStatus(formData);

    if (result?.error) {
      alert(`Error updating status: ${result.error}`);
    } else {
      setStatus(newStatus);
      alert('Status updated successfully!');
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-lg shadow-md w-full">
        <h2 className={`text-2xl font-bold mb-6 text-gray-900 ${eduNSW.className}`}>Solicitud de Presupuesto</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre</label>
              <div className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm sm:text-sm text-gray-900">
                {quoteRequest.full_name}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <div className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm sm:text-sm text-gray-900">
                {quoteRequest.email}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Teléfono</label>
              <div className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm sm:text-sm text-gray-900">
                {quoteRequest.phone || 'N/A'}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Estado</label>
              <select
                value={status}
                onChange={(e) => handleStatusChange(e.target.value as QuoteRequest['status'])}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Dirección</label>
              <div className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm sm:text-sm text-gray-900">
                {quoteRequest.address || 'N/A'}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Ciudad</label>
              <div className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm sm:text-sm text-gray-900">
                {quoteRequest.city || 'N/A'}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Código Postal</label>
              <div className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm sm:text-sm text-gray-900">
                {quoteRequest.postal_code || 'N/A'}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tipo de Proyecto</label>
              <div className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm sm:text-sm text-gray-900">
                {quoteRequest.project_type || 'N/A'}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Presupuesto Estimado</label>
              <div className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm sm:text-sm text-gray-900">
                {quoteRequest.estimated_budget || 'N/A'}
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Cómo nos encontró?</label>
              <div className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm sm:text-sm text-gray-900">
                {quoteRequest.how_found_us || 'N/A'}
              </div>
            </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Espacios a abordar</label>
            <div className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm sm:text-sm text-gray-900">
              {quoteRequest.spaces_to_address && quoteRequest.spaces_to_address.length > 0 ? (
                <ul className="list-disc list-inside">
                  {quoteRequest.spaces_to_address.map((space, index) => <li key={index}>{space}</li>)}
                </ul>
              ) : 'N/A'}
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Detalles del Proyecto</label>
            <div className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm sm:text-sm text-gray-900 min-h-[6rem] whitespace-pre-wrap">
              {quoteRequest.project_details || 'N/A'}
            </div>
          </div>
        </div>
      </div>

      {quoteRequest.attachments && quoteRequest.attachments.length > 0 && (
        <div className="bg-white p-8 rounded-lg shadow-md w-full">
          <h2 className={`text-2xl font-bold mb-4 text-gray-900 ${eduNSW.className}`}>Adjuntos</h2>
          <div className="flex flex-col gap-4">
            {quoteRequest.attachments.map((attachment, index) => {
              const isImage = /\.(jpg|jpeg|png|gif)$/i.test(attachment);
              const fileName = attachment.split('/').pop();
              return (
                <div key={index} className="bg-gray-50 p-4 rounded-lg shadow flex items-center justify-between space-x-4 w-full">
                  <div className="flex-shrink-0">
                    {isImage ? (
                      <div className="cursor-pointer" onClick={() => openImageModal(attachment)}>
                        <Image src={attachment} alt={fileName || 'Attachment'} width={64} height={64} className="object-cover rounded-md" />
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 flex items-center justify-center text-gray-500 text-4xl rounded-md">
                        <FaFileAlt />
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-700 font-medium flex-grow">{fileName}</p>
                  <div className="flex items-center space-x-4 flex-shrink-0">
                    {isImage && (
                      <button onClick={() => openImageModal(attachment)} className="text-blue-600 hover:text-blue-800 flex items-center space-x-1 text-sm">
                        <FaEye />
                        <span>Preview</span>
                      </button>
                    )}
                    <a href={attachment} download target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 flex items-center space-x-1 text-sm">
                      <FaDownload />
                      <span>Download</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {showImageModal && modalImageUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={closeImageModal}>
          <div className="relative bg-white p-4 rounded-lg max-w-4xl max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <button onClick={closeImageModal} className="absolute top-2 right-2 text-3xl text-gray-700 hover:text-gray-900 focus:outline-none leading-none" aria-label="Close">&times;</button>
            <Image src={modalImageUrl} alt="Attachment Preview" width={1200} height={800} className="max-w-full h-auto object-contain" style={{ objectFit: 'contain' }} priority />
          </div>
        </div>
      )}
    </div>
  );
}