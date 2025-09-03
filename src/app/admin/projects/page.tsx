import AdminHeader from '@/components/AdminHeader';
import { getProjects, addProject, deleteProject } from './actions';
import { FaTrash } from 'react-icons/fa';
import { Edu_NSW_ACT_Cursive } from 'next/font/google';
import ProjectForm from './ProjectForm';
import ClientOnly from '@/components/ClientOnly';

// Initialize the font for the Hero Section.
const eduNSW = Edu_NSW_ACT_Cursive({
  weight: ['400', '700'], // You can specify the weights you need
  subsets: ['latin'],
  fallback: ['cursive'],
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
            <ClientOnly>
              <ProjectForm action={addProject} />
            </ClientOnly>
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
