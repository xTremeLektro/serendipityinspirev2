import AdminHeader from '@/components/AdminHeader'
import StorageManager from './StorageManager'
import { listBuckets, listObjects } from './actions'
import type { StorageItemSummary } from './actions'

type PageSearchParams = Record<string, string | string[] | undefined> & {
  bucket?: string | string[]
  path?: string | string[]
}

export default async function AdminStoragePage({
  searchParams,
}: {
  searchParams?: Promise<PageSearchParams>
}) {
  const resolvedSearchParams = searchParams ? await searchParams : {}

  const getFirstValue = (value: string | string[] | undefined) =>
    Array.isArray(value) ? value[0] : value

  const { data: buckets, error: bucketError } = await listBuckets()

  const availableBucketNames = new Set(buckets.map((bucket) => bucket.name))
  const requestedBucket = getFirstValue(resolvedSearchParams.bucket)
  const selectedBucket =
    requestedBucket && availableBucketNames.has(requestedBucket)
      ? requestedBucket
      : buckets[0]?.name ?? null

  let initialPath = ''
  const requestedPath = getFirstValue(resolvedSearchParams.path)
  if (requestedPath) {
    try {
      initialPath = decodeURIComponent(requestedPath)
    } catch {
      initialPath = requestedPath
    }
  }

  let initialItems: StorageItemSummary[] = []
  let itemsError: string | null = null

  if (selectedBucket) {
    const { data, error } = await listObjects(selectedBucket, initialPath)
    initialItems = data
    itemsError = error
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader title="Almacenamiento" />
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <StorageManager
              initialBuckets={buckets}
              initialBucket={selectedBucket}
              initialPath={initialPath}
              initialItems={initialItems}
              bucketError={bucketError}
              itemsError={itemsError}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
