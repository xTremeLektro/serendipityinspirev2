"use client";

import React, { useState } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { Edu_NSW_ACT_Cursive } from 'next/font/google';

// Initialize the font for the Hero Section.
const eduNSW = Edu_NSW_ACT_Cursive({
  weight: ['400', '700'], // You can specify the weights you need
  fallback: ['cursive'],
});

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs: FAQ[];
}

const FAQSection: React.FC<FAQSectionProps> = ({ faqs }) => {
  const [openFAQId, setOpenFAQId] = useState<string | null>(null);

  const toggleFAQ = (id: string) => {
    setOpenFAQId(openFAQId === id ? null : id);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className='bg-black text-white rounded-lg mb-8'>
        <br />
        <h2 className={`text-4xl md:text-5xl font-bold text-center ${eduNSW.className}`}>Preguntas Frecuentes</h2>
        <br />
      </div>
      <div className="space-y-4">
        {faqs.map((faq) => (
          <div key={faq.id} className="bg-white p-6 rounded-lg shadow-md">
            <button
              className="w-full flex justify-between items-center text-left focus:outline-none"
              onClick={() => toggleFAQ(faq.id)}
            >
              <span className="text-xl font-semibold text-gray-800">{faq.question}</span>
              {openFAQId === faq.id ? (
                <FaMinus className="text-gray-600" />
              ) : (
                <FaPlus className="text-gray-600" />
              )}
            </button>
            {openFAQId === faq.id && (
              <p className="mt-4 text-lg text-gray-700">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQSection;
