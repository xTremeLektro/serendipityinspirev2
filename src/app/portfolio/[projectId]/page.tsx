import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Edu_NSW_ACT_Cursive } from 'next/font/google';
import { projects } from '@/data/projects-data';
import { notFound } from 'next/navigation';

// Initialize the font for the Hero Section.
const eduNSW = Edu_NSW_ACT_Cursive({
  weight: ['400', '700'], // You can specify the weights you need
});

interface ProjectDetailPageProps {
  params: {
    projectId: string;
  };
}

// This function generates static pages for each project at build time
export async function generateStaticParams() {
  return projects.map((project) => ({
    projectId: project.id,
  }));
}

const ProjectDetailPage = ({ params }: ProjectDetailPageProps) => {
  const project = projects.find((p) => p.id === params.projectId);

  if (!project) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className={`rounded-lg mb-8 bg-black text-white relative ${eduNSW.className}`}>
        <br />
        <h1 className="text-4xl md:text-5xl font-bold text-center">{project.title}</h1>
        <br />
      </div>      

      <div className="flex flex-col md:flex-row gap-8">
        {/* Placeholder for Project Attributes (Sidebar) */}
        <div className="md:w-1/4 bg-gray-400 p-6 rounded-lg shadow-md flex flex-col justify-between">
          <div>
            <h2 className={`text-2xl font-semibold mb-6 text-gray-800 ${eduNSW.className}`}>Atributos</h2>
            <ul className="list-none p-0 text-gray-700">
              <li className="mb-3 text-gray-700"><strong className="font-medium text-gray-800">Ubicación:</strong> {project.details.location}</li>
              <li className="mb-3 text-gray-700"><strong className="font-medium text-gray-800">Área:</strong> {project.details.area}</li>
              <li className="mb-3 text-gray-700"><strong className="font-medium text-gray-800">Año de Finalización:</strong> {project.details.year}</li>
              <li><strong className="font-medium text-gray-800">Estilo:</strong> {project.details.style}</li>
            </ul>
          </div>
          {/* Placeholder for Back Button or Link */}
          <Link href="/portfolio" className="bg-blue-600 text-white px-6 py-3 rounded-full text-lg hover:bg-blue-700">Volver al Portfolio</Link>
        </div>

        {/* Main content: Description and Images */}
        <div className="md:w-3/4">
          {/* Placeholder for Project Description */}
          <div className="mb-8 text-black">
            <h2 className={`text-2xl font-semibold mb-4 ${eduNSW.className}`}>Descripción del Proyecto</h2>
            <p className="text-gray-700 leading-relaxed">{project.details.longDescription}</p>
          </div>

          {/* Dynamic Project Image Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {project.detailImages.map((image, index) => (
              <Image
                key={index}
                src={image.src}
                alt={image.alt}
                width={800}
                height={600}
                className="w-full h-auto object-cover rounded-lg shadow"
              />
            ))}
          </div>
        </div>
      </div>

  </div>
  );
};

export default ProjectDetailPage;