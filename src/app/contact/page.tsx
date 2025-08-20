"use client";

import { FormEvent } from 'react';
import { Edu_NSW_ACT_Cursive } from 'next/font/google';

// Initialize the font for the Hero Section.
const eduNSW = Edu_NSW_ACT_Cursive({
  weight: ['400', '700'], // You can specify the weights you need
  fallback: ['system-ui', 'sans-serif'],
});

const ContactPage = () => {
  const handleBasicSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const response = await fetch('/api/contact/basic', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      alert('¡Gracias por tu mensaje! Nos pondremos en contacto pronto.');
    } else {
      alert('Hubo un error al enviar tu mensaje. Por favor, inténtalo de nuevo.');
    }
  };

  const handleQuoteSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const response = await fetch('/api/contact/quote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      alert('¡Gracias por tu solicitud de presupuesto! Nos pondremos en contacto pronto.');
    } else {
      alert('Hubo un error al enviar tu solicitud. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <div className="bg-white text-black">
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className='bg-black text-white rounded-lg'>
        <br />
        <h1 className={`text-4xl md:text-5xl font-bold text-center ${eduNSW.className}`}>Contacto</h1>
        <br />
      </div>

      <section className="mb-8">
        <h2 className={`text-3xl font-semibold mb-4 text-black ${eduNSW.className}`}>Consulta General / Suscripción</h2>
        <p className={`mb-4 text-gray-800 ${eduNSW.className}`}>
          Utilice este formulario para consultas generales, comentarios o para suscribirse a nuestras noticias y actualizaciones. Nos encantará saber de usted.
        </p>
        {/* Basic contact form placeholder */}
        <div className="contact-form-container bg-gray-400 p-6 rounded-lg shadow-md">
          <form onSubmit={handleBasicSubmit}>
            <div className="mb-4 text-gray-700">
              <label htmlFor="name" className="block text-gray-700 font-bold mb-2">Nombre:</label>
              <input type="text" id="name" name="name" className="form-input appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white" />
            </div>
            <div className="mb-4 text-gray-700">
              <label htmlFor="email" className="block text-gray-700 font-bold mb-2">Email:</label>
              <input type="email" id="email" name="email" className="form-input appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white" />
            </div>
            <div className="mb-4 text-gray-700">
              <label htmlFor="message" className="block text-gray-700 font-bold mb-2">Mensaje / Interés:</label>
              <textarea id="message" name="message" className="form-textarea appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white"></textarea>
            </div>
            <input type="hidden" name="formType" value="basic" /> {/* Add hidden input to differentiate forms */}
            <div className="flex items-center justify-end text-gray-700">
              <button type="submit" className="form-button bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Enviar</button>
            </div>
          </form>
        </div>
      </section>
      <section>
        <h2 className={`text-3xl font-semibold mb-4 text-black ${eduNSW.className}`}>Solicitar Presupuesto</h2>
        <p className={`mb-4 text-gray-800 ${eduNSW.className}`}>
          Si tiene un proyecto en mente y desea solicitar un presupuesto detallado, por favor complete el siguiente formulario con la mayor cantidad de información posible.
        </p>

        {/* Detailed quote request form placeholder */}
        <div className="contact-form-container bg-gray-400 p-6 rounded-lg shadow-md">
          <form onSubmit={handleQuoteSubmit} encType="multipart/form-data"> {/* Add encType for file uploads */}
          <div className="mb-4 text-gray-700">
              <label htmlFor="quote-name" className="block text-gray-700 font-bold mb-2">Nombre:</label>
              <input type="text" id="quote-name" name="nombreCompleto" className="form-input appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white" required /> {/* Added required */}
          </div>
          <div className="mb-4 text-gray-700">
              <label htmlFor="quote-email" className="block text-gray-700 font-bold mb-2">Email:</label>
              <input type="email" id="quote-email" name="correoElectronico" className="form-input appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white" required /> {/* Added required */}
          </div>
          <div className="mb-4 text-gray-700">
              <label htmlFor="quote-phone" className="block text-gray-700 font-bold mb-2">Teléfono:</label>
              <input type="tel" id="quote-phone" name="telefono" className="form-input appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white" />
          </div>
          <div className="mb-4 text-gray-700">
              <label htmlFor="quote-address" className="block text-gray-700 font-bold mb-2">Dirección:</label>
              <input type="text" id="quote-address" name="direccion" className="form-input appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white" required /> {/* Added required */}
          </div>
          {/* Combined City and Postal Code */}
          <div className="mb-4 flex flex-wrap -mx-2 text-gray-700">
            <div className="w-full md:w-1/2 px-2 mb-4 md:mb-0 text-gray-700"> {/* City */}
                <label htmlFor="quote-city" className="block text-gray-700 font-bold mb-2">Ciudad:</label>
                <input type="text" id="quote-city" name="ciudad" className="form-input appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white" required /> {/* Added required */}
            </div>
            <div className="w-full md:w-1/2 px-2 text-gray-700"> {/* Postal Code */}
                <label htmlFor="quote-postal" className="block text-gray-700 font-bold mb-2">Código postal:</label>
                <input type="text" id="quote-postal" name="codigoPostal" className="form-input appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white" required /> {/* Added required */}
            </div>
            </div>
            <div className="mb-4 text-gray-700">
              <label htmlFor="project-type" className="block text-gray-700 font-bold mb-2">Tipo de Proyecto:</label>
              {/* Using select for Type of Project */}
              <select id="project-type" name="tipoDeProyecto" className="form-select appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white">
                <option value="" className="bg-white text-gray-700">Seleccione un tipo de proyecto</option>
                <option value="residencial">Residencial</option>
                <option value="comercial">Comercial</option>
                <option value="remodelacion">Remodelación</option>
                <option value="obra-nueva">Obra Nueva</option>
                <option value="otro">Otro</option>
              </select>
            </div>
            <div className="mb-4 text-gray-700">
              <label className="block text-gray-700 font-bold mb-2">Espacios a intervenir (Seleccione uno o más):</label>

              {/* Container for Espacio a intervenir */}
              <div className="text-gray-700">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2"> {/* Use grid for checkbox layout */}
                  {['Hall de Entrada', 'Living', 'Comedor', 'Living-Comedor', 'Dormitorio Ppal', 'Dormitorio Secundario', 'Sala de Estar', 'Baño', 'Logia', 'Walk-in Closet', 'Escritorio', 'Terraza'].map(space => (
                    <div key={space} className="flex items-center">
                      <input type="checkbox" id={`space-${space.replace(/\s+/g, '-').toLowerCase()}`} name="espaciosAAbordar" value={space} className="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500 bg-white" />
                      <label htmlFor={`space-${space.replace(/\s+/g, '-').toLowerCase()}`} className="ml-2 text-gray-700">{space}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mb-4 text-gray-700">
              <label htmlFor="estimated-budget" className="block text-gray-700 font-bold mb-2">Presupuesto estimado:</label>
              {/* Using select for Estimated Budget */}
              <select id="estimated-budget" name="presupuestoEstimado" className="form-select appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white">
                <option value="" className="bg-white text-gray-700">Seleccione un rango de presupuesto</option>
                <option value="bajo">Bajo</option>
                <option value="medio">Medio</option>
                <option value="alto">Alto</option>
                <option value="muy-alto">Muy Alto</option>
                <option value="a-discutir">A discutir</option>
              </select>
            </div>
            <div className="mb-4 text-gray-700">
              <label htmlFor="how-found-us" className="block text-gray-700 font-bold mb-2">Cómo nos encontró?:</label>
              {/* Using text input for How did you find us? */}
              <input type="text" id="how-found-us" name="comoNosEncontro" className="form-input appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white" />
            </div>
            <div className="mb-4 text-gray-700">
              <label htmlFor="project-details" className="block text-gray-700 font-bold mb-2">Detalles del Proyecto:</label>
              <textarea id="project-details" name="descripcionDelProyecto" className="form-textarea appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white" rows={4}></textarea> {/* Added rows for better initial size */}
            </div>
            <div className="mb-4 text-gray-700">
              <label htmlFor="attachments" className="block text-gray-700 font-bold mb-2">Archivos adjuntos:</label>
              {/* File input for attachments */}
              <input type="file" id="attachments" name="archivosAdjuntos" className="form-input appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white" multiple /> {/* Added multiple for selecting multiple files */}
            </div>
            <input type="hidden" name="formType" value="quote" /> {/* Add hidden input to differentiate forms */}
            <div className="flex items-center justify-end">
              <button type="submit" className="form-button bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Solicitar Presupuesto</button>
            </div>
          </form>
        </div>
      </section>
    </div>
    </div>
  );
};

export default ContactPage;