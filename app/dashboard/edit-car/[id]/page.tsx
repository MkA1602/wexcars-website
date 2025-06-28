"use client"

import { useEffect, useState } from "react"
import { supabaseClient } from "@/lib/supabase/client"
import { useAuth } from "@/contexts/auth-context"
import ClientWrapper from "@/components/client-wrapper"
import { DynamicEditCarForm } from "@/components/dashboard/dynamic-dashboard-components"
import { Loader2 } from "lucide-react"

interface EditCarPageProps {
  params: { id: string }
}

export default function EditCarPage({ params }: EditCarPageProps) {
  const [car, setCar] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    const fetchCar = async () => {
      try {
        setLoading(true)
        setError(null)

        const { data: carData, error: carError } = await supabaseClient
          .from('cars')
          .select('*')
          .eq('id', params.id)
          .single()

        if (carError) {
          throw carError
        }

        if (!carData) {
          throw new Error('Car not found')
        }

        // Check if user owns this car or is admin
        if (carData.user_id !== user?.id && user?.email !== 'mohammedlk27@gmail.com') {
          throw new Error('You do not have permission to edit this car')
        }

        setCar(carData)
      } catch (err: any) {
        console.error('Error fetching car:', err)
        setError(err.message || 'Failed to load car data')
      } finally {
        setLoading(false)
      }
    }

    if (user && params.id) {
      fetchCar()
    }
  }, [user, params.id])

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-gray-600">Please sign in to edit cars</h3>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          <span className="text-lg">Loading car data...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-red-600 mb-2">Error Loading Car</h3>
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    )
  }

  if (!car) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-gray-600">Car not found</h3>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Edit Car</h1>
      <ClientWrapper>
        <DynamicEditCarForm car={car} />
      </ClientWrapper>
    </div>
  )
}

// Client component wrapper to handle car fetching
function EditCarWrapper({ carId }: { carId: string }) {
  return <DynamicEditCarForm car={{ id: carId }} />
}
