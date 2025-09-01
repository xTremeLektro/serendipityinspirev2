import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  const allCookies = await cookieStore.getAll();
  const cookieMap = new Map(allCookies.map(c => [c.name, c.value]));

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieMap.get(name);
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // The `set` method was called from a Server Component after headers were sent.
            // This can be ignored if you have middleware refreshing user sessions.
            console.warn('Supabase cookie set failed:', error);
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // The `delete` method was called from a Server Component after headers were sent.
            // This can be ignored if you have middleware refreshing user sessions.
            console.warn('Supabase cookie remove failed:', error);
          }
        },
      },
    }
  );
}