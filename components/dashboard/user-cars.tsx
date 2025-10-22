"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { supabaseClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, Car as CarIcon } from "lucide-react"
import DashboardCarCard from "./dashboard-car-card"
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
    // Show confirmation dialog
    const confirmed = window.confirm(
      "Are you sure you want to delete this car? This action cannot be undone."
    )
    
    if (!confirmed) {
      return
    }

    setIsDeleting(carId)
    setError(null)

    try {
      const { error } = await supabaseClient.from("cars").delete().eq("id", carId)

      if (error) {
        console.error("Delete error:", error)
        throw error
      }

      // Show success message
      alert("Car deleted successfully!")
      
      // Refresh the page to update the car list
      router.refresh()
    } catch (err: any) {
      console.error("Failed to delete car:", err)
      setError(err.message || "Failed to delete car. Please check your permissions.")
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {activeCars.map((car) => (
                <DashboardCarCard 
                  key={car.id} 
                  car={car} 
                  isSold={false}
                  onDelete={handleDelete}
                  onMarkAsSold={handleMarkAsSold}
                  isDeleting={isDeleting === car.id}
                  isMarkingSold={isMarkingSold === car.id}
                />
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {soldCars.map((car) => (
                <DashboardCarCard 
                  key={car.id} 
                  car={car} 
                  isSold={true}
                  onDelete={handleDelete}
                  onMarkAsUnsold={handleMarkAsUnsold}
                  isDeleting={isDeleting === car.id}
                  isMarkingSold={isMarkingSold === car.id}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
