'use client'

import { useState, useEffect, ChangeEvent, useRef } from 'react'
import Image from 'next/image'
import AdminHeader from '@/components/AdminHeader'
import {
  fetchCarouselItems,
  updateCarouselItem,
  uploadImageAndGetUrl,
  swapCarouselItemOrder,
} from './actions'

import { Edu_NSW_ACT_Cursive } from 'next/font/google';

// Initialize the font for the Hero Section.
const eduNSW = Edu_NSW_ACT_Cursive({
  weight: ['400', '700'], // You can specify the weights you need
  fallback: ['cursive'],
  subsets: ['latin', 'latin-ext'],
});

interface CarouselItem {
  id: string
  created_at: string
  short_desc: string | null
  picture: string | null
  ord: number
}

export default function AdminCarouselPage() {
  const [carouselItems, setCarouselItems] = useState<CarouselItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<{ [key: string]: File | null }>({}) // { itemId: File }
  const [isSaving, setIsSaving] = useState<string | null>(null) // itemId being saved
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({}) // Refs for hidden file inputs

  const [showModal, setShowModal] = useState(false)
  const [modalImageUrl, setModalImageUrl] = useState<string | null>(null)

  useEffect(() => {
    const getCarouselItems = async () => {
      setLoading(true)
      setError(null)
      const { data, error } = await fetchCarouselItems()
      if (error) {
        setError(error.message)
      } else if (data) {
        setCarouselItems(data)
      }
      setLoading(false)
    }
    getCarouselItems()
  }, [])

  const handleShortDescChange = (id: string, newDesc: string) => {
    setCarouselItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, short_desc: newDesc } : item
      )
    )
  }

  const handleFileChange = (id: string, event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFiles((prevFiles) => ({ ...prevFiles, [id]: event.target.files![0] }))
    } else {
      setSelectedFiles((prevFiles) => ({ ...prevFiles, [id]: null }))
    }
  }

  const handleSave = async (itemToSave: CarouselItem) => {
    setIsSaving(itemToSave.id)
    setError(null)
    try {
      let newPictureUrl: string | null = itemToSave.picture
      const fileToUpload = selectedFiles[itemToSave.id]

      if (fileToUpload) {
        const { publicUrl, error: uploadError } = await uploadImageAndGetUrl(
          fileToUpload,
          itemToSave.picture // Pass old URL for deletion
        )
        if (uploadError) {
          throw new Error(uploadError.message)
        }
        newPictureUrl = publicUrl
      }

      const { success, error: updateError } = await updateCarouselItem(itemToSave.id, {
        short_desc: itemToSave.short_desc,
        picture: newPictureUrl,
      })

      if (!success) {
        if (updateError) {
          throw new Error(updateError.message)
        }
        throw new Error("An unknown error occurred during update.")
      }

      // Clear selected file for this item after successful save
      setSelectedFiles((prevFiles) => ({ ...prevFiles, [itemToSave.id]: null }))
      // Re-fetch items to ensure UI is fully consistent with DB, including new picture URL
      const { data, error: fetchError } = await fetchCarouselItems()
      if (fetchError) {
        setError(fetchError.message)
      } else if (data) {
        setCarouselItems(data)
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Failed to save item.')
      }
    } finally {
      setIsSaving(null)
    }
  }

  const handleMove = async (itemToMove: CarouselItem, direction: 'up' | 'down') => {
    setError(null)
    const currentIndex = carouselItems.findIndex((item) => item.id === itemToMove.id)
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1

    if (targetIndex < 0 || targetIndex >= carouselItems.length) {
      return // Cannot move further
    }

    const targetItem = carouselItems[targetIndex]

    try {
      // Swap ord values in the database
      const { success, error: swapError } = await swapCarouselItemOrder(
        itemToMove.id,
        itemToMove.ord,
        targetItem.id,
        targetItem.ord
      )

      if (!success) {
        if (swapError) {
          throw new Error(swapError.message)
        }
        throw new Error("An unknown error occurred during swap.")
      }

      // Optimistically update UI for smoother experience
      setCarouselItems((prevItems) => {
        const newItems = [...prevItems]
        // Temporarily swap items in the array based on their current position
        const temp = newItems[currentIndex]
        newItems[currentIndex] = newItems[targetIndex]
        newItems[targetIndex] = temp
        // Re-assign ord values based on new positions (important for display consistency)
        // This is a simplified approach; a full re-sort by ord after swap might be safer
        // if ord values are not strictly sequential or if there are gaps.
        // For fixed 1-5, this should be fine.
        newItems[currentIndex].ord = direction === 'up' ? targetItem.ord : itemToMove.ord;
        newItems[targetIndex].ord = direction === 'up' ? itemToMove.ord : targetItem.ord;
        return newItems;
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Failed to move item.')
      }
      // Re-fetch on error to revert optimistic update
      const { data, error: fetchError } = await fetchCarouselItems()
      if (fetchError) {
        setError(fetchError.message)
      } else if (data) {
        setCarouselItems(data)
      }
    }
  }

  const openModal = (imageUrl: string) => {
    setModalImageUrl(imageUrl)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setModalImageUrl(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <AdminHeader title="Administrar Carrusel" />
        <main>
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              <div className="bg-white p-8 rounded-lg shadow-md w-full text-center">
                <p className="text-gray-700">Cargando ítems del carrusel...</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <AdminHeader title="Administrar Carrusel" />
        <main>
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              <div className="bg-white p-8 rounded-lg shadow-md w-full text-center text-red-500">
                <p>Error: {error}</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader title="Administrar Carrusel" />
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white p-8 rounded-lg shadow-md w-full">
              <h2 className={`text-2xl font-bold text-gray-800 mb-6 ${eduNSW.className}`}>Ítems del Carrusel</h2>
              {carouselItems.length === 0 ? (
                <div className="text-center text-gray-700">No hay ítems en el carrusel.</div>
              ) : (
                <div className="space-y-6">
                  {carouselItems.map((item, index) => (
                    <div
                      key={item.id}
                      className="flex flex-col md:flex-row items-stretch bg-gray-50 p-4 rounded-lg shadow-sm md:space-x-4"
                    >
                      {/* Image Section - Now has a fixed width of 320px and height of 48px. */}
                      <div className="flex-shrink-0 w-80 h-48 rounded-md overflow-hidden cursor-pointer relative group bg-gray-300" onClick={() => item.picture && openModal(item.picture)}>
                        {item.picture ? (
                          <Image
                            src={item.picture}
                            alt={item.short_desc || 'Carousel Image'}
                            width={320}
                            height={192}
                            className="w-full h-full object-cover"
                            style={{ objectFit: 'cover' }}
                            unoptimized={false}
                            priority
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs text-center">
                            No Image
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300 z-10 pointer-events-none">
                          <span className="text-white text-sm">Ver</span>
                        </div>
                      </div>
                      
                      {/* This container stretches to the full height of the image. */}
                      <div className="flex-grow flex flex-col justify-between w-full mt-4 md:mt-0">
                        
                        {/* Details Section - Aligned to the top due to justify-between. */}
                        <div className="w-full">
                          <div>
                            <p className="text-sm text-gray-700 font-bold">Orden: {item.ord}</p>
                            <div className="mb-2">
                              <label htmlFor={`short_desc-${item.id}`} className="block text-sm font-bold text-gray-700">Descripción Corta:</label>
                              <input
                                type="text"
                                id={`short_desc-${item.id}`}
                                value={item.short_desc || ''}
                                onChange={(e) => handleShortDescChange(item.id, e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-gray-900"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Buttons Section - Pushed to the bottom due to justify-between. */}
                        <div className="flex flex-col md:flex-row mt-4 md:mt-0 space-y-2 md:space-y-0 md:space-x-2 md:self-end">
                          <input
                            type="file"
                            id={`picture-upload-${item.id}`}
                            accept="image/*"
                            onChange={(e) => handleFileChange(item.id, e)}
                            className="hidden" // Hide the actual file input
                            ref={(el) => {
                              if (el) {
                                fileInputRefs.current[item.id] = el;
                              } else {
                                delete fileInputRefs.current[item.id];
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => fileInputRefs.current[item.id]?.click()}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                          >
                            Seleccionar Archivo
                          </button>
                          <button
                            onClick={() => handleSave(item)}
                            disabled={isSaving === item.id}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isSaving === item.id ? 'Guardando...' : 'Guardar'}
                          </button>
                          <button
                            onClick={() => handleMove(item, 'up')}
                            disabled={index === 0 || isSaving !== null}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Mover Arriba
                          </button>
                          <button
                            onClick={() => handleMove(item, 'down')}
                            disabled={index === carouselItems.length - 1 || isSaving !== null}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Mover Abajo
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Image Modal */}
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
          </div>
        </div>
      )}
    </div>
  );
}
