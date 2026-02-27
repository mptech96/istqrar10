import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

// 1. Initialize the next-intl middleware
const intlMiddleware = createMiddleware({
  ...routing,
  localePrefix: 'always',
  localeDetection: true
});

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // ! if dev mode use user , if production mode use set_auth cookie .
  // 2. Check for the user cookie to know if the user is authenticated for routing
  // (Since the Auth Token is an HttpOnly cross-domain cookie, we use the 'user' cookie set by the frontend on successful login)
  const token = process.env.NODE_ENV === 'development' ? request.cookies.get('user')?.value : request.cookies.get('set_auth')?.value;
  // 3. Helper: Remove the locale (e.g., "/en/dashboard" -> "/dashboard")
  // We do this to check the *actual* route regardless of language
  const localePattern = `^/(${routing.locales.join('|')})`;
  const pathnameWithoutLocale = pathname.replace(new RegExp(localePattern), '') || '/';

  // 4. Define your route protection rules
  const isAuthPage = pathnameWithoutLocale === '/login' || pathnameWithoutLocale === '/register';
  // You can either list protected routes OR assume everything is protected except public ones
  const isProtectedRoute = pathnameWithoutLocale.startsWith('/dashboard') || pathnameWithoutLocale === '/profile';

  // --- LOGIC START ---

  // Scenario A: User is NOT logged in but tries to access a protected route
  if (isProtectedRoute && !token) {
    // Get the locale from the current URL to preserve language preference, or default
    const currentLocale = pathname.match(new RegExp(localePattern))?.[1] || routing.defaultLocale;
    
    // Redirect to login page
    return NextResponse.redirect(new URL(`/${currentLocale}/login`, request.url));
  }

  // Scenario B: User IS logged in but tries to access Login/Register
  if (isAuthPage && token) {
    const currentLocale = pathname.match(new RegExp(localePattern))?.[1] || routing.defaultLocale;
    
    // Redirect to dashboard
    return NextResponse.redirect(new URL(`/${currentLocale}/dashboard`, request.url));
  }

  // --- LOGIC END ---

  // 5. If Auth checks pass, let next-intl handle the localization
  return intlMiddleware(request);
}

// Keep your existing matcher config
export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};