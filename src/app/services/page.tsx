import React, { FC, useMemo } from 'react';
import Image from "next/image";
import { getServicesWithHeadPics } from '@/lib/services';
import { getGeneralFAQs } from '@/lib/faq';
import FAQSection from '@/components/FAQSection';
import { generateHTML } from '@tiptap/html';
import { JSONContent } from '@tiptap/react';
import { getTiptapExtensions } from '@/lib/tiptap';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const TiptapRenderer: FC<{ content: JSONContent | string | null }> = ({ content }) => {
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

const ServicesPage: React.FC = async () => {
  const services = await getServicesWithHeadPics();
  const generalFAQs = await getGeneralFAQs();

  return (
    <main className={`${inter.variable} font-sans bg-slate-50 text-slate-800`}>
      <div className="container mx-auto px-4 py-16">

        {/* --- Page Header --- */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-slate-900">Nuestros Servicios</h1>
          <p className="text-lg text-slate-600 mt-2 max-w-2xl mx-auto">Soluciones a medida para transformar tus espacios.</p>
        </div>

        {/* --- Services List --- */}
        <div className="space-y-20">
          {services.map((service, index) => (
            <section key={service.id} className="bg-white p-8 rounded-lg shadow-lg overflow-hidden">
              <div className={`flex flex-col md:flex-row items-center gap-8 ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''} justify-between`}>
                
                {/* --- Image --- */}
                <div className="md:w-1/3">
                  {service.head_pic_url && (
                    <Image
                      src={service.head_pic_url}
                      alt={service.service_name}
                      className="rounded-lg object-cover w-full h-full shadow-md"
                      width={800}
                      height={600}
                      priority
                    />
                  )}
                </div>

                {/* --- Description --- */}
                <div className="md:w-1/2">
                  <h2 className="text-4xl font-bold text-slate-900 mb-4">{service.service_name}</h2>
                  <div className="service-description">
                    <TiptapRenderer content={service.service_desc} />
                  </div>
                </div>

              </div>
            </section>
          ))}
        </div>

      </div>

      {/* --- FAQ Section --- */}
      <FAQSection faqs={generalFAQs} />

    </main>
  );
};

export default ServicesPage;