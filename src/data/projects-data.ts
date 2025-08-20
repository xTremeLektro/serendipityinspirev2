export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  details: {
    location: string;
    area: string;
    year: string;
    style: string;
    longDescription: string;
  };
  detailImages: {
    src: string;
    alt: string;
  }[];
}

export const projects: Project[] = [
  {
    id: 'proyecto-residencial-moderno',
    title: 'Proyecto Residencial Moderno',
    description: 'Un diseño innovador que fusiona líneas limpias y funcionalidad...',
    imageUrl: '/images/0000 - Public Serendipity Site v2/carrousel1.jpg',
    imageAlt: 'Imagen de un moderno salón con grandes ventanales.',
    details: {
      location: 'Madrid, España',
      area: '150 m²',
      year: '2023',
      style: 'Moderno y Minimalista',
      longDescription: 'Este es un espacio para la descripción detallada del proyecto. Aquí se puede incluir información sobre el concepto, los desafíos, y el resultado final. Este proyecto se centró en maximizar la luz natural y crear un flujo abierto entre los espacios de vida, utilizando una paleta de colores neutros y materiales de alta calidad para un acabado lujoso y atemporal.',
    },
    detailImages: Array.from({ length: 10 }, (_, i) => ({
      src: `https://via.placeholder.com/800x600?text=Residencial+${i + 1}`,
      alt: `Imagen ${i + 1} del proyecto residencial moderno`,
    })),
  },
  {
    id: 'reforma-oficina-creativa',
    title: 'Reforma de Oficina Creativa',
    description: 'Transformamos un espacio de trabajo convencional en un entorno vibrante...',
    imageUrl: '/images/0000 - Public Serendipity Site v2/carrousel2.jpg',
    imageAlt: 'Imagen de un área de coworking colorida y moderna.',
    details: {
      location: 'Barcelona, España',
      area: '300 m²',
      year: '2022',
      style: 'Industrial y Vibrante',
      longDescription: 'La transformación de esta oficina buscaba fomentar la creatividad y la colaboración. Se utilizaron paredes de cristal, espacios abiertos y mobiliario modular para permitir flexibilidad. Los toques de color y las obras de arte locales añaden un carácter único que inspira a los empleados cada día.',
    },
    detailImages: Array.from({ length: 8 }, (_, i) => ({
      src: `https://via.placeholder.com/800x600?text=Oficina+${i + 1}`,
      alt: `Imagen ${i + 1} de la reforma de oficina creativa`,
    })),
  },
  // ... Add the rest of your projects here following the same structure
  {
    id: 'diseño-local-comercial',
    title: 'Diseño de Local Comercial',
    description: 'Desarrollamos un concepto de diseño único para esta tienda de moda...',
    imageUrl: '/images/0000 - Public Serendipity Site v2/carrousel3.jpg',
    imageAlt: 'Imagen del interior de una tienda de ropa con un diseño elegante.',
    details: {
      location: 'Valencia, España',
      area: '120 m²',
      year: '2023',
      style: 'Elegante y Contemporáneo',
      longDescription: 'El diseño de esta boutique de moda se centra en crear una experiencia de compra de lujo. Se utilizaron materiales como el mármol, el latón y el terciopelo para crear un ambiente sofisticado. La iluminación estratégica resalta las prendas y crea un recorrido visual atractivo para los clientes.',
    },
    detailImages: Array.from({ length: 6 }, (_, i) => ({
      src: `https://via.placeholder.com/800x600?text=Tienda+${i + 1}`,
      alt: `Imagen ${i + 1} del diseño de local comercial`,
    })),
  },
];