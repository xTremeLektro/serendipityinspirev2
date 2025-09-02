import React from 'react';
import Image from "next/image";
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const AboutUsPage: React.FC = () => {
  return (
    <main className={`${inter.variable} font-sans bg-slate-50 text-slate-800`}>
      <div className="container mx-auto px-4 py-16">

        {/* --- Page Header --- */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-slate-900">Sobre Nosotros</h1>
          <p className="text-lg text-slate-600 mt-2 max-w-2xl mx-auto">Conoce la pasión y la creatividad detrás de nuestros diseños.</p>
        </div>

        {/* --- Our Company Section --- */}
        <section className="mb-20">
          <div className="grid md:grid-cols-5 gap-12 items-center">
            <div className="md:order-2 md:col-span-2">
              <Image 
                src="/images/0000 - Public Serendipity Site v2/photo-output.PNG"
                alt="Nuestra Empresa"
                width={800}
                height={600}
                className="rounded-lg shadow-xl object-cover w-full h-full"
              />
            </div>
            <div className="md:order-1 md:col-span-3">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">Nuestra Empresa</h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                En Serendipity Inspire ©, nos apasiona transformar espacios y crear ambientes que inspiren y funcionen a la perfección para quienes los habitan.
                Creemos que el diseño interior va más allá de la estética; se trata de mejorar la calidad de vida y reflejar la esencia de cada persona o marca.
                Con gran experiencia en el sector, ofrecemos soluciones de diseño interior innovadoras y personalizadas para hogares y negocios.
                Nuestro enfoque se basa en la escucha activa, la creatividad y la atención al detalle para convertir tus sueños en realidad.
              </p>
            </div>
          </div>
        </section>

        {/* --- Our Team Section --- */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900">Nuestro Equipo</h2>
            <p className="text-lg text-slate-600 mt-2 max-w-2xl mx-auto">Profesionales apasionados y dedicados a la excelencia.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            
            {/* --- Team Member 1 --- */}
            <div className="bg-white rounded-lg shadow-lg p-8 text-center transform hover:-translate-y-2 transition-transform duration-300">
              <div className="w-40 h-40 rounded-full mb-6 mx-auto overflow-hidden border-4 border-slate-100">
                <Image src="/images/0000 - Public Serendipity Site v2/Andrea.jpeg" alt="Foto de María Andrea Gonzalez" width={256} height={256} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">María Andrea Gonzalez</h3>
              <p className="text-md text-[#E67E22] font-semibold mb-3">Fundadora / Diseñadora Principal</p>
              <p className="text-slate-600 leading-relaxed">
                Con 10 años de experiencia, María Andrea lidera nuestro equipo con una visión innovadora y un enfoque centrado en el cliente.
              </p>
            </div>

            {/* --- Team Member 2 --- */}
            <div className="bg-white rounded-lg shadow-lg p-8 text-center transform hover:-translate-y-2 transition-transform duration-300">
              <div className="w-40 h-40 rounded-full mb-6 mx-auto overflow-hidden border-4 border-slate-100">
                <Image src="/images/0000 - Public Serendipity Site v2/Eliana.jpeg" alt="Foto de Eliana Ucín" width={256} height={256} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Eliana Ucín</h3>
              <p className="text-md text-[#E67E22] font-semibold mb-3">Fundadora / Diseñadora Principal</p>
              <p className="text-slate-600 leading-relaxed">
                Eliana aporta una gran experiencia y conocimiento técnico a nuestros proyectos, garantizando resultados excepcionales.
              </p>
            </div>

          </div>
        </section>

      </div>
    </main>
  );
};

export default AboutUsPage;
