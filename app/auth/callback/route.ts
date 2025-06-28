import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import type { Database } from "@/lib/database.types"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
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
        // Check if user profile exists, create if not
        const { data: existingProfile } = await supabase
          .from("users")
          .select("*")
          .eq("id", data.user.id)
          .single()

        if (!existingProfile) {
          // Create user profile
          const { error: profileError } = await supabase
            .from("users")
            .insert({
              id: data.user.id,
              email: data.user.email || "",
              full_name: data.user.user_metadata?.full_name || 
                        data.user.user_metadata?.first_name + " " + data.user.user_metadata?.last_name ||
                        data.user.email?.split("@")[0] || "User",
              phone_number: data.user.user_metadata?.phone || null,
              avatar_url: data.user.user_metadata?.avatar_url || null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })

          if (profileError) {
            console.error("Error creating user profile:", profileError)
          }
        }
      }
    } catch (error) {
      console.error("Unexpected error in auth callback:", error)
      return NextResponse.redirect(new URL("/auth/login?error=auth_callback_error", request.url))
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL(next, request.url))
} 