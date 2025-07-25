import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  // Check if Supabase environment variables are set
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  // Skip authentication checks if Supabase is not configured
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase environment variables not set. Authentication is disabled.")
    return res
  }
  
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Check if the user is authenticated
  const isAuthenticated = !!session
  const isAuthRoute = req.nextUrl.pathname.startsWith("/auth")
  const isApiRoute = req.nextUrl.pathname.startsWith("/api")
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin")

  // Define public routes that don't require authentication
  const publicRoutes = ["/", "/about", "/contact", "/pricing", "/collections", "/terms", "/privacy", "/cookies"]

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
