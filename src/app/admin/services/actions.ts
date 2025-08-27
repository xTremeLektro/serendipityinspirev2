'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

interface Service {
  id: string;
  service_name: string;
  service_desc: string;
  fac_type_id: string | null;
  faq_type_list?: { faq_type: string };
  ord: number | null;
}

export async function getServices(): Promise<Service[]> {
  const supabase = await createClient()
  const { data, error } = await supabase.from('services').select(`
    *,
    faq_type_list (faq_type)
  `)
  if (error) {
    console.error('Error fetching services:', error)
    return []
  }
  return data
}

export async function getFaqTypes() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('faq_type_list').select('*')
  if (error) {
    console.error('Error fetching FAQ types:', error)
    return []
  }
  return data
}

export async function addService(formData: FormData) {
  const supabase = await createClient()
  const service_name = formData.get('service_name') as string
  const service_desc = formData.get('service_desc') as string
  const fac_type_id = formData.get('fac_type_id') as string

  const serviceData: { service_name: string; service_desc: string; fac_type_id?: string } = {
    service_name,
    service_desc,
  };

  if (fac_type_id) {
    serviceData.fac_type_id = fac_type_id;
  }

  const { error } = await supabase.from('services').insert([serviceData])

  if (error) {
    console.error('Error adding service:', error)
    return { error: error.message }
  }

  revalidatePath('/admin/services')
}

export async function deleteService(formData: FormData) {
    const supabase = await createClient()
    const id = formData.get('id') as string
    const { error } = await supabase.from('services').delete().match({ id })
    if (error) {
        console.error('Error deleting service:', error)
        return { error: error.message }
    }
    revalidatePath('/admin/services')
}

export async function getService(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('services').select('*').eq('id', id).single()
  if (error) {
    console.error('Error fetching service:', error)
    return null
  }
  return data
}

export async function updateService(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string
  const service_name = formData.get('service_name') as string
  const service_desc = formData.get('service_desc') as string
  const fac_type_id = formData.get('fac_type_id') as string

  const serviceData: { service_name: string; service_desc: string; fac_type_id?: string | null } = {
    service_name,
    service_desc,
  };

  if (fac_type_id) {
    serviceData.fac_type_id = fac_type_id;
  } else {
    serviceData.fac_type_id = null;
  }

  const { error } = await supabase.from('services').update(serviceData).eq('id', id)

  if (error) {
    console.error('Error updating service:', error)
    return { error: error.message }
  }

  revalidatePath(`/admin/services/${id}`)
  revalidatePath('/admin/services')
}

export async function updateServiceOrder(serviceId: string, formData: FormData) {
  const supabase = await createClient();
  const ord = parseInt(formData.get('ord') as string);

  const { error } = await supabase.from('services').update({ ord }).eq('id', serviceId);

  if (error) {
    console.error('Error updating service order:', error);
    return { error: error.message };
  }

  revalidatePath('/admin/services');
}

export async function getServicePics(serviceId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('service_pics').select('*').eq('service_id', serviceId).order('ord')
  if (error) {
    console.error('Error fetching service pictures:', error)
    return []
  }
  return data
}

export async function addServicePic(
  prevState: { error: string | null; success: boolean },
  formData: FormData
): Promise<{ error: string | null; success: boolean }> {
  const supabase = await createClient();
  const service_id = formData.get('service_id');
  const photo = formData.get('photo') as File;
  const caption = formData.get('caption');

  if (!photo || photo.size === 0) {
    const errorMessage = 'A photo is required.';
    console.error(errorMessage);
    return { error: errorMessage, success: false };
  }

  const arrayBuffer = await photo.arrayBuffer();

  // 1. Upload image to storage
  const fileName = `services/${service_id}/${Date.now()}-${photo.name}`
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('attachments')
    .upload(fileName, arrayBuffer, {
      contentType: photo.type,
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError || !uploadData) {
    console.error('Error uploading image:', uploadError);
    const errorMessage = `Error uploading image: ${uploadError?.message || 'Unknown error'}`;
    return { error: errorMessage, success: false };
  }

  // 2. Get public URL
  const { data: publicUrlData, error: urlError } = supabase.storage
    .from('attachments')
    .getPublicUrl(uploadData.path);

  if (urlError || !publicUrlData.publicUrl) {
    const errorMessage = `Error getting public URL: ${urlError?.message || 'URL not found.'}`;
    console.error(errorMessage);
    // Clean up the uploaded file if we can't get a URL
    await supabase.storage.from('attachments').remove([uploadData.path]);
    return { error: errorMessage, success: false };
  }

  // 3. Insert into service_pics table
  const { error: dbError } = await supabase.from('service_pics').insert([
    {
      service_id,
      photo_url: publicUrlData.publicUrl,
      caption,
    },
  ]);

  if (dbError) {
    const errorMessage = `Error adding service picture to database: ${dbError.message}`;
    console.error(errorMessage);
    // Clean up the uploaded file if the DB insert fails
    await supabase.storage.from('attachments').remove([uploadData.path]);
    return { error: errorMessage, success: false };
  }

  revalidatePath(`/admin/services/${service_id}`)
  return { success: true, error: null };
}

export async function deleteServicePic(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string
  const service_id = formData.get('service_id') as string
  const photo_url = formData.get('photo_url') as string

  // 1. Delete from storage
  if (photo_url) {
    const oldFilePath = photo_url.split('/storage/v1/object/public/attachments/')[1];
    if (oldFilePath) {
      const { error: deleteError } = await supabase.storage
        .from('attachments')
        .remove([oldFilePath])
      if (deleteError) {
        console.error('Error deleting old image:', deleteError)
      }
    }
  }

  // 2. Delete from table
  const { error } = await supabase.from('service_pics').delete().match({ id })
  if (error) {
      console.error('Error deleting service picture:', error)
      return { error: error.message }
  }
  revalidatePath(`/admin/services/${service_id}`)
}

export async function updateServicePicAttributes(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string
  const service_id = formData.get('service_id') as string
  const is_home = formData.get('is_home') === 'on' // Checkbox value is 'on' if checked
  const is_head_pic = formData.get('is_head_pic') === 'on'
  const ord = parseInt(formData.get('ord') as string) || 0 // Convert to number, default to 0 if invalid

  const { error } = await supabase.from('service_pics').update({
    is_home,
    is_head_pic,
    ord,
  }).eq('id', id)

  if (error) {
    console.error('Error updating service picture attributes:', error)
    return { error: error.message }
  }

  revalidatePath(`/admin/services/${service_id}`)
}
