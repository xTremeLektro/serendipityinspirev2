import { getProject, getProjectPics } from '../actions';
import EditProjectPageClient from './EditProjectPageClient';
import AdminHeader from '@/components/AdminHeader';

interface PageProps {
  params: Promise<{ projectId: string }>;
}

export default async function Page({ params }: PageProps) {
  const { projectId } = await params;
  const project = await getProject(projectId);
  const projectPics = await getProjectPics(projectId);

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-100">
        <AdminHeader title="Project Not Found" backUrl="/admin/projects" backText="Return to Projects" />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white p-8 rounded-lg shadow-md w-full text-center">
              <p className="text-gray-700">The requested project could not be found.</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <EditProjectPageClient
      project={project}
      projectPics={projectPics}
    />
  );
}
