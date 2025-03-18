// src/app/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value;


  const privateRoutes = ['/dashboard']; 

  
  const isPrivateRoute = privateRoutes.includes(request.nextUrl.pathname);

  
  const isAuthRoute = request.nextUrl.pathname.startsWith('/auth');

  
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }


  if (!token && isPrivateRoute) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

 
  return NextResponse.next();
}


export const config = {
  matcher: ['/dashboard', '/profile', '/auth']
};