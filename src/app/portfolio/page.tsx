import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import { Edu_NSW_ACT_Cursive } from 'next/font/google';

// Initialize the font for the Hero Section.
const eduNSW = Edu_NSW_ACT_Cursive({
  weight: ['400', '700'], // You can specify the weights you need
  fallback: ['system-ui', 'sans-serif'],
});

const PortfolioPage = () => {
  const projects = [
    {
      id: 'proyecto-residencial-moderno',
      title: 'Proyecto Residencial Moderno',
 description: 'Un diseño innovador que fusiona líneas limpias y funcionalidad para crear espacios habitables que inspiran tranquilidad y armonía. Cada detalle ha sido cuidadosamente seleccionado para reflejar un estilo de vida contemporáneo.',
      imageUrl: '/images/0000 - Public Serendipity Site v2/carrousel1.jpg',
      imageAlt: 'Imagen de un moderno salón con grandes ventanales.',
    },
    {
      id: 'reforma-oficina-creativa',
      title: 'Reforma de Oficina Creativa',
 description: 'Transformamos un espacio de trabajo convencional en un entorno vibrante y dinámico que estimula la colaboración, la innovación y el bienestar de los empleados. Colores vivos, mobiliario ergonómico y zonas de descanso integradas definen este proyecto.',
      imageUrl: '/images/0000 - Public Serendipity Site v2/carrousel2.jpg',
      imageAlt: 'Imagen de un área de coworking colorida y moderna.',
    },
    {
      id: 'diseño-local-comercial',
      title: 'Diseño de Local Comercial',
 description: 'Desarrollamos un concepto de diseño único para esta tienda de moda, creando un ambiente que no solo exhibe la ropa, sino que también ofrece una experiencia de compra memorable. Iluminación estratégica y materiales texturizados realzan la estética del espacio.',
      imageUrl: '/images/0000 - Public Serendipity Site v2/carrousel3.jpg',
      imageAlt: 'Imagen del interior de una tienda de ropa con un diseño elegante.',
    },
    {
      id: 'interiorismo-restaurante-mediterraneo',
      title: 'Interiorismo Restaurante Mediterráneo',
 description: 'Capturamos la esencia del Mediterráneo en este diseño de restaurante. Tonos tierra, materiales naturales y una iluminación cálida crean un ambiente acogedor y relajante que invita a disfrutar de la gastronomía.',
      imageUrl: '/images/0000 - Public Serendipity Site v2/carrousel4.jpg',
      imageAlt: 'Imagen del comedor de un restaurante con decoración mediterránea.',
    },
    {
      id: 'proyecto-loft-industrial',
      title: 'Proyecto Loft Industrial',
 description: 'Un audaz diseño para un loft que abraza la estética industrial con un toque moderno. Ladrillo visto, estructuras metálicas y grandes ventanales se combinan para crear un espacio con carácter y personalidad.',
      imageUrl: '/images/0000 - Public Serendipity Site v2/carrousel5.jpg',
      imageAlt: 'Imagen de un loft con elementos de diseño industrial.',
    },
  ];

  return (
    <div className="bg-white text-black">
      <div className="container mx-auto px-4 py-8">
        <div className='bg-black text-white rounded-lg'>
          <br />
            <h1 className={`text-4xl md:text-5xl font-bold text-center ${eduNSW.className}`}>Nuestro Portafolio</h1>
          <br />
        </div>
        <br />
        <div className="portfolio-grid">
          {projects.map((project) => (
            <div
              key={project.id}
              className="project-preview bg-gray-400 border border-gray-200 shadow-md p-6 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl"
            >
            {/* Placeholder for project image */}
            <Image
              src={project.imageUrl}
              alt={project.imageAlt}
              width={600}
              height={400}
              className="project-image w-full h-full object-cover rounded-md"
              style={{ objectFit: 'cover', borderRadius: '0.375rem' }}
            />
            <p className="text-black mb-4">{project.description}</p>
            <Link href={`/portfolio/${project.id}`} className="bg-blue-600 text-white px-6 py-3 rounded-full text-lg hover:bg-blue-700">
              Ver Detalles
            </Link>
        </div>
      ))}
      </div>
      </div>
    </div>
  );
};

export default PortfolioPage;