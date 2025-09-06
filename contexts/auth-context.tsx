"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabaseClient } from "@/lib/supabase/client"
import type { User, Session } from "@supabase/supabase-js"

// Import the necessary Sentry functions
import { setUserContext, clearUserContext } from "@/lib/monitoring"

type AuthContextType = {
  user: User | null
  session: Session | null
  isLoading: boolean
  signUp: (
    email: string,
    password: string,
    fullName: string,
  ) => Promise<{
    error: any | null
    success: boolean
  }>
  signIn: (
    email: string,
    password: string,
  ) => Promise<{
    error: any | null
    success: boolean
  }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{
    error: any | null
    success: boolean
  }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Check if Supabase is configured
  const isSupabaseConfigured = 
    typeof process.env.NEXT_PUBLIC_SUPABASE_URL === 'string' && 
    typeof process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === 'string'

  useEffect(() => {
    // Skip auth if Supabase is not configured
    if (!isSupabaseConfigured) {
      setIsLoading(false)
      return
    }

    // Get initial session
    const getInitialSession = async () => {
      const {
        data: { session },
        error,
      } = await supabaseClient.auth.getSession()

      if (error) {
        console.error("Error getting session:", error)
      }

      setSession(session)
      setUser(session?.user ?? null)
      setIsLoading(false)
    }

    getInitialSession()

    // Set up auth state listener
    const { data: authListener } = supabaseClient.auth.onAuthStateChange(
      async (event: string, session: Session | null) => {
        setSession(session)
        setUser(session?.user ?? null)
        setIsLoading(false)

        // Handle auth events
        if (event === "SIGNED_IN") {
          // Check for pending favorite to add after sign-in
          const pendingFavorite = localStorage.getItem("pendingFavorite")
          if (pendingFavorite) {
            // Add the car to favorites
            try {
              const savedFavorites = localStorage.getItem("carFavorites") || "{}"
              const favorites = JSON.parse(savedFavorites)
              favorites[pendingFavorite] = true
              localStorage.setItem("carFavorites", JSON.stringify(favorites))
              // Clear the pending favorite
              localStorage.removeItem("pendingFavorite")
              console.log(`Added car ${pendingFavorite} to favorites after sign-in`)
            } catch (error) {
              console.error("Error adding pending favorite:", error)
              localStorage.removeItem("pendingFavorite")
            }
          }
          router.refresh()
        }
        if (event === "SIGNED_OUT") {
          // Clear user context from Sentry when user logs out
          clearUserContext()
          // Only redirect to login page if user explicitly signs out
          router.push("/auth/login")
          router.refresh()
        }
      }
    )

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [router, isSupabaseConfigured])

  const signUp = async (email: string, password: string, fullName: string) => {
    setIsLoading(true)

    try {
      // Sign up the user
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name: fullName,
          },
        },
      })

      if (error) {
        // Handle specific error types
        let errorMessage = error.message
        
        if (error.message.includes('rate limit') || error.message.includes('Rate limit')) {
          errorMessage = 'Email sending is temporarily limited. Please try again in a few minutes or contact support if the issue persists.'
        } else if (error.message.includes('Email rate limit exceeded')) {
          errorMessage = 'Too many registration attempts. Please wait 15 minutes before trying again.'
        } else if (error.message.includes('Invalid email')) {
          errorMessage = 'Please enter a valid email address.'
        } else if (error.message.includes('Password should be at least')) {
          errorMessage = 'Password must be at least 6 characters long.'
        } else if (error.message.includes('User already registered')) {
          errorMessage = 'An account with this email already exists. Please try signing in instead.'
        }
        
        return { 
          error: { ...error, message: errorMessage }, 
          success: false, 
          message: null 
        }
      }

      // User profile will be created automatically by the database trigger
      // No need to manually create it here anymore
      
      if (data.user) {
        // If this is the admin user, they don't need email verification
        if (email === 'mohammedlk27@gmail.com') {
          return { 
            error: null, 
            success: true, 
            message: 'Admin account created successfully. You can now log in.' 
          }
        }
        
        return { 
          error: null, 
          success: true, 
          message: 'Registration successful! Please check your email (including spam folder) to verify your account before logging in.' 
        }
      }

      return { error: null, success: true, message: 'Registration completed successfully.' }
    } catch (error: any) {
      let errorMessage = 'An unexpected error occurred. Please try again.'
      
      if (error.message.includes('rate limit') || error.message.includes('Rate limit')) {
        errorMessage = 'Email sending is temporarily limited. Please try again in a few minutes or contact support if the issue persists.'
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        errorMessage = 'Network error. Please check your internet connection and try again.'
      }
      
      return { 
        error: { message: errorMessage }, 
        success: false, 
        message: null 
      }
    } finally {
      setIsLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    setIsLoading(true)

    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { error, success: false }
      }

      // Add user context to Sentry when user logs in
      if (data.user) {
        setUserContext({
          id: data.user.id,
          email: data.user.email,
          username: data.user.user_metadata?.username || undefined,
        })

        // Check if user is admin and redirect accordingly
        try {
          const { data: userProfile } = await supabaseClient
            .from('users')
            .select('role')
            .eq('id', data.user.id)
            .single()

          // Check for pending favorite to add after sign-in
          const pendingFavorite = localStorage.getItem("pendingFavorite")
          if (pendingFavorite) {
            // Add the car to favorites
            try {
              const savedFavorites = localStorage.getItem("carFavorites") || "{}"
              const favorites = JSON.parse(savedFavorites)
              favorites[pendingFavorite] = true
              localStorage.setItem("carFavorites", JSON.stringify(favorites))
              // Clear the pending favorite
              localStorage.removeItem("pendingFavorite")
              console.log(`Added car ${pendingFavorite} to favorites after sign-in`)
            } catch (error) {
              console.error("Error adding pending favorite:", error)
              localStorage.removeItem("pendingFavorite")
            }
          }

          if (userProfile?.role === 'admin' || userProfile?.role === 'super_admin') {
            // Admin users go to admin dashboard
            setTimeout(() => router.push('/admin/dashboard'), 100)
          } else {
            // Regular users go to regular dashboard
            setTimeout(() => router.push('/dashboard'), 100)
          }
        } catch (err) {
          console.error('Error checking user role:', err)
          // Default to regular dashboard if there's an error
          setTimeout(() => router.push('/dashboard'), 100)
        }
      }

      return { error: null, success: true }
    } catch (error) {
      return { error, success: false }
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    setIsLoading(true)
    try {
      // Clear user context from Sentry
      clearUserContext()
      
      const { error } = await supabaseClient.auth.signOut()
      if (error) {
        console.error("Error signing out:", error)
      }
    } catch (error) {
      console.error("Error signing out:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) {
        return { error, success: false }
      }

      return { error: null, success: true }
    } catch (error) {
      return { error, success: false }
    }
  }

  const value = {
    user,
    session,
    isLoading,
    signUp,
    signIn,
    signOut,
    resetPassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
