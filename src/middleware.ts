import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// Check if Supabase env variables are valid
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const isSupabaseConfigured = !!(
  supabaseUrl && 
  supabaseUrl.startsWith('http') && 
  !supabaseUrl.includes('your-supabase-project-url') &&
  supabaseAnonKey &&
  !supabaseAnonKey.includes('your-supabase-anon-key')
);

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // 1. Bypass auth check in local developer mode if Supabase is not fully configured yet
  // This allows the user to test and view UI pages on localhost immediately.
  if (!isSupabaseConfigured) {
    return response;
  }

  const supabase = createServerClient(
    supabaseUrl!,
    supabaseAnonKey!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Get current user session
  const { data: { user } } = await supabase.auth.getUser();
  const pathname = request.nextUrl.pathname;

  // Static files and system paths to ignore
  const isStatic = pathname.startsWith('/_next') || 
                   pathname.startsWith('/api') || 
                   pathname.includes('.') || 
                   pathname === '/favicon.ico';

  const isLoginPage = pathname.startsWith('/login');
  const isAuthCallback = pathname.startsWith('/auth');
  const isPendingPage = pathname.startsWith('/pending-approval');
  const isUnauthorizedPage = pathname.startsWith('/unauthorized');

  if (isStatic) {
    return response;
  }

  // 1. Not logged in -> Redirect to login page
  if (!user && !isLoginPage && !isAuthCallback && !isPendingPage && !isUnauthorizedPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. Logged in -> Verify approval and roles
  if (user) {
    // Fetch profile to check approval status and role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, is_approved')
      .eq('id', user.id)
      .single();

    // 2.1 User is not approved yet -> force redirect to /pending-approval
    if (!profile?.is_approved) {
      if (!isPendingPage && !isLoginPage && !isAuthCallback && !isUnauthorizedPage) {
        return NextResponse.redirect(new URL('/pending-approval', request.url));
      }
      return response;
    }

    // 2.2 Approved user trying to access login or pending-approval page -> Redirect to home
    if (isLoginPage || isPendingPage) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // 2.3 RBAC Route Protection
    const role = profile.role;

    if (pathname.startsWith('/admin') && role !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    if (pathname.startsWith('/nurse') && !['admin', 'nurse'].includes(role)) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
