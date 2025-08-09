import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto px-4">
      {/* Hero Section - Added dark: styles for text */}
      <section className="hero-section relative h-[60vh] flex items-center justify-center text-center text-white dark:text-gray-200 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url("https://via.placeholder.com/1920x1080?text=Interior+Design+Hero")' }}>
          <div className="absolute inset-0 bg-black opacity-50"></div> {/* Overlay */}
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fadeInUp">Diseño de Interiores que Inspira</h1>
          <p className="text-xl md:text-2xl mb-8 animate-fadeInUp delay-200">Transformamos tus espacios en lugares únicos y funcionales.</p>
          <div className="flex justify-center space-x-4">
            {/* Placeholder Images - Consider using actual Image components with proper aspect ratios */}
            <img src="https://via.placeholder.com/300x200?text=Hero+Image+1" alt="Imagen de Diseño Interior 1" className="w-1/4 rounded-lg shadow-lg transform transition duration-500 hover:scale-105"/>
            <img src="https://via.placeholder.com/300x200?text=Hero+Image+2" alt="Imagen de Diseño Interior 2" className="w-1/4 rounded-lg shadow-lg transform transition duration-500 hover:scale-105"/>
            <img src="https://via.placeholder.com/300x200?text=Hero+Image+3" alt="Imagen de Diseño Interior 3" className="w-1/4 rounded-lg shadow-lg transform transition duration-500 hover:scale-105"/>
          </div>
        </div>
      </section>

      {/* Project Previews */}
      <section className="py-12 dark:bg-gray-900 dark:text-white">
        <h2 className="text-3xl font-bold text-center mb-8 ">Nuestros Proyectos Destacados</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Placeholder Project Card 1 */}
          <div className="project-card border dark:border-gray-700 rounded-lg overflow-hidden shadow-lg dark:shadow-xl transform transition duration-300 hover:scale-105 hover:shadow-xl cursor-pointer dark:bg-gray-800">
            <img src="https://via.placeholder.com/400x300?text=Proyecto+1" alt="Imagen del Proyecto 1" className="w-full h-48 object-cover"/>
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2 dark:text-white">Nombre del Proyecto 1</h3>
 <p className="text-gray-600 dark:text-gray-300">Explora cómo transformamos este espacio con soluciones de diseño innovadoras y personalizadas.</p>
            </div>
          </div>
          {/* Placeholder Project Card 2 */}
          <div className="project-card border dark:border-gray-700 rounded-lg overflow-hidden shadow-lg dark:shadow-xl transform transition duration-300 hover:scale-105 hover:shadow-xl cursor-pointer dark:bg-gray-800">
            <img src="https://via.placeholder.com/400x300?text=Proyecto+2" alt="Imagen del Proyecto 2" className="w-full h-48 object-cover"/>
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2 dark:text-white">Nombre del Proyecto 2</h3>
 <p className="text-gray-600 dark:text-gray-300">Un vistazo a nuestro trabajo en este proyecto que combina estética y funcionalidad a la perfección.</p>
            </div>
          </div>
          {/* Placeholder Project Card 3 */}
          <div className="project-card border rounded-lg overflow-hidden shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
 <img src="https://via.placeholder.com/400x300?text=Proyecto+3" alt="Imagen del Proyecto 3" className="w-full h-48 object-cover"/>
           <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">Nombre del Proyecto 3</h3>
 <p className="text-gray-600 dark:text-gray-300">Descubre los detalles de este proyecto y cómo abordamos cada desafío de diseño.</p>
            </div>
          </div>
        </div>
        <div className="text-center mt-8">
          <Link href="/portfolio" className="text-blue-600 dark:text-blue-400 hover:underline text-xl">Ver Portfolio Completo</Link>
        </div>
      </section>

      {/* Call to Action for About Us */}
      <section className="py-12 text-center dark:bg-gray-900 dark:text-white">
        <h2 className="text-3xl font-bold mb-6 ">Conoce a Nuestro Equipo</h2>
        <p className="text-xl mb-8 ">Somos un equipo de apasionados por el diseño y comprometidos con la excelencia en cada proyecto.</p>
        <Link href="/about" className="text-blue-600 dark:text-blue-400 hover:underline text-xl">Sobre Nosotros</Link>
      </section>

      {/* Call to Action for Contact */}
      <section className="py-12 text-center bg-gray-100 dark:bg-gray-800 dark:text-white">
        <h2 className="text-3xl font-bold mb-6 ">Comencemos Tu Proyecto</h2>
        <p className="text-xl mb-8 ">Contáctanos para una consulta o para suscribirte a nuestro boletín.</p>
        <Link href="/contact" className="bg-blue-600 text-white px-6 py-3 rounded-full text-lg hover:bg-blue-700">Contáctanos</Link>
      </section>

      {/* Call to Action for Services */}
      <section className="py-12 text-center bg-gray-100">
        <h2 className="text-3xl font-bold mb-6">Descubre Nuestros Servicios</h2>
        <p className="text-xl mb-8">Ofrecemos soluciones completas para tus proyectos de diseño de interiores.</p>
        <Link href="/services" className="bg-blue-600 text-white px-6 py-3 rounded-full text-lg hover:bg-blue-700">Explorar Servicios</Link>
      </section>
    </div>
  );
}
