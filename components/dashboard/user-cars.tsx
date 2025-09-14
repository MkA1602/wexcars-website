"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { supabaseClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Pencil, Trash2, AlertCircle, Eye, Calendar, DollarSign, Tag, CheckCircle, RotateCcw, Car as CarIcon } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import PriceDisplay from "@/components/ui/price-display"
import type { Car } from "@/lib/types"

interface UserCarsProps {
  cars: any[]
}

export default function UserCars({ cars }: UserCarsProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [isMarkingSold, setIsMarkingSold] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Separate active and sold cars
  const activeCars = cars.filter(car => !car.is_sold)
  const soldCars = cars.filter(car => car.is_sold)

  const handleDelete = async (carId: string) => {
    setIsDeleting(carId)
    setError(null)

    try {
      const { error } = await supabaseClient.from("cars").delete().eq("id", carId)

      if (error) {
        throw error
      }

      // Refresh the page to update the car list
      router.refresh()
    } catch (err: any) {
      setError(err.message || "Failed to delete car")
    } finally {
      setIsDeleting(null)
    }
  }

  const handleMarkAsSold = async (carId: string) => {
    setIsMarkingSold(carId)
    setError(null)

    try {
      const { error } = await supabaseClient
        .from("cars")
        .update({ 
          is_sold: true, 
          sold_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq("id", carId)

      if (error) {
        throw error
      }

      // Refresh the page to update the car list
      router.refresh()
    } catch (err: any) {
      setError(err.message || "Failed to mark car as sold")
    } finally {
      setIsMarkingSold(null)
    }
  }

  const handleMarkAsUnsold = async (carId: string) => {
    setIsMarkingSold(carId)
    setError(null)

    try {
      const { error } = await supabaseClient
        .from("cars")
        .update({ 
          is_sold: false, 
          sold_at: null,
          updated_at: new Date().toISOString()
        })
        .eq("id", carId)

      if (error) {
        throw error
      }

      // Refresh the page to update the car list
      router.refresh()
    } catch (err: any) {
      setError(err.message || "Failed to mark car as unsold")
    } finally {
      setIsMarkingSold(null)
    }
  }

  // Car Card Component
  const CarCard = ({ car, isSold = false }: { car: any, isSold?: boolean }) => (
    <Card key={car.id} className={`overflow-hidden ${isSold ? 'opacity-75' : ''}`}>
      <div className="relative h-48 overflow-hidden">
        <img
          src={car.image || "/placeholder.svg?height=200&width=300&query=luxury+car"}
          alt={`${car.brand} ${car.name}`}
          className="w-full h-full object-cover"
        />
        {isSold && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
              <CheckCircle size={14} />
              SOLD
            </div>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-bold text-lg mb-1">
          {car.brand} {car.name}
        </h3>
        <div className="flex flex-wrap gap-2 mb-3">
          <div className="flex items-center text-xs bg-gray-100 px-2 py-1 rounded-full">
            <Tag size={12} className="mr-1" />
            <span>{car.category}</span>
          </div>
          <div className="flex items-center text-xs bg-gray-100 px-2 py-1 rounded-full">
            <Calendar size={12} className="mr-1" />
            <span>{car.year}</span>
          </div>
          {car.location && (
            <div className="flex items-center text-xs bg-green-100 px-2 py-1 rounded-full">
              <span className="text-green-700">📍 {car.location}</span>
            </div>
          )}
          <div className="bg-gray-50 px-3 py-2 rounded-lg">
            <PriceDisplay
              key={`user-price-${car.id}`}
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
          {car.chassis_number && (
            <div className="flex items-center text-xs bg-blue-100 px-2 py-1 rounded-full">
              <span className="text-blue-700">VIN: {car.chassis_number}</span>
            </div>
          )}
          {car.created_at && (
            <div className="flex items-center text-[10px] bg-purple-100 px-2 py-1 rounded-full">
              <Calendar size={10} className="mr-1" />
              <span className="text-purple-700">{new Date(car.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}</span>
            </div>
          )}
          {isSold && car.sold_at && (
            <div className="flex items-center text-[10px] bg-green-100 px-2 py-1 rounded-full">
              <CheckCircle size={10} className="mr-1" />
              <span className="text-green-700">Sold: {new Date(car.sold_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}</span>
            </div>
          )}
        </div>
        <p className="text-gray-600 text-sm line-clamp-2">{car.description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
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
              onClick={() => handleMarkAsSold(car.id)}
              disabled={isMarkingSold === car.id}
            >
              <CheckCircle size={14} />
              <span>{isMarkingSold === car.id ? "Marking..." : "Mark as Sold"}</span>
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-1"
              onClick={() => handleMarkAsUnsold(car.id)}
              disabled={isMarkingSold === car.id}
            >
              <RotateCcw size={14} />
              <span>{isMarkingSold === car.id ? "Updating..." : "Mark as Unsold"}</span>
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 flex items-center gap-1"
            onClick={() => handleDelete(car.id)}
            disabled={isDeleting === car.id}
          >
            <Trash2 size={14} />
            <span>{isDeleting === car.id ? "Deleting..." : "Delete"}</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Active Cars Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CarIcon size={20} />
            Active Listings ({activeCars.length})
          </CardTitle>
          <CardDescription>Your cars currently available for sale</CardDescription>
        </CardHeader>
        <CardContent>
          {activeCars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeCars.map((car) => (
                <CarCard key={car.id} car={car} isSold={false} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CarIcon size={48} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Active Listings</h3>
              <p className="text-gray-500 mb-4">You don't have any cars listed for sale at the moment.</p>
              <Link href="/dashboard/add-car">
                <Button className="bg-primary-light hover:bg-primary-dark text-white">
                  Add Your First Car
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Link href="/dashboard/add-car">
            <Button className="bg-primary-light hover:bg-primary-dark text-white">Add New Car</Button>
          </Link>
        </CardFooter>
      </Card>

      {/* Sold Cars Section */}
      {soldCars.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle size={20} className="text-green-600" />
              Sold Cars ({soldCars.length})
            </CardTitle>
            <CardDescription>Your previously sold vehicles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {soldCars.map((car) => (
                <CarCard key={car.id} car={car} isSold={true} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
