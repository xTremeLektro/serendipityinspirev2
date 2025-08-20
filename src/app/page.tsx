import Image from "next/image";
import Link from "next/link";
import ExpandingCards from "@/components/ExpandingCards";
import { Edu_NSW_ACT_Cursive } from 'next/font/google';

// Initialize the font for the Hero Section.
const eduNSW = Edu_NSW_ACT_Cursive({
  weight: ['400', '700'], // You can specify the weights you need
  fallback: ['system-ui', 'sans-serif'],
});

export default function Home() {
  return (
    <>
      <div className="bg-white">
        <br />
      </div>
      <div className="container mx-auto bg-black text-white rounded-lg">
        {/* Hero Section */}
        <section className="flex items-center justify-center text-center rounded-lg">
          <div className={`relative ${eduNSW.className}`}>
            <br />
            <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fadeInUp">Diseño de Interiores que Inspira</h1>
            <p className="text-xl md:text-2xl animate-fadeInUp delay-200">Transformamos tus espacios en lugares únicos y funcionales.</p>
            <br />
          </div>
        </section>

        {/* Expanding Cards Section */}
        <ExpandingCards />

        {/* Project Previews */}
        <section className="flex items-center justify-center text-center">
          <div className={`rounded-lg relative ${eduNSW.className}`}>
            <br />
            <p className="text-xl md:text-2xl font-bold animate-fadeInUp delay-200">Nuestros Proyectos Destacados</p>
            <br />
          </div>
        </section>
        <section className="py-12 bg-white text-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Placeholder Project Card 1 */}
            <div className="project-card border border-gray-200 rounded-lg overflow-hidden shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl cursor-pointer bg-white">
              <Image
                src="/images/0000 - Public Serendipity Site v2/carrousel1.jpg"
                alt="Imagen del Proyecto 1"
                width={400}
                height={300}
                className="w-full h-48 object-cover"
                style={{ objectFit: "cover" }} />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">Nombre del Proyecto 1</h3>
                <p className="text-gray-600">Explora cómo transformamos este espacio con soluciones de diseño innovadoras y personalizadas.</p>
              </div>
            </div>
            {/* Placeholder Project Card 2 */}
            <div className="project-card border border-gray-200 rounded-lg overflow-hidden shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl cursor-pointer bg-white">
              <Image
                src="/images/0000 - Public Serendipity Site v2/carrousel2.jpg"
                alt="Imagen del Proyecto 2"
                width={400}
                height={300}
                className="w-full h-48 object-cover"
                style={{ objectFit: "cover" }} />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">Nombre del Proyecto 2</h3>
                <p className="text-gray-600">Un vistazo a nuestro trabajo en este proyecto que combina estética y funcionalidad a la perfección.</p>
              </div>
            </div>
            {/* Placeholder Project Card 3 */}
            <div className="project-card border border-gray-200 rounded-lg overflow-hidden shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl cursor-pointer bg-white">
              <Image
                src="/images/0000 - Public Serendipity Site v2/carrousel3.jpg"
                alt="Imagen del Proyecto 3"
                width={400}
                height={300}
                className="w-full h-48 object-cover"
                style={{ objectFit: "cover" }} />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">Nombre del Proyecto 3</h3>
                <p className="text-gray-600">Descubre los detalles de este proyecto y cómo abordamos cada desafío de diseño.</p>
              </div>
            </div>
          </div>
          <div className="text-center mt-8">
            <Link href="/portfolio" className="bg-blue-600 text-white px-6 py-3 rounded-full text-lg hover:bg-blue-700">Ver Portfolio Completo</Link>
          </div>
        </section>

        {/* Call to Action for About Us */}
        <section className="py-12 text-center bg-gray-100 text-black">
          <h2 className="text-3xl font-bold mb-6 ">Conoce a Nuestro Equipo</h2>
          <p className="text-xl mb-8 ">Somos un equipo de apasionados por el diseño y comprometidos con la excelencia en cada proyecto.</p>
          <Link href="/about" className="bg-blue-600 text-white px-6 py-3 rounded-full text-lg hover:bg-blue-700">Sobre Nosotros</Link>
        </section>

        {/* Call to Action for Services */}
        <section className="py-12 text-center bg-white text-black">
          <h2 className="text-3xl font-bold mb-6 ">Descubre Nuestros Servicios</h2>
          <p className="text-xl mb-8">Ofrecemos soluciones completas para tus proyectos de diseño de interiores.</p>
          <Link href="/services" className="bg-blue-600 text-white px-6 py-3 rounded-full text-lg hover:bg-blue-700">Explorar Servicios</Link>
        </section>

        {/* Call to Action for Contact */}
        <section className="py-12 text-center bg-gray-100 text-black rounded-b-lg">
          <h2 className="text-3xl font-bold mb-6">Comencemos Tu Proyecto</h2>
          <p className="text-xl mb-8">Contáctanos para una consulta o para suscribirte a nuestro boletín.</p>
          <Link href="/contact" className="bg-blue-600 text-white px-6 py-3 rounded-full text-lg hover:bg-blue-700">Contáctanos</Link>
        </section>
      </div>

      <div className="bg-white">
        <br />
      </div>
    </>
  );
}
