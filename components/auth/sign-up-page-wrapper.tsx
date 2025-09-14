"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { supabaseClient } from "@/lib/supabase/client"

interface SignUpPageWrapperProps {
  children: React.ReactNode
}

export function SignUpPageWrapper({ children }: SignUpPageWrapperProps) {
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
      // Check if user is admin and redirect accordingly
      const checkUserRoleAndRedirect = async () => {
        try {
          const { data: userProfile } = await supabaseClient
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single()

          if (userProfile?.role === 'admin' || userProfile?.role === 'super_admin') {
            // Admin users go to admin dashboard
            router.push('/admin/dashboard')
          } else {
            // Regular users go to regular dashboard
            router.push('/dashboard')
          }
        } catch (err) {
          console.error('Error checking user role:', err)
          // Default to regular dashboard if there's an error
          router.push('/dashboard')
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

  // If user is authenticated, don't render the sign-up form
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

  // If user is not authenticated, show the sign-up form
  return <>{children}</>
}
