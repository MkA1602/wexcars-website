'use client'

import React from 'react'
import Image from 'next/image'
import { Filter, Search } from 'lucide-react'

const UsedCarsPage = () => {
  const usedCars = [
    {
      id: 1,
      title: '2022 BMW 3 Series',
      price: 45900,
      mileage: '15,000',
      location: 'Los Angeles, CA',
      image: 'https://picsum.photos/id/111/800/500',
    },
    {
      id: 2,
      title: '2021 Mercedes-Benz C-Class',
      price: 42500,
      mileage: '22,000',
      location: 'Miami, FL',
      image: 'https://picsum.photos/id/112/800/500',
    },
    {
      id: 3,
      title: '2023 Audi A4',
      price: 48900,
      mileage: '8,000',
      location: 'New York, NY',
      image: 'https://picsum.photos/id/113/800/500',
    },
    {
      id: 4,
      title: '2022 Lexus ES',
      price: 43900,
      mileage: '18,000',
      location: 'Chicago, IL',
      image: 'https://picsum.photos/id/114/800/500',
    },
  ]

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Used Cars</h1>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by make, model, or keyword"
              className="input w-full pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
          <button className="btn-secondary flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filters
          </button>
        </div>

        {/* Cars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {usedCars.map((car) => (
            <div key={car.id} className="card group">
              <div className="aspect-w-16 aspect-h-9 mb-4 overflow-hidden rounded-lg">
                <Image
                  src={car.image}
                  alt={car.title}
                  width={800}
                  height={500}
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>
              <h3 className="text-lg font-semibold mb-2">{car.title}</h3>
              <p className="text-xl font-bold text-primary mb-2">
                ${car.price.toLocaleString()}
              </p>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p>Mileage: {car.mileage} miles</p>
                <p>{car.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default UsedCarsPage 