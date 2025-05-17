import type { Metadata } from "next"
import InventoryFilters from "@/components/inventory-filters"
import CarCard from "@/components/car-card"
import Pagination from "@/components/pagination"
import HeroSection from "@/components/hero-section"

export const metadata: Metadata = {
  title: "Inventory | AutoWex",
  description: "Browse our selection of premium luxury and sports cars.",
}

export default function InventoryPage() {
  // This would normally come from a database
  const cars = [
    {
      id: "mercedes-s-class",
      title: "Mercedes-Benz S-Class",
      year: 2023,
      mileage: 1200,
      price: 89900,
      image: "/placeholder.svg?key=rspkm",
      rating: 5,
      location: "New York",
      transmission: "Automatic",
      fuelType: "Hybrid",
      bodyType: "Sedan",
    },
    {
      id: "bmw-7-series",
      title: "BMW 7 Series",
      year: 2023,
      mileage: 800,
      price: 84500,
      image: "/placeholder.svg?key=qzric",
      rating: 5,
      location: "Los Angeles",
      transmission: "Automatic",
      fuelType: "Gasoline",
      bodyType: "Sedan",
    },
    {
      id: "audi-a8",
      title: "Audi A8",
      year: 2023,
      mileage: 1500,
      price: 79900,
      image: "/placeholder.svg?key=r5vfs",
      rating: 5,
      location: "Chicago",
      transmission: "Automatic",
      fuelType: "Diesel",
      bodyType: "Sedan",
    },
    {
      id: "porsche-911",
      title: "Porsche 911",
      year: 2023,
      mileage: 500,
      price: 115000,
      image: "/placeholder.svg?key=p911s",
      rating: 5,
      location: "Miami",
      transmission: "Manual",
      fuelType: "Gasoline",
      bodyType: "Coupe",
    },
    {
      id: "bentley-continental",
      title: "Bentley Continental GT",
      year: 2022,
      mileage: 2500,
      price: 195000,
      image: "/placeholder.svg?key=bcgt2",
      rating: 5,
      location: "Las Vegas",
      transmission: "Automatic",
      fuelType: "Gasoline",
      bodyType: "Coupe",
    },
    {
      id: "ferrari-roma",
      title: "Ferrari Roma",
      year: 2023,
      mileage: 300,
      price: 245000,
      image: "/placeholder.svg?key=frm23",
      rating: 5,
      location: "Los Angeles",
      transmission: "Automatic",
      fuelType: "Gasoline",
      bodyType: "Coupe",
    },
    {
      id: "lamborghini-urus",
      title: "Lamborghini Urus",
      year: 2023,
      mileage: 1000,
      price: 235000,
      image: "/placeholder.svg?key=lmbus",
      rating: 5,
      location: "Miami",
      transmission: "Automatic",
      fuelType: "Gasoline",
      bodyType: "SUV",
    },
    {
      id: "rolls-royce-ghost",
      title: "Rolls-Royce Ghost",
      year: 2022,
      mileage: 1800,
      price: 345000,
      image: "/placeholder.svg?key=rrgh2",
      rating: 5,
      location: "New York",
      transmission: "Automatic",
      fuelType: "Gasoline",
      bodyType: "Sedan",
    },
    {
      id: "aston-martin-vantage",
      title: "Aston Martin Vantage",
      year: 2023,
      mileage: 600,
      price: 165000,
      image: "/placeholder.svg?key=amvnt",
      rating: 5,
      location: "Chicago",
      transmission: "Automatic",
      fuelType: "Gasoline",
      bodyType: "Coupe",
    },
  ]

  return (
    <>
      {/* Hero Section */}
      <HeroSection className="bg-gray-900 text-white">
        <div className="container-custom py-32 mt-16">
          <h1 className="text-4xl font-bold mb-4">Our Inventory</h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            Browse our selection of premium luxury and sports cars. Filter by make, model, price, and more to find your
            perfect vehicle.
          </p>
        </div>
      </HeroSection>

      {/* Inventory Section */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters */}
            <div className="w-full lg:w-1/4">
              <InventoryFilters />
            </div>

            {/* Car Listings */}
            <div className="w-full lg:w-3/4">
              <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-col sm:flex-row justify-between items-center">
                <p className="text-gray-600 mb-4 sm:mb-0">
                  Showing <span className="font-semibold">{cars.length}</span> vehicles
                </p>
                <div className="flex items-center">
                  <label htmlFor="sort" className="mr-2 text-gray-600">
                    Sort by:
                  </label>
                  <select
                    id="sort"
                    className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="price-asc">Price (Low to High)</option>
                    <option value="price-desc">Price (High to Low)</option>
                    <option value="year-desc">Year (Newest)</option>
                    <option value="year-asc">Year (Oldest)</option>
                    <option value="mileage-asc">Mileage (Low to High)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cars.map((car) => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>

              <div className="mt-12">
                <Pagination currentPage={1} totalPages={5} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
