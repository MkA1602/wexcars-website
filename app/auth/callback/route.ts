import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import type { Database } from "@/lib/database.types"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const type = requestUrl.searchParams.get("type")
  const nextParam = requestUrl.searchParams.get("next") ?? "/dashboard"

  // Validate redirect URL to prevent open redirects
  const { validateRedirectUrl } = await import("@/lib/security")
  const next = validateRedirectUrl(nextParam, [])

  if (!code) {
    return NextResponse.redirect(new URL("/auth/login?error=missing_code", request.url))
  }

  const cookieStore = cookies()
  const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })
  
  try {
    console.log("Attempting to exchange code for session...")
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      // Log error without sensitive data
      return NextResponse.redirect(new URL("/auth/login?error=auth_callback_error", request.url))
    }

    if (data.user) {
      // Determine if this is an email confirmation
      const isEmailConfirmation = type === "signup" || 
        (data.user.email_confirmed_at && 
         new Date(data.user.email_confirmed_at).getTime() > new Date(data.user.created_at).getTime() - 60000) // Within 1 minute of creation
      
      if (isEmailConfirmation) {
        // This is a signup confirmation - sanitize email before including in URL
        const sanitizedEmail = data.user.email ? encodeURIComponent(data.user.email.split('@')[0] + '@***') : ''
        return NextResponse.redirect(new URL(`/auth/email-confirmation?message=confirmed&email=${sanitizedEmail}`, request.url))
      } else if (type === "recovery") {
        return NextResponse.redirect(new URL("/auth/reset-password?message=success", request.url))
      } else {
        // Regular sign in - use validated redirect URL
        return NextResponse.redirect(new URL(next, request.url))
      }
    } else {
      return NextResponse.redirect(new URL("/auth/login?error=no_user_data", request.url))
    }
    
  } catch (error: any) {
    // Don't expose error details to users
    return NextResponse.redirect(new URL("/auth/login?error=auth_callback_error", request.url))
  }
} 