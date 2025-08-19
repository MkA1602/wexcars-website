"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { supabaseClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Pencil, Trash2, AlertCircle, Eye, Calendar, DollarSign, Tag } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import PriceDisplay from "@/components/ui/price-display"
import type { Car } from "@/lib/types"

interface UserCarsProps {
  cars: any[]
}

export default function UserCars({ cars }: UserCarsProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>My Cars</CardTitle>
          <CardDescription>Manage your car listings</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car) => (
              <Card key={car.id} className="overflow-hidden">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={car.image || "/placeholder.svg?height=200&width=300&query=luxury+car"}
                    alt={`${car.brand} ${car.name}`}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Location Badge */}
                  {car.location && (
                    <div className="absolute top-2 left-2 bg-gray-900/80 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
                      <span className="text-red-400">📍</span>
                      {car.location}
                    </div>
                  )}
                  
                  {/* Date Added Badge */}
                  <div className="absolute bottom-2 left-2 bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded-md">
                    {car.created_at ? new Date(car.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    }) : 'New'}
                  </div>
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
                    {car.location && (
                      <div className="flex items-center text-xs bg-green-100 px-2 py-1 rounded-full">
                        <span className="text-green-700">📍 {car.location}</span>
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
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2">{car.description}</p>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-between">
                  <div className="flex gap-2">
                    <Link href={`/collections/${car.id}`}>
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <Eye size={14} />
                        <span>View</span>
                      </Button>
                    </Link>
                    <Link href={`/dashboard/edit-car/${car.id}`}>
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <Pencil size={14} />
                        <span>Edit</span>
                      </Button>
                    </Link>
                  </div>
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
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Link href="/dashboard/add-car">
            <Button className="bg-primary-light hover:bg-primary-dark text-white">Add New Car</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
