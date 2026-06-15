import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

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

export async function createClient() {
  if (!isSupabaseConfigured()) {
    // Typecast to unknown and then to server client return type to bypass ESLint 'no-explicit-any'
    return null as unknown as ReturnType<typeof createServerClient>;
  }
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}
