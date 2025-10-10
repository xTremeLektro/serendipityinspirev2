'use server'

import { createClient as createSupabaseClient, type SupabaseClient } from '@supabase/supabase-js'

type MaybeError<T> = {
  data: T
  error: string | null
}

export interface StorageBucketSummary {
  id: string
  name: string
  public: boolean
  created_at: string | null
  updated_at: string | null
}

export interface StorageItemSummary {
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

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE

function getAdminClient(): { client: SupabaseClient | null; error: string | null } {
  if (!SUPABASE_URL) {
    const error = 'Supabase URL is not configured. Set NEXT_PUBLIC_SUPABASE_URL in the environment.'
    console.error(error)
    return { client: null, error }
  }

  if (!SERVICE_KEY) {
    const error = 'Supabase service role key is not configured. Set SUPABASE_SERVICE_ROLE_KEY in the environment to use storage administration features.'
    console.error(error)
    return { client: null, error }
  }

  const client = createSupabaseClient(SUPABASE_URL, SERVICE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })

  return { client, error: null }
}

export async function listBuckets(): Promise<MaybeError<StorageBucketSummary[]>> {
  const { client, error: configError } = getAdminClient()
  if (!client) {
    return { data: [], error: configError }
  }

  const { data, error } = await client.storage.listBuckets()
  if (error) {
    console.error('Error listing buckets:', error)
    return { data: [], error: error.message }
  }

  const buckets: StorageBucketSummary[] = (data || []).map((bucket) => ({
    id: bucket.id,
    name: bucket.name,
    public: bucket.public,
    created_at: bucket.created_at ?? null,
    updated_at: bucket.updated_at ?? null,
  }))

  return { data: buckets, error: null }
}

export async function listObjects(bucketName: string, path: string): Promise<MaybeError<StorageItemSummary[]>> {
  const { client, error: configError } = getAdminClient()
  if (!client) {
    return { data: [], error: configError }
  }

  const normalizedPath = path ? path.replace(/^\/+|\/+$/g, '') : ''

  const { data, error } = await client.storage
    .from(bucketName)
    .list(normalizedPath || undefined, {
      limit: 1000,
      sortBy: { column: 'name', order: 'asc' },
    })

  if (error) {
    console.error(`Error listing objects for bucket ${bucketName} at path ${path}:`, error)
    return { data: [], error: error.message }
  }

  const items: StorageItemSummary[] = (data || []).map((item) => {
    const isFolder = item.id === null
    const itemPath = [normalizedPath, item.name].filter(Boolean).join('/')
    return {
      id: item.id,
      name: item.name,
      created_at: item.created_at ?? null,
      updated_at: item.updated_at ?? null,
      last_accessed_at: item.last_accessed_at ?? null,
      size: typeof (item.metadata as { size?: unknown } | null)?.size === 'number'
        ? ((item.metadata as { size?: number }).size ?? null)
        : null,
      metadata: item.metadata ?? null,
      isFolder,
      path: itemPath,
    }
  })

  const foldersFirst = items.sort((a, b) => {
    if (a.isFolder === b.isFolder) {
      return a.name.localeCompare(b.name)
    }
    return a.isFolder ? -1 : 1
  })

  return { data: foldersFirst, error: null }
}

export async function createFolder(bucketName: string, path: string, folderName: string): Promise<MaybeError<{ path: string }>> {
  const { client, error: configError } = getAdminClient()
  if (!client) {
    return { data: { path: '' }, error: configError }
  }

  const trimmedName = folderName.trim().replace(/\/+$/g, '')
  if (!trimmedName) {
    return { data: { path: '' }, error: 'El nombre de la carpeta es obligatorio.' }
  }

  const normalizedPath = path ? path.replace(/^\/+|\/+$/g, '') : ''
  const targetPath = [normalizedPath, trimmedName].filter(Boolean).join('/')

  const placeholderPath = `${targetPath}/.keep`
  const { error } = await client.storage.from(bucketName).upload(placeholderPath, new Uint8Array(), {
    upsert: false,
    contentType: 'application/octet-stream',
  })

  if (error && error.message !== 'The resource already exists') {
    console.error(`Error creating folder ${targetPath} in bucket ${bucketName}:`, error)
    return { data: { path: targetPath }, error: error.message }
  }

  return { data: { path: targetPath }, error: null }
}

