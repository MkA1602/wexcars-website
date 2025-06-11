import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/lib/database.types"

// Check if Supabase environment variables are set
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create a mock client if environment variables are not set
const createMockClient = () => {
  console.warn("Using mock Supabase client due to missing environment variables")
  return {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signUp: () => Promise.resolve({ error: new Error("Supabase not configured"), data: { user: null, session: null } }),
      signInWithPassword: () => Promise.resolve({ error: new Error("Supabase not configured"), data: { user: null, session: null } }),
      signOut: () => Promise.resolve({ error: null }),
      resetPasswordForEmail: () => Promise.resolve({ error: null }),
    },
    from: () => ({
      insert: () => Promise.resolve({ error: null }),
      select: () => Promise.resolve({ data: [], error: null }),
      update: () => Promise.resolve({ error: null }),
      delete: () => Promise.resolve({ error: null }),
    }),
  }
}

// Create a single instance of the Supabase client to be used across the client-side application
export const supabaseClient = (!supabaseUrl || !supabaseAnonKey) 
  ? createMockClient() as any
  : createClientComponentClient<Database>()
