import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { ADMIN_COOKIE_NAME, isValidAdminSessionValue } from '@/lib/admin';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin/login')) {
    return NextResponse.next();
  }

  const cookieValue = request.cookies.get(ADMIN_COOKIE_NAME)?.value;

  if (await isValidAdminSessionValue(cookieValue)) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL('/admin/login', request.url));
}

export const config = {
  matcher: ['/admin/:path*']
};
