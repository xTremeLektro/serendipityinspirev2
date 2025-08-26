import AdminHeader from '@/components/AdminHeader';
import { getProjects, addProject, deleteProject } from './actions';
import { FaTrash } from 'react-icons/fa';
import { Edu_NSW_ACT_Cursive } from 'next/font/google';

// Initialize the font for the Hero Section.
const eduNSW = Edu_NSW_ACT_Cursive({
  weight: ['400', '700'], // You can specify the weights you need
});

export default async function AdminProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader title="Gestión de Proyectos" />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white p-8 rounded-lg shadow-md w-full mb-8">
            <h2 className={`text-2xl font-bold mb-4 text-gray-900 ${eduNSW.className}`}>Agregar Nuevo Proyecto</h2>
            <form action={addProject}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                  <label htmlFor="project_name" className="block text-sm font-medium text-gray-700">Project Name</label>
                  <input type="text" name="project_name" id="project_name" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900" required />
                </div>
                <div className="mb-4">
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">Ubicación</label>
                  <input type="text" name="location" id="location" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900" />
                </div>
                <div className="mb-4">
                  <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">Fecha de Finalización</label>
                  <input type="date" name="end_date" id="end_date" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900" />
                </div>
                <div className="mb-4">
                  <label htmlFor="property_type" className="block text-sm font-medium text-gray-700">Tipo de Propiedad</label>
                  <input type="text" name="property_type" id="property_type" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900" />
                </div>
                <div className="mb-4">
                  <label htmlFor="style" className="block text-sm font-medium text-gray-700">Estilo</label>
                  <input type="text" name="style" id="style" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900" />
                </div>
                <div className="mb-4">
                  <label htmlFor="scope" className="block text-sm font-medium text-gray-700">Alcance</label>
                  <input type="text" name="scope" id="scope" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900" />
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="short_description" className="block text-sm font-medium text-gray-700">Descripción Corta</label>
                <textarea name="short_description" id="short_description" rows={2} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"></textarea>
              </div>
              <div className="mb-4">
                <label htmlFor="detailed_description" className="block text-sm font-medium text-gray-700">Descripción Detallada</label>
                <textarea name="detailed_description" id="detailed_description" rows={4} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"></textarea>
              </div>
              <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Add Project</button>
            </form>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md w-full">
            <h2 className={`text-2xl font-bold mb-4 text-gray-900 ${eduNSW.className}`}>Proyectos Existentes</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre del Proyecto</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ubicación</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de Finalización</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {projects.map((project) => (
                    <tr key={project.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{project.project_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{project.location}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{project.end_date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <a href={`/admin/projects/${project.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</a>
                        <form action={deleteProject} className="inline-block">
                          <input type="hidden" name="id" value={project.id} />
                          <button type="submit" className="text-red-600 hover:text-red-900">
                            <FaTrash />
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
