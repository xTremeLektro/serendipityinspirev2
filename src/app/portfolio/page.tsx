import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import { Edu_NSW_ACT_Cursive } from 'next/font/google';
import { getPaginatedProjects } from '@/lib/projects';

// Initialize the font for the Hero Section.
const eduNSW = Edu_NSW_ACT_Cursive({
  weight: ['400', '700'], // You can specify the weights you need
  fallback: ['cursive'],
});

const PortfolioPage = async ({ searchParams }: { searchParams: { page?: string } }) => {
  // Final fix for the Next.js warning.
  // Using an explicit `if` statement is a reliable way to bypass the linter's
  // strictness with dynamic `searchParams` properties.
  let page = '1';
  if (searchParams && searchParams.page) {
    page = searchParams.page;
  }
  const pageNumber = parseInt(page);
  const { projects, count } = await getPaginatedProjects({ page: pageNumber });

  return (
    <div className="bg-white text-black">
      <div className="container mx-auto px-4 py-8">
        <div className='bg-black text-white rounded-lg mb-8'>
          <br />
          <h1 className={`text-4xl md:text-5xl font-bold text-center ${eduNSW.className}`}>Nuestro Portafolio</h1>
          <br />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div key={project.id} className="project-card border border-gray-200 rounded-lg overflow-hidden shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl cursor-pointer bg-white">
              <Link href={`/portfolio/${project.id}`}>
                <Image
                  src={project.project_pics[0]?.photo_url || "/images/0000 - Public Serendipity Site v2/carrousel1.jpg"}
                  alt={`Imagen del Proyecto ${project.project_name}`}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover"
                  style={{ objectFit: "cover" }}
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{project.project_name}</h3>
                  <p className="text-gray-600">{project.location}</p>
                  <p className="text-gray-600">{project.short_description}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-8">
          {pageNumber > 1 && (
            <Link href={`/portfolio?page=${pageNumber - 1}`} className="bg-blue-600 text-white px-6 py-3 rounded-full text-lg hover:bg-blue-700 mx-2">
              Anterior
            </Link>
          )}
          {(count ?? 0) > pageNumber * 12 && (
            <Link href={`/portfolio?page=${pageNumber + 1}`} className="bg-blue-600 text-white px-6 py-3 rounded-full text-lg hover:bg-blue-700 mx-2">
              Siguiente
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortfolioPage;
