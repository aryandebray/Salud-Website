import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  console.log('Middleware running for path:', request.nextUrl.pathname);
  
  // Add pathname to headers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', request.nextUrl.pathname);

  // Only protect admin routes
  if (!request.nextUrl.pathname.startsWith('/admin')) {
    console.log('Not an admin route, allowing access');
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // Don't protect the login page
  if (request.nextUrl.pathname === '/admin/login') {
    console.log('Login page, allowing access');
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // Redirect /admin to /admin/dashboard
  if (request.nextUrl.pathname === '/admin') {
    console.log('Redirecting from /admin to /admin/dashboard');
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  const token = request.cookies.get('admin_token');
  console.log('Admin token found:', !!token);

  if (!token) {
    console.log('No token found, redirecting to login');
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // If we have a token, allow access
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
} 