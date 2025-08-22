import AdminHeader from '@/components/AdminHeader'

export default function AdminServicesPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader title="Services Management" />
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white p-8 rounded-lg shadow-md w-full text-center">
              <p className="text-gray-700">This is where you will manage the services content.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}