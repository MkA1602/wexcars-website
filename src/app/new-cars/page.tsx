'use client'

import React from 'react'
import Image from 'next/image'
import { Filter, Search, Star } from 'lucide-react'

const NewCarsPage = () => {
  const newCars = [
    {
      id: 1,
      title: '2024 BMW M5',
      price: 105900,
      rating: 4.9,
      reviews: 12,
      image: 'https://picsum.photos/id/119/800/500',
    },
    {
      id: 2,
      title: '2024 Mercedes-AMG S63',
      price: 185000,
      rating: 4.8,
      reviews: 8,
      image: 'https://picsum.photos/id/120/800/500',
    },
    {
      id: 3,
      title: '2024 Audi RS7',
      price: 125000,
      rating: 4.7,
      reviews: 15,
      image: 'https://picsum.photos/id/121/800/500',
    },
    {
      id: 4,
      title: '2024 Porsche Taycan',
      price: 95900,
      rating: 4.9,
      reviews: 10,
      image: 'https://picsum.photos/id/122/800/500',
    },
  ]

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">New Cars</h1>

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
          {newCars.map((car) => (
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
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 mr-1" />
                  {car.rating}
                </div>
                <span className="mx-2">•</span>
                <span>{car.reviews} reviews</span>
              </div>
              <button className="btn-primary w-full mt-4">Learn More</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default NewCarsPage 