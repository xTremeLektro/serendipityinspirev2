"use client";

import React, { useState } from 'react';
import Image from 'next/image';

interface ProjectImage {
  photo_url: string;
  caption?: string;
}

interface ProjectImageGalleryProps {
  images: ProjectImage[];
}

const ProjectImageGallery: React.FC<ProjectImageGalleryProps> = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const openModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {images.map((image, index) => (
          <div key={index} onClick={() => openModal(image.photo_url)} className="cursor-pointer">
            <Image
              src={image.photo_url}
              alt={image.caption || `Imagen del proyecto ${index + 1}`}
              width={800}
              height={600}
              className="w-full h-auto object-cover rounded-lg shadow"
            />
            {image.caption && <p className="text-center mt-2 text-gray-600">{image.caption}</p>}
          </div>
        ))}
      </div>

      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={closeModal}>
          <div className="relative max-w-4xl max-h-full" onClick={(e) => e.stopPropagation()}>
            <Image
              src={selectedImage}
              alt="Imagen a pantalla completa"
              width={1920}
              height={1080}
              className="object-contain w-full h-full"
            />
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white text-2xl font-bold"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectImageGallery;
