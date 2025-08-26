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
