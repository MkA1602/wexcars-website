import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Search, ChevronRight, MapPin } from 'lucide-react'

export default function Home() {
  const featuredVehicles = [
    {
      id: 1,
      title: '2023 BMW M3 Competition',
      price: 79900,
      image: 'https://picsum.photos/id/111/800/500',
      location: 'Los Angeles, CA',
    },
    {
      id: 2,
      title: '2022 Mercedes-Benz AMG GT',
      price: 89900,
      image: 'https://picsum.photos/id/112/800/500',
      location: 'Miami, FL',
    },
    {
      id: 3,
      title: '2023 Porsche 911 GT3',
      price: 169900,
      image: 'https://picsum.photos/id/113/800/500',
      location: 'New York, NY',
    },
    {
      id: 4,
      title: '2022 Audi RS e-tron GT',
      price: 139900,
      image: 'https://picsum.photos/id/114/800/500',
      location: 'San Francisco, CA',
    },
  ]

  const filters = {
    make: ['All Makes', 'BMW', 'Mercedes-Benz', 'Porsche', 'Audi', 'Ferrari'],
    priceRange: ['Any Price', 'Under $50k', '$50k-$100k', '$100k-$200k', '$200k+'],
    bodyStyle: ['All Styles', 'Sedan', 'Coupe', 'SUV', 'Convertible'],
    location: ['Any Location', 'Los Angeles', 'New York', 'Miami', 'San Francisco'],
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[#6B4BFF] to-[#8970FF] py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
              Find Your Perfect Vehicle
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-100 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Search through thousands of vehicles or participate in live auctions to find your dream car.
            </p>
          </div>

          {/* Search Bar */}
          <div className="mt-10 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <select className="input">
                  {filters.make.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <select className="input">
                  {filters.priceRange.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <select className="input">
                  {filters.bodyStyle.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <select className="input">
                  {filters.location.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-4">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    className="input w-full pl-10"
                    placeholder="Search by make, model, or keyword"
                  />
                </div>
                <button className="btn-primary px-8">Search</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Vehicles */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Featured Vehicles</h2>
            <Link
              href="/vehicles"
              className="flex items-center text-sm font-medium text-[#6B4BFF] hover:text-[#8970FF]"
            >
              View all vehicles
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredVehicles.map((vehicle) => (
              <div key={vehicle.id} className="group relative">
                <div className="aspect-h-3 aspect-w-4 overflow-hidden rounded-lg">
                  <Image
                    src={vehicle.image}
                    alt={vehicle.title}
                    width={800}
                    height={500}
                    className="object-cover object-center group-hover:opacity-75"
                  />
                </div>
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-900">{vehicle.title}</h3>
                  <p className="mt-1 text-lg font-medium text-[#6B4BFF]">
                    ${vehicle.price.toLocaleString()}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">{vehicle.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 