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

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })
    
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error("Error exchanging code for session:", error)
        return NextResponse.redirect(new URL("/auth/login?error=auth_callback_error", request.url))
      }

      if (data.user) {
        console.log("User authenticated successfully:", data.user.email)
        
        // Handle different types of auth flows
        if (type === "signup") {
          return NextResponse.redirect(new URL("/auth/email-confirmation?message=success", request.url))
        } else if (type === "recovery") {
          return NextResponse.redirect(new URL("/auth/reset-password?message=success", request.url))
        } else {
          // Regular sign in
          return NextResponse.redirect(new URL(next, request.url))
        }
      }
      
    } catch (error) {
      console.error("Unexpected error in auth callback:", error)
      return NextResponse.redirect(new URL("/auth/login?error=auth_callback_error", request.url))
    }
  }

  // If no code provided, redirect to login
  return NextResponse.redirect(new URL("/auth/login?error=missing_code", request.url))
} 