import { createClient } from './supabase/server';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  type: string; // This will be the faq_type_list ID
}

export async function getGeneralFAQs(): Promise<FAQ[]> {
  const supabase = await createClient();

  // First, get the ID for 'General Questions' from faq_type_list
  const { data: faqTypeData, error: faqTypeError } = await supabase
    .from('faq_type_list')
    .select('id')
    .ilike('faq_type', 'General Questions')
    .single();

  if (faqTypeError) {
    console.error('Error fetching FAQ type "General Questions":', faqTypeError);
    return [];
  }

  if (!faqTypeData) {
    console.warn('FAQ type "General Questions" not found.');
    return [];
  }

  const generalTypeId = faqTypeData.id;

  // Then, get all FAQs with that type ID
  const { data: faqs, error: faqsError } = await supabase
    .from('faq_list')
    .select('*')
    .eq('type', generalTypeId)
    .order('question', { ascending: true }); // Order by question for consistency

  if (faqsError) {
    console.error('Error fetching general FAQs:', faqsError);
    return [];
  }

  return faqs;
}
