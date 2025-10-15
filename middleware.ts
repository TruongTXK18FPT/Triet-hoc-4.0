import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Protect selected routes: roadmap-ai, blog/create, quiz/create
const protectedPaths = [
  '/roadmap-ai',
  '/blog/create',
  '/quiz/create',
];

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  
  // Check if path needs protection
  const isProtected = protectedPaths.some((p) => pathname === p || pathname.startsWith(p + '/'));
  
  if (!isProtected) return NextResponse.next();

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (token) return NextResponse.next();

  // Redirect to login
  const url = req.nextUrl.clone();
  url.pathname = '/login';
  url.search = `callbackUrl=${encodeURIComponent(pathname + (search || ''))}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/roadmap-ai/:path*', '/blog/create/:path*', '/quiz/create/:path*'],
};


