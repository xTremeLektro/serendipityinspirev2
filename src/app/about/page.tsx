import React from 'react';

const AboutUsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 bg-white dark:bg-black text-gray-800 dark:text-gray-200">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 text-gray-800">Sobre Nosotros</h1>

      <section className="company-intro mb-16 p-8 bg-gray-100 rounded-lg shadow-sm">
        <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-gray-700">Nuestra Empresa</h2>
        <p className="text-lg leading-relaxed">
          En [Nombre de la Empresa], nos apasiona transformar espacios y crear ambientes que inspiren y funcionen a la perfección para quienes los habitan.
          Creemos que el diseño interior va más allá de la estética; se trata de mejorar la calidad de vida y reflejar la esencia de cada persona o marca.
          Con años de experiencia en el sector, ofrecemos soluciones de diseño interior innovadoras y personalizadas para hogares y negocios.
          Nuestro enfoque se basa en la escucha activa, la creatividad y la atención al detalle para convertir tus sueños en realidad.
        </p>
      </section>
      
      <section className="text-gray-800">
        <h2 className="text-3xl md:text-4xl font-semibold text-center mb-10 text-gray-700">Nuestro Equipo</h2>
        <div className="team-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Placeholder for Team Member 1 */}
          <div className="team-member flex flex-col items-center text-center p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 dark:bg-gray-700 dark:shadow-xl dark:hover:shadow-2xl">
            <div className="w-32 h-32 rounded-full mb-4 overflow-hidden border border-gray-200 dark:border-gray-700">
              <img src="https://via.placeholder.com/128" alt="Foto del Miembro 1" className="w-full h-full object-cover" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-800">Nombre del Miembro 1</h3>
            <p className="text-md text-gray-600 mb-3">Fundador/Diseñador Principal</p>
            <p className="text-sm text-gray-700 leading-relaxed dark:text-gray-400">
              Con [Número] años de experiencia, [Nombre del Miembro 1] lidera nuestro equipo con una visión innovadora y un enfoque centrado en el cliente.
              Su pasión por el diseño se refleja en cada proyecto, buscando siempre soluciones creativas y funcionales.
            </p>
          </div>

          {/* Placeholder for Team Member 2 */}
          <div className="team-member flex flex-col items-center text-center p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 dark:bg-gray-700 dark:shadow-xl dark:hover:shadow-2xl">
            <div className="w-32 h-32 rounded-full mb-4 overflow-hidden">
              <img src="https://via.placeholder.com/128" alt="Foto del Miembro 2" className="w-full h-full object-cover border border-gray-200 dark:border-gray-700" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-800">Nombre del Miembro 2</h3>
            <p className="text-md text-gray-600 mb-2">Diseñador Senior</p>
            <p className="text-sm text-gray-700">
              [Nombre del Miembro 2] aporta una gran experiencia y conocimiento técnico a nuestros proyectos.
              Su habilidad para combinar estética y funcionalidad garantiza resultados excepcionales.
            </p>
          </div>

          {/* Add more team member placeholders as needed */}
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;