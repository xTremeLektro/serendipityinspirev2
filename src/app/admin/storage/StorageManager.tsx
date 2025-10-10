"use client"

import Image from "next/image"
import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react"
import {
  listBuckets,
  listObjects,
  createFolder,
  uploadFile,
  deleteObject,
  moveObject,
  getObjectPreviewUrl,
  type StorageBucketSummary,
  type StorageItemSummary,
} from './actions'

type MessageKind = 'success' | 'error' | 'info'

interface MessageState {
  kind: MessageKind
  text: string
}

interface StorageManagerProps {
  initialBuckets: StorageBucketSummary[]
  initialBucket: string | null
  initialPath: string
  initialItems: StorageItemSummary[]
  bucketError: string | null
  itemsError: string | null
}

const dateFormatter = new Intl.DateTimeFormat('es-ES', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

function formatBytes(bytes: number | null): string {
  if (bytes === null || Number.isNaN(bytes)) {
    return '—'
  }
  if (bytes === 0) {
    return '0 B'
  }
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
  const value = bytes / Math.pow(1024, exponent)
  return `${value.toFixed(value >= 10 || exponent === 0 ? 0 : 1)} ${units[exponent]}`
}

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

export default function StorageManager({
  initialBuckets,
  initialBucket,
  initialPath,
  initialItems,
  bucketError,
  itemsError,
}: StorageManagerProps) {
  const [buckets, setBuckets] = useState<StorageBucketSummary[]>(initialBuckets)
  const [selectedBucket, setSelectedBucket] = useState<string | null>(initialBucket)
  const [currentPath, setCurrentPath] = useState(initialPath)
  const [items, setItems] = useState<StorageItemSummary[]>(initialItems)
  const [message, setMessage] = useState<MessageState | null>(() => {
    if (bucketError) {
      return { kind: 'error', text: bucketError }
    }
    if (itemsError) {
      return { kind: 'error', text: itemsError }
    }
    return null
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [folderName, setFolderName] = useState('')
  const [renameTarget, setRenameTarget] = useState<StorageItemSummary | null>(null)
  const [renameValue, setRenameValue] = useState('')
  const [isPending, startTransition] = useTransition()
  const [previewItem, setPreviewItem] = useState<StorageItemSummary | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [previewError, setPreviewError] = useState<string | null>(null)
  const [isPreviewLoading, setIsPreviewLoading] = useState(false)
  const previewCacheRef = useRef<Map<string, string>>(new Map())
  const [, forcePreviewCacheUpdate] = useState(0)

  const breadcrumbs = useMemo(() => {
    const segments = currentPath ? currentPath.split('/').filter(Boolean) : []
    const crumbs = segments.map((segment, index) => ({
      label: segment,
      path: segments.slice(0, index + 1).join('/'),
    }))
    return [{ label: 'Raiz', path: '' }, ...crumbs]
  }, [currentPath])

  const currentBucketLabel = useMemo(() => {
    if (!selectedBucket) {
      return 'Sin buckets disponibles'
    }
    const bucket = buckets.find((b) => b.name === selectedBucket)
    return bucket ? bucket.name : selectedBucket
  }, [buckets, selectedBucket])

  const updateMessage = useCallback((kind: MessageKind, text: string) => {
    setMessage({ kind, text })
  }, [])

  const refreshItems = useCallback(
    async (bucket: string, path: string) => {
      setIsLoading(true)
      const { data, error } = await listObjects(bucket, path)
      if (error) {
        updateMessage('error', error)
      } else {
        setItems(data)
      }
      setIsLoading(false)
    },
    [updateMessage],
  )

  const refreshBuckets = useCallback(async () => {
    const { data, error } = await listBuckets()
    if (error) {
      updateMessage('error', error)
      return
    }
    setBuckets(data)
    if (!selectedBucket && data.length > 0) {
      const nextBucket = data[0].name
      setSelectedBucket(nextBucket)
      setCurrentPath('')
      await refreshItems(nextBucket, '')
    }
  }, [refreshItems, selectedBucket, updateMessage])

  const handleSelectBucket = useCallback(
    async (bucketName: string) => {
      if (bucketName === selectedBucket) {
        return
      }
      setSelectedBucket(bucketName)
      setCurrentPath('')
      await refreshItems(bucketName, '')
      updateMessage('info', `Mostrando contenido de ${bucketName}`)
    },
    [refreshItems, selectedBucket, updateMessage],
  )

  const handleNavigateTo = useCallback(
    async (path: string) => {
      if (!selectedBucket) {
        return
      }
      setCurrentPath(path)
      await refreshItems(selectedBucket, path)
    },
    [refreshItems, selectedBucket],
  )

  const handleCreateFolder = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      if (!selectedBucket) {
        updateMessage('error', 'Selecciona un bucket antes de crear carpetas.')
        return
      }
      const nameToCreate = folderName.trim()
      if (!nameToCreate) {
        updateMessage('error', 'El nombre de la carpeta es obligatorio.')
        return
      }

      startTransition(async () => {
        const result = await createFolder(selectedBucket, currentPath, nameToCreate)
        if (result.error) {
          updateMessage('error', result.error)
          return
        }
        setFolderName('')
        updateMessage('success', `Carpeta "${nameToCreate}" creada correctamente.`)
        await refreshItems(selectedBucket, currentPath)
      })
    },
    [currentPath, folderName, refreshItems, selectedBucket, startTransition, updateMessage],
  )

  const handleUpload = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      if (!selectedBucket) {
        updateMessage('error', 'Selecciona un bucket antes de subir archivos.')
        return
      }
      const form = event.currentTarget
      const formData = new FormData(form)
      formData.set('bucket', selectedBucket)
      formData.set('path', currentPath)

      setIsUploading(true)
      const result = await uploadFile(formData)
      setIsUploading(false)
      form.reset()

      if (result.error) {
        updateMessage('error', result.error)
        return
      }

      updateMessage('success', `Archivo subido a ${result.data.path || 'la carpeta actual'}.`)
      await refreshItems(selectedBucket, currentPath)
    },
    [currentPath, refreshItems, selectedBucket, updateMessage],
  )

  const handleDelete = useCallback(
    async (item: StorageItemSummary) => {
      if (!selectedBucket) {
        updateMessage('error', 'Selecciona un bucket antes de eliminar elementos.')
        return
      }

      if (!item.path) {
        updateMessage('error', 'La ruta del elemento no es valida.')
        return
      }

      const confirmed = window.confirm(
        item.isFolder
          ? `Estas a punto de eliminar la carpeta "${item.name}". Asegurate de que este vacia en Supabase. Deseas continuar?`
          : `Eliminar el archivo "${item.name}"?`,
      )
      if (!confirmed) {
        return
      }

      startTransition(async () => {
        const result = await deleteObject(selectedBucket, item.path)
        if (result.error) {
          updateMessage('error', result.error)
          return
        }
        updateMessage('success', `Elemento "${item.name}" eliminado.`)
        await refreshItems(selectedBucket, currentPath)
      })
    },
    [currentPath, refreshItems, selectedBucket, startTransition, updateMessage],
  )

  const openRenameFor = useCallback((item: StorageItemSummary) => {
    if (item.isFolder) {
      updateMessage('info', 'El renombrado rapido solo esta disponible para archivos individuales.')
      return
    }
    setRenameTarget(item)
    setRenameValue(item.name)
  }, [updateMessage])

  const handleRenameSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      if (!selectedBucket || !renameTarget) {
        updateMessage('error', 'No hay ningun archivo seleccionado para renombrar.')
        return
      }
      const trimmedValue = renameValue.trim()
      if (!trimmedValue) {
        updateMessage('error', 'El nuevo nombre no puede estar vacio.')
        return
      }

      const parentPath =
        renameTarget.path.split('/').slice(0, -1).join('/') // '' if root
      const destination = [parentPath, trimmedValue].filter(Boolean).join('/')

      startTransition(async () => {
        const result = await moveObject(selectedBucket, renameTarget.path, destination)
        if (result.error) {
          updateMessage('error', result.error)
          return
        }
        updateMessage('success', `Archivo renombrado a "${trimmedValue}".`)
        setRenameTarget(null)
        setRenameValue('')
        await refreshItems(selectedBucket, currentPath)
      })
    },
    [currentPath, refreshItems, renameTarget, renameValue, selectedBucket, startTransition, updateMessage],
  )

  const handleCancelRename = useCallback(() => {
    setRenameTarget(null)
    setRenameValue('')
  }, [])

  const handlePreview = useCallback(
    async (item: StorageItemSummary) => {
      if (!selectedBucket) {
        updateMessage('error', 'Selecciona un bucket antes de previsualizar archivos.')
        return
      }

      if (!isImageItem(item)) {
        updateMessage('info', 'La previsualizacion solo esta disponible para imagenes.')
        return
      }

      setPreviewItem(item)
      setPreviewError(null)

      const cachedUrl = previewCacheRef.current.get(item.path) ?? null
      setPreviewUrl(cachedUrl)
      setIsPreviewLoading(false)
      if (cachedUrl) {
        return
      }

      setIsPreviewLoading(true)
      const result = await getObjectPreviewUrl(selectedBucket, item.path)
      setIsPreviewLoading(false)

      if (result.error) {
        setPreviewError(result.error)
        updateMessage('error', result.error)
        return
      }

      const url = result.data.url
      previewCacheRef.current.set(item.path, url)
      setPreviewUrl(url)
    },
    [selectedBucket, updateMessage],
  )

  const handleClosePreview = useCallback(() => {
    setPreviewItem(null)
    setPreviewUrl(null)
    setPreviewError(null)
    setIsPreviewLoading(false)
  }, [])

  useEffect(() => {
    if (!selectedBucket || items.length === 0) {
      return
    }

    let isCancelled = false

    const preload = async () => {
      const pendingImages = items.filter(
        (item) => isImageItem(item) && !previewCacheRef.current.has(item.path),
      )
      if (pendingImages.length === 0) {
        return
      }

      try {
        const results = await Promise.all(
          pendingImages.map(async (item) => {
            const result = await getObjectPreviewUrl(selectedBucket, item.path)
            return { item, result }
          }),
        )

        if (isCancelled) {
          return
        }

        let cacheUpdated = false
        let firstError: string | null = null

        results.forEach(({ item, result }) => {
          if (result.error) {
            if (!firstError) {
              firstError = result.error
            }
            return
          }

          const url = result.data.url
          if (!previewCacheRef.current.has(item.path)) {
            previewCacheRef.current.set(item.path, url)
            cacheUpdated = true
          }
        })

        if (cacheUpdated && !isCancelled) {
          forcePreviewCacheUpdate((value) => value + 1)
        }

        if (firstError) {
          updateMessage('error', firstError)
        }
      } catch (error) {
        if (!isCancelled) {
          console.error('Error preloading image previews:', error)
        }
      }
    }

    void preload()

    return () => {
      isCancelled = true
    }
  }, [items, selectedBucket, updateMessage, forcePreviewCacheUpdate])

  useEffect(() => {
    if (!previewItem) {
      return
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClosePreview()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleClosePreview, previewItem])

  const bucketIsEmpty = !selectedBucket

  return (
    <>
      <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Buckets disponibles</h2>
          <p className="text-sm text-gray-500">Selecciona un bucket para administrar su contenido.</p>
        </div>
        <button
          onClick={() => refreshBuckets()}
          className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          type="button"
        >
          Actualizar buckets
        </button>
      </div>

      {message && (
        <div
          className={`rounded-md border px-4 py-3 text-sm ${
            message.kind === 'error'
              ? 'border-red-200 bg-red-50 text-red-700'
              : message.kind === 'success'
              ? 'border-green-200 bg-green-50 text-green-700'
              : 'border-blue-200 bg-blue-50 text-blue-700'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="rounded-lg border border-gray-200 bg-white p-4">
          <ul className="space-y-2">
            {buckets.map((bucket) => (
              <li key={bucket.id}>
                <button
                  type="button"
                  onClick={() => handleSelectBucket(bucket.name)}
                  className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm font-medium ${
                    bucket.name === selectedBucket
                      ? 'bg-blue-600 text-white shadow'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span>{bucket.name}</span>
                  <span className="text-xs font-normal">{bucket.public ? 'Publico' : 'Privado'}</span>
                </button>
              </li>
            ))}
            {buckets.length === 0 && (
              <li className="text-sm text-gray-500">No se encontraron buckets configurados.</li>
            )}
          </ul>
        </aside>

        <section className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{currentBucketLabel}</h3>
              <nav className="mt-1 flex flex-wrap items-center gap-1 text-sm text-gray-500">
                {breadcrumbs.map((crumb, index) => (
                  <div key={crumb.path} className="flex items-center gap-1">
                    <button
                      type="button"
                      className={`rounded px-2 py-1 ${
                        crumb.path === currentPath
                          ? 'bg-blue-100 text-blue-700'
                          : 'hover:bg-gray-100 hover:text-gray-700'
                      }`}
                      onClick={() => handleNavigateTo(crumb.path)}
                      disabled={crumb.path === currentPath}
                    >
                      {crumb.label || 'Raiz'}
                    </button>
                    {index < breadcrumbs.length - 1 && <span className="text-gray-400">/</span>}
                  </div>
                ))}
              </nav>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => selectedBucket && refreshItems(selectedBucket, currentPath)}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Recargar carpeta
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <form onSubmit={handleCreateFolder} className="rounded-md border border-gray-200 p-4">
              <h4 className="text-sm font-semibold text-gray-900">Nueva carpeta</h4>
              <p className="mt-1 text-xs text-gray-500">
                Crea una subcarpeta dentro de la ubicacion actual.
              </p>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <input
                  type="text"
                  name="folderName"
                  value={folderName}
                  onChange={(event) => setFolderName(event.target.value)}
                  placeholder="Nombre de la carpeta"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  disabled={bucketIsEmpty || isPending}
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                  disabled={bucketIsEmpty || isPending}
                >
                  Crear
                </button>
              </div>
            </form>

            <form onSubmit={handleUpload} className="rounded-md border border-gray-200 p-4">
              <h4 className="text-sm font-semibold text-gray-900">Subir archivo</h4>
              <p className="mt-1 text-xs text-gray-500">
                Sube archivos directamente a la ubicacion seleccionada. Las cargas reemplazan archivos con el mismo
                nombre.
              </p>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
                <input
                  type="file"
                  name="file"
                  className="w-full text-sm text-gray-700 disabled:opacity-50"
                  disabled={bucketIsEmpty || isUploading}
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
                  disabled={bucketIsEmpty || isUploading}
                >
                  {isUploading ? 'Subiendo...' : 'Subir'}
                </button>
              </div>
            </form>
          </div>

          <div className="mt-6 overflow-hidden rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Nombre
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Tipo
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Tamano
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Actualizado
                  </th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-sm text-gray-500">
                      Cargando contenido...
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-sm text-gray-500">
                      No hay elementos en esta ubicacion.
                    </td>
                  </tr>
                ) : (
                  items.map((item) => {
                    const isRenaming = renameTarget?.path === item.path
                    const isImage = isImageItem(item)
                    const cachedPreviewUrl = isImage ? previewCacheRef.current.get(item.path) ?? null : null
                    return (
                      <tr key={item.path}>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          <div className="flex items-center gap-3">
                            {isImage && (
                              <div className="relative h-10 w-10 overflow-hidden rounded border border-gray-200 bg-gray-50">
                                {cachedPreviewUrl ? (
                                  <Image
                                    src={cachedPreviewUrl}
                                    alt={item.name}
                                    fill
                                    sizes="40px"
                                    className="object-cover"
                                    unoptimized
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center">
                                    <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                                      Img
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}
                            {item.isFolder ? (
                              <button
                                type="button"
                                className="text-blue-600 hover:underline"
                                onClick={() => handleNavigateTo(item.path)}
                              >
                                {item.name}
                              </button>
                            ) : (
                              <span className="break-all">{item.name}</span>
                            )}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                          {item.isFolder ? 'Carpeta' : isImage ? 'Imagen' : 'Archivo'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                          {item.isFolder ? '—' : formatBytes(item.size)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                          {item.updated_at ? dateFormatter.format(new Date(item.updated_at)) : '—'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-gray-500">
                          {isRenaming ? (
                            <form onSubmit={handleRenameSubmit} className="flex items-center justify-end gap-2">
                              <input
                                type="text"
                                value={renameValue}
                                onChange={(event) => setRenameValue(event.target.value)}
                                className="w-32 rounded-md border border-gray-300 px-2 py-1 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                              <button
                                type="submit"
                                className="rounded-md bg-blue-600 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-700"
                                disabled={isPending}
                              >
                                Guardar
                              </button>
                              <button
                                type="button"
                                className="rounded-md bg-gray-200 px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-300"
                                onClick={handleCancelRename}
                              >
                                Cancelar
                              </button>
                            </form>
                          ) : (
                            <div className="flex items-center justify-end gap-2">
                              {!item.isFolder && isImage && (
                                <button
                                  type="button"
                                  onClick={() => handlePreview(item)}
                                  className="rounded-md border border-gray-300 px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                                  disabled={isPreviewLoading && previewItem?.path === item.path}
                                >
                                  {isPreviewLoading && previewItem?.path === item.path ? 'Abriendo...' : 'Ver'}
                                </button>
                              )}
                              {!item.isFolder && (
                                <button
                                  type="button"
                                  onClick={() => openRenameFor(item)}
                                  className="rounded-md border border-gray-300 px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-100"
                                >
                                  Renombrar
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleDelete(item)}
                                className="rounded-md border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                                disabled={isPending}
                              >
                                Eliminar
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div
            className="absolute inset-0"
            onClick={handleClosePreview}
            aria-hidden="true"
          />
          <div className="relative z-10 w-full max-w-3xl overflow-hidden rounded-lg bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-gray-200 px-4 py-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">Previsualizacion</p>
                <h4 className="text-base font-semibold text-gray-900">{previewItem.name}</h4>
              </div>
              <button
                type="button"
                onClick={handleClosePreview}
                className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Cerrar previsualizacion"
              >
                X
              </button>
            </div>
            <div className="max-h-[75vh] overflow-auto bg-gray-50 p-4">
              {previewError ? (
                <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {previewError}
                </div>
              ) : isPreviewLoading && !previewUrl ? (
                <div className="flex h-48 items-center justify-center text-sm text-gray-500">
                  Generando vista previa...
                </div>
              ) : previewUrl ? (
                <div className="flex justify-center">
                  <div className="relative h-[60vh] w-full max-w-4xl">
                    <Image
                      src={previewUrl}
                      alt={previewItem.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 960px"
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                </div>
              ) : (
                <div className="flex h-48 items-center justify-center text-sm text-gray-500">
                  No se pudo cargar la imagen.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
