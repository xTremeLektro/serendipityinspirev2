"use client";

import { useState } from "react";

import SandwichMenu from "../components/SandwichMenu";
import Link from "next/link"; // Assuming you'll need Link within this component for navigation
import { usePathname } from "next/navigation";
import { Mulish } from 'next/font/google';

// The path should be relative to the `public` directory.
import Image from 'next/image';
const logoImage = '/images/photo-output.PNG';

// Initialize the font, specifying subsets and other options.
const mulish = Mulish({
  subsets: ['latin'],
  display: 'swap', // This is the default and ensures text is visible while the font loads
});

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
 <div className={`min-h-screen flex flex-col ${mulish.className}`}>
      <header className="bg-gray-900 text-white shadow-md p-4 flex justify-between items-center">
        <nav id="nav" className={`relative flex items-center ${isMenuOpen ? 'active' : ''}`}>
          <button className="icon" onClick={toggleMenu}>
            <SandwichMenu />
          </button>
          <ul className="flex space-x-4">
            <li><Link href="/" className={pathname === '/' ? 'font-bold' : ''}>Inicio</Link></li>
            <li><Link href="/portfolio" className={pathname === '/portfolio' ? 'font-bold' : ''}>Portafolio</Link></li>
            <li><Link href="/services" className={pathname === '/services' ? 'font-bold' : ''}>Servicios</Link></li>
            <li><Link href="/about" className={pathname === '/about' ? 'font-bold' : ''}>Sobre Nosotros</Link></li>
            <li><Link href="/contact" className={pathname === '/contact' ? 'font-bold' : ''}>Contacto</Link></li>
          </ul>
        </nav>
          <Image
            src={logoImage}
            alt="Imagen Logo Serendipity"
            width={160}
            height={40}
            className="h-10 w-auto"
          />
      </header>

      <main className="flex-grow">{children}</main>

    </div>
  );
};

export default LayoutClient;