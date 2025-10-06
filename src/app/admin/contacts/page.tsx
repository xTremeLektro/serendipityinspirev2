'use client'

import { useState, useEffect } from 'react'
import AdminHeader from '@/components/AdminHeader'
import { fetchContactInquiries, updateContactInquiryStatus } from './actions'
import { format } from 'date-fns'
import { FaAngleDoubleLeft, FaChevronLeft, FaChevronRight, FaAngleDoubleRight } from 'react-icons/fa';

interface ContactInquiry {
  id: string
  created_at: string
  name: string
  email: string
  message: string
  is_reviewed: boolean
  subscribed: boolean
}

export default function AdminContactsPage() {
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalInquiries, setTotalInquiries] = useState(0);
  const [startDate, setStartDate] = useState<string | undefined>(undefined)
  const [endDate, setEndDate] = useState<string | undefined>(undefined)
  const [isReviewedFilter, setIsReviewedFilter] = useState<boolean | undefined>(undefined)
  const [searchName, setSearchName] = useState<string | undefined>(undefined)
  const limit = 15

  useEffect(() => {
    const getInquiries = async () => {
      const { data, count } = await fetchContactInquiries({
        page,
        limit,
        startDate,
        endDate,
        isReviewed: isReviewedFilter,
        searchName,
      })
      setInquiries(data as ContactInquiry[] || [])
      setTotalInquiries(count || 0);
      if (count !== null) {
        setTotalPages(Math.ceil(count / limit))
      }
    }
    getInquiries()
  }, [page, startDate, endDate, isReviewedFilter, searchName])

  const handleCheckboxChange = async (id: string, currentStatus: boolean) => {
    await updateContactInquiryStatus(id, !currentStatus)
    // Optimistically update UI or re-fetch data
    setInquiries((prev) =>
      prev.map((inquiry) =>
        inquiry.id === id ? { ...inquiry, is_reviewed: !currentStatus } : inquiry
      )
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader title="Contactos" />
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white p-8 rounded-lg shadow-md w-full">
              {/* Filter and Search Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Fecha Inicio:</label>
                  <input
                    type="date"
                    id="startDate"
                    value={startDate || ''}
                    onChange={(e) => setStartDate(e.target.value || undefined)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-gray-900"
                  />
                </div>
                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">Fecha Fin:</label>
                  <input
                    type="date"
                    id="endDate"
                    value={endDate || ''}
                    onChange={(e) => setEndDate(e.target.value || undefined)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-gray-900"
                  />
                </div>
                <div>
                  <label htmlFor="isReviewedFilter" className="block text-sm font-medium text-gray-700">Revisado:</label>
                  <select
                    id="isReviewedFilter"
                    value={isReviewedFilter === undefined ? 'all' : isReviewedFilter ? 'true' : 'false'}
                    onChange={(e) => {
                      const value = e.target.value
                      setIsReviewedFilter(value === 'all' ? undefined : value === 'true')
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-gray-900"
                  >
                    <option value="all">Todos</option>
                    <option value="true">Sí</option>
                    <option value="false">No</option>
                  </select>
                </div>
                <div className="md:col-span-3">
                  <label htmlFor="searchName" className="block text-sm font-medium text-gray-700">Buscar por Nombre:</label>
                  <input
                    type="text"
                    id="searchName"
                    value={searchName || ''}
                    onChange={(e) => setSearchName(e.target.value || undefined)}
                    placeholder="Escribe un nombre..."
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-gray-900"
                  />
                </div>
              </div>

              {/* Contacts Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 table-fixed">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">Fecha</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">Nombre</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">Correo Electrónico</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/6">Mensaje</th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">Revisado</th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">Suscrito</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {inquiries.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">No hay contactos para mostrar.</td>
                      </tr>
                    ) : (
                      inquiries.map((inquiry) => (
                        <tr key={inquiry.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{format(new Date(inquiry.created_at), 'dd/MM/yyyy HH:mm')}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{inquiry.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{inquiry.email}</td>
                          <td className="px-6 py-4 text-sm text-gray-900 whitespace-normal break-words">{inquiry.message}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                            <input
                              type="checkbox"
                              checked={inquiry.is_reviewed}
                              onChange={() => handleCheckboxChange(inquiry.id, inquiry.is_reviewed)}
                              className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                            <input
                              type="checkbox"
                              checked={inquiry.subscribed}
                              disabled
                              className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded bg-gray-200 disabled:cursor-not-allowed"
                            />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <br />

              {/* Pagination */}
              <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-600">
                Mostrando <span className="font-bold">{(page - 1) * limit + 1}</span> a <span className="font-bold">{Math.min(page * limit, totalInquiries)}</span> de <span className="font-bold">{totalInquiries}</span> resultados
              </div>
              <nav aria-label="Pagination">
                <ul className="inline-flex items-center -space-x-px">
                  <li>
                    <button
                      onClick={() => setPage(1)}
                      disabled={page === 1}
                      className="px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaAngleDoubleLeft />
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                      className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaChevronLeft />
                    </button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <li key={p}>
                      <button
                        onClick={() => setPage(p)}
                        className={`px-3 py-2 leading-tight border border-gray-300 ${page === p ? 'text-blue-600 bg-blue-50' : 'text-gray-500 bg-white'} hover:bg-gray-100 hover:text-gray-700`}
                      >
                        {p}
                      </button>
                    </li>
                  ))}
                  <li>
                    <button
                      onClick={() => setPage(page + 1)}
                      disabled={page === totalPages}
                      className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaChevronRight />
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setPage(totalPages)}
                      disabled={page === totalPages}
                      className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaAngleDoubleRight />
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}