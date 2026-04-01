import { auth } from '@/src/lib/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isLoginPage = req.nextUrl.pathname === '/login';
  const isAuthApi = req.nextUrl.pathname.startsWith('/api/auth');
  const isApiRoute = req.nextUrl.pathname.startsWith('/api/');

  // Allow auth API routes (login, callback, session, etc)
  if (isAuthApi) {
    return NextResponse.next();
  }

  // API routes without session -> 401
  if (isApiRoute && !isLoggedIn) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Logged-in users trying to access the login page -> redirect to dashboard
  if (isLoggedIn && isLoginPage) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Normal pages without session -> redirect to login
  if (!isLoggedIn && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|logo-matrix.svg).*)'],
};
