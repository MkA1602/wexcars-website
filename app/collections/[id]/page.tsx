"use client"

import { useEffect, useState } from "react"
import React from "react"
import { notFound, useParams } from "next/navigation"
import { supabaseClient } from "@/lib/supabase/client"
import CarDetailPage from "@/components/car-detail/car-detail-page"
import { Loader2 } from "lucide-react"
import type { Car } from "@/lib/types"

export default function CarDetail() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';
  const [car, setCar] = useState<Car | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCar = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const { data: carData, error: carError } = await supabaseClient
          .from('cars')
          .select('*')
          .eq('id', id)
          .single()

        if (carError) {
          if (carError.code === 'PGRST116') {
            // No rows returned
            notFound()
            return
          }
          throw carError
        }

        if (!carData) {
          notFound()
          return
        }

        // Check if car is sold
        if (carData.is_sold) {
          setCar({
            id: carData.id,
            name: carData.name,
            brand: carData.brand,
            category: carData.category,
            year: carData.year,
            price: carData.price,
            currency: carData.currency || 'AED',
            priceWithVat: carData.price,
            image: carData.image,
            rating: 4.5,
            transmission: carData.transmission || 'Automatic',
            color: carData.color || 'Black',
            featured: false,
            description: carData.description,
            specifications: {
              engine: 'Not specified',
              power: 'Not specified',
              acceleration: 'Not specified',
              topSpeed: 'Not specified',
              transmission: carData.transmission || 'Automatic',
              drivetrain: 'Not specified',
              fuelEconomy: 'Not specified',
              seating: 'Not specified'
            },
            is_sold: true,
            sold_at: carData.sold_at
          } as Car)
          setIsLoading(false)
          return
        }

        // Transform database data to match Car interface
        const transformedCar: Car = {
          id: carData.id,
          name: carData.name,
          brand: carData.brand,
          category: carData.category,
          year: carData.year,
          price: carData.price,
          price_excl_vat: carData.price_excl_vat,
          vat_rate: carData.vat_rate,
          vat_amount: carData.vat_amount,
          currency: carData.currency || 'AED',
          priceWithVat: carData.price, // price already includes VAT
          image: carData.image,
          images: carData.images,
          rating: 4.5, // Default rating since not in DB
          transmission: carData.transmission || 'Automatic',
          color: carData.color || 'Black',
          featured: false, // Default featured status
          description: carData.description,
          features: carData.features,
          specifications: carData.specifications || {
            engine: 'Not specified',
            power: 'Not specified',
            acceleration: 'Not specified',
            topSpeed: 'Not specified',
            transmission: carData.transmission || 'Automatic',
            drivetrain: 'Not specified',
            fuelEconomy: 'Not specified',
            seating: 'Not specified'
          },
          user_id: carData.user_id,
          seller_type: carData.seller_type || 'individual',
          dealership_name: carData.dealership_name,
          created_at: carData.created_at,
          updated_at: carData.updated_at,
          mileage: carData.mileage,
          fuel_type: carData.fuel_type,
          horsepower: carData.horsepower,
          gearbox: carData.gearbox,
          car_type: carData.car_type,
          engine_size: carData.engine_size,
          drivetrain: carData.drivetrain,
          availability: carData.availability,
          availability_days: carData.availability_days,
          availability_date: carData.availability_date,
          chassis_number: carData.chassis_number,
          location: carData.location,
          is_sold: carData.is_sold || false,
          sold_at: carData.sold_at
        }

        setCar(transformedCar)
      } catch (err: any) {
        console.error('Error fetching car:', err)
        setError('Failed to load car details')
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchCar()
    }
  }, [id])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading car details...</p>
          </div>
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
    notFound()
    return null
  }

  return <CarDetailPage car={car} />
}
