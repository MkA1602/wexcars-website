import Link from "next/link"
import Image from "next/image"
import { Star } from "lucide-react"

interface RelatedCarsProps {
  currentCarId: string
}

export default function RelatedCars({ currentCarId }: RelatedCarsProps) {
  // This would normally come from a database, filtered to exclude the current car
  const relatedCars = [
    {
      id: "bmw-7-series",
      title: "BMW 7 Series",
      year: 2023,
      price: 84500,
      image: "/placeholder.svg?key=qzric",
      rating: 5,
    },
    {
      id: "audi-a8",
      title: "Audi A8",
      year: 2023,
      price: 79900,
      image: "/placeholder.svg?key=r5vfs",
      rating: 5,
    },
    {
      id: "lexus-ls",
      title: "Lexus LS",
      year: 2023,
      price: 76000,
      image: "/placeholder.svg?key=lxls",
      rating: 5,
    },
  ].filter((car) => car.id !== currentCarId)

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {relatedCars.map((car) => (
        <div key={car.id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          <Link href={`/inventory/${car.id}`} className="block">
            <div className="relative h-48">
              <Image src={car.image || "/placeholder.svg"} alt={car.title} fill className="object-cover" />
            </div>
          </Link>
          <div className="p-4">
            <Link href={`/inventory/${car.id}`} className="block">
              <h3 className="text-lg font-bold mb-1 hover:text-primary-600 transition-colors">
                {car.year} {car.title}
              </h3>
            </Link>
            <div className="flex items-center mb-2">
              <div className="flex mr-2">
                {[...Array(car.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                ))}
              </div>
              <span className="text-sm text-gray-500">5 reviews</span>
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
      ))}
    </div>
  )
}
