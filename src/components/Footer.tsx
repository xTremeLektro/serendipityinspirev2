import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <div className="container mx-auto">
      <section className="py-12 px-8 bg-white text-gray-800">
        <footer className="bg-gray-900 text-gray-400 py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* About Section - Centered content */}
              <div className="mb-6 md:mb-0">
                <img src="/home/user/serendipityinspirev2/src/app/images/photo-output.PNG" alt="Imagen Logo Serendipity" className="h-10"/>
                <h2 className="text-lg font-semibold text-white mb-4">Sobre Nosotros</h2>
                <p>
                  Creando espacios únicos que inspiran.
                </p> {/* Added dark mode text color here */}
              </div>

              {/* Quick Links - Centered content */}
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

              {/* Contact Information - Centered content */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-4">Contacto</h4>
                <p className="mb-2"><i className="fas fa-map-marker-alt w-4 mr-2"></i> Vitacura, Santiago, Chile</p> {/* Added dark mode text color here */}
                <p className="mb-2"><i className="fas fa-phone w-4 mr-2"></i> +56 9 1234 5678</p> {/* Added dark mode text color here */}
                <p className="mb-4"><i className="fas fa-envelope w-4 mr-2"></i> hola@serendipity.cl</p> {/* Added dark mode text color here */}
                <div className="flex space-x-4">
                    <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition duration-300"><i className="fab fa-instagram text-xl"></i></a>
                    <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition duration-300"><i className="fab fa-pinterest text-xl"></i></a>
                    <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition duration-300"><i className="fab fa-linkedin-in text-xl"></i></a>
                </div>
              </div>
            </div>

            {/* Footer Bottom */}
            <div className="bg-gray-800 text-white p-4 text-center">
              <p>&copy; 2025 Serendipity Interior Design. Todos los derechos reservados.</p>
            </div>

          </div>
        </footer>
      </section>
    </div>
  );
};

export default Footer;