import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import { getPaginatedProjects } from '@/lib/projects';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const PortfolioPage = async ({ searchParams }: { searchParams: { page?: string } }) => {
  const sp = await searchParams;
  const page = sp?.page ?? '1';
  const pageNumber = parseInt(page);
  const { projects, count } = await getPaginatedProjects({ page: pageNumber });

  return (
    <main className={`${inter.variable} font-sans bg-slate-50 text-slate-800`}>
      <div className="container mx-auto px-4 py-16">
        
        {/* --- Page Header --- */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-slate-900">Nuestro Portafolio</h1>
          <p className="text-lg text-slate-600 mt-2 max-w-2xl mx-auto">Explora una selección de nuestros proyectos más inspiradores.</p>
        </div>

        {/* --- Projects Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <Link href={`/portfolio/${project.id}`} key={project.id}>
              <div className="group project-card bg-white rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="overflow-hidden h-56">
                  <Image
                    src={project.project_pics[0]?.photo_url || "/images/0000 - Public Serendipity Site v2/carrousel1.jpg"}
                    alt={`Imagen del Proyecto ${project.project_name}`}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-slate-900">{project.project_name}</h3>
                  <p className="text-slate-600 mb-4">{project.short_description}</p>
                  <span className="font-semibold text-[#E67E22] group-hover:underline">Ver Proyecto</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* --- Pagination --- */}
        <div className="flex justify-center items-center mt-12 space-x-4">
          {pageNumber > 1 && (
            <Link href={`/portfolio?page=${pageNumber - 1}`} className="bg-slate-800 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-slate-900 transition-colors duration-300 shadow-lg">
              Anterior
            </Link>
          )}
          {(count ?? 0) > pageNumber * 12 && (
            <Link href={`/portfolio?page=${pageNumber + 1}`} className="bg-[#E67E22] text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-[#d35400] transition-colors duration-300 shadow-lg">
              Siguiente
            </Link>
          )}
        </div>
      </div>
    </main>
  );
};

export default PortfolioPage;
