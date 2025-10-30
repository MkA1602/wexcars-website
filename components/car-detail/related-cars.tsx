"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { supabaseClient } from "@/lib/supabase/client"
import { formatCurrency } from "@/lib/utils"
import type { Car } from "@/lib/types"

interface RelatedCarsProps {
  currentCarId: string
}

export default function RelatedCars({ currentCarId }: RelatedCarsProps) {
  const [relatedCars, setRelatedCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRelatedCars = async () => {
      try {
        // Fetch 3 random cars excluding the current one, sold cars, and removed cars
        const { data, error } = await supabaseClient
          .from('cars')
          .select('*')
          .neq('id', currentCarId)
          .eq('is_sold', false) // Exclude sold cars
          .eq('is_published', true) // Only show published cars
          .neq('availability', 'Sold') // Exclude cars marked as sold in availability
          .neq('availability', 'Removed') // Exclude removed cars
          .neq('availability', 'Inactive') // Exclude inactive cars
          .order('created_at', { ascending: false })
          .limit(3)
          
        if (error) {
          console.error('Error fetching related cars:', error)
          return
        }
        
        setRelatedCars(data || [])
      } catch (error) {
        console.error('Error fetching related cars:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRelatedCars()
  }, [currentCarId])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-4">
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-6 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (relatedCars.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No related vehicles found</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {relatedCars.map((car) => (
        <div key={car.id} className="bg-white rounded-lg shadow-md overflow-hidden group">
          <div className="relative">
            <Link href={`/collections/${car.id}`} className="block relative h-48 overflow-hidden">
              <img
                src={car.image || "/placeholder.svg"}
                alt={`${car.brand} ${car.name}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </Link>
            

          </div>

          <div className="p-4">
            <h3 className="font-bold text-lg mb-1">
              <Link href={`/collections/${car.id}`} className="hover:text-primary-light transition-colors">
                {car.brand} {car.name}
              </Link>
            </h3>
            <p className="text-gray-600 text-sm mb-2">
              {car.year}{!car.is_new_car && (car.mileage ? ` • ${car.mileage.toLocaleString()} km` : ' • Mileage N/A')} • {car.fuel_type || 'Fuel N/A'} • {car.location ? (
                <span className="text-red-500 font-medium">📍 {car.location}</span>
              ) : (
                <span className="text-gray-400">Location N/A</span>
              )} • <span className="text-xs">{car.created_at ? new Date(car.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
              }) : 'Date N/A'}</span>
            </p>

            <div className="pt-3 border-t border-gray-100">
              <div className="text-xl font-bold">{formatCurrency(car.price, car.currency)}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
