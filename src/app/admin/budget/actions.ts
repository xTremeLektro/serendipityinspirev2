'use server';

import { revalidatePath } from 'next/cache';
import { createSupabaseServerClient } from '@/lib/supabase/utils';

export async function deleteQuoteRequest(formData: FormData) {
  const id = formData.get('id') as string;
  if (!id) return;

  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) {
    // Or handle error appropriately
    return;
  }

  const supabase = createSupabaseServerClient();

  await supabase.from('quote_requests').delete().eq('id', numericId);

  revalidatePath('/admin/budget');
}