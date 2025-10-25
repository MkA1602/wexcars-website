"use client"

import type React from "react"
import { useState, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Heart, Star, Zap, Pencil, Trash2, CheckCircle, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import PriceDisplay from "@/components/ui/price-display"
import type { Car } from "@/lib/types"
import { supabaseClient } from "@/lib/supabase/client"

interface DashboardCarCardProps {
  car: Car
  isSold?: boolean
  onDelete?: (carId: string) => void
  onMarkAsSold?: (carId: string) => void
  onMarkAsUnsold?: (carId: string) => void
  isDeleting?: boolean
  isMarkingSold?: boolean
}

export default function DashboardCarCard({ 
  car, 
  isSold = false, 
  onDelete, 
  onMarkAsSold, 
  onMarkAsUnsold,
  isDeleting = false,
  isMarkingSold = false
}: DashboardCarCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const router = useRouter()

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true)
  }, [])

  const handleImageError = useCallback(() => {
    setImageError(true)
    setImageLoaded(true)
  }, [])

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (onDelete) {
      onDelete(car.id)
    }
  }, [car.id, onDelete])

  const handleMarkAsSold = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (onMarkAsSold) {
      onMarkAsSold(car.id)
    }
  }, [car.id, onMarkAsSold])

  const handleMarkAsUnsold = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (onMarkAsUnsold) {
      onMarkAsUnsold(car.id)
    }
  }, [car.id, onMarkAsUnsold])

  return (
    <Card className={`overflow-hidden transition-all duration-300 hover:shadow-lg h-full flex flex-col group ${isSold ? 'opacity-75' : ''}`}>
      <div className="relative">
        <Link href={`/collections/${car.id}`}>
          <div className="relative h-48 overflow-hidden bg-gray-100">
            {!imageError ? (
              <Image
                src={car.image || "/placeholder.svg?height=400&width=600&query=luxury+car"}
                alt={`${car.brand} ${car.name}`}
                fill
                className={`object-cover transition-all duration-500 group-hover:scale-105 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={false}
                loading="lazy"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <span className="text-gray-500 text-sm">Image not available</span>
              </div>
            )}
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-gray-300 border-t-primary-light rounded-full animate-spin"></div>
              </div>
            )}
            {isSold && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                  <CheckCircle size={14} />
                  SOLD
                </div>
              </div>
            )}
          </div>
        </Link>
        
        {/* Dashboard Action Buttons */}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="bg-white/90 hover:bg-white rounded-full h-8 w-8"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              router.push(`/dashboard/edit-car/${car.id}`)
            }}
            aria-label="Edit car"
          >
            <Pencil size={14} />
          </Button>
        </div>

        {/* Status Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {car.featured && (
            <Badge className="bg-primary-light hover:bg-primary-dark">
              Featured
            </Badge>
          )}
          {isSold && (
            <Badge className="bg-green-600 text-white">
              Sold
            </Badge>
          )}
        </div>
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
              {car.year}{!car.is_new_car && (car.mileage ? ` • ${car.mileage.toLocaleString()} km` : ' • Mileage N/A')} • {car.fuel_type || 'Fuel N/A'} • {car.location ? (
                <span className="text-red-500 font-medium">📍 {car.location}</span>
              ) : (
                <span className="text-gray-400">Location N/A</span>
              )} • <span className="text-xs">{car.created_at ? new Date(car.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
              }) : 'Date N/A'}</span>
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
          {car.is_new_car && (
            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
              ✨ New Car
            </Badge>
          )}
          <Badge variant="outline" className="text-xs bg-gray-50">
            {car.transmission || 'Manual'}
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

        {/* Seller Information */}
        <div className="mb-3">
          {car.seller_type === 'dealership' ? (
            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
              🏢 {car.dealership_name || 'Dealership'}
            </Badge>
          ) : (
            <Badge variant="outline" className="text-xs bg-gray-50 text-gray-700 border-gray-200">
              👤 Individual Seller
            </Badge>
          )}
        </div>

        {/* Chassis Number */}
        {car.chassis_number && (
          <div className="mb-3">
            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
              VIN: {car.chassis_number}
            </Badge>
          </div>
        )}

        {/* Sold Date */}
        {isSold && car.sold_at && (
          <div className="mb-3">
            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
              <CheckCircle size={10} className="mr-1" />
              Sold: {new Date(car.sold_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </Badge>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-4 pt-0 border-t mt-auto">
        <div className="w-full space-y-3">
          {/* Price Display */}
          <PriceDisplay
            key={`dashboard-price-${car.id}`}
            price={car.price}
            priceExclVat={car.price_excl_vat}
            vatRate={car.vat_rate}
            vatAmount={car.vat_amount}
            currency={car.currency}
            enableToggle={true}
            carId={car.id}
            size="sm"
            isNettoPrice={car.is_netto_price}
          />
          
          {/* Action Buttons */}
          <div className="flex gap-2 justify-between">
            <div className="flex gap-2">
              <Link href={`/dashboard/edit-car/${car.id}`}>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Pencil size={14} />
                  <span>Edit</span>
                </Button>
              </Link>
            </div>
            <div className="flex gap-2">
              {!isSold ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700 flex items-center gap-1"
                  onClick={handleMarkAsSold}
                  disabled={isMarkingSold}
                >
                  <CheckCircle size={14} />
                  <span>{isMarkingSold ? "Marking..." : "Mark as Sold"}</span>
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-1"
                  onClick={handleMarkAsUnsold}
                  disabled={isMarkingSold}
                >
                  <RotateCcw size={14} />
                  <span>{isMarkingSold ? "Updating..." : "Mark as Unsold"}</span>
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 flex items-center gap-1"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <Trash2 size={14} />
                <span>{isDeleting ? "Deleting..." : "Delete"}</span>
              </Button>
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

