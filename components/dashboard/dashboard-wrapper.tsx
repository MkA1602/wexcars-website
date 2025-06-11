"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { supabaseClient } from "@/lib/supabase/client"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import DashboardContent from "./dashboard-content"

// Mock car data as fallback
const mockCars = [
  {
    id: "1",
    brand: "Ferrari",
    name: "488 GTB",
    year: 2023,
    category: "Sports Car",
    price: 330000,
    currency: "USD",
    color: "Rosso Red",
    transmission: "Automatic",
    image: "/placeholder.svg?height=400&width=600&text=Ferrari+488+GTB",
    description: "Experience the thrill of Ferrari's most iconic sports car with stunning performance and design.",
    specifications: {
      engine: "3.9L V8 Turbo",
      power: "661 HP",
      acceleration: "0-60 mph in 3.0s",
      topSpeed: "205 mph",
      transmission: "7-Speed DCT",
      drivetrain: "RWD",
      fuelEconomy: "16/22 mpg",
      seating: "2 passengers"
    }
  },
  {
    id: "2", 
    brand: "Lamborghini",
    name: "Huracán",
    year: 2023,
    category: "Supercar",
    price: 290000,
    currency: "EUR",
    color: "Verde Mantis",
    transmission: "Automatic",
    image: "/placeholder.svg?height=400&width=600&text=Lamborghini+Huracan",
    description: "The perfect blend of luxury and performance in Lamborghini's masterpiece.",
    specifications: {
      engine: "5.2L V10",
      power: "631 HP", 
      acceleration: "0-60 mph in 2.9s",
      topSpeed: "202 mph",
      transmission: "7-Speed DCT",
      drivetrain: "AWD",
      fuelEconomy: "14/20 mpg",
      seating: "2 passengers"
    }
  },
  {
    id: "3",
    brand: "Aston Martin",
    name: "DB11",
    year: 2024,
    category: "Luxury",
    price: 195000,
    currency: "GBP",
    color: "British Racing Green",
    transmission: "Automatic",
    image: "/placeholder.svg?height=400&width=600&text=Aston+Martin+DB11",
    description: "British elegance meets exceptional performance in this stunning grand tourer.",
    specifications: {
      engine: "4.0L V8 Twin-Turbo",
      power: "528 HP",
      acceleration: "0-60 mph in 3.9s",
      topSpeed: "187 mph",
      transmission: "8-Speed Automatic",
      drivetrain: "RWD",
      fuelEconomy: "18/24 mpg",
      seating: "4 passengers"
    }
  },
  {
    id: "4",
    brand: "Nissan",
    name: "GT-R NISMO",
    year: 2024,
    category: "Sports Car",
    price: 25000000,
    currency: "JPY",
    color: "Pearl White",
    transmission: "Automatic",
    image: "/placeholder.svg?height=400&width=600&text=Nissan+GT-R",
    description: "Japanese engineering excellence with legendary GT-R performance and precision.",
    specifications: {
      engine: "3.8L V6 Twin-Turbo",
      power: "600 HP",
      acceleration: "0-60 mph in 2.9s",
      topSpeed: "196 mph",
      transmission: "6-Speed DCT",
      drivetrain: "AWD",
      fuelEconomy: "16/22 mpg",
      seating: "4 passengers"
    }
  },
  {
    id: "5",
    brand: "McLaren",
    name: "720S",
    year: 2024,
    category: "Supercar",
    price: 1200000,
    currency: "AED",
    color: "Papaya Orange",
    transmission: "Automatic",
    image: "/placeholder.svg?height=400&width=600&text=McLaren+720S",
    description: "British supercar excellence engineered for the Middle East market with exceptional performance.",
    specifications: {
      engine: "4.0L V8 Twin-Turbo",
      power: "710 HP",
      acceleration: "0-60 mph in 2.8s",
      topSpeed: "212 mph",
      transmission: "7-Speed DCT",
      drivetrain: "RWD",
      fuelEconomy: "15/22 mpg",
      seating: "2 passengers"
    }
  }
]

export default function DashboardWrapper() {
  const { user, isLoading: authLoading } = useAuth()
  const [profile, setProfile] = useState<any>(null)
  const [cars, setCars] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Check if Supabase is configured
  const isSupabaseConfigured = 
    typeof process.env.NEXT_PUBLIC_SUPABASE_URL === 'string' && 
    typeof process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === 'string'

  useEffect(() => {
    const fetchUserData = async () => {
      // If Supabase is not configured, provide demo data
      if (!isSupabaseConfigured) {
        setProfile({
          id: 'demo-user',
          email: 'demo@wexcars.com',
          full_name: 'Demo User',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        setCars(mockCars)
        setError('Demo Mode: Supabase not configured. Using sample data for testing.')
        setIsLoading(false)
        return
      }

      if (!user) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        // Try to fetch user profile from Supabase
        const { data: profileData, error: profileError } = await supabaseClient
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profileError && profileError.code !== 'PGRST116') {
          console.warn('Profile fetch error:', profileError)
        }

        // Try to fetch user cars from Supabase
        const { data: carsData, error: carsError } = await supabaseClient
          .from('cars')
          .select('*')
          .eq('user_id', user.id)

        if (carsError && carsError.code !== 'PGRST116') {
          console.warn('Cars fetch error:', carsError)
        }

        // Set profile data (fallback to user metadata if no profile found)
        setProfile(profileData || {
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          created_at: user.created_at,
          updated_at: user.updated_at
        })

        // Set cars data (use mock data if no cars found or if Supabase fetch fails)
        setCars(carsData && carsData.length > 0 ? carsData : [])

      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        setError('Failed to load dashboard data')
        
        // Fallback data
        setProfile({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          created_at: user.created_at,
          updated_at: user.updated_at
        })
        setCars([])
      } finally {
        setIsLoading(false)
      }
    }

    if (!authLoading) {
      // In demo mode (no Supabase), skip authentication check
      if (!isSupabaseConfigured) {
        fetchUserData()
        return
      }
      
      if (!user) {
        router.push('/auth/login')
        return
      }
      fetchUserData()
    }
  }, [user, authLoading, router, isSupabaseConfigured])

  // Show loading state while authenticating or fetching data
  if (authLoading || isLoading) {
    return (
      <div className="w-full p-8 bg-white rounded-lg shadow-md animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  // Show demo mode info or error state
  if (error) {
    return (
      <div className="w-full p-8">
        <Alert variant={isSupabaseConfigured ? "destructive" : "default"}>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
        <div className="mt-6">
          <DashboardContent user={profile} profile={profile} cars={mockCars} />
        </div>
      </div>
    )
  }

  // In demo mode, always show dashboard with mock data
  if (!isSupabaseConfigured) {
    return <DashboardContent user={profile} profile={profile} cars={mockCars} />
  }

  // Redirect to login if not authenticated (only when Supabase is configured)
  if (!user) {
    router.push('/auth/login')
    return null
  }

  // Render dashboard with fetched data
  return <DashboardContent user={user} profile={profile} cars={cars} />
} 