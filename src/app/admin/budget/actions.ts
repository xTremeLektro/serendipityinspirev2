'use server';

import { revalidatePath } from 'next/cache';
import { createSupabaseServerClient } from '@/lib/supabase/utils';
import { QuoteRequest } from '@/lib/types';

export async function deleteQuoteRequest(formData: FormData) {
  const id = formData.get('id') as string;
  if (!id) return;

  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) {
    // Or handle error appropriately
    return;
  }

  const supabase = await createSupabaseServerClient();

  await supabase.from('quote_requests').delete().eq('id', numericId);

  revalidatePath('/admin/budget');
}

export async function getQuoteRequests(): Promise<{ data: QuoteRequest[] | null; error: string | null }> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from('quote_requests').select('*').order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching quote requests:', error);
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

export async function updateQuoteRequestStatus(formData: FormData) {
  const id = formData.get('id') as string;
  const status = formData.get('status') as string;

  if (!id || !status) {
    return { error: 'ID and status are required.' };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('quote_requests')
    .update({ status: status })
    .eq('id', id)
    .select();

  if (error) {
    console.error('Error updating quote request status:', error);
    return { error: error.message };
  }

  revalidatePath('/admin/budget');
  return { data, error: null };
}
