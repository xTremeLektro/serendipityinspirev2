'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function fetchContactInquiries({
  page,
  limit,
  startDate,
  endDate,
  isReviewed,
  searchName,
}: {
  page: number
  limit: number
  startDate?: string
  endDate?: string
  isReviewed?: boolean
  searchName?: string
}) {
  const supabase = await createClient()
  let query = supabase.from('contact_inquiries').select('*', { count: 'exact' })

  if (startDate) {
    query = query.gte('created_at', startDate)
  }
  if (endDate) {
    query = query.lte('created_at', endDate)
  }
  if (isReviewed !== undefined) {
    query = query.eq('is_reviewed', isReviewed)
  }
  if (searchName) {
    query = query.ilike('name', `%${searchName}%`)
  }

  const { data, count, error } = await query
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1)

  if (error) {
    console.error('Error fetching contact inquiries:', error)
    return { data: [], count: 0, error }
  }

  return { data, count, error: null }
}

export async function updateContactInquiryStatus(id: string, is_reviewed: boolean) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('contact_inquiries')
    .update({ is_reviewed })
    .eq('id', id)
    .select()

  if (error) {
    console.error('Error updating contact inquiry status:', error)
    return { success: false, error }
  }

  revalidatePath('/admin/contacts')
  return { success: true, data }
}
