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
  const token =request.cookies.get('user')?.value ;
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
    
    // Determine the dashboard path based on user role
    let dashboardPath = '/dashboard';
    try {
      const user = JSON.parse(decodeURIComponent(token));
      const role = user.role;
      if (role === 'auditor') {
        dashboardPath = '/dashboard/auditor-dashboard';
      } else if (role === 'company_admin') {
        dashboardPath = '/dashboard/company-dashboard';
      } else if (role === 'branch_manager') {
        dashboardPath = '/dashboard/branch-dashboard';
      }
    } catch {
      // Fallback
    }
    
    // Redirect to the role-specific dashboard
    return NextResponse.redirect(new URL(`/${currentLocale}${dashboardPath}`, request.url));
  }

  // Scenario C: User IS logged in, check role-based access for protected routes
  if (isProtectedRoute && token) {
    try {
      const user = JSON.parse(decodeURIComponent(token));
      const role = user.role;
      const currentLocale = pathname.match(new RegExp(localePattern))?.[1] || routing.defaultLocale;

      // Define allowed route prefixes per role
      const rolePermissions: Record<string, string[]> = {
        super_admin: ['/dashboard'], // Super admin can access all dashboard routes
        auditor: [
          '/dashboard/auditor-dashboard',
          '/dashboard/daily-visits',
          '/dashboard/tickets',
          '/dashboard/reports/auditor',
          '/dashboard/visits', // Needed for individual visit questions/reports
          '/dashboard/profile',
          '/dashboard/settings',
        ],
        company_admin: [
          '/dashboard/company-dashboard',
          '/dashboard/inspectors',
          '/dashboard/branches',
          '/dashboard/visits',
          '/dashboard/tickets',
          '/dashboard/reports/company',
          '/dashboard/profile',
          '/dashboard/settings',
        ],
        branch_manager: [
          '/dashboard/branch-dashboard',
          '/dashboard/visits',
          '/dashboard/tickets',
          '/dashboard/reports/branch',
          '/dashboard/profile',
          '/dashboard/settings',
        ],
      };

      const allowedPaths = rolePermissions[role] || [];
      const isAuthorized = 
        role === 'super_admin' || 
        allowedPaths.some(path => pathnameWithoutLocale.startsWith(path));

      if (!isAuthorized) {
        // Redirect unauthorized users to the specialized unauthorized page instead of dashboard
        return NextResponse.redirect(new URL(`/${currentLocale}/unauthorized`, request.url));
      }
    } catch {
      // If parsing fails, allow the request to proceed (standard auth check already passed)
    }
  }

  // --- LOGIC END ---

  // 5. If Auth checks pass, let next-intl handle the localization
  return intlMiddleware(request);
}

// Keep your existing matcher config
export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};