export async function uploadFile(formData: FormData): Promise<MaybeError<{ path: string }>> {
  const bucketName = formData.get('bucket') as string | null
  const path = (formData.get('path') as string | null) ?? ''
  const file = formData.get('file') as File | null

  if (!bucketName) {
    return { data: { path: '' }, error: 'El bucket es obligatorio.' }
  }
  if (!file || file.size === 0) {
    return { data: { path: '' }, error: 'Selecciona un archivo valido para subir.' }
  }

  const { client, error: configError } = getAdminClient()
  if (!client) {
    return { data: { path: '' }, error: configError }
  }

  const normalizedPath = path ? path.replace(/^\/+|\/+$/g, '') : ''
  const targetPath = [normalizedPath, file.name].filter(Boolean).join('/')

  const arrayBuffer = await file.arrayBuffer()
  const { error } = await client.storage.from(bucketName).upload(targetPath, arrayBuffer, {
    cacheControl: '3600',
    upsert: true,
    contentType: file.type || 'application/octet-stream',
  })

  if (error) {
    console.error(`Error uploading file to ${bucketName}/${targetPath}:`, error)
    return { data: { path: targetPath }, error: error.message }
  }

  return { data: { path: targetPath }, error: null }
}

export async function deleteObject(bucketName: string, targetPath: string): Promise<MaybeError<{ path: string }>> {
  const { client, error: configError } = getAdminClient()
  if (!client) {
    return { data: { path: targetPath }, error: configError }
  }

  if (!targetPath) {
    return { data: { path: targetPath }, error: 'Selecciona un archivo valido para eliminar.' }
  }

  const { data, error } = await client.storage.from(bucketName).remove([targetPath])

  if (error) {
    console.error(`Error deleting ${bucketName}/${targetPath}:`, error)
    return { data: { path: targetPath }, error: error.message }
  }

  if (!data || data.length === 0) {
    return { data: { path: targetPath }, error: 'No se elimino ningun elemento. Verifica la ruta.' }
  }

  return { data: { path: targetPath }, error: null }
}

export async function moveObject(bucketName: string, sourcePath: string, targetPath: string): Promise<MaybeError<{ path: string }>> {
  const { client, error: configError } = getAdminClient()
  if (!client) {
    return { data: { path: targetPath }, error: configError }
  }

  const normalizedSource = sourcePath.replace(/^\/+/, '')
  const normalizedTarget = targetPath.replace(/^\/+/, '').replace(/\/{2,}/g, '/')

  if (!normalizedSource) {
    return { data: { path: normalizedTarget }, error: 'Selecciona un archivo valido para mover.' }
  }

  if (!normalizedTarget) {
    return { data: { path: normalizedTarget }, error: 'Proporciona una ruta destino valida.' }
  }

  const { error } = await client.storage.from(bucketName).move(normalizedSource, normalizedTarget)

  if (error) {
    console.error(`Error moving ${bucketName}/${normalizedSource} to ${bucketName}/${normalizedTarget}:`, error)
    return { data: { path: normalizedTarget }, error: error.message }
  }

  return { data: { path: normalizedTarget }, error: null }
}

export async function getObjectPreviewUrl(
  bucketName: string,
  targetPath: string,
  expiresInSeconds = 60 * 10,
): Promise<MaybeError<{ url: string }>> {
  const { client, error: configError } = getAdminClient()
  if (!client) {
    return { data: { url: '' }, error: configError }
  }

  const normalizedPath = targetPath.replace(/^\/+/, '')
  if (!normalizedPath) {
    return { data: { url: '' }, error: 'La ruta del archivo no es valida.' }
  }

  const { data, error } = await client.storage.from(bucketName).createSignedUrl(normalizedPath, expiresInSeconds)

  if (error) {
    console.error(`Error generating preview URL for ${bucketName}/${normalizedPath}:`, error)
    return { data: { url: '' }, error: error.message }
  }

  if (!data?.signedUrl) {
    return { data: { url: '' }, error: 'No se pudo generar un enlace de previsualizacion.' }
  }

  return { data: { url: data.signedUrl }, error: null }
}

export async function getObjectPublicUrl(
  bucketName: string,
  targetPath: string,
): Promise<MaybeError<{ url: string }>> {
  const { client, error: configError } = getAdminClient()
  if (!client) {
    return { data: { url: '' }, error: configError }
  }

  const normalizedPath = targetPath.replace(/^\/+/, '')
  if (!normalizedPath) {
    return { data: { url: '' }, error: 'La ruta del archivo no es valida.' }
  }

  const { data } = client.storage.from(bucketName).getPublicUrl(normalizedPath)

  if (data?.publicUrl) {
    return { data: { url: data.publicUrl }, error: null }
  }

  const { data: signed, error } = await client.storage
    .from(bucketName)
    .createSignedUrl(normalizedPath, 60 * 60)

  if (error) {
    console.error(`Error generating public URL for ${bucketName}/${normalizedPath}:`, error)
    return { data: { url: '' }, error: error.message }
  }

  if (!signed?.signedUrl) {
    return { data: { url: '' }, error: 'No se pudo generar un enlace publico para la imagen seleccionada.' }
  }

  return { data: { url: signed.signedUrl }, error: null }
}
