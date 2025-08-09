"use client";

import { useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import SandwichMenu from "../components/SandwichMenu";
import Link from "next/link"; // Assuming you'll need Link within this component for navigation
import { usePathname } from "next/navigation";

interface LayoutClientProps {
  children: React.ReactNode;
}

const LayoutClient: React.FC<LayoutClientProps> = ({ children }) => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {

    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-4 flex justify-between items-center">
        {/* Sandwich Menu Button - Moved to the left */}
        <div className="md:hidden">
          <button onClick={toggleMenu}>
            <SandwichMenu />
          </button>
        </div>
        <div className="hidden md:flex space-x-4">
          <Link href="/" className={pathname === '/' ? 'font-bold' : ''}>Inicio</Link>
          <Link href="/portfolio" className={pathname === '/portfolio' ? 'font-bold' : ''}>Portafolio</Link>
          <Link href="/services" className={pathname === '/services' ? 'font-bold' : ''}>Servicios</Link>
          <Link href="/about" className={pathname === '/about' ? 'font-bold' : ''}>Sobre Nosotros</Link>
          <Link href="/contact" className={pathname === '/contact' ? 'font-bold' : ''}>Contacto</Link>
        </div>
        <ThemeToggle />
      </header>

      {isMenuOpen && (
        <nav className="md:hidden bg-gray-200 dark:bg-gray-700 p-4 z-50">
          <ul className="flex flex-col space-y-2">
            <li>
              <Link href="/" onClick={toggleMenu} className={pathname === '/' ? 'font-bold' : ''}>
                Inicio
              </Link>
            </li>
            <li>
              <Link href="/portfolio" onClick={toggleMenu} className={pathname === '/portfolio' ? 'font-bold' : ''}>
                Portafolio
              </Link>
            </li>
            <li>
              <Link href="/services" onClick={toggleMenu} className={pathname === '/services' ? 'font-bold' : ''}>
                Servicios
              </Link>
            </li>
            <li>
              <Link href="/about" onClick={toggleMenu} className={pathname === '/about' ? 'font-bold' : ''}>
                Sobre Nosotros
              </Link>
            </li>
            <li>
              <Link href="/contact" onClick={toggleMenu} className={pathname === '/contact' ? 'font-bold' : ''}>
                Contacto
              </Link>
            </li>
          </ul>
        </nav>
      )}

      <main className="flex-grow">{children}</main>

      <footer className="bg-gray-800 dark:bg-gray-900 text-white p-4 text-center">
        <p>&copy; 2023 Interior Design. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default LayoutClient;