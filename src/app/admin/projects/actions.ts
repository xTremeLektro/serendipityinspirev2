'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getProjects() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('projects').select('*')
  if (error) {
    console.error('Error fetching projects:', error)
    return []
  }
  return data
}

export async function addProject(formData: FormData) {
  const supabase = await createClient()
  const project_name = formData.get('project_name') as string
  const short_description = formData.get('short_description') as string
  const detailed_description = formData.get('detailed_description') as string
  const location = formData.get('location') as string
  const end_date = formData.get('end_date') as string
  const property_type = formData.get('property_type') as string
  const style = formData.get('style') as string
  const scope = formData.get('scope') as string

  const projectData = {
    project_name,
    short_description,
    detailed_description,
    location,
    end_date,
    property_type,
    style,
    scope,
  };

  const { error } = await supabase.from('projects').insert([projectData])

  if (error) {
    console.error('Error adding project:', error)
    return { error: error.message }
  }

  revalidatePath('/admin/projects')
}

export async function deleteProject(formData: FormData) {
    const supabase = await createClient()
    const id = formData.get('id') as string
    const { error } = await supabase.from('projects').delete().match({ id })
    if (error) {
        console.error('Error deleting project:', error)
        return { error: error.message }
    }
    revalidatePath('/admin/projects')
}

export async function getProject(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('projects').select('*').eq('id', id).single()
  if (error) {
    console.error('Error fetching project:', error)
    return null
  }
  return data
}

export async function updateProject(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string
  const project_name = formData.get('project_name') as string
  const short_description = formData.get('short_description') as string
  const detailed_description = formData.get('detailed_description') as string
  const location = formData.get('location') as string
  const end_date = formData.get('end_date') as string
  const property_type = formData.get('property_type') as string
  const style = formData.get('style') as string
  const scope = formData.get('scope') as string

  const projectData = {
    project_name,
    short_description,
    detailed_description,
    location,
    end_date,
    property_type,
    style,
    scope,
  };

  const { error } = await supabase.from('projects').update(projectData).eq('id', id)

  if (error) {
    console.error('Error updating project:', error)
    return { error: error.message }
  }

  revalidatePath(`/admin/projects/${id}`)
  revalidatePath('/admin/projects')
}

export async function getProjectPics(projectId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('project_pics').select('*').eq('project_id', projectId).order('ord')
  if (error) {
    console.error('Error fetching project pictures:', error)
    return []
  }
  return data
}

export async function addProjectPic(
  prevState: { error: string | null; success: boolean },
  formData: FormData
): Promise<{ error: string | null; success: boolean }> {
  const supabase = await createClient();
  const project_id = formData.get('project_id');
  const photo = formData.get('photo') as File;
  const caption = formData.get('caption');

  if (!photo || photo.size === 0) {
    const errorMessage = 'A photo is required.';
    console.error(errorMessage);
    return { error: errorMessage, success: false };
  }

  const arrayBuffer = await photo.arrayBuffer();

  // 1. Upload image to storage
  const fileName = `projects/${project_id}/${Date.now()}-${photo.name}`
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

  // 3. Insert into project_pics table
  const { error: dbError } = await supabase.from('project_pics').insert([
    {
      project_id,
      photo_url: publicUrlData.publicUrl,
      caption,
    },
  ]);

  if (dbError) {
    const errorMessage = `Error adding project picture to database: ${dbError.message}`;
    console.error(errorMessage);
    // Clean up the uploaded file if the DB insert fails
    await supabase.storage.from('attachments').remove([uploadData.path]);
    return { error: errorMessage, success: false };
  }

  revalidatePath(`/admin/projects/${project_id}`)
  return { success: true, error: null };
}

export async function deleteProjectPic(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string
  const project_id = formData.get('project_id') as string
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
  const { error } = await supabase.from('project_pics').delete().match({ id })
  if (error) {
      console.error('Error deleting project picture:', error)
      return { error: error.message }
  }
  revalidatePath(`/admin/projects/${project_id}`)
}

export async function updateProjectPicAttributes(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string
  const project_id = formData.get('project_id') as string
  const is_home = formData.get('is_home') === 'on'
  const is_head_pic = formData.get('is_head_pic') === 'on'
  const ord = parseInt(formData.get('ord') as string) || 0

  const { error } = await supabase.from('project_pics').update({
    is_home,
    is_head_pic,
    ord,
  }).eq('id', id)

  if (error) {
    console.error('Error updating project picture attributes:', error)
    return { error: error.message }
  }

  revalidatePath(`/admin/projects/${project_id}`)
}
