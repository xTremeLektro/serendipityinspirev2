import React from 'react';
import Image from "next/image";
import { Edu_NSW_ACT_Cursive } from 'next/font/google';

// Initialize the font for the Hero Section.
const eduNSW = Edu_NSW_ACT_Cursive({
  weight: ['400', '700'], // You can specify the weights you need
  fallback: ['cursive'],
});

const AboutUsPage: React.FC = () => {
  return (
    <div className="bg-white text-black">
    <div className="container mx-auto px-4 py-8">
      <div className='bg-black text-white rounded-lg'>
        <br />
        <h1 className={`text-4xl md:text-5xl font-bold text-center ${eduNSW.className}`}>Sobre Nosotros</h1>
        <br />
      </div>
      
      <br />
      
      <section className="bg-white text-black">
        <h2 className={`text-3xl font-semibold mb-6 service-subtitle service-card ${eduNSW.className}`}>Nuestra Empresa</h2>
        <section className="company-intro mb-8 p-8 bg-gray-400 rounded-lg shadow-sm">
          
          <p className="text-lg leading-relaxed text-black">
            En Serendipity Inspire ©, nos apasiona transformar espacios y crear ambientes que inspiren y funcionen a la perfección para quienes los habitan.
            Creemos que el diseño interior va más allá de la estética; se trata de mejorar la calidad de vida y reflejar la esencia de cada persona o marca.
            Con gran experiencia en el sector, ofrecemos soluciones de diseño interior innovadoras y personalizadas para hogares y negocios.
            Nuestro enfoque se basa en la escucha activa, la creatividad y la atención al detalle para convertir tus sueños en realidad.
          </p>
        </section>
      </section>

      <section className="bg-white text-black">
        <h2 className={`text-3xl font-semibold mb-6 service-subtitle service-card ${eduNSW.className}`}>Nuestro Equipo</h2>

        <div className="team-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Placeholder for Team Member 1 */}
          <div className="team-member flex flex-col items-center text-center p-8 bg-gray-400 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="w-32 h-32 rounded-full mb-4 overflow-hidden border border-gray-200">
              <Image src="/images/0000 - Public Serendipity Site v2/Andrea.jpeg" alt="Foto del Andrea" width={256} height={256} className="w-full h-full object-cover border border-gray-200" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-black">María Andrea Gonzalez</h3>
            <p className="text-md text-black mb-3">Fundador/Diseñador Principal</p>
            <p className="text-sm text-black leading-relaxed">
              Con 10 años de experiencia, María Andrea Gonzalez lidera nuestro equipo con una visión innovadora y un enfoque centrado en el cliente.
              Su pasión por el diseño se refleja en cada proyecto, buscando siempre soluciones creativas y funcionales.
            </p>
          </div>

          {/* Placeholder for Team Member 2 */}
          <div className="team-member flex flex-col items-center text-center p-8 bg-gray-400 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="w-32 h-32 rounded-full mb-4 overflow-hidden">
              <Image src="/images/0000 - Public Serendipity Site v2/Eliana.jpeg" alt="Foto del Eliana" width={128} height={128} className="w-full h-full object-cover border border-gray-200" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-black">Eliana Ucín</h3>
            <p className="text-md text-black mb-3">Fundador/Diseñador Principal</p>
            <p className="text-sm text-black leading-relaxed">
              Con 10 años de experiencia, Eliana Ucín aporta una gran experiencia y conocimiento técnico a nuestros proyectos.
              Su habilidad para combinar estética y funcionalidad garantiza resultados excepcionales.
            </p>
          </div>

          {/* Add more team member placeholders as needed */}
        </div>
      </section>
    </div>
    </div>
  );
};

export default AboutUsPage;