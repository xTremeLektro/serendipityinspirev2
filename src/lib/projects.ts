// src/lib/projects.ts
import { createClient } from '@/lib/supabase/server';

export async function getHomeProjects() {
  const supabase = await createClient();
  const { data: projects, error } = await supabase
    .from('projects')
    .select(`
      id,
      project_name,
      location,
      short_description,
      project_pics (
        photo_url
      )
    `)
    .eq('is_home', true)
    .eq('project_pics.is_head_pic', true)
    .limit(3);

  if (error) {
    console.error('Error fetching home projects:', error);
    return [];
  }

  return projects;
}

export async function getPaginatedProjects({ page = 1, limit = 12 }) {
  const supabase = await createClient();
  const { data, error, count } = await supabase
    .from('projects')
    .select(`
      id,
      project_name,
      location,
      short_description,
      project_pics (
        photo_url
      )
    `, { count: 'exact' })
    .eq('project_pics.is_head_pic', true)
    .range((page - 1) * limit, page * limit - 1);

  if (error) {
    console.error('Error fetching paginated projects:', error);
    return { projects: [], count: 0 };
  }

  return { projects: data, count };
}

export async function getProjectById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('projects')
    .select(`
      id,
      project_name,
      location,
      short_description,
      detailed_description,
      end_date,
      property_type,
      style,
      scope,
      project_pics (
        photo_url,
        caption
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching project by id:', error);
    return null;
  }

  return data;
}
