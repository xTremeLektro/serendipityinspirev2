import React from 'react';

const ProjectDetailPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
 <h1 className="text-4xl font-bold text-center mb-12 dark:text-white">Nombre del Proyecto (Placeholder)</h1>

 <div className="flex flex-col md:flex-row gap-8">
 {/* Placeholder for Project Attributes (Sidebar) */}
 <div className="md:w-1/4 bg-gray-100 p-6 rounded-lg shadow-md dark:bg-gray-700 dark:shadow-lg">
 <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200">Atributos</h2>
 <ul className="list-none p-0 text-gray-700 dark:text-gray-300">
 <li className="mb-3"><strong className="font-medium">Ubicación:</strong> Ciudad, País (Placeholder)</li>
 <li className="mb-3"><strong className="font-medium">Área:</strong> XXX m² (Placeholder)</li>
 <li className="mb-3"><strong className="font-medium">Año de Finalización:</strong> YYYY (Placeholder)</li>
 <li><strong className="font-medium">Estilo:</strong> Moderno, Rústico, Minimalista, etc. (Placeholder)</li>
 {/* Add more placeholder attributes as needed */}
          </ul>
 </div>

 {/* Main content: Description and Images */}
 <div className="md:w-3/4">
 {/* Placeholder for Project Description */}
 <div className="mb-8">
 <h2 className="text-2xl font-semibold mb-4 text-gray-800">Descripción del Proyecto</h2>
 <p className="text-gray-700 leading-relaxed dark:text-gray-300">
 Este es un espacio para la descripción detallada del proyecto. Aquí se puede incluir información sobre el concepto, los desafíos, y el resultado final. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
 </p>
 </div>

 {/* Placeholder for Project Images */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <img
 src="https://via.placeholder.com/800x600"
 alt="Imagen del Proyecto 1 (Placeholder)"
 className="w-full h-auto object-cover rounded-lg shadow"
 />
 <img
 src="https://via.placeholder.com/800x600"
 alt="Imagen del Proyecto 2 (Placeholder)"
 className="w-full h-auto object-cover rounded-lg shadow"
 />
 {/* Add more img tags with placeholder images as needed */}
 </div>
 </div>
      </div>

      {/* Placeholder for Back Button or Link */}
      <div>
        <a href="/portfolio" className="text-blue-600 hover:underline dark:text-blue-400">Volver al Portfolio</a>
      </div>
    </div>
  );
};

export default ProjectDetailPage;