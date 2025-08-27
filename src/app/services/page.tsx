import React from 'react';
import Image from "next/image";
import { Edu_NSW_ACT_Cursive } from 'next/font/google';
import { getServicesWithHeadPics } from '@/lib/services';
import { getGeneralFAQs } from '@/lib/faq';
import FAQSection from '@/components/FAQSection';

// Initialize the font for the Hero Section.
const eduNSW = Edu_NSW_ACT_Cursive({
  weight: ['400', '700'], // You can specify the weights you need
  fallback: ['cursive'],
});

const ServicesPage: React.FC = async () => {
  const services = await getServicesWithHeadPics();
  const generalFAQs = await getGeneralFAQs();

  return (
 <div className="bg-white text-black">
    <div className="container mx-auto px-4 py-8 services-container service-card">
      <div className='bg-black text-white rounded-lg'>
        <br />
        <h1 className={`text-4xl md:text-5xl font-bold text-center ${eduNSW.className}`}>Nuestros Servicios</h1>
        <br />
      </div>
      <br />
      {services.map((service, index) => (
        <section key={service.id} className="mb-16 service-section bg-white p-6 rounded-lg shadow-md">
          <h2 className={`text-3xl font-semibold mb-6 service-subtitle service-card ${eduNSW.className}`}>{service.service_name}</h2>
          <div className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center service-content`}>
            <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'} mb-6 md:mb-0 flex justify-center service-image-container`}>
              {service.head_pic_url && (
                <Image
                  src={service.head_pic_url}
                  alt={service.service_name}
                  className="rounded-lg shadow-lg w-full h-auto service-image"
                  width={800}
                  height={600}
                  priority
                />
              )}
            </div>
            <div className="md:w-1/2 service-description">
              <p className="text-lg text-gray-700 mb-4 service-paragraph">
                {service.service_desc}
              </p>
            </div>
          </div>
        </section>
      ))}
    </div>
    <FAQSection faqs={generalFAQs} />
    </div>
  );
};

export default ServicesPage;
