"use client";

import { useState } from 'react';

// Data for the cards. You can easily update the titles and image paths here.
// Make sure your images are in the `public/images/` directory.
const cardData = [
  {
    title: 'Espacios Modernos y Funcionales',
    imageUrl: '/images/0000 - Public Serendipity Site v2/carrousel1.jpg'
  },
  {
    title: 'Detalles que Inspiran',
    imageUrl: '/images/0000 - Public Serendipity Site v2/carrousel2.jpg'
  },
  {
    title: 'Perfecta Armonía',
    imageUrl: '/images/0000 - Public Serendipity Site v2/carrousel3.jpg'
  },
  {
    title: 'Espacios para Compartir',
    imageUrl: '/images/0000 - Public Serendipity Site v2/carrousel4.jpg'
  },
  {
    title: 'Adornos que Embellecen',
    imageUrl: '/images/0000 - Public Serendipity Site v2/carrousel5.jpg'
  }
];

const ExpandingCards: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0); // First panel is active by default

  const handlePanelClick = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <section className="py-12 bg-white">
      <div className="expanding-cards-container">
        {cardData.map((card, index) => (
          <div
            key={index}
            className={`expanding-panel ${activeIndex === index ? 'active' : ''}`}
            style={{ backgroundImage: `url('${card.imageUrl}')` }}
            onClick={() => handlePanelClick(index)}
          >
            <h3>{card.title}</h3>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ExpandingCards;

