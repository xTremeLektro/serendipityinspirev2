'use client';

import React, { useState, useMemo } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { generateHTML } from '@tiptap/core';
import { JSONContent } from '@tiptap/react';
import { getTiptapExtensions } from '@/lib/tiptap';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

interface FAQ {
  id: string;
  question: string;
  answer: JSONContent;
}

interface FAQSectionProps {
  faqs: FAQ[];
}

const TiptapRenderer: React.FC<{ content: JSONContent | string | null }> = ({ content }) => {
  const output = useMemo(() => {
    if (!content) {
      return '';
    }

    let tiptapContent = content;

    if (typeof tiptapContent === 'string') {
      try {
        tiptapContent = JSON.parse(tiptapContent);
      } catch {
        return tiptapContent;
      }
    }

    if (typeof tiptapContent === 'object' && tiptapContent?.type === 'doc') {
      return generateHTML(tiptapContent, getTiptapExtensions());
    }

    if (typeof content === 'string') return content;
    return JSON.stringify(content);

  }, [content]);

  return <div dangerouslySetInnerHTML={{ __html: output }} className="prose prose-lg max-w-none text-slate-600 [&_p:empty]:after:content-['\00a0']" />;
};

const FAQSection: React.FC<FAQSectionProps> = ({ faqs }) => {
  const [openFAQId, setOpenFAQId] = useState<string | null>(null);

  const toggleFAQ = (id: string) => {
    setOpenFAQId(openFAQId === id ? null : id);
  };

  return (
    <section className={`${inter.variable} font-sans bg-white py-20`}>
      <div className="container mx-auto px-4">
        
        {/* --- Section Header --- */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900">Preguntas Frecuentes</h2>
          <p className="text-lg text-slate-600 mt-2 max-w-2xl mx-auto">Encuentra respuestas a las dudas más comunes sobre nuestros servicios.</p>
        </div>

        {/* --- Accordion --- */}
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq) => (
            <div key={faq.id} className="border border-slate-200 rounded-lg overflow-hidden">
              <button
                className="w-full flex justify-between items-center p-6 text-left focus:outline-none bg-slate-50 hover:bg-slate-100 transition-colors"
                onClick={() => toggleFAQ(faq.id)}
              >
                <span className="text-xl font-semibold text-slate-800">{faq.question}</span>
                {openFAQId === faq.id ? (
                  <FaMinus className="text-slate-600" />
                ) : (
                  <FaPlus className="text-slate-600" />
                )}
              </button>
              {openFAQId === faq.id && (
                <div className="p-6 bg-white">
                  <TiptapRenderer content={faq.answer} />
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FAQSection;