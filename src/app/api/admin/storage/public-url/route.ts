import { NextRequest, NextResponse } from 'next/server'

import { getObjectPublicUrl } from '@/app/admin/storage/actions'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const bucketName = searchParams.get('bucket')
  const targetPath = searchParams.get('path')

  if (!bucketName || !targetPath) {
    return NextResponse.json({ error: 'Se requiere especificar bucket y path.' }, { status: 400 })
  }

  const { data, error } = await getObjectPublicUrl(bucketName, targetPath)
  if (error) {
    return NextResponse.json({ error }, { status: 500 })
  }

  return NextResponse.json({ url: data.url }, { status: 200 })
}
