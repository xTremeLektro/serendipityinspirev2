import React from 'react';
import Link from 'next/link';

// The path should be relative to the `public` directory.
import Image from 'next/image';
import { Edu_NSW_ACT_Cursive } from 'next/font/google';
const logoImage = '/images/photo-output.PNG';

const eduNSW = Edu_NSW_ACT_Cursive({
  weight: ['400', '700'], // You can specify the weights you need
  fallback: ['cursive'],
});

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div className="mb-6 md:mb-0">
            <Image
              src={logoImage}
              alt="Imagen Logo Serendipity"
              width={160} // Provide an appropriate width based on your image's aspect ratio
              height={40}
              className="h-10 w-auto mb-4"
            />
            <p className={`${eduNSW.className}`}>
              Creando espacios únicos que inspiran.
            </p>
          </div>

          {/* Quick Links */}
          <div className="mb-6 md:mb-0">
            <h2 className="text-lg font-semibold text-white mb-4">Enlaces Rápidos</h2>
            <ul>
              <li className="mb-2">
                <Link href="/" className="hover:text-white transition duration-300">
                  Inicio
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/portfolio" className="hover:text-white transition duration-300">
                  Portafolio
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/services" className="hover:text-white transition duration-300">
                  Servicios
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/about" className="hover:text-white transition duration-300">
                  Sobre Nosotros
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/contact" className="hover:text-white transition duration-300">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contacto</h4>
            <p className="mb-2"><i className="fas fa-map-marker-alt w-4 mr-2"></i> Vitacura, Santiago, Chile</p>
            <p className="mb-2"><i className="fas fa-phone w-4 mr-2"></i> +56 9 1234 5678</p>
            <p className="mb-4"><i className="fas fa-envelope w-4 mr-2"></i> hola@serendipity.cl</p>
            <div className="flex space-x-4">
                <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition duration-300"><i className="fab fa-instagram text-xl"></i></a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition duration-300"><i className="fab fa-pinterest text-xl"></i></a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition duration-300"><i className="fab fa-linkedin-in text-xl"></i></a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-8 border-t border-gray-700 pt-8 text-center">
          <p>&copy; 2025 Serendipity Interior Design. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;