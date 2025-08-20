import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import { Edu_NSW_ACT_Cursive } from 'next/font/google';
import { projects } from '@/data/projects-data';

// Initialize the font for the Hero Section.
const eduNSW = Edu_NSW_ACT_Cursive({
  weight: ['400', '700'], // You can specify the weights you need
  fallback: ['system-ui', 'sans-serif'],
});

const PortfolioPage = () => {
  return (
    <div className="bg-white text-black">
      <div className="container mx-auto px-4 py-8">
        <div className='bg-black text-white rounded-lg mb-8'>
          <br />
            <h1 className={`text-4xl md:text-5xl font-bold text-center ${eduNSW.className}`}>Nuestro Portafolio</h1>
          <br />
        </div>

        <div className="portfolio-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {/* <div className="portfolio-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"></div> */}
          {projects.map((project) => (
            <div
              key={project.id}
              className="project-preview bg-gray-400 border border-gray-200 shadow-md p-6 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between"
            >
              {/* Placeholder for project image */}
              <Image
                src={project.imageUrl}
                alt={project.imageAlt}
                width={600}
                height={400}
                className="project-image w-full object-cover rounded-md"
                style={{ objectFit: 'cover', borderRadius: '0.375rem' }}
              />
              <p className="text-black mb-4 mt-4">{project.description}</p>
              <Link href={`/portfolio/${project.id}`} className="bg-blue-600 text-white px-6 py-3 rounded-full text-lg hover:bg-blue-700">
                Ver Detalles
              </Link>
            </div>
                                      )
                        )
            }
        </div>
      </div>
    </div>
  );
};

export default PortfolioPage;