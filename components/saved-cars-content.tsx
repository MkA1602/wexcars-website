"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Trash2, Calendar, Gauge, MapPin, Heart } from "lucide-react"

export default function SavedCarsContent() {
  const [savedCars, setSavedCars] = useState([
    {
      id: "mercedes-s-class",
      title: "Mercedes-Benz S-Class",
      year: 2023,
      mileage: 1200,
      price: 89900,
      location: "New York",
      image: "/placeholder.svg?key=rspkm",
      dateSaved: "2023-05-15",
    },
    {
      id: "bmw-7-series",
      title: "BMW 7 Series",
      year: 2023,
      mileage: 800,
      price: 84500,
      location: "Los Angeles",
      image: "/placeholder.svg?key=qzric",
      dateSaved: "2023-05-10",
    },
    {
      id: "audi-a8",
      title: "Audi A8",
      year: 2023,
      mileage: 1500,
      price: 79900,
      location: "Chicago",
      image: "/placeholder.svg?key=r5vfs",
      dateSaved: "2023-05-05",
    },
    {
      id: "porsche-911",
      title: "Porsche 911",
      year: 2023,
      mileage: 500,
      price: 115000,
      location: "Miami",
      image: "/placeholder.svg?key=p911s",
      dateSaved: "2023-04-28",
    },
  ])

  const [sortBy, setSortBy] = useState("dateSaved")
  const [sortOrder, setSortOrder] = useState("desc")

  const handleRemove = (id: string) => {
    setSavedCars(savedCars.filter((car) => car.id !== id))
  }

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("asc")
    }
  }

  const sortedCars = [...savedCars].sort((a, b) => {
    let comparison = 0

    if (sortBy === "price") {
      comparison = a.price - b.price
    } else if (sortBy === "year") {
      comparison = a.year - b.year
    } else if (sortBy === "title") {
      comparison = a.title.localeCompare(b.title)
    } else if (sortBy === "dateSaved") {
      comparison = new Date(a.dateSaved).getTime() - new Date(b.dateSaved).getTime()
    }

    return sortOrder === "asc" ? comparison : -comparison
  })

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold mb-6">Saved Cars</h1>

        {savedCars.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Heart className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No saved cars yet</h2>
            <p className="text-gray-600 mb-6">Start browsing our inventory and save cars you're interested in.</p>
            <Link
              href="/inventory"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
            >
              Browse Inventory
            </Link>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <p className="text-gray-600">{savedCars.length} saved vehicles</p>
              <div className="flex items-center">
                <span className="mr-2 text-sm text-gray-600">Sort by:</span>
                <select
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split("-")
                    setSortBy(field)
                    setSortOrder(order)
                  }}
                >
                  <option value="dateSaved-desc">Date Saved (Newest)</option>
                  <option value="dateSaved-asc">Date Saved (Oldest)</option>
                  <option value="price-asc">Price (Low to High)</option>
                  <option value="price-desc">Price (High to Low)</option>
                  <option value="year-desc">Year (Newest)</option>
                  <option value="year-asc">Year (Oldest)</option>
                  <option value="title-asc">Name (A-Z)</option>
                  <option value="title-desc">Name (Z-A)</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {sortedCars.map((car) => (
                <div key={car.id} className="border rounded-lg overflow-hidden flex flex-col md:flex-row">
                  <div className="relative w-full md:w-1/3 h-48 md:h-auto">
                    <Image src={car.image || "/placeholder.svg"} alt={car.title} fill className="object-cover" />
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">
                        {car.year} {car.title}
                      </h3>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
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
                      <p className="text-2xl font-bold text-primary-600 mb-4">${car.price.toLocaleString()}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/inventory/${car.id}`}
                        className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
                      >
                        View Details
                      </Link>
                      <Link
                        href={`/contact?car=${car.id}`}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                      >
                        Contact Dealer
                      </Link>
                      <button
                        onClick={() => handleRemove(car.id)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors flex items-center"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
