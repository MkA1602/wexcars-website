"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, Star, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import PriceDisplay from "@/components/ui/price-display"
import type { Car } from "@/lib/types"
import { supabaseClient } from "@/lib/supabase/client"

const FeaturedCars = () => {
  const [cars, setCars] = useState<Car[]>([])
  const [favorites, setFavorites] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '100px' } // Load 100px before coming into view
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // Lazy load cars data only when component becomes visible
  useEffect(() => {
    if (!isVisible) return

    const fetchFeaturedCars = async () => {
      try {
        setIsLoading(true)
        
        const { data: carsData, error } = await supabaseClient
          .from('cars')
          .select('*')
          .limit(6) // Only load 6 featured cars
          .order('created_at', { ascending: false })

        if (error) throw error

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
          featured: true,
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
          // Add the new fields that exist in database but not in Car interface
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
      } catch (error) {
        console.error('Error fetching featured cars:', error)
      } finally {
        setIsLoading(false)
      }
    }

    // Load favorites from localStorage
    try {
      const savedFavorites = localStorage.getItem("carFavorites")
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites))
      }
    } catch (error) {
      console.error("Error loading favorites:", error)
    }

    fetchFeaturedCars()
  }, [isVisible])

  const toggleFavorite = useCallback((id: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setFavorites((prev) => {
      const newFavorites = { ...prev, [id]: !prev[id] }
      try {
        localStorage.setItem("carFavorites", JSON.stringify(newFavorites))
      } catch (error) {
        console.error("Error saving favorites:", error)
      }
      return newFavorites
    })
  }, [])

  return (
    <section ref={sectionRef} className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Collection
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked selection of premium vehicles, each offering unmatched luxury and performance.
          </p>
        </div>

        {!isVisible ? (
          // Placeholder while not visible
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-80 bg-gray-100 rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : isLoading ? (
          // Loading state
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="overflow-hidden h-full animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4 w-3/4"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          // Actual content
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car, index) => (
              <Card key={car.id} className="overflow-hidden transition-all duration-300 hover:shadow-xl h-full flex flex-col group">
                <div className="relative">
                  <Link href={`/collections/${car.id}`}>
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={car.image || "/placeholder.svg"}
                        alt={`${car.brand} ${car.name}`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority={index < 3} // Priority for first 3 cars
                        loading={index < 3 ? "eager" : "lazy"}
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                      />
                    </div>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full"
                    onClick={(e) => toggleFavorite(car.id, e)}
                    aria-label={favorites[car.id] ? "Remove from favorites" : "Add to favorites"}
                  >
                    <Heart size={18} className={favorites[car.id] ? "fill-red-500 text-red-500" : "text-gray-600"} />
                  </Button>
                  <Badge className="absolute top-2 left-2 bg-primary-light hover:bg-primary-dark">
                    Featured
                  </Badge>
                </div>
                
                <CardContent className="p-4 flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg line-clamp-1">
                        <Link href={`/collections/${car.id}`} className="hover:text-primary-light">
                          {car.brand} {car.name}
                        </Link>
                      </h3>
                      <p className="text-gray-500 text-sm">
                        {car.year} • {car.mileage ? `${car.mileage.toLocaleString()} km` : 'Mileage N/A'} • {car.fuel_type || 'Fuel N/A'} • {car.location ? (
                          <span className="text-red-500 font-medium">📍 {car.location}</span>
                        ) : (
                          <span className="text-gray-400">Location N/A</span>
                        )} • <span className="text-xs">{car.created_at ? new Date(car.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        }) : 'Date N/A'}</span>
                      </p>
                    </div>
                    <div className="flex items-center ml-2">
                      <Star size={14} className="text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-medium ml-1">{car.rating}</span>
                    </div>
                  </div>

                  <Badge variant="outline" className="text-xs bg-gray-50 mb-3">
                    {car.category}
                  </Badge>

                  {car.description && (
                    <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                      {car.description}
                    </p>
                  )}
                </CardContent>
                
                <CardFooter className="p-4 pt-0 flex justify-between items-center border-t mt-auto">
                  <div className="flex-1">
                    <PriceDisplay
                      key={`featured-price-${car.id}`}
                      price={car.price}
                      priceExclVat={car.price_excl_vat}
                      vatRate={car.vat_rate}
                      vatAmount={car.vat_amount}
                      currency={car.currency}
                      enableToggle={true}
                      carId={car.id}
                      size="sm"
                    />
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/collections/${car.id}`}>
                      View Details
                      <ArrowRight size={16} className="ml-1" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        <div className="text-center mt-8">
          <Button asChild size="lg" className="bg-primary-light hover:bg-primary-dark">
            <Link href="/collections">
              View All Collection
              <ArrowRight size={20} className="ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

export default FeaturedCars
