import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import type { Car } from "@/lib/types"

interface FeaturedCarsProps {
  cars?: Car[]
}

export default function FeaturedCars({ cars = [] }: FeaturedCarsProps) {
  // Safety check for undefined cars
  if (!cars || !Array.isArray(cars)) {
    return null
  }

  // Only show up to 3 featured cars
  const featuredCars = cars.filter((car) => car?.featured).slice(0, 3)

  if (featuredCars.length === 0) return null

  return (
    <div className="mb-12 px-4 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Featured Vehicles</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {featuredCars.map((car) => {
          // Safety check for each car object
          if (!car || !car.id) return null

          return (
            <div key={car.id} className="bg-white rounded-lg shadow-md overflow-hidden group relative">
              <div className="absolute top-3 left-3 bg-primary-light text-white text-xs font-bold px-2 py-1 rounded z-10">
                Featured
              </div>
              <Link href={`/collections/${car.id}`}>
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={car.image || "/placeholder.svg?height=200&width=300&query=luxury+car"}
                    alt={`${car.brand || "Unknown"} ${car.name || "Car"}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              </Link>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-lg">
                      <Link href={`/collections/${car.id}`} className="hover:text-primary-light transition-colors">
                        {car.brand || "Unknown"} {car.name || "Car"}
                      </Link>
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {car.year || "N/A"} • {car.category || "N/A"}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <Star size={16} className="text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-medium ml-1">{car.rating || "0"}</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {car.description || "No description available"}
                </p>
                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                  <div className="text-xl font-bold">{formatCurrency(car.price, car.currency)}</div>
                  <Link href={`/collections/${car.id}`}>
                    <Button className="bg-primary-light hover:bg-primary-dark text-white">View Details</Button>
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
