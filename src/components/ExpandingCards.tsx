"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';

const ExpandingCards: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0); // First panel is active by default
  const [cards, setCards] = useState<{ title: string; imageUrl: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCards = async () => {
      const supabase = createClient();
      setLoading(true);
      setError(null);
      console.log('Fetching data from pic_carrousel...');
      const { data, error } = await supabase
        .from('pic_carrousel')
        .select('short_desc, picture, ord')
        .order('ord', { ascending: true });

      console.log('Supabase data response:', data);
      console.log('Supabase error response:', error);

      if (error) {
        console.error('Error fetching carousel data:', error);
        setError('Failed to load carousel images.');
        setLoading(false);
        return;
      }

      const mappedCards = data.map((item) => ({
        title: item.short_desc,
        imageUrl: item.picture,
      }));
      console.log('Mapped cards:', mappedCards);
      setCards(mappedCards);
      setLoading(false);
    };

    fetchCards();
  }, []); // Empty dependency array to run only once on mount

  useEffect(() => {
    if (cards.length > 0) {
      const timer = setTimeout(() => {
        setActiveIndex((activeIndex + 1) % cards.length);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [activeIndex, cards]);

  const handlePanelClick = (index: number) => {
    setActiveIndex(index);
  };

  if (loading) {
    return <div className="text-center py-12">Cargando imágenes...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">Error: {error}</div>;
  }

  if (cards.length === 0) {
    return <div className="text-center py-12">No hay imágenes para mostrar.</div>;
  }

  return (
    <section className="py-12 bg-white">
      <div className="expanding-cards-container">
        {cards.map((card, index) => (
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

