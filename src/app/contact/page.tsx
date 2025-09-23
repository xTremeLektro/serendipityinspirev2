'use client';

import { FormEvent, useState } from 'react';
import { Inter } from 'next/font/google';
import { createClient } from '@/lib/supabase';
import { Mail, Phone, MapPin } from 'lucide-react';
import ConfirmationModal from '@/components/ConfirmationModal';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const ContactPage = () => {
  const supabase = createClient();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [activeTab, setActiveTab] = useState('general');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalIsSuccess, setModalIsSuccess] = useState(false);

  const openModal = (title: string, message: string, isSuccess: boolean) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalIsSuccess(isSuccess);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  const handleRemoveFile = (fileToRemove: File) => {
    setSelectedFiles((prevFiles) =>
      prevFiles.filter((file) => file !== fileToRemove)
    );
  };

  const handleBasicSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const subscribed = formData.has('subscribed');

    try {
      const { error } = await supabase.from('contact_inquiries').insert([{
        name: data.name.toString(),
        email: data.email.toString(),
        message: data.message.toString(),
        subscribed: subscribed,
      }]);

      if (error) {
        console.error("Error inserting data:", error);
        openModal('Error', 'Hubo un error al enviar tu mensaje. Por favor, inténtalo de nuevo.', false);
      } else {
        openModal('¡Mensaje Enviado!', '¡Gracias por tu mensaje! Nos pondremos en contacto pronto.', true);
        form.reset();
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      openModal('Error Inesperado', 'Hubo un error inesperado al enviar tu mensaje. Por favor, inténtalo de nuevo.', false);
    }
  };

  const handleQuoteSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const attachmentsToUpload = selectedFiles;
    const espaciosAAbordar = formData.getAll('espaciosAAbordar');
    const attachmentPaths: string[] = [];

    for (const attachment of attachmentsToUpload) {
      if (attachment.size > 0) {
        const { data: fileData, error: fileError } = await supabase.storage
          .from('attachments')
          .upload(`public/${attachment.name}`, attachment);

        if (fileError) {
          console.error('Error uploading file:', fileError);
          openModal('Error de Archivo', 'Hubo un error al subir un archivo. Por favor, inténtalo de nuevo.', false);
          return;
        }

        const { data: publicUrlData } = supabase.storage
          .from('attachments')
          .getPublicUrl(fileData.path);

        attachmentPaths.push(publicUrlData.publicUrl);
      }
    }

    try {
      const { error } = await supabase.from('quote_requests').insert([{
        full_name: data.nombreCompleto.toString(),
        email: data.correoElectronico.toString(),
        phone: data.telefono.toString(),
        address: data.direccion.toString(),
        city: data.ciudad.toString(),
        postal_code: data.codigoPostal.toString(),
        project_type: data.tipoDeProyecto.toString(),
        spaces_to_address: espaciosAAbordar,
        estimated_budget: data.presupuestoEstimado.toString(),
        how_found_us: data.comoNosEncontro.toString(),
        project_details: data.descripcionDelProyecto.toString(),
        attachments: attachmentPaths,
      }]);

      if (error) {
        console.error("Error inserting data:", error);
        openModal('Error', 'Hubo un error al enviar tu solicitud. Por favor, inténtalo de nuevo.', false);
      } else {
        openModal('¡Solicitud Enviada!', '¡Gracias por tu solicitud de presupuesto! Nos pondremos en contacto pronto.', true);
        form.reset();
        setSelectedFiles([]);
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      openModal('Error Inesperado', 'Hubo un error inesperado al enviar tu solicitud. Por favor, inténtalo de nuevo.', false);
    }
  };

  return (
    <main className={`${inter.variable} font-sans bg-slate-50 text-slate-800`}>
      <ConfirmationModal
        isOpen={modalIsOpen}
        onClose={closeModal}
        title={modalTitle}
        message={modalMessage}
        isSuccess={modalIsSuccess}
      />
      <div className="container mx-auto px-4 py-16">

        {/* --- Page Header --- */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-slate-900">Contacto</h1>
          <p className="text-lg text-slate-600 mt-2 max-w-2xl mx-auto">¿Listo para empezar? Contáctanos para consultas o para solicitar un presupuesto.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">

          {/* --- Contact Info (Left Column) --- */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Información de Contacto</h2>
            <p className="text-lg text-slate-600 mb-8">
              Nos encantaría saber de ti. Puedes encontrarnos en nuestra oficina, llamarnos o enviarnos un correo electrónico.
            </p>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <MapPin size={24} className="text-[#E67E22]" />
                <span className="text-lg text-slate-700">Vitacura, Santiago, Chile</span>
              </div>
              <div className="flex items-center gap-4">
                <Phone size={24} className="text-[#E67E22]" />
                <span className="text-lg text-slate-700">+56 9 1234 5678</span>
              </div>
              <div className="flex items-center gap-4">
                <Mail size={24} className="text-[#E67E22]" />
                <span className="text-lg text-slate-700">hola@serendipity.cl</span>
              </div>
            </div>
          </div>

          {/* --- Forms (Right Column) --- */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            {/* --- Tabs --- */}
            <div className="flex border-b border-slate-200 mb-6">
              <button 
                onClick={() => setActiveTab('general')} 
                className={`px-6 py-3 text-lg font-semibold transition-colors ${activeTab === 'general' ? 'border-b-2 border-[#E67E22] text-[#E67E22]' : 'text-slate-500 hover:text-slate-800'}`}>
                Consulta General
              </button>
              <button 
                onClick={() => setActiveTab('quote')} 
                className={`px-6 py-3 text-lg font-semibold transition-colors ${activeTab === 'quote' ? 'border-b-2 border-[#E67E22] text-[#E67E22]' : 'text-slate-500 hover:text-slate-800'}`}>
                Solicitar Presupuesto
              </button>
            </div>

            {/* --- General Inquiry Form --- */}
            <div className={activeTab === 'general' ? 'block' : 'hidden'}>
              <form onSubmit={handleBasicSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-lg font-semibold text-slate-700 mb-2">Nombre Completo</label>
                  <input type="text" id="name" name="name" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#E67E22] focus:border-transparent transition" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-lg font-semibold text-slate-700 mb-2">Email</label>
                  <input type="email" id="email" name="email" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#E67E22] focus:border-transparent transition" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-lg font-semibold text-slate-700 mb-2">Mensaje</label>
                  <textarea id="message" name="message" rows={4} className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#E67E22] focus:border-transparent transition"></textarea>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="subscribed" name="subscribed" className="h-5 w-5 text-[#E67E22] border-slate-300 rounded focus:ring-[#E67E22] transition" />
                  <label htmlFor="subscribed" className="ml-2 text-slate-700">Deseo suscribirme para recibir comunicaciones y novedades.</label>
                </div>
                <button type="submit" className="w-full bg-[#E67E22] text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-[#d35400] transition-colors duration-300 shadow-lg">Enviar Mensaje</button>
              </form>
            </div>

            {/* --- Quote Request Form --- */}
            <div className={activeTab === 'quote' ? 'block' : 'hidden'}>
              <form onSubmit={handleQuoteSubmit} encType="multipart/form-data" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="quote-name" className="block text-lg font-semibold text-slate-700 mb-2">Nombre Completo</label>
                    <input type="text" id="quote-name" name="nombreCompleto" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#E67E22] focus:border-transparent transition" required />
                  </div>
                  <div>
                    <label htmlFor="quote-email" className="block text-lg font-semibold text-slate-700 mb-2">Email</label>
                    <input type="email" id="quote-email" name="correoElectronico" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#E67E22] focus:border-transparent transition" required />
                  </div>
                </div>
                <div>
                  <label htmlFor="quote-phone" className="block text-lg font-semibold text-slate-700 mb-2">Teléfono</label>
                  <input type="tel" id="quote-phone" name="telefono" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#E67E22] focus:border-transparent transition" />
                </div>
                <div>
                  <label htmlFor="quote-address" className="block text-lg font-semibold text-slate-700 mb-2">Dirección</label>
                  <input type="text" id="quote-address" name="direccion" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#E67E22] focus:border-transparent transition" required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="quote-city" className="block text-lg font-semibold text-slate-700 mb-2">Ciudad</label>
                    <input type="text" id="quote-city" name="ciudad" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#E67E22] focus:border-transparent transition" required />
                  </div>
                  <div>
                    <label htmlFor="quote-postal" className="block text-lg font-semibold text-slate-700 mb-2">Código Postal</label>
                    <input type="text" id="quote-postal" name="codigoPostal" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#E67E22] focus:border-transparent transition" required />
                  </div>
                </div>
                <div>
                  <label htmlFor="project-type" className="block text-lg font-semibold text-slate-700 mb-2">Tipo de Proyecto</label>
                  <select id="project-type" name="tipoDeProyecto" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#E67E22] focus:border-transparent transition">
                    <option value="">Seleccione un tipo</option>
                    <option value="residencial">Residencial</option>
                    <option value="comercial">Comercial</option>
                    <option value="remodelacion">Remodelación</option>
                    <option value="obra-nueva">Obra Nueva</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-lg font-semibold text-slate-700 mb-2">Espacios a Intervenir</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {['Hall de Entrada', 'Living', 'Comedor', 'Living-Comedor', 'Dormitorio Ppal', 'Dormitorio Secundario', 'Sala de Estar', 'Baño', 'Logia', 'Walk-in Closet', 'Escritorio', 'Terraza'].map(space => (
                      <div key={space} className="flex items-center">
                        <input type="checkbox" id={`space-${space.replace(/\s+/g, '-').toLowerCase()}`} name="espaciosAAbordar" value={space} className="h-5 w-5 text-[#E67E22] border-slate-300 rounded focus:ring-[#E67E22] transition" />
                        <label htmlFor={`space-${space.replace(/\s+/g, '-').toLowerCase()}`} className="ml-2 text-slate-700">{space}</label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label htmlFor="project-details" className="block text-lg font-semibold text-slate-700 mb-2">Detalles del Proyecto</label>
                  <textarea id="project-details" name="descripcionDelProyecto" rows={4} className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#E67E22] focus:border-transparent transition"></textarea>
                </div>
                <div>
                  <label htmlFor="attachments" className="block text-lg font-semibold text-slate-700 mb-2">Archivos Adjuntos</label>
                  <input type="file" id="attachments" name="archivosAdjuntos" className="w-full text-slate-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#E67E22]/10 file:text-[#E67E22] hover:file:bg-[#E67E22]/20" multiple onChange={handleFileChange} />
                  <div className="mt-2 space-y-2">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-slate-100 p-2 rounded-md">
                        <span className="text-sm text-slate-700">{file.name}</span>
                        <button type="button" onClick={() => handleRemoveFile(file)} className="ml-2 text-red-500 hover:text-red-700 text-sm font-bold">X</button>
                      </div>
                    ))}
                  </div>
                </div>
                <button type="submit" className="w-full bg-[#E67E22] text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-[#d35400] transition-colors duration-300 shadow-lg">Solicitar Presupuesto</button>
              </form>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
};

export default ContactPage;
