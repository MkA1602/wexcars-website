"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import OptimizedCarGrid from "./car-grid"
import type { Car } from "@/lib/types"
import { supabaseClient } from "@/lib/supabase/client"

const FeaturedCars = () => {
  const [cars, setCars] = useState<Car[]>([])
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
          .eq('is_sold', false) // Only fetch non-sold cars
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

    fetchFeaturedCars()
  }, [isVisible])

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-72 bg-gray-200 animate-pulse rounded-lg"></div>
            ))}
          </div>
        ) : isLoading ? (
          // Loading state
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-72 bg-gray-200 animate-pulse rounded-lg"></div>
            ))}
          </div>
        ) : (
          // Use the same grid component as collections page
          <OptimizedCarGrid cars={cars} vatDisplay="both" />
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
