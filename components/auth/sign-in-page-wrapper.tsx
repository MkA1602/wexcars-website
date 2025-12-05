"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { supabaseClient } from "@/lib/supabase/client"

interface SignInPageWrapperProps {
  children: React.ReactNode
}

export function SignInPageWrapper({ children }: SignInPageWrapperProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Skip redirect if Supabase is not configured
    const isSupabaseConfigured = 
      typeof process.env.NEXT_PUBLIC_SUPABASE_URL === 'string' && 
      typeof process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === 'string'

    if (!isSupabaseConfigured) {
      return
    }

    // If user is authenticated, redirect them to appropriate dashboard
    if (user && !isLoading) {
      // Set a timeout to ensure redirect happens even if role check fails
      const redirectTimeout = setTimeout(() => {
        router.replace('/dashboard')
      }, 3000) // Fallback after 3 seconds

      // Check if user is admin and redirect accordingly
      const checkUserRoleAndRedirect = async () => {
        try {
          // Set a timeout for the database query
          const queryPromise = supabaseClient
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single()

          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Query timeout')), 2000)
          )

          const { data: userProfile, error } = await Promise.race([
            queryPromise,
            timeoutPromise
          ]) as { data: any, error: any }

          clearTimeout(redirectTimeout)

          if (error && error.code !== 'PGRST116') {
            // PGRST116 = no rows found, which is okay for new users
            console.error('Error checking user role:', error)
            router.replace('/dashboard')
            return
          }

          if (userProfile?.role === 'admin' || userProfile?.role === 'super_admin') {
            // Admin users go to admin dashboard
            router.replace('/admin/dashboard')
          } else {
            // Regular users go to regular dashboard
            router.replace('/dashboard')
          }
        } catch (err) {
          clearTimeout(redirectTimeout)
          console.error('Error checking user role:', err)
          // Default to regular dashboard if there's an error
          router.replace('/dashboard')
        }
      }

      checkUserRoleAndRedirect()
    }
  }, [user, isLoading, router])

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin"></div>
      </div>
    )
  }

  // If user is authenticated, don't render the sign-in form
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to your dashboard...</p>
        </div>
      </div>
    )
  }

  // If user is not authenticated, show the sign-in form
  return <>{children}</>
}
