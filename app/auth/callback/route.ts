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
  const next = requestUrl.searchParams.get("next") ?? "/dashboard"

  console.log("Auth callback received:", { 
    code: !!code, 
    type, 
    next,
    fullUrl: request.url,
    searchParams: Object.fromEntries(requestUrl.searchParams.entries())
  })

  if (!code) {
    console.log("No code provided in auth callback")
    return NextResponse.redirect(new URL("/auth/login?error=missing_code", request.url))
  }

  const cookieStore = cookies()
  const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })
  
  try {
    console.log("Attempting to exchange code for session...")
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error("Error exchanging code for session:", error)
      return NextResponse.redirect(new URL("/auth/login?error=auth_callback_error&message=" + encodeURIComponent(error.message), request.url))
    }

    if (data.user) {
      console.log("User authenticated successfully:", {
        email: data.user.email,
        email_confirmed_at: data.user.email_confirmed_at,
        created_at: data.user.created_at,
        type
      })
      
      // Determine if this is an email confirmation
      const isEmailConfirmation = type === "signup" || 
        (data.user.email_confirmed_at && 
         new Date(data.user.email_confirmed_at).getTime() > new Date(data.user.created_at).getTime() - 60000) // Within 1 minute of creation
      
      console.log("Is email confirmation:", isEmailConfirmation)
      
      if (isEmailConfirmation) {
        // This is a signup confirmation
        console.log("Redirecting to email confirmation success page")
        return NextResponse.redirect(new URL("/auth/email-confirmation?message=confirmed&email=" + encodeURIComponent(data.user.email || ''), request.url))
      } else if (type === "recovery") {
        console.log("Redirecting to password reset page")
        return NextResponse.redirect(new URL("/auth/reset-password?message=success", request.url))
      } else {
        // Regular sign in
        console.log("Redirecting to dashboard")
        return NextResponse.redirect(new URL(next, request.url))
      }
    } else {
      console.log("No user data returned from auth exchange")
      return NextResponse.redirect(new URL("/auth/login?error=no_user_data", request.url))
    }
    
  } catch (error: any) {
    console.error("Unexpected error in auth callback:", error)
    return NextResponse.redirect(new URL("/auth/login?error=auth_callback_error&message=" + encodeURIComponent(error.message || 'Unknown error'), request.url))
  }
} 