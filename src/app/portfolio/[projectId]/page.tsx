import React, { FC, useMemo } from 'react';
import Link from 'next/link';
import { Edu_NSW_ACT_Cursive } from 'next/font/google';
import { getProjectById } from '@/lib/projects';
import { notFound } from 'next/navigation';
import ProjectImageGallery from '@/components/ProjectImageGallery';
import { generateHTML } from '@tiptap/html';
import { JSONContent } from '@tiptap/react';
import { getTiptapExtensions } from '@/lib/tiptap';

// Initialize the font for the Hero Section.
const eduNSW = Edu_NSW_ACT_Cursive({
  weight: ['400', '700'], // You can specify the weights you need
  fallback: ['cursive'],
});

interface ProjectDetailPageProps {
  params: {
    projectId: string;
  };
}

const TiptapRenderer: FC<{ content: JSONContent | string | null }> = ({ content }) => {
  const output = useMemo(() => {
    if (!content) {
      return '';
    }

    let tiptapContent = content;

    if (typeof tiptapContent === 'string') {
      try {
        tiptapContent = JSON.parse(tiptapContent);
      } catch {
        return tiptapContent;
      }
    }

    if (typeof tiptapContent === 'object' && tiptapContent?.type === 'doc') {
      return generateHTML(tiptapContent, getTiptapExtensions());
    }

    if (typeof content === 'string') return content;
    return JSON.stringify(content);

  }, [content]);

  return <div dangerouslySetInnerHTML={{ __html: output }} className="prose prose-sm max-w-none [&_p:empty]:after:content-['\00a0']" />;
};

const ProjectDetailPage = async (props: ProjectDetailPageProps) => {
  // Implementing the Next.js documentation's recommended approach.
  // We explicitly await the params object before accessing its properties.
  const { projectId } = await props.params;
  const project = await getProjectById(projectId);

  if (!project) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className={`rounded-lg mb-8 bg-black text-white relative ${eduNSW.className}`}>
        <br />
        <h1 className="text-4xl md:text-5xl font-bold text-center">{project.project_name}</h1>
        <br />
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Placeholder for Project Attributes (Sidebar) */}
        <div className="md:w-1/4 bg-gray-400 p-6 rounded-lg shadow-md flex flex-col justify-between">
          <div>
            <h2 className={`text-2xl font-semibold mb-6 text-gray-800 ${eduNSW.className}`}>Atributos</h2>
            <ul className="list-none p-0 text-gray-700">
              <li className="mb-3 text-gray-700"><strong className="font-medium text-gray-800">Ubicación:</strong> {project.location}</li>
              <li className="mb-3 text-gray-700"><strong className="font-medium text-gray-800">Tipo de Propiedad:</strong> {project.property_type}</li>
              <li className="mb-3 text-gray-700"><strong className="font-medium text-gray-800">Fecha de Finalización:</strong> {project.end_date}</li>
              <li className="mb-3 text-gray-700"><strong className="font-medium text-gray-800">Estilo:</strong> {project.style}</li>
              <li><strong className="font-medium text-gray-800">Alcance:</strong> {project.scope}</li>
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
            <TiptapRenderer content={project.detailed_description} />
          </div>

          {/* Dynamic Project Image Gallery */}
          <ProjectImageGallery images={project.project_pics} />
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
