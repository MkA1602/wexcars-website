"use client"

import { useState, useEffect } from "react"
import { supabaseClient } from "@/lib/supabase/client"
import type { Car } from "@/lib/types"
import { Loader2 } from "lucide-react"
import ErrorBoundary from "@/components/error-boundary"

export default function SimpleCarListingPage() {
  const [cars, setCars] = useState<Car[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const { data: carsData, error: carsError } = await supabaseClient
          .from('cars')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20) // Limit to 20 cars for better performance

        if (carsError) {
          throw carsError
        }

        // Simple transformation
        const transformedCars: Car[] = (carsData || []).map((car: any) => ({
          id: car.id,
          name: car.name,
          brand: car.brand,
          category: car.category,
          year: car.year,
          price: car.price,
          price_excl_vat: car.price_excl_vat,
          vat_rate: car.vat_rate,
          vat_amount: car.vat_amount,
          currency: car.currency || 'AED',
          priceWithVat: car.price,
          image: car.image,
          images: car.images,
          rating: 4.5,
          transmission: car.transmission || 'Automatic',
          color: car.color || 'Black',
          featured: false,
          description: car.description,
          features: car.features,
          specifications: car.specifications || {
            engine: 'Not specified',
            power: 'Not specified',
            acceleration: 'Not specified',
            topSpeed: 'Not specified',
            transmission: car.transmission || 'Automatic',
            drivetrain: 'Not specified',
            fuelEconomy: 'Not specified',
            seating: 'Not specified'
          },
          user_id: car.user_id,
          seller_type: car.seller_type || 'individual',
          dealership_name: car.dealership_name,
          created_at: car.created_at,
          updated_at: car.updated_at,
          mileage: car.mileage,
          fuel_type: car.fuel_type,
          horsepower: car.horsepower,
          gearbox: car.gearbox,
          car_type: car.car_type,
          engine_size: car.engine_size,
          drivetrain: car.drivetrain,
          availability: car.availability,
          availability_days: car.availability_days,
          availability_date: car.availability_date,
          chassis_number: car.chassis_number,
          location: car.location
        }))

        setCars(transformedCars)
      } catch (err: any) {
        console.error('Error fetching cars:', err)
        setError('Failed to load cars. Please try again.')
        setCars([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchCars()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary-light" />
          <p className="text-gray-600">Loading luxury vehicles...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Cars</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary-light text-white px-6 py-3 rounded-md hover:bg-primary-dark transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Luxury Vehicle Collection</h1>
            <p className="text-gray-600">Discover our exclusive collection of premium vehicles</p>
          </div>

          {cars.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-gray-600">No vehicles found</h3>
              <p className="text-gray-500 mt-2">Please check back later for new listings</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cars.map((car) => (
                <div key={car.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={car.image || "/placeholder.svg?height=400&width=600&query=luxury+car"}
                      alt={`${car.brand} ${car.name}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {car.brand} {car.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">{car.year} • {car.transmission}</p>
                    <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                      {car.description || 'Premium luxury vehicle with exceptional features and performance.'}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary-light">
                        {car.currency} {car.price?.toLocaleString()}
                      </span>
                      <a
                        href={`/collections/${car.id}`}
                        className="bg-primary-light text-white px-4 py-2 rounded-md text-sm hover:bg-primary-dark transition-colors"
                      >
                        View Details
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Showing {cars.length} vehicles
            </p>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}
