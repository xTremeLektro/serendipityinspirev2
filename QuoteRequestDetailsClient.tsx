"use client";

import { useState } from 'react';
import Image from 'next/image';
import { FaDownload, FaEye } from 'react-icons/fa';

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

interface QuoteRequestDetailsClientProps {
  quoteRequest: QuoteRequest;
}

export default function QuoteRequestDetailsClient({ quoteRequest }: QuoteRequestDetailsClientProps) {
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState<string | null>(null);

  const openImageModal = (imageUrl: string) => {
    setModalImageUrl(imageUrl);
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
    setModalImageUrl(null);
  };

  return (
    <>
      <div className="bg-white p-8 rounded-lg shadow-md w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div><p className="font-semibold text-gray-600">Name:</p><p>{quoteRequest.full_name}</p></div>
          <div><p className="font-semibold text-gray-600">Email:</p><p>{quoteRequest.email}</p></div>
          <div><p className="font-semibold text-gray-600">Phone:</p><p>{quoteRequest.phone || 'N/A'}</p></div>
          <div><p className="font-semibold text-gray-600">Address:</p><p>{quoteRequest.address || 'N/A'}</p></div>
          <div><p className="font-semibold text-gray-600">City:</p><p>{quoteRequest.city || 'N/A'}</p></div>
          <div><p className="font-semibold text-gray-600">Postal Code:</p><p>{quoteRequest.postal_code || 'N/A'}</p></div>
          <div><p className="font-semibold text-gray-600">Project Type:</p><p>{quoteRequest.project_type || 'N/A'}</p></div>
          <div><p className="font-semibold text-gray-600">Estimated Budget:</p><p>{quoteRequest.estimated_budget || 'N/A'}</p></div>
          <div className="md:col-span-2"><p className="font-semibold text-gray-600">How they found us:</p><p>{quoteRequest.how_found_us || 'N/A'}</p></div>
          <div className="md:col-span-2">
            <p className="font-semibold text-gray-600">Spaces to address:</p>
            {quoteRequest.spaces_to_address && quoteRequest.spaces_to_address.length > 0 ? (
              <ul className="list-disc list-inside mt-1">
                {quoteRequest.spaces_to_address.map((space, index) => <li key={index}>{space}</li>)}
              </ul>
            ) : <p>N/A</p>}
          </div>
          <div className="md:col-span-2">
            <p className="font-semibold text-gray-600">Project Details:</p>
            <p className="whitespace-pre-wrap mt-1">{quoteRequest.project_details || 'N/A'}</p>
          </div>
        </div>
      </div>

      {quoteRequest.attachments && quoteRequest.attachments.length > 0 && (
        <div className="mt-8 bg-white p-8 rounded-lg shadow-md w-full">
          <h3 className="text-xl font-bold mb-4 text-gray-900">Attachments</h3>
          <ul className="space-y-3">
            {quoteRequest.attachments.map((attachment, index) => {
              const isImage = /\.(jpg|jpeg|png|gif)$/i.test(attachment);
              const fileName = attachment.split('/').pop();
              return (
                <li key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <span className="text-gray-800 font-medium">{fileName}</span>
                  <div className="flex items-center space-x-4">
                    {isImage && (
                      <button onClick={() => openImageModal(attachment)} className="text-blue-600 hover:text-blue-800 flex items-center space-x-1">
                        <FaEye />
                        <span>Preview</span>
                      </button>
                    )}
                    <a href={attachment} download target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 flex items-center space-x-1">
                      <FaDownload />
                      <span>Download</span>
                    </a>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {showImageModal && modalImageUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={closeImageModal}>
          <div className="relative bg-white p-4 rounded-lg max-w-4xl max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <button onClick={closeImageModal} className="absolute top-2 right-2 text-3xl text-gray-700 hover:text-gray-900 focus:outline-none leading-none" aria-label="Close">&times;</button>
            <Image src={modalImageUrl} alt="Attachment Preview" width={1200} height={800} className="max-w-full h-auto object-contain" />
          </div>
        </div>
      )}
    </>
  );
}