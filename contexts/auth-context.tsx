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
          router.refresh()
        }
        if (event === "SIGNED_OUT") {
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
      const { error } = await supabaseClient.auth.signUp({
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
        return { error, success: false }
      }

      // Create user profile in the users table
      const { error: profileError } = await supabaseClient.from("users").insert({
        id: (await supabaseClient.auth.getUser()).data.user?.id,
        email,
        full_name: fullName,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      if (profileError) {
        return { error: profileError, success: false }
      }

      return { error: null, success: true }
    } catch (error) {
      return { error, success: false }
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
      await supabaseClient.auth.signOut()

      // Clear user context from Sentry when user logs out
      clearUserContext()
    } catch (error) {
      console.error("Error signing out:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const resetPassword = async (email: string) => {
    setIsLoading(true)

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
    } finally {
      setIsLoading(false)
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
