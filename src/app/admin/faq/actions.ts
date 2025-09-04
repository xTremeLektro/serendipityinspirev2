'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getFaqTypes() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('faq_type_list').select('*')
  if (error) {
    console.error('Error fetching FAQ types:', error)
    return []
  }
  return data
}

export async function addFaqType(formData: FormData) {
  const supabase = await createClient()
  const faqType = formData.get('faq_type') as string
  const { error } = await supabase.from('faq_type_list').insert([{ faq_type: faqType }])
  if (error) {
    console.error('Error adding FAQ type:', error)
    throw new Error(error.message)
  }
  revalidatePath('/admin/faq')
}

export async function deleteFaqType(formData: FormData) {
    const supabase = await createClient()
    const id = formData.get('id') as string
    const { error } = await supabase.from('faq_type_list').delete().match({ id })
    if (error) {
        console.error('Error deleting FAQ type:', error)
        throw new Error(error.message)
    }
    revalidatePath('/admin/faq')
}

export async function getFaqs() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('faq_list').select(`
    *,
    faq_type_list (faq_type)
  `).order('ord')
  if (error) {
    console.error('Error fetching FAQs:', error)
    return []
  }
  return data
}

export async function addFaq(formData: FormData) {
  const supabase = await createClient()
  const question = formData.get('question') as string
  const answer = formData.get('answer') as string
  const type = formData.get('type') as string

  const { error } = await supabase.from('faq_list').insert([{ question, answer, type }])

  if (error) {
    console.error('Error adding FAQ:', error)
    throw new Error(error.message)
  }

  revalidatePath('/admin/faq')
}

export async function deleteFaq(formData: FormData) {
    const supabase = await createClient()
    const id = formData.get('id') as string
    const { error } = await supabase.from('faq_list').delete().match({ id })
    if (error) {
        console.error('Error deleting FAQ:', error)
        throw new Error(error.message)
    }
    revalidatePath('/admin/faq')
}

export async function getFaq(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('faq_list').select(`
    *,
    faq_type_list (faq_type)
  `).eq('id', id).single()
  if (error) {
    console.error('Error fetching FAQ:', error)
    return null
  }
  return data
}

export async function updateFaq(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string
  const question = formData.get('question') as string
  const answer = formData.get('answer') as string
  const type = formData.get('type') as string
  const ord = parseInt(formData.get('ord') as string)

  const faqData: { question: string; answer: string; type: string; ord?: number } = {
    question,
    answer,
    type,
  };

  if (!isNaN(ord)) {
    faqData.ord = ord;
  }

  const { error } = await supabase.from('faq_list').update(faqData).eq('id', id)

  if (error) {
    console.error('Error updating FAQ:', error)
    throw new Error(error.message)
  }

  revalidatePath('/admin/faq')
}

export async function updateFaqOrder(faqId: string, formData: FormData) {
  const supabase = await createClient();
  const ord = parseInt(formData.get('ord') as string);

  const { error } = await supabase.from('faq_list').update({ ord }).eq('id', faqId);

  if (error) {
    console.error('Error updating faq order:', error);
    throw new Error(error.message);
  }

  revalidatePath('/admin/faq');
}