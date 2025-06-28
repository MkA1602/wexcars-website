"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { supabaseClient } from "@/lib/supabase/client"

export type UserRole = 'user' | 'admin' | 'super_admin'

interface UserProfile {
  id: string
  email: string
  full_name: string
  role: UserRole
  phone_number?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export function useAuthRole() {
  const { user, isLoading: authLoading } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchUserProfile() {
      if (!user) {
        setProfile(null)
        setIsLoading(false)
        return
      }

      try {
        const { data, error } = await supabaseClient
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()

        if (error) {
          throw error
        }

        setProfile(data)
      } catch (err: any) {
        console.error('Error fetching user profile:', err)
        setError(err.message || 'Failed to fetch user profile')
        setProfile(null)
      } finally {
        setIsLoading(false)
      }
    }

    if (!authLoading) {
      fetchUserProfile()
    }
  }, [user, authLoading])

  const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin'
  const isSuperAdmin = profile?.role === 'super_admin'
  const isUser = profile?.role === 'user'

  const hasPermission = (requiredRole: UserRole): boolean => {
    if (!profile) return false
    
    const roleHierarchy: Record<UserRole, number> = {
      'user': 1,
      'admin': 2,
      'super_admin': 3
    }

    const userRoleLevel = roleHierarchy[profile.role] || 0
    const requiredRoleLevel = roleHierarchy[requiredRole] || 0

    return userRoleLevel >= requiredRoleLevel
  }

  const canManageCars = isAdmin
  const canManageUsers = isSuperAdmin
  const canAccessAdmin = isAdmin

  return {
    profile,
    isLoading: authLoading || isLoading,
    error,
    isAdmin,
    isSuperAdmin,
    isUser,
    hasPermission,
    canManageCars,
    canManageUsers,
    canAccessAdmin,
    refetch: () => {
      if (user) {
        setIsLoading(true)
        setError(null)
        // Re-trigger the effect
        setProfile(null)
      }
    }
  }
} 