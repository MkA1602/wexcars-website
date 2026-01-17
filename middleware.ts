import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Helper to check if hostname is localhost
function isLocalhost(hostname: string): boolean {
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname.startsWith("localhost:") ||
    hostname.startsWith("127.0.0.1:") ||
    hostname === "0.0.0.0"
  )
}

// Helper to check if hostname is production domain
function isProductionDomain(hostname: string): boolean {
  return hostname === "wexcars.com" || hostname === "www.wexcars.com"
}

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const hostname = req.headers.get("host") || ""
  const pathname = req.nextUrl.pathname
  
  // Add security headers
  res.headers.set('X-DNS-Prefetch-Control', 'on')
  res.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
  res.headers.set('X-Frame-Options', 'SAMEORIGIN')
  res.headers.set('X-Content-Type-Options', 'nosniff')
  res.headers.set('X-XSS-Protection', '1; mode=block')
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  
  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://www.googletagmanager.com https://www.google-analytics.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://*.supabase.co https://*.supabase.in https://vitals.vercel-insights.com wss://*.supabase.co",
    "frame-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
    "upgrade-insecure-requests"
  ].join('; ')
  res.headers.set('Content-Security-Policy', csp)
  const isStaticAsset =
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/static/") ||
    pathname.startsWith("/images/") ||
    pathname.startsWith("/public/") ||
    pathname.startsWith("/assets/") ||
    pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|ico|txt|xml|json|css|js|woff2?|ttf|otf)$/i)
  
  // Check if Supabase environment variables are set
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  // Skip authentication checks if Supabase is not configured
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase environment variables not set. Authentication is disabled.")
    return res
  }
  
  const supabase = createMiddlewareClient({ req, res })
  
  // Define route types (declare once)
  const isAdminRoute = pathname.startsWith("/admin")
  const isApiRoute = pathname.startsWith("/api")
  const isAuthRoute = pathname.startsWith("/auth")
  const isMaintenanceRoute = pathname === "/maintenance"
  
  // Check maintenance mode for production domain only
  // Allow localhost and admin routes to bypass
  // Only check maintenance mode on production domain, not localhost
  // Also ALWAYS bypass static assets to avoid blocking images/css/js
  if (
    isProductionDomain(hostname) &&
    !isLocalhost(hostname) &&
    !isAdminRoute &&
    !isApiRoute &&
    !isMaintenanceRoute &&
    !isStaticAsset
  ) {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("setting_value")
        .eq("setting_key", "maintenance_mode")
        .single()

      if (!error && data?.setting_value) {
        const maintenanceMode = data.setting_value as { enabled: boolean }
        if (maintenanceMode.enabled) {
          // Redirect to maintenance page
          return NextResponse.rewrite(new URL("/maintenance", req.url))
        }
      }
    } catch (error) {
      // Fail open - allow access if we can't check maintenance mode
      console.error("Error checking maintenance mode:", error)
    }
  }

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Check if the user is authenticated
  const isAuthenticated = !!session

  // Define public routes that don't require authentication
  const publicRoutes = ["/", "/about", "/contact", "/pricing", "/collections", "/terms", "/privacy", "/cookies", "/help", "/faq", "/shipping", "/description"]

  // Check if the current path is a public route or starts with one
  const isPublicRoute = publicRoutes.some(
    (route) => req.nextUrl.pathname === route || req.nextUrl.pathname.startsWith(`${route}/`),
  )

  // Handle admin routes - require authentication and admin role
  if (isAdminRoute && isAuthenticated) {
    try {
      // Get user profile to check role
      const { data: userProfile, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', session.user.id)
        .single()

      if (error || !userProfile || (userProfile.role !== 'admin' && userProfile.role !== 'super_admin')) {
        // User is not admin, redirect to dashboard
        return NextResponse.redirect(new URL("/dashboard", req.url))
      }
    } catch (error) {
      console.error('Error checking admin role:', error)
      // If there's an error checking role, redirect to dashboard for safety
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }
  }

  // Redirect unauthenticated users to login page ONLY if they try to access protected routes
  if (!isAuthenticated && !isAuthRoute && !isApiRoute && !isPublicRoute) {
    const redirectUrl = new URL("/auth/login", req.url)
    redirectUrl.searchParams.set("redirectTo", req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && isAuthRoute && req.nextUrl.pathname !== "/auth/callback") {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
