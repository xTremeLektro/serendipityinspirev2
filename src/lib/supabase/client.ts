import { createClient } from '@supabase/supabase-js';

// This client is safe to use in build steps like generateStaticParams
// as it does not depend on cookies or the request lifecycle.
export const createBuildTimeClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
};
