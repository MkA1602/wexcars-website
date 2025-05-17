import Link from "next/link"
import Image from "next/image"
import { Star, Calendar, MapPin, Gauge } from "lucide-react"

interface CarCardProps {
  car: {
    id: string
    title: string
    year: number
    mileage: number
    price: number
    image: string
    rating: number
    location: string
    transmission?: string
    fuelType?: string
    bodyType?: string
  }
}

export default function CarCard({ car }: CarCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 transition-transform hover:shadow-lg hover:-translate-y-1">
      <Link href={`/inventory/${car.id}`} className="block">
        <div className="relative h-48">
          <Image src={car.image || "/placeholder.svg"} alt={car.title} fill className="object-cover" />
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/inventory/${car.id}`} className="block">
          <h3 className="text-lg font-bold mb-1 hover:text-primary-600 transition-colors">{car.title}</h3>
        </Link>
        <div className="flex items-center mb-2">
          <div className="flex mr-2">
            {[...Array(car.rating)].map((_, i) => (
              <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
            ))}
          </div>
          <span className="text-sm text-gray-500">5 reviews</span>
        </div>
        <div className="flex flex-wrap gap-2 text-sm text-gray-600 mb-3">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{car.year}</span>
          </div>
          <div className="flex items-center">
            <Gauge className="h-4 w-4 mr-1" />
            <span>{car.mileage.toLocaleString()} miles</span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{car.location}</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-gray-900">${car.price.toLocaleString()}</span>
          <Link
            href={`/inventory/${car.id}`}
            className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}
