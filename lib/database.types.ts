export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          created_at: string
          updated_at: string
          phone_number: string | null
          avatar_url: string | null
        }
        Insert: {
          id?: string
          email: string
          full_name: string
          created_at?: string
          updated_at?: string
          phone_number?: string | null
          avatar_url?: string | null
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          created_at?: string
          updated_at?: string
          phone_number?: string | null
          avatar_url?: string | null
        }
      }
      cars: {
        Row: {
          id: string
          name: string
          brand: string
          category: string
          year: number
          price: number
          image: string
          description: string
          user_id: string
          seller_type: string
          dealership_name: string | null
          chassis_number: string | null
          location: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          brand: string
          category: string
          year: number
          price: number
          image: string
          description: string
          user_id: string
          seller_type?: string
          dealership_name?: string | null
          chassis_number?: string | null
          location?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          brand?: string
          category?: string
          year?: number
          price?: number
          image?: string
          description?: string
          user_id?: string
          seller_type?: string
          dealership_name?: string | null
          chassis_number?: string | null
          location?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
