"use client";

import AdminHeader from '@/components/AdminHeader';
import { updateProject, addProjectPic, deleteProjectPic, updateProjectPicAttributes } from '../actions';
import { useState, useEffect, useRef, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { FaTrash } from 'react-icons/fa';
import Image from 'next/image';
import { Edu_NSW_ACT_Cursive } from 'next/font/google';

// Initialize the font for the Hero Section.
const eduNSW = Edu_NSW_ACT_Cursive({
  weight: ['400', '700'], // You can specify the weights you need
});

interface Project {
  id: string;
  project_name: string;
  short_description?: string;
  detailed_description?: string;
  location?: string;
  end_date?: string;
  property_type?: string;
  style?: string;
  scope?: string;
}

interface ProjectPic {
  id: string;
  photo_url?: string;
  caption?: string;
  is_home?: boolean;
  is_head_pic?: boolean;
  ord?: number;
}

interface EditProjectPageClientProps {
  project: Project;
  projectPics: ProjectPic[];
}

export default function EditProjectPageClient({ project, projectPics }: EditProjectPageClientProps) {
  const [showModal, setShowModal] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState<string | null>(null);

  const openModal = (imageUrl: string) => {
    setModalImageUrl(imageUrl);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalImageUrl(null);
  };

  // For addProjectPic form
  const [addPicState, addPicFormAction] = useActionState(addProjectPic, { error: null, success: false });
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [caption, setCaption] = useState('');

  useEffect(() => {
    if (addPicState.success) {
      if (photoInputRef.current) {
        photoInputRef.current.value = '';
      }
      setCaption('');
      alert('Picture added successfully!');
    }
  }, [addPicState.success]);

  function AddPictureButton() {
    const { pending } = useFormStatus();
    return (
      <button
        type="submit"
        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
        disabled={pending}
      >
        {pending ? 'Adding...' : 'Add Picture'}
      </button>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader title={`Editar Proyecto: ${project.project_name}`} backUrl="/admin/projects" backText="Regresar a Proyectos" />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0 space-y-8">
          <div className="bg-white p-8 rounded-lg shadow-md w-full">
            <h2 className={`text-2xl font-bold mb-4 text-gray-900 ${eduNSW.className}`}>Detalles del Proyecto</h2>
            <form action={updateProject}>
              <input type="hidden" name="id" value={project.id} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                  <label htmlFor="project_name" className="block text-sm font-medium text-gray-700">Nombre del Proyecto</label>
                  <input type="text" name="project_name" id="project_name" defaultValue={project.project_name} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900" required />
                </div>
                <div className="mb-4">
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">Ubicación</label>
                  <input type="text" name="location" id="location" defaultValue={project.location || ''} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900" />
                </div>
                <div className="mb-4">
                  <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">Fecha de Finalización</label>
                  <input type="date" name="end_date" id="end_date" defaultValue={project.end_date || ''} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900" />
                </div>
                <div className="mb-4">
                  <label htmlFor="property_type" className="block text-sm font-medium text-gray-700">Tipo de Propiedad</label>
                  <input type="text" name="property_type" id="property_type" defaultValue={project.property_type || ''} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900" />
                </div>
                <div className="mb-4">
                  <label htmlFor="style" className="block text-sm font-medium text-gray-700">Estilo</label>
                  <input type="text" name="style" id="style" defaultValue={project.style || ''} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900" />
                </div>
                <div className="mb-4">
                  <label htmlFor="scope" className="block text-sm font-medium text-gray-700">Alcance</label>
                  <input type="text" name="scope" id="scope" defaultValue={project.scope || ''} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900" />
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="short_description" className="block text-sm font-medium text-gray-700">Descripción Corta</label>
                <textarea name="short_description" id="short_description" defaultValue={project.short_description || ''} rows={3} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"></textarea>
              </div>
              <div className="mb-4">
                <label htmlFor="detailed_description" className="block text-sm font-medium text-gray-700">Descripción Detallada</label>
                <textarea name="detailed_description" id="detailed_description" defaultValue={project.detailed_description || ''} rows={6} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"></textarea>
              </div>
              <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Update Project</button>
            </form>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md w-full">
            <h2 className={`text-2xl font-bold mb-4 text-gray-900 ${eduNSW.className}`}>Administrar Imágenes del Proyecto</h2>
            <div className="mb-8">
              <h3 className={`text-xl font-bold mb-2 text-gray-900 ${eduNSW.className}`}>Agregar Nueva Imagen</h3>
              <form action={addPicFormAction}>
                <input type="hidden" name="project_id" value={project.id} />
                <div className="mb-4">
                  <label htmlFor="photo" className="block text-sm font-medium text-gray-700">Foto</label>
                  <input type="file" name="photo" id="photo" ref={photoInputRef} className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer bg-gray-50 focus:outline-none" required />
                </div>
                <div className="mb-4">
                  <label htmlFor="caption" className="block text-sm font-medium text-gray-700">Descripción</label>
                  <input type="text" name="caption" id="caption" value={caption} onChange={(e) => setCaption(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900" />
                </div>
                {addPicState.error && <p className="text-red-500 text-sm mb-4">{addPicState.error}</p>}
                <AddPictureButton />
              </form>
            </div>

            <div>
              <h3 className={`text-xl font-bold mb-2 text-gray-900 ${eduNSW.className}`}>Imágenes Existentes</h3>
              <div className="flex flex-col gap-4">
                {projectPics.map((pic) => (
                  <div key={pic.id} className="bg-gray-50 p-4 rounded-lg shadow flex items-center justify-between space-x-4 w-full">
                    <div className="flex-shrink-0 cursor-pointer" onClick={() => pic.photo_url && openModal(pic.photo_url)}>
                      {pic.photo_url && typeof pic.photo_url === 'string' ? (
                        <Image src={pic.photo_url} alt={pic.caption || 'Project Picture'} width={64} height={64} className="object-cover rounded-md" />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 flex items-center justify-center text-gray-500 text-xs rounded-md">No Image</div>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 font-medium flex-grow-0 w-64">{pic.caption}</p>
                    <form action={updateProjectPicAttributes} className="flex items-center space-x-4 flex-grow justify-end">
                      <input type="hidden" name="id" value={pic.id} />
                      <input type="hidden" name="project_id" value={project.id} />
                      <label className="flex items-center text-sm text-gray-700">
                        <input type="checkbox" name="is_home" defaultChecked={pic.is_home} className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out mr-1" />
                        Home
                      </label>
                      <label className="flex items-center text-sm text-gray-700">
                        <input type="checkbox" name="is_head_pic" defaultChecked={pic.is_head_pic} className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out mr-1" />
                        Head Pic
                      </label>
                      <label className="flex items-center text-sm text-gray-700">
                        Orden:
                        <input type="number" name="ord" defaultValue={pic.ord} className="ml-1 w-16 px-2 py-1 border border-gray-300 rounded-md text-sm text-gray-900" />
                      </label>
                      <button type="submit" className="text-blue-600 hover:text-blue-900 text-sm flex-shrink-0">Actualizar</button>
                    </form>
                    <form action={deleteProjectPic} className="flex-shrink-0">
                      <input type="hidden" name="id" value={pic.id} />
                      <input type="hidden" name="project_id" value={project.id} />
                      <input type="hidden" name="photo_url" value={pic.photo_url} />
                      <button type="submit" className="text-red-600 hover:text-red-900">
                        <FaTrash />
                      </button>
                    </form>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      {showModal && modalImageUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={closeModal}>
          <div className="relative bg-white p-4 rounded-lg max-w-3xl max-h-full overflow-auto" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-2xl text-gray-700 hover:text-gray-900 focus:outline-none"
              aria-label="Cerrar"
            >
              &times;
            </button>
            {modalImageUrl && typeof modalImageUrl === 'string' ? (
              <Image
                src={modalImageUrl}
                alt="Full size image"
                width={800}
                height={600}
                className="max-w-full max-h-full object-contain"
                style={{ objectFit: 'contain' }}
                unoptimized={false}
                priority
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                Imagen No Disponible
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
