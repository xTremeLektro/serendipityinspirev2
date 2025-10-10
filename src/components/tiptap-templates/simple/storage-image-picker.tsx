'use client'

import Image from 'next/image'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

const IMAGE_EXTENSIONS = new Set([
  'jpg',
  'jpeg',
  'png',
  'gif',
  'bmp',
  'webp',
  'svg',
  'tif',
  'tiff',
  'heic',
  'heif',
  'avif',
])

interface StorageBucketSummary {
  id: string
  name: string
  public: boolean
}

interface StorageItemSummary {
  id: string | null
  name: string
  created_at: string | null
  updated_at: string | null
  last_accessed_at: string | null
  size: number | null
  metadata: Record<string, unknown> | null
  isFolder: boolean
  path: string
}

export interface StorageImageSelection {
  bucket: string
  path: string
  name: string
  url: string
}

interface StorageImagePickerProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (selection: StorageImageSelection) => void
}

function isImageItem(item: StorageItemSummary): boolean {
  if (item.isFolder) {
    return false
  }
  const metadata = item.metadata as { mimetype?: unknown } | null
  const mimetype = typeof metadata?.mimetype === 'string' ? metadata.mimetype : null
  if (mimetype?.toLowerCase().startsWith('image/')) {
    return true
  }
  const extension = item.name.split('.').pop()?.toLowerCase() ?? ''
  return IMAGE_EXTENSIONS.has(extension)
}

async function fetchJson<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const response = await fetch(input, { cache: 'no-store', ...init })
  const data = await response.json()
  if (!response.ok) {
    throw new Error(typeof data?.error === 'string' ? data.error : 'Ocurrio un error al consultar Supabase.')
  }
  return data as T
}

