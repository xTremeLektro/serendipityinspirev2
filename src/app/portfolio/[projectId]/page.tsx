import React from 'react';
import Link from 'next/link';
import { getProjectById } from '@/lib/projects';
import { notFound } from 'next/navigation';
import ProjectImageGallery from '@/components/ProjectImageGallery';
import TiptapRenderer from '@/components/TiptapRenderer'; // New import
import { Inter } from 'next/font/google';
import { ArrowLeft } from 'lucide-react';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

interface ProjectDetailPageProps {
  params: Promise<{ projectId: string }>;
}

const ProjectDetailPage = async (props: ProjectDetailPageProps) => {
  const { projectId } = await props.params;
  const project = await getProjectById(projectId);

  if (!project) {
    notFound();
  }

  return (
    <main className={`${inter.variable} font-sans bg-slate-50 text-slate-800`}>
      <div className="container mx-auto px-4 py-16">

        {/* --- Project Header --- */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-slate-900">{project.project_name}</h1>
          <p className="text-lg text-slate-600 mt-2">{project.location}</p>
        </div>

        {/* --- Project Details --- */}
        <div className="grid md:grid-cols-3 gap-12 mb-12">

          {/* --- Description (Left Column) --- */}
          <div className="md:col-span-2">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Descripción del Proyecto</h2>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <TiptapRenderer content={project.detailed_description} />
            </div>
          </div>

          {/* --- Attributes (Right Column) --- */}
          <div className="md:col-span-1">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Detalles</h2>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <ul className="space-y-4 text-lg">
                <li><strong className="font-semibold text-slate-800 block">Ubicación:</strong> <span className="text-slate-600">{project.location}</span></li>
                <li><strong className="font-semibold text-slate-800 block">Tipo:</strong> <span className="text-slate-600">{project.property_type}</span></li>
                <li><strong className="font-semibold text-slate-800 block">Fecha:</strong> <span className="text-slate-600">{project.end_date}</span></li>
                <li><strong className="font-semibold text-slate-800 block">Estilo:</strong> <span className="text-slate-600">{project.style}</span></li>
                <li><strong className="font-semibold text-slate-800 block">Alcance:</strong> <span className="text-slate-600">{project.scope}</span></li>
              </ul>
            </div>
          </div>

        </div>

        {/* --- Image Gallery --- */}
        <div>
          <ProjectImageGallery images={project.project_pics} />
        </div>

        {/* --- Back to Portfolio Link --- */}
        <div className="text-center mt-16">
          <Link href="/portfolio" className="inline-flex items-center gap-2 bg-slate-800 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-slate-900 transition-colors duration-300 shadow-lg">
            <ArrowLeft size={20} />
            Volver al Portfolio
          </Link>
        </div>

      </div>
    </main>
  );
};

export default ProjectDetailPage;
