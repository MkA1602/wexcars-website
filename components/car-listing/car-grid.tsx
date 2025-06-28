"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, Star, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import PriceDisplay from "@/components/ui/price-display"
import type { Car } from "@/lib/types"
import ErrorBoundary from "@/components/error-boundary"

interface CarGridProps {
  cars: Car[]
  vatDisplay: "include" | "exclude" | "both"
}

export default function CarGrid({ cars, vatDisplay }: CarGridProps) {
  const [favorites, setFavorites] = useState<Record<string, boolean>>({})
  const [isMounted, setIsMounted] = useState(false)

  // Set mounted state to prevent hydration issues
  useEffect(() => {
    // Load favorites from localStorage
    try {
      const savedFavorites = localStorage.getItem("carFavorites")
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites))
      }
    } catch (error) {
      console.error("Error loading favorites:", error)
    }

    setIsMounted(true)
  }, [])

  // Save favorites to localStorage when they change
  useEffect(() => {
    if (isMounted) {
      try {
        localStorage.setItem("carFavorites", JSON.stringify(favorites))
      } catch (error) {
        console.error("Error saving favorites:", error)
      }
    }
  }, [favorites, isMounted])

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setFavorites((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  // Parse features from JSON if available
  const parseFeatures = (featuresString: string | null | undefined): string[] => {
    if (!featuresString) return []
    try {
      return JSON.parse(featuresString)
    } catch {
      return []
    }
  }

  if (!isMounted) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-72 bg-gray-200 animate-pulse rounded-lg"></div>
        ))}
      </div>
    )
  }

  if (!cars || cars.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium text-gray-600">No cars found matching your criteria</h3>
        <p className="text-gray-500 mt-2">Try adjusting your filters or search terms</p>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {cars.map((car) => {
          const features = parseFeatures(car.features)
          
          return (
            <Card
              key={car.id}
              className="overflow-hidden transition-all duration-300 hover:shadow-lg h-full flex flex-col group"
            >
              <div className="relative">
                <Link href={`/collections/${car.id}`}>
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={car.image || "/placeholder.svg?height=400&width=600&query=luxury+car"}
                      alt={`${car.brand} ${car.name}`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
                {car.featured && (
                  <Badge className="absolute top-2 left-2 bg-primary-light hover:bg-primary-dark">
                    Featured
                  </Badge>
                )}
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
                      {car.year} • {car.transmission || 'Manual'} • {car.color || 'Not specified'}
                    </p>
                  </div>
                  {car.rating && (
                    <div className="flex items-center ml-2">
                      <Star size={14} className="text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-medium ml-1">{car.rating}</span>
                    </div>
                  )}
                </div>

                {/* Category and Engine Type */}
                <div className="flex flex-wrap gap-1 mb-3">
                  <Badge variant="outline" className="text-xs bg-gray-50">
                    {car.category}
                  </Badge>
                  {car.specifications?.engine?.toLowerCase().includes("electric") ? (
                    <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                      <Zap size={10} className="mr-1" />
                      Electric
                    </Badge>
                  ) : car.specifications?.engine?.toLowerCase().includes("hybrid") ? (
                    <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                      <Zap size={10} className="mr-1" />
                      Hybrid
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs bg-gray-50">
                      Petrol
                    </Badge>
                  )}
                </div>

                {/* Top Features */}
                {features.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-600 mb-1">Features:</p>
                    <div className="flex flex-wrap gap-1">
                      {features.slice(0, 3).map((feature) => (
                        <Badge key={feature} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {features.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{features.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Short description */}
                {car.description && (
                  <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                    {car.description}
                  </p>
                )}
              </CardContent>
              
              <CardFooter className="p-4 pt-0 flex justify-between items-center border-t mt-auto">
                <div className="flex-1">
                  <PriceDisplay
                    price={car.price}
                    priceExclVat={car.price_excl_vat}
                    vatRate={car.vat_rate}
                    vatAmount={car.vat_amount}
                    currency={car.currency}
                    showVatBreakdown={vatDisplay === "both"}
                    size="sm"
                  />
                </div>
                <Button variant="outline" size="sm" className="text-xs ml-3" asChild>
                  <Link href={`/collections/${car.id}`}>
                    View Details
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </ErrorBoundary>
  )
}
