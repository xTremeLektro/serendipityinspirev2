'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

interface CarouselItem {
  id: string
  created_at: string
  short_desc: string | null
  picture: string | null
  ord: number
}

export async function fetchCarouselItems(): Promise<{
  data: CarouselItem[] | null
  error: any
}> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('pic_carrousel')
    .select('id, created_at, short_desc, picture, ord')
    .order('ord', { ascending: true })

  if (error) {
    console.error('Error fetching carousel items:', error)
    return { data: null, error }
  }
  return { data, error: null }
}

export async function updateCarouselItem(
  id: string,
  updates: { short_desc?: string | null; picture?: string | null }
): Promise<{
  success: boolean
  error: any
}> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('pic_carrousel')
    .update(updates)
    .eq('id', id)

  if (error) {
    console.error('Error updating carousel item:', error)
    return { success: false, error }
  }
  revalidatePath('/admin/carousel')
  return { success: true, error: null }
}

export async function uploadImageAndGetUrl(
  file: File,
  oldImageUrl?: string | null
): Promise<{
  publicUrl: string | null
  error: any
}> {
  const supabase = await createClient()
  const fileName = `carrousel/${Date.now()}-${file.name}`
  const { data, error: uploadError } = await supabase.storage
    .from('attachments') // Changed to 'attachments' bucket
    .upload(fileName, file, { cacheControl: '3600', upsert: false })

  if (uploadError) {
    console.error('Error uploading image:', uploadError)
    return { publicUrl: null, error: uploadError }
  }

  // Delete old image if provided
  if (oldImageUrl) {
    // Extract the path within the bucket, which is everything after the bucket name
    const oldFilePath = oldImageUrl.split('/storage/v1/object/public/attachments/')[1];
    if (oldFilePath) {
      const { error: deleteError } = await supabase.storage
        .from('attachments')
        .remove([oldFilePath])
      if (deleteError) {
        console.error('Error deleting old image:', deleteError)
        // Don't block the process if old image deletion fails
      }
    }
  }

  const { data: publicUrlData } = supabase.storage
    .from('attachments')
    .getPublicUrl(data.path)

  return { publicUrl: publicUrlData.publicUrl, error: null }
}

export async function swapCarouselItemOrder(
  id1: string,
  ord1: number,
  id2: string,
  ord2: number
): Promise<{
  success: boolean
  error: any
}> {
  const supabase = await createClient()

  // Perform updates in a transaction-like manner (sequential updates)
  const { error: error1 } = await supabase
    .from('pic_carrousel')
    .update({ ord: ord2 })
    .eq('id', id1)

  if (error1) {
    console.error('Error swapping order for item 1:', error1)
    return { success: false, error: error1 }
  }

  const { error: error2 } = await supabase
    .from('pic_carrousel')
    .update({ ord: ord1 })
    .eq('id', id2)

  if (error2) {
    console.error('Error swapping order for item 2:', error2)
    return { success: false, error: error2 }
  }

  revalidatePath('/admin/carousel')
  return { success: true, error: null }
}
