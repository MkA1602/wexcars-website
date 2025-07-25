import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cars } from "@/lib/car-data"
import { formatCurrency } from "@/lib/utils"

interface RelatedCarsProps {
  currentCarId: string
}

export default function RelatedCars({ currentCarId }: RelatedCarsProps) {
  // Get 3 related cars (excluding the current one)
  const relatedCars = cars.filter((car) => car.id !== currentCarId).slice(0, 3)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {relatedCars.map((car) => (
        <div key={car.id} className="bg-white rounded-lg shadow-md overflow-hidden group">
          <Link href={`/collections/${car.id}`} className="block relative h-48 overflow-hidden">
            <img
              src={car.image || "/placeholder.svg"}
              alt={`${car.brand} ${car.name}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </Link>

          <div className="p-4">
            <h3 className="font-bold text-lg mb-1">
              <Link href={`/collections/${car.id}`} className="hover:text-primary-light transition-colors">
                {car.brand} {car.name}
              </Link>
            </h3>
            <p className="text-gray-600 text-sm mb-2">
              {car.year} • {car.category}
            </p>

            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
              <div className="text-xl font-bold">{formatCurrency(car.price, car.currency)}</div>
              <Link href={`/collections/${car.id}`}>
                <Button size="sm" className="bg-primary-light hover:bg-primary-dark text-white">
                  View Details
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
