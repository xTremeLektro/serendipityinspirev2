import React from 'react';
import Image from "next/image";
import { Edu_NSW_ACT_Cursive } from 'next/font/google';

// Initialize the font for the Hero Section.
const eduNSW = Edu_NSW_ACT_Cursive({
  weight: ['400', '700'], // You can specify the weights you need
});

const ServicesPage: React.FC = () => {
  // Content based on http://127.0.0.1:5500/main/index.html and http://127.0.0.1:5500/main/dise%C3%B1o-interior-integral.html
  return (
 <div className="bg-white text-black">
    <div className="container mx-auto px-4 py-8 services-container service-card">
      <div className='bg-black text-white rounded-lg'>
        <br />
        <h1 className={`text-4xl md:text-5xl font-bold text-center ${eduNSW.className}`}>Nuestros Servicios</h1>
        <br />
      </div>
      <section className="mb-16 service-section bg-white p-6 rounded-lg shadow-md">
        <h2 className={`text-3xl font-semibold mb-6 service-subtitle service-card ${eduNSW.className}`}>Diseño Interior Integral</h2>
        <div className="flex flex-col md:flex-row items-center service-content">
          <div className="md:w-1/2 md:pr-8 mb-6 md:mb-0 flex justify-center service-image-container">
            <Image
              src="/images/0000 - Public Serendipity Site v2/carrousel1.jpg"
              alt="Diseño Interior Integral"
              className="rounded-lg shadow-lg w-full h-auto service-image"
              width={800}
              height={600}
              priority
            />
          </div>
          <div className="md:w-1/2 service-description">
            <p className="text-lg text-gray-700 mb-4 service-paragraph">
 Nos encargamos de transformar tus espacios desde la concepción hasta la materialización. Nuestro servicio de diseño interior integral abarca todas las etapas del proyecto para garantizar un resultado coherente, funcional y estéticamente atractivo que refleje tu
              personalidad y cumpla con tus necesidades.
            </p>
            <h3 className="text-2xl font-semibold mb-4 service-list-title">¿Qué incluye?</h3>
            <ul className="list-disc list-inside text-gray-700 service-list">
              <li>Análisis de necesidades y estudio del espacio.</li>
              <li>Desarrollo de concepto e ideas preliminares.</li>
              <li>Planos de distribución y zonificación.</li>
              <li>Selección de materiales, acabados y mobiliario.</li>
              <li>Diseño de iluminación y detalles técnicos.</li>
              <li className="service-list-item">Gestión y supervisión del proyecto.</li>
              <li>Entrega y asesoramiento final.</li>
            </ul>
          </div>
        </div>
      </section>
 
      <section className="mb-16 service-section bg-white p-6 rounded-lg shadow-md">
        <h2 className={`text-3xl font-semibold mb-6 service-subtitle service-card ${eduNSW.className}`}>Consultoría de Diseño</h2>
        <div className="flex flex-col md:flex-row-reverse items-center service-content">
          <div className="md:w-1/2 md:pl-8 mb-6 md:mb-0 flex justify-center service-image-container">
            <Image
              src="/images/0000 - Public Serendipity Site v2/carrousel4.jpg"
              alt="Consultoría de Diseño"
              className="rounded-lg shadow-lg w-full h-auto service-image"
              width={800}
              height={600}
              priority
            />
          </div>
          <div className="md:w-1/2">
            <p className="text-lg text-gray-700 mb-4">
 Si buscas orientación profesional para tu proyecto de diseño, nuestra consultoría es la opción ideal. Te brindamos asesoramiento experto en áreas específicas, ayudándote a tomar decisiones informadas
              y a resolver dudas sobre distribución, color, mobiliario, materiales o cualquier otro aspecto
              de tu espacio.
            </p>
            <h3 className="text-2xl font-semibold mb-4 service-list-title">Ideal para:</h3>
            <ul className="list-disc list-inside text-gray-700 service-list">
              <li>Quienes desean renovar su espacio por sí mismos pero necesitan asesoramiento profesional.</li>
              <li>Definir un estilo o paleta de colores.</li>
              <li>Optimizar la distribución de un espacio.</li>
              <li>Seleccionar mobiliario y complementos.</li>
              <li>Resolver problemas específicos de diseño.</li>
            </ul>
          </div>
        </div>
      </section>
 
      <section className="service-section bg-white p-6 rounded-lg shadow-md">
        <h2 className={`text-3xl font-semibold mb-6 service-subtitle service-card ${eduNSW.className}`}>Diseño de Mobiliario a Medida</h2>
        <div className="flex flex-col md:flex-row items-center service-content">
          <div className="md:w-1/2 md:pr-8 mb-6 md:mb-0 flex justify-center service-image-container">
            <Image
              src="/images/0000 - Public Serendipity Site v2/carrousel5.jpg"
              alt="Diseño de Mobiliario a Medida"
              className="rounded-lg shadow-lg w-full h-auto service-image"
              width={800}
              height={600}
              priority
            />
          </div>
          <div className="md:w-1/2">
            <p className="text-lg text-gray-700 mb-4">
 Creamos piezas de mobiliario únicas y funcionales, diseñadas específicamente para tu espacio y tus necesidades. Desde armarios empotrados hasta muebles singulares, nuestro servicio de
              diseño a medida garantiza soluciones personalizadas que maximizan el aprovechamiento del
              espacio y reflejan tu estilo.
            </p>
            <h3 className="text-2xl font-semibold mb-4 service-list-title">Ofrecemos:</h3>
            <ul className="list-disc list-inside text-gray-700 service-list">
              <li>Diseño de mobiliario integrado y funcional.</li>
              <li>Selección de materiales de alta calidad.</li>
              <li>Creación de piezas únicas y personalizadas.</li>
              <li>Optimización del espacio disponible.</li>
              <li>Colaboración con artesanos y fabricantes.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
    </div>
  );
};

export default ServicesPage;