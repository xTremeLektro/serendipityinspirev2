'use client';

import AdminHeader from '@/components/AdminHeader';
import { updateProject } from '../actions';
// import { useState } from 'react';
import { Edu_NSW_ACT_Cursive } from 'next/font/google';
import ProjectForm from '../ProjectForm';
import ClientOnly from '@/components/ClientOnly';
import { JSONContent } from '@tiptap/react';

// Initialize the font for the Hero Section.
const eduNSW = Edu_NSW_ACT_Cursive({
  weight: ['400', '700'], // You can specify the weights you need
  subsets: ['latin'],
  fallback: ['cursive'],
});

interface Project {
  id: string;
  project_name: string;
  short_description: string | null;
  detailed_description: JSONContent;
  location: string | null;
  end_date: string | null;
  property_type: string | null;
  style: string | null;
  scope: string | null;
  is_home: boolean | null;
}

// interface ProjectPic {
//   id: string;
//   photo_url?: string;
//   caption?: string;
//   is_home?: boolean;
//   is_head_pic?: boolean;
//   ord?: number;
// }

interface EditProjectPageClientProps {
  project: Project;
}


export default function EditProjectPageClient({ project }: EditProjectPageClientProps) {

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader title={`Editar Proyecto: ${project.project_name}`} backUrl="/admin/projects" backText="Regresar a Proyectos" />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0 space-y-8">
          <div className="bg-white p-8 rounded-lg shadow-md w-full">
            <h2 className={`text-2xl font-bold mb-4 text-gray-900 ${eduNSW.className}`}>Detalles del Proyecto</h2>
            <ClientOnly>
              <ProjectForm 
                action={updateProject} 
                initialData={project} 
              />
            </ClientOnly>
          </div>
        </div>
      </main>
    </div>
  );
}