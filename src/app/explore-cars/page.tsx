'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Filter, Search, ChevronDown, Heart } from 'lucide-react'

export default function ExploreCars() {
  const [selectedBrand, setSelectedBrand] = useState('')
  const [priceRange, setPriceRange] = useState('')
  const [bodyStyle, setBodyStyle] = useState('')
  const [year, setYear] = useState('')
  const [selectedType, setSelectedType] = useState('all')

  const carTypes = [
    {
      id: 'all',
      name: 'All Cars',
      icon: '/images/all-cars.png'
    },
    {
      id: 'sedan',
      name: 'Sedan',
      icon: '/images/sedan.png'
    },
    {
      id: 'suv',
      name: 'SUV',
      icon: '/images/suv.png'
    },
    {
      id: 'coupe',
      name: 'Coupe',
      icon: '/images/coupe.png'
    },
    {
      id: 'hatchback',
      name: 'Hatchback',
      icon: '/images/hatchback.png'
    }
  ]

  const cars = [
    {
      id: 1,
      name: 'Porsche 911 GT3',
      price: 169900,
      image: '/images/freepik__a-pristine-white-porsche-carrera-gt3-2025-elegantl__76345.png',
      year: 2023,
      mileage: '1,200 mi',
      location: 'Los Angeles, CA'
    },
    // Add more cars here
  ]

  return (
    <main className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Car Types Slider */}
        <div className="mb-8">
          <div className="flex overflow-x-auto pb-4 hide-scrollbar">
            <div className="flex space-x-4">
              {carTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`flex flex-col items-center min-w-[100px] p-4 rounded-xl transition-all duration-300 ${
                    selectedType === type.id
                      ? 'bg-primary text-white shadow-lg scale-105'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <div className="w-12 h-12 mb-2 relative">
                    <Image
                      src={type.icon}
                      alt={type.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="text-sm font-medium">{type.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Find Your Perfect Car</h1>
          <button className="flex items-center text-primary hover:text-primary/80">
            <Filter className="w-5 h-5 mr-2" />
            More Filters
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-gray-900 bg-white"
          >
            <option value="">All Brands</option>
            <option value="porsche">Porsche</option>
            <option value="ferrari">Ferrari</option>
            <option value="lamborghini">Lamborghini</option>
            <option value="mclaren">McLaren</option>
            <option value="bugatti">Bugatti</option>
          </select>

          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-gray-900 bg-white"
          >
            <option value="">Price Range</option>
            <option value="0-50000">$0 - $50,000</option>
            <option value="50000-100000">$50,000 - $100,000</option>
            <option value="100000-200000">$100,000 - $200,000</option>
            <option value="200000+">$200,000+</option>
          </select>

          <select
            value={bodyStyle}
            onChange={(e) => setBodyStyle(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-gray-900 bg-white"
          >
            <option value="">Body Style</option>
            <option value="coupe">Coupe</option>
            <option value="convertible">Convertible</option>
            <option value="suv">SUV</option>
            <option value="sedan">Sedan</option>
          </select>

          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-gray-900 bg-white"
          >
            <option value="">Year</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
            <option value="2021">2021</option>
            <option value="2020">2020</option>
          </select>
        </div>

        {/* Cars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cars.map((car) => (
            <Link 
              href={`/cars/${car.id}`} 
              key={car.id}
              className="bg-white rounded-2xl shadow-sm overflow-hidden group hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
            >
              <div className="relative h-48">
                <Image
                  src={car.image}
                  alt={car.name}
                  fill
                  className="object-cover"
                />
                <button className="absolute top-4 right-4 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors">
                  <Heart className="w-5 h-5 text-gray-600 hover:text-red-500 transition-colors" />
                </button>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{car.name}</h3>
                  <p className="text-lg font-bold text-primary">${car.price.toLocaleString()}</p>
                </div>
                <div className="flex items-center text-sm text-gray-500 space-x-4">
                  <span>{car.year}</span>
                  <span>•</span>
                  <span>{car.mileage}</span>
                  <span>•</span>
                  <span>{car.location}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style jsx global>{`
        /* Hide scrollbar for Chrome, Safari and Opera */
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }

        /* Hide scrollbar for IE, Edge and Firefox */
        .hide-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
    </main>
  )
} 