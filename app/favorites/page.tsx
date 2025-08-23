"use client"

import { useState, useEffect } from "react"
import { Heart, Car, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { supabaseClient } from "@/lib/supabase/client"
import type { Car } from "@/lib/types"
import { formatCurrency } from "@/lib/utils"

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Record<string, boolean>>({})
  const [favoriteCars, setFavoriteCars] = useState<Car[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  // Load favorites from localStorage
  useEffect(() => {
    setIsMounted(true)
    
    try {
      const savedFavorites = localStorage.getItem("carFavorites")
      if (savedFavorites) {
        const favoritesData = JSON.parse(savedFavorites)
        setFavorites(favoritesData)
        
        // Get favorite car IDs
        const favoriteIds = Object.keys(favoritesData).filter(id => favoritesData[id])
        
        if (favoriteIds.length > 0) {
          fetchFavoriteCars(favoriteIds)
        } else {
          setIsLoading(false)
        }
      } else {
        setIsLoading(false)
      }
    } catch (error) {
      console.error("Error loading favorites:", error)
      setIsLoading(false)
    }
  }, [])

  // Fetch favorite cars from database
  const fetchFavoriteCars = async (carIds: string[]) => {
    try {
      const { data: carsData, error } = await supabaseClient
        .from('cars')
        .select('*')
        .in('id', carIds)

      if (error) {
        throw error
      }

      // Transform database data to match Car interface
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
        specifications: car.specifications || {},
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

      setFavoriteCars(transformedCars)
    } catch (error) {
      console.error('Error fetching favorite cars:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Toggle favorite status
  const toggleFavorite = (carId: string) => {
    if (!isMounted) return
    
    try {
      const newFavorites = { ...favorites, [carId]: !favorites[carId] }
      localStorage.setItem("carFavorites", JSON.stringify(newFavorites))
      setFavorites(newFavorites)
      
      // Remove from favorite cars if unfavorited
      if (!newFavorites[carId]) {
        setFavoriteCars(prev => prev.filter(car => car.id !== carId))
      }
    } catch (error) {
      console.error("Error saving favorites:", error)
    }
  }

  // Remove from favorites
  const removeFromFavorites = (carId: string) => {
    toggleFavorite(carId)
  }

  if (!isMounted) {
    return null
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-light mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your favorites...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Favorites</h1>
              <p className="text-gray-600">Your saved luxury vehicles</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {favoriteCars.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No favorites yet</h2>
            <p className="text-gray-600 mb-6">Start exploring our collection and add cars to your favorites!</p>
            <Link href="/collections">
              <Button className="bg-primary-light hover:bg-primary-dark text-white">
                <Car className="w-4 h-4 mr-2" />
                Browse Cars
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {favoriteCars.length} {favoriteCars.length === 1 ? 'car' : 'cars'} in your favorites
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteCars.map((car) => (
                <Card key={car.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    {car.image && (
                      <img
                        src={car.image}
                        alt={`${car.brand} ${car.name}`}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute top-2 right-2 w-8 h-8 p-0"
                      onClick={() => removeFromFavorites(car.id)}
                      aria-label="Remove from favorites"
                    >
                      <Heart className="w-4 h-4 fill-white" />
                    </Button>
                  </div>
                  
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">
                      {car.brand} {car.name}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>{car.year}</span>
                      {car.mileage && (
                        <>
                          <span>•</span>
                          <span>{car.mileage.toLocaleString()} km</span>
                        </>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-2xl font-bold text-red-600">
                        €{car.price.toLocaleString()}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {car.fuel_type && (
                        <Badge variant="secondary" className="bg-gray-200 text-gray-700">
                          {car.fuel_type}
                        </Badge>
                      )}
                      {car.transmission && (
                        <Badge variant="secondary" className="bg-gray-200 text-gray-700">
                          {car.transmission}
                        </Badge>
                      )}
                      {car.location && (
                        <Badge className="bg-red-500/20 text-red-700">
                          📍 {car.location}
                        </Badge>
                      )}
                    </div>
                    
                    <Link href={`/collections/${car.id}`}>
                      <Button className="w-full bg-primary-light hover:bg-primary-dark text-white">
                        View Details
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
