import { NextResponse, type NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const hasSession = req.cookies.has('auth_session');
  const { pathname } = req.nextUrl;
  const protectedPaths = ['/dashboard', '/items', '/admin'];
  const needsAuth = protectedPaths.some((p) => pathname.startsWith(p));
  if (needsAuth && !hasSession) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ['/dashboard/:path*', '/items/:path*', '/admin/:path*'] };
