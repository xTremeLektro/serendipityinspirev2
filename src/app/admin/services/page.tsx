import AdminHeader from '@/components/AdminHeader';
import { getServices, addService, deleteService, getFaqTypes } from './actions';
import { FaTrash } from 'react-icons/fa';
import { Edu_NSW_ACT_Cursive } from 'next/font/google';

// Initialize the font for the Hero Section.
const eduNSW = Edu_NSW_ACT_Cursive({
  weight: ['400', '700'], // You can specify the weights you need
});

export default async function AdminServicesPage() {
  const services = await getServices();
  const faqTypes = await getFaqTypes();

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader title="Services Management" />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white p-8 rounded-lg shadow-md w-full mb-8">
            <h2 className={`text-2xl font-bold mb-4 text-gray-900 ${eduNSW.className}`}>Add New Service</h2>
            <form action={addService}>
              <div className="mb-4">
                <label htmlFor="service_name" className="block text-sm font-medium text-gray-700">Service Name</label>
                <input type="text" name="service_name" id="service_name" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900" required />
              </div>
              <div className="mb-4">
                <label htmlFor="service_desc" className="block text-sm font-medium text-gray-700">Service Description</label>
                <textarea name="service_desc" id="service_desc" rows={4} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900" required></textarea>
              </div>
              <div className="mb-4">
                <label htmlFor="fac_type_id" className="block text-sm font-medium text-gray-700">FAQ Type</label>
                <select name="fac_type_id" id="fac_type_id" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border text-gray-900">
                  <option value="">Select a type</option>
                  {faqTypes.map((type) => (
                    <option key={type.id} value={type.id} className="text-gray-900">{type.faq_type}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Add Service</button>
            </form>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md w-full">
            <h2 className={`text-2xl font-bold mb-4 text-gray-900 ${eduNSW.className}`}>Existing Services</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FAQ Type</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {services.map((service) => (
                    <tr key={service.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{service.service_name}</td>
                      <td className="px-6 py-4 whitespace-normal text-sm text-gray-500 max-w-xs">{service.service_desc}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{service.faq_type_list?.faq_type || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <a href={`/admin/services/${service.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</a>
                        <form action={deleteService} className="inline-block">
                          <input type="hidden" name="id" value={service.id} />
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
