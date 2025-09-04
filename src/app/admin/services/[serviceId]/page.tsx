import { getService, getFaqTypes, getServicePics } from '../actions';
import EditServicePageClient from './EditServicePageClient';
import AdminHeader from '@/components/AdminHeader';

interface ServiceIdPageProps {
  params: Promise<{ serviceId: string }>;
}

export default async function Page({ params }: ServiceIdPageProps) {
  const { serviceId } = await params;
  const service = await getService(serviceId);
  const faqTypes = await getFaqTypes();
  const servicePics = await getServicePics(serviceId);

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-100">
        <AdminHeader title="Service Not Found" backUrl="/admin/services" backText="Return to Services" />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white p-8 rounded-lg shadow-md w-full text-center">
              <p className="text-gray-700">The requested service could not be found.</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <EditServicePageClient
      service={service}
      faqTypes={faqTypes}
      servicePics={servicePics}
    />
  );
}