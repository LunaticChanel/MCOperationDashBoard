import { createBrowserClient } from '@supabase/ssr';

export function isSupabaseConfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return !!(
    url && 
    url.startsWith('http') && 
    !url.includes('your-supabase-project-url') &&
    key &&
    !key.includes('your-supabase-anon-key')
  );
}

export function createClient() {
  if (!isSupabaseConfigured()) {
    // Typecast to unknown and then to browser client return type to bypass ESLint 'no-explicit-any'
    return null as unknown as ReturnType<typeof createBrowserClient>;
  }
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
