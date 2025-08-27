import { createClient } from './supabase/server';

interface Service {
  id: string;
  service_name: string;
  service_desc: string;
  ord: number | null;
}

interface ServiceWithHeadPic extends Service {
  head_pic_url: string | null;
}

export async function getServicesWithHeadPics(): Promise<ServiceWithHeadPic[]> {
  const supabase = await createClient();

  const { data: services, error: servicesError } = await supabase
    .from('services')
    .select('*')
    .order('ord', { ascending: true });

  if (servicesError) {
    console.error('Error fetching services:', servicesError);
    return [];
  }

  const servicesWithPics: ServiceWithHeadPic[] = await Promise.all(
    services.map(async (service) => {
      const { data: headPic, error: headPicError } = await supabase
        .from('service_pics')
        .select('photo_url')
        .eq('service_id', service.id)
        .eq('is_head_pic', true)
        .single();

      if (headPicError && headPicError.code !== 'PGRST116') { // PGRST116 means no rows found
        console.error(`Error fetching head pic for service ${service.id}:`, headPicError);
      }

      return {
        ...service,
        head_pic_url: headPic ? headPic.photo_url : null,
      };
    })
  );

  return servicesWithPics;
}