export function StorageImagePicker({ isOpen, onClose, onSelect }: StorageImagePickerProps) {
  const [isLoadingBuckets, setIsLoadingBuckets] = useState(false)
  const [buckets, setBuckets] = useState<StorageBucketSummary[]>([])
  const [selectedBucket, setSelectedBucket] = useState<string | null>(null)
  const [currentPath, setCurrentPath] = useState('')
  const [items, setItems] = useState<StorageItemSummary[]>([])
  const [isLoadingItems, setIsLoadingItems] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSelectingImage, setIsSelectingImage] = useState(false)
  const previewCacheRef = useRef<Map<string, string>>(new Map())
  const [, forcePreviewUpdate] = useState(0)

  const breadcrumbs = useMemo(() => {
    const segments = currentPath ? currentPath.split('/').filter(Boolean) : []
    const crumbs = segments.map((segment, index) => ({
      label: segment,
      path: segments.slice(0, index + 1).join('/'),
    }))
    return [{ label: 'Raiz', path: '' }, ...crumbs]
  }, [currentPath])

  const loadBuckets = useCallback(async () => {
    setIsLoadingBuckets(true)
    setError(null)
    try {
      const data = await fetchJson<{ buckets: StorageBucketSummary[] }>('/api/admin/storage')
      setBuckets(data.buckets)
      if (data.buckets.length > 0) {
        setSelectedBucket((current) => current ?? data.buckets[0].name)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar los buckets.')
    } finally {
      setIsLoadingBuckets(false)
    }
  }, [])

  const loadItems = useCallback(
    async (bucketName: string, path: string) => {
      setIsLoadingItems(true)
      setError(null)
      try {
        const params = new URLSearchParams()
        params.set('bucket', bucketName)
        if (path) {
          params.set('path', path)
        }
        const data = await fetchJson<{ items: StorageItemSummary[] }>(`/api/admin/storage?${params.toString()}`)
        setItems(data.items)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'No se pudo cargar el contenido del bucket.')
      } finally {
        setIsLoadingItems(false)
      }
    },
    [],
  )

  useEffect(() => {
    if (isOpen) {
      void loadBuckets()
    }
  }, [isOpen, loadBuckets])

  useEffect(() => {
    if (!isOpen || !selectedBucket) {
      return
    }
    setCurrentPath('')
    previewCacheRef.current.clear()
    void loadItems(selectedBucket, '')
  }, [isOpen, selectedBucket, loadItems])

  useEffect(() => {
    if (!isOpen || !selectedBucket || items.length === 0) {
      return
    }

    const imageItems = items.filter((item) => isImageItem(item) && !previewCacheRef.current.has(item.path))
    if (imageItems.length === 0) {
      return
    }

    let isCancelled = false
    ;(async () => {
      try {
        const results = await Promise.all(
          imageItems.map(async (item) => {
            const params = new URLSearchParams()
            params.set('bucket', selectedBucket)
            params.set('path', item.path)
            try {
              const data = await fetchJson<{ url: string }>(`/api/admin/storage/preview?${params.toString()}`)
              return { path: item.path, url: data.url }
            } catch {
              return { path: item.path, url: '' }
            }
          }),
        )

        if (isCancelled) {
          return
        }

        let updated = false
        results.forEach(({ path, url }) => {
          if (url && !previewCacheRef.current.has(path)) {
            previewCacheRef.current.set(path, url)
            updated = true
          }
        })

        if (updated && !isCancelled) {
          forcePreviewUpdate((value) => value + 1)
        }
      } catch (err) {
        if (!isCancelled) {
          console.error('Error preloading image previews:', err)
        }
      }
    })()

    return () => {
      isCancelled = true
    }
  }, [isOpen, items, selectedBucket])

  const handleNavigate = useCallback(
    (path: string) => {
      if (!selectedBucket) {
        return
      }
      setCurrentPath(path)
      void loadItems(selectedBucket, path)
    },
    [loadItems, selectedBucket],
  )

  const handleSelectImage = useCallback(
    async (item: StorageItemSummary) => {
      if (!selectedBucket || isSelectingImage) {
        return
      }
      setIsSelectingImage(true)
      setError(null)
      try {
        const params = new URLSearchParams()
        params.set('bucket', selectedBucket)
        params.set('path', item.path)
        const data = await fetchJson<{ url: string }>(`/api/admin/storage/public-url?${params.toString()}`)
        onSelect({
          bucket: selectedBucket,
          path: item.path,
          name: item.name,
          url: data.url,
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'No se pudo obtener la URL publica de la imagen.')
      } finally {
        setIsSelectingImage(false)
      }
    },
    [isSelectingImage, onSelect, selectedBucket],
  )

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative z-10 flex w-full max-w-4xl flex-col overflow-hidden rounded-lg bg-white shadow-2xl dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-700">
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Selecciona una imagen</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Navega por el almacenamiento para elegir una imagen previamente cargada.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            aria-label="Cerrar selector de imagen"
          >
            X
          </button>
        </div>

        <div className="grid max-h-[70vh] flex-1 grid-cols-[200px_1fr] divide-x divide-slate-200 dark:divide-slate-800">
          <aside className="overflow-y-auto bg-slate-50 p-3 dark:bg-slate-950">
            <h4 className="px-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Buckets
            </h4>
            <div className="mt-3 space-y-1">
              {isLoadingBuckets ? (
                <div className="px-2 text-sm text-slate-500">Cargando buckets...</div>
              ) : buckets.length === 0 ? (
                <div className="px-2 text-sm text-slate-500">No hay buckets configurados.</div>
              ) : (
                buckets.map((bucket) => (
                  <button
                    key={bucket.id}
                    type="button"
                    onClick={() => setSelectedBucket(bucket.name)}
                    className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-sm ${
                      bucket.name === selectedBucket
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-700 hover:bg-slate-200 dark:text-slate-200 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className="truncate">{bucket.name}</span>
                    <span className="ml-2 text-[10px] uppercase tracking-wide">
                      {bucket.public ? 'Publico' : 'Privado'}
                    </span>
                  </button>
                ))
              )}
            </div>
          </aside>

          <section className="flex flex-col overflow-hidden">
            <div className="border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                {breadcrumbs.map((crumb, index) => (
                  <div key={`${crumb.path}-${index}`} className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleNavigate(crumb.path)}
                      className={`rounded px-2 py-1 ${
                        crumb.path === currentPath
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                          : 'hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200'
                      }`}
                    >
                      {crumb.label || 'Raiz'}
                    </button>
                    {index < breadcrumbs.length - 1 && <span>/</span>}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-white dark:bg-slate-900">
              {error && (
                <div className="border-b border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
                  {error}
                </div>
              )}
              {isLoadingItems ? (
                <div className="flex h-full items-center justify-center px-4 py-6 text-sm text-slate-500">
                  Cargando contenido...
                </div>
              ) : items.length === 0 ? (
                <div className="flex h-full items-center justify-center px-4 py-6 text-sm text-slate-500">
                  Esta ubicacion no contiene elementos.
                </div>
              ) : (
                <ul className="grid gap-3 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {items.map((item) => {
                    if (item.isFolder) {
                      return (
                        <li key={item.path}>
                          <button
                            type="button"
                            onClick={() => handleNavigate(item.path)}
                            className="flex h-32 w-full flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-sm font-medium text-slate-600 hover:border-blue-300 hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-blue-700 dark:hover:bg-blue-950"
                          >
                            <span className="text-2xl">📁</span>
                            <span className="mt-2 truncate px-3 text-xs">{item.name}</span>
                          </button>
                        </li>
                      )
                    }

                    if (!isImageItem(item)) {
                      return null
                    }

                    const cachedPreviewUrl = previewCacheRef.current.get(item.path) ?? null
                    return (
                      <li key={item.path}>
                        <button
                          type="button"
                          onClick={() => void handleSelectImage(item)}
                          className="group flex h-32 w-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:border-blue-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-blue-600"
                          disabled={isSelectingImage}
                        >
                          <div className="relative h-24 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                            {cachedPreviewUrl ? (
                              <Image
                                src={cachedPreviewUrl}
                                alt={item.name}
                                fill
                                sizes="180px"
                                className="object-cover"
                                unoptimized
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-xs text-slate-400 dark:text-slate-500">
                                Previsualizando...
                              </div>
                            )}
                          </div>
                          <div className="px-3 py-2 text-left">
                            <p className="truncate text-xs font-medium text-slate-700 group-hover:text-blue-600 dark:text-slate-200 dark:group-hover:text-blue-300">
                              {item.name}
                            </p>
                          </div>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          </section>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}
