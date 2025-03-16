'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Search, ChevronRight, MapPin, ChevronDown, Filter } from 'lucide-react'

interface SearchFilters {
  make: string
  model: string
  minYear: string
  maxYear: string
  minPrice: string
  maxPrice: string
  bodyStyle: string
  transmission: string
  fuelType: string
  location: string
}

export default function Home() {
  const [isAdvancedSearch, setIsAdvancedSearch] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({
    make: '',
    model: '',
    minYear: '',
    maxYear: '',
    minPrice: '',
    maxPrice: '',
    bodyStyle: '',
    transmission: '',
    fuelType: '',
    location: '',
  })

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

  const makes = ['All Makes', 'Audi', 'BMW', 'Ferrari', 'Lamborghini', 'Mercedes-Benz', 'Porsche']
  const bodyStyles = ['All Styles', 'Coupe', 'Convertible', 'Sedan', 'SUV', 'Wagon']
  const transmissions = ['All Types', 'Automatic', 'Manual', 'PDK', 'DCT']
  const fuelTypes = ['All Types', 'Petrol', 'Diesel', 'Hybrid', 'Electric']
  const years = Array.from({ length: 2024 - 1990 + 1 }, (_, i) => (2024 - i).toString())

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Search filters:', filters)
    // Implement search functionality
  }

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-screen">
        <div className="absolute inset-0">
          <Image
            src="/images/freepik__a-pristine-white-porsche-carrera-gt3-2025-elegantl__76345.png"
            alt="Luxury Porsche in snow"
            fill
            className="object-cover"
            priority
            quality={100}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
        </div>

        <div className="relative h-full flex items-center">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center mb-12">
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
                Find Your Dream Car
              </h1>
              <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8 animate-fade-in-delay">
                Discover the finest collection of luxury and exotic vehicles
              </p>
              <div className="flex justify-center space-x-4 animate-fade-in-delay-2">
                <Link 
                  href="/explore-cars"
                  className="px-8 py-3 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-all duration-200 hover:shadow-lg hover:scale-105"
                >
                  Explore Cars
                </Link>
                <Link
                  href="/auctions"
                  className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-full font-medium hover:bg-white/10 transition-all duration-200"
                >
                  Join Auction
                </Link>
              </div>
            </div>

            {/* Search Section */}
            <div className="max-w-4xl mx-auto">
              <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 transform hover:scale-[1.02] transition-all duration-300">
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-gray-900 placeholder-gray-500">
                      <option value="">Select Brand</option>
                      <option value="porsche">Porsche</option>
                      <option value="ferrari">Ferrari</option>
                      <option value="lamborghini">Lamborghini</option>
                      <option value="mclaren">McLaren</option>
                    </select>
                    <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-gray-900 placeholder-gray-500">
                      <option value="">Price Range</option>
                      <option value="0-50000">$0 - $50,000</option>
                      <option value="50000-100000">$50,000 - $100,000</option>
                      <option value="100000-200000">$100,000 - $200,000</option>
                      <option value="200000+">$200,000+</option>
                    </select>
                    <button 
                      type="submit"
                      className="w-full px-8 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-all duration-200 hover:shadow-lg"
                    >
                      Search Now
                    </button>
                  </div>
                </form>
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

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        
        .animate-fade-in-delay {
          animation: fadeIn 0.8s ease-out 0.2s forwards;
          opacity: 0;
        }
        
        .animate-fade-in-delay-2 {
          animation: fadeIn 0.8s ease-out 0.4s forwards;
          opacity: 0;
        }
      `}</style>
    </main>
  )
} 