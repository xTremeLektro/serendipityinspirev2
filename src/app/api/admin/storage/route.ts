import { NextRequest, NextResponse } from 'next/server'

import { listBuckets, listObjects } from '@/app/admin/storage/actions'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const bucketName = searchParams.get('bucket')
  const path = searchParams.get('path') ?? ''

  if (!bucketName) {
    const { data, error } = await listBuckets()
    if (error) {
      return NextResponse.json({ error }, { status: 500 })
    }
    return NextResponse.json({ buckets: data }, { status: 200 })
  }

  const { data, error } = await listObjects(bucketName, path)
  if (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
  return NextResponse.json({ items: data }, { status: 200 })
}
