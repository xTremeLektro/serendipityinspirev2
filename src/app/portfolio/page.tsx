import Link from 'next/link';
import React from 'react';

const PortfolioPage = () => {
  const projects = [
    {
      id: 'proyecto-residencial-moderno',
      title: 'Proyecto Residencial Moderno',
 description: 'Un diseño innovador que fusiona líneas limpias y funcionalidad para crear espacios habitables que inspiran tranquilidad y armonía. Cada detalle ha sido cuidadosamente seleccionado para reflejar un estilo de vida contemporáneo.',
      imageUrl: 'https://via.placeholder.com/600x400?text=Proyecto+Residencial+Moderno',
      imageAlt: 'Imagen de un moderno salón con grandes ventanales.',
    },
    {
      id: 'reforma-oficina-creativa',
      title: 'Reforma de Oficina Creativa',
 description: 'Transformamos un espacio de trabajo convencional en un entorno vibrante y dinámico que estimula la colaboración, la innovación y el bienestar de los empleados. Colores vivos, mobiliario ergonómico y zonas de descanso integradas definen este proyecto.',
      imageUrl: 'https://via.placeholder.com/600x400?text=Reforma+Oficina+Creativa',
      imageAlt: 'Imagen de un área de coworking colorida y moderna.',
    },
    {
      id: 'diseño-local-comercial',
      title: 'Diseño de Local Comercial',
 description: 'Desarrollamos un concepto de diseño único para esta tienda de moda, creando un ambiente que no solo exhibe la ropa, sino que también ofrece una experiencia de compra memorable. Iluminación estratégica y materiales texturizados realzan la estética del espacio.',
      imageUrl: 'https://via.placeholder.com/600x400?text=Dise%C3%B1o+Local+Comercial',
      imageAlt: 'Imagen del interior de una tienda de ropa con un diseño elegante.',
    },
    {
      id: 'interiorismo-restaurante-mediterraneo',
      title: 'Interiorismo Restaurante Mediterráneo',
 description: 'Capturamos la esencia del Mediterráneo en este diseño de restaurante. Tonos tierra, materiales naturales y una iluminación cálida crean un ambiente acogedor y relajante que invita a disfrutar de la gastronomía.',
      imageUrl: 'https://via.placeholder.com/600x400?text=Restaurante+Mediterraneo',
      imageAlt: 'Imagen del comedor de un restaurante con decoración mediterránea.',
    },
    {
      id: 'proyecto-loft-industrial',
      title: 'Proyecto Loft Industrial',
 description: 'Un audaz diseño para un loft que abraza la estética industrial con un toque moderno. Ladrillo visto, estructuras metálicas y grandes ventanales se combinan para crear un espacio con carácter y personalidad.',
      imageUrl: 'https://via.placeholder.com/600x400?text=Loft+Industrial',
      imageAlt: 'Imagen de un loft con elementos de diseño industrial.',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-white">Nuestro Portafolio</h1>

      <div className="portfolio-grid">
        {projects.map((project) => (
          <div key={project.id} className="project-preview bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md dark:shadow-lg">
            {/* Placeholder for project image */}{" "}
            <div className="w-full h-48 bg-gray-300 dark:bg-gray-700 rounded-md mb-4 flex items-center justify-center text-gray-600 dark:text-gray-300">
             <img
                src={project.imageUrl}
                alt={project.imageAlt}
                className="project-image"
              />
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">{project.description}</p>
            <Link href={`/portfolio/${project.id}`} className="text-blue-600 hover:underline block mt-4">
              Ver Detalles
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PortfolioPage;