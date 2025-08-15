import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-8 dark:bg-black dark:text-gray-300">
      <div className="container mx-auto px-4 dark:bg-black">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div className="mb-6 md:mb-0">
            <h2 className="text-lg font-semibold text-white mb-4 dark:text-white">Sobre Nosotros</h2>
            <p>
              Creando espacios únicos que inspiran.
            </p> {/* Added dark mode text color here */}
          </div>

          {/* Quick Links */}
          <div className="mb-6 md:mb-0">
            <h2 className="text-lg font-semibold text-white mb-4">Enlaces Rápidos</h2>
            <ul>
              <li className="mb-2">
                <Link href="/" className="hover:text-white transition duration-300">
                  Inicio {/* Added dark mode text color here */}
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/portfolio" className="hover:text-white transition duration-300">
                  Portafolio {/* Added dark mode text color here */}
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/services" className="hover:text-white transition duration-300">
                  Servicios {/* Added dark mode text color here */}
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/about" className="hover:text-white transition duration-300">
                  Sobre Nosotros {/* Added dark mode text color here */}
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/contact" className="hover:text-white transition duration-300">
                  Contacto {/* Added dark mode text color here */}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4 dark:text-white">Contacto</h4>
            <p className="mb-2"><i className="fas fa-map-marker-alt w-4 mr-2 dark:text-gray-300"></i> Vitacura, Santiago, Chile</p> {/* Added dark mode text color here */}
            <p className="mb-2"><i className="fas fa-phone w-4 mr-2 dark:text-gray-300"></i> +56 9 1234 5678</p> {/* Added dark mode text color here */}
            <p className="mb-4"><i className="fas fa-envelope w-4 mr-2 dark:text-gray-300"></i> hola@serendipity.cl</p> {/* Added dark mode text color here */}
            <div className="flex space-x-4">
                <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition duration-300 dark:text-gray-400 dark:hover:text-white"><i className="fab fa-instagram text-xl"></i></a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition duration-300 dark:text-gray-400 dark:hover:text-white"><i className="fab fa-pinterest text-xl"></i></a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition duration-300 dark:text-gray-400 dark:hover:text-white"><i className="fab fa-linkedin-in text-xl"></i></a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="bg-gray-800 dark:bg-gray-900 text-white p-4 text-center">
          <p>&copy; 2025 Serendipity Interior Design. Todos los derechos reservados.</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;