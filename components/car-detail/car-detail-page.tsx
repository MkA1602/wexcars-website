import type React from "react"
import Link from "next/link"
import type { Car } from "@/lib/types"
import { formatCurrency } from "@/lib/utils"
import CarHero from "./car-hero"
import CarGallery from "./car-gallery"
import CarSpecifications from "./car-specifications"
import RelatedCars from "./related-cars"

interface CarDetailPageProps {
  car: Car
}

const CarDetailPage: React.FC<CarDetailPageProps> = ({ car }) => {
  return (
    <div className="min-h-screen">
      {/* Breadcrumb Navigation */}
      <nav className="bg-white border-b border-gray-200 py-4 px-6 md:px-12">
        <div className="container mx-auto">
          <div className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-primary-light transition-colors">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/collections" className="text-gray-500 hover:text-primary-light transition-colors">
              Collections
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">
              {car.brand} {car.name}
            </span>
          </div>
        </div>
      </nav>

      {/* Car Hero Section */}
      <CarHero car={car} />

      {/* Car Details Content */}
      <main className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            {/* Car Gallery */}
            <div>
              <CarGallery car={car} />
            </div>

            {/* Car Information */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4">Vehicle Information</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Year</div>
                    <div className="font-medium">{car.year}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Category</div>
                    <div className="font-medium">{car.category}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Transmission</div>
                    <div className="font-medium">{car.transmission}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Color</div>
                    <div className="font-medium">{car.color}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Price</div>
                    <div className="font-medium text-xl text-primary-light">{formatCurrency(car.price, car.currency)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Availability</div>
                    <div className="font-medium text-green-600">Available</div>
                  </div>
                </div>
              </div>

              {/* Description */}
              {car.description && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-2xl font-bold mb-4">Description</h2>
                  <p className="text-gray-700 leading-relaxed">{car.description}</p>
                </div>
              )}

              {/* Contact/Inquiry Button */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4">Interested?</h2>
                <p className="text-gray-600 mb-4">
                  Contact our luxury car specialists to get more information about this vehicle.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link 
                    href="/contact" 
                    className="bg-primary-light hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-medium text-center transition-colors"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Car Specifications */}
          <div className="mb-12">
            <CarSpecifications car={car} />
          </div>

          {/* Related Cars */}
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">Related Vehicles</h2>
              <p className="text-gray-600">Explore similar luxury vehicles you might be interested in</p>
            </div>
            <RelatedCars currentCarId={car.id} />
          </div>
        </div>
      </main>
    </div>
  )
}

export default CarDetailPage
