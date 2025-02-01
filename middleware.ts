import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest): NextResponse {
  const hostname = request.headers.get('host') || '';
  
  // Check specifically for compusophy subdomain
  if (hostname.startsWith('compusophy.')) {
    const response = NextResponse.next();
    response.headers.set('x-subdomain-context', 'compusophy');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/:path*',
